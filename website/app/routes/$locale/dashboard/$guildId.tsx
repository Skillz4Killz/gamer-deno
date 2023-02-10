import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useTransition } from "@remix-run/react";
import { configs } from "configs.server";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RiDeleteBin6Line, RiRepeatFill } from "react-icons/ri";
import { BOT_INVITE, SUPPORT_SERVER } from "~/utils/constants";
import prisma from "~/utils/db.server";
import { requireData, SessionData } from "~/utils/session.server";
import { humanizeMilliseconds } from "./index";

type GuildSettings = {
    initialSetupStep: number;
    isInGuild: boolean;
    isInSupport: boolean;
    prefix: string;
    maxReminders: number;
};

type LoaderData = {
    user: SessionData;
    settings: GuildSettings;
    reminders: {
        channel_id: string;
        server_id: string;
        content: string;
        id: number;
        user_id: string;
        interval: number | null;
        imageURL?: string;
        serverName?: string;
    }[];
};
export const loader: LoaderFunction = async ({ request, params }): Promise<LoaderData> => {
    const user = await requireData(request);

    const settings: GuildSettings = {
        initialSetupStep: 99,
        isInGuild: false,
        isInSupport: false,
        prefix: ".",
        maxReminders: 5,
    };

    const configurations = await prisma.servers.findUnique({ where: { server_id: BigInt(params.guildId!) } });

    // If no settings in db, start setup
    if (!configurations) settings.initialSetupStep = 0;

    if (settings.initialSetupStep < 2) {
        const [isInGuild, isInSupport] = await Promise.all([
            // Is bot in the guild
            fetch(`https://discord.com/api/v10/guilds/${params.guildId}/members/${user.userId}`, {
                headers: {
                    Authorization: `Bot ${configs.bot.token}`,
                    "Content-Type": "application/json",
                },
            }).then((res) => res.json()),
            // Is user in support server
            fetch(`https://discord.com/api/v10/guilds/${"547046977578336286"}/members/${user.userId}`, {
                headers: {
                    Authorization: `Bot ${configs.bot.token}`,
                    "Content-Type": "application/json",
                },
            }).then((res) => res.json()),
        ]);

        settings.isInGuild = !!isInGuild?.user?.id;
        settings.isInSupport = !!isInSupport?.user?.id;
    }

    if (configurations?.prefix) settings.prefix = configurations.prefix;
    // @ts-ignore TODO: remove this ignore
    if (configurations.maxReminders) settings.maxReminders = configurations.maxReminders;

    const reminders = (await prisma.reminders.findMany({ where: { server_id: BigInt(params.guildId!) } })) ?? [];
    const uniqueUsers = [...new Set(reminders.map((r) => r.user_id))];
    const members = (
        await Promise.all(
            uniqueUsers.map((r) =>
                fetch(`https://discord.com/api/v10/guilds/${params.guildId}/members/${r}`, {
                    headers: {
                        Authorization: `Bot ${configs.bot.token}`,
                        "Content-Type": "application/json",
                    },
                }).then((res) => res.json()),
            ),
        )
    ).filter((u) => {
        console.log(u);
        return u.user?.id;
    });

    return {
        user,
        settings,
        reminders: ((await prisma.reminders.findMany({ where: { server_id: BigInt(params.guildId!) } })) ?? []).map(
            (reminder) => {
                const member = members.find((m) => m.user?.id === reminder.user_id.toString());

                return {
                    channel_id: reminder.channel_id.toString(),
                    server_id: reminder.server_id.toString(),
                    content: reminder.content,
                    id: reminder.id,
                    user_id: reminder.user_id.toString(),
                    interval: reminder.interval,
                    // TODO: When running proxy rest, get the users
                    imageURL: `https://cdn.discordapp.com/avatars/${reminder.user_id}/${
                        member.avatar ?? member.user.avatar
                    }.jpg?size=2048`,
                    serverName: member ? `${member.user.username}#${member.user.discriminator}` : "Missing username",
                };
            },
        ),
    };
};

const steps = [
    {
        name: "Wizard FAQ",
        imageURL: "https://c.tenor.com/St6dO-mo8jkAAAAC/meliodas-nanatsu-no-taizai.gif",
    },
    {
        name: "Invite Bot",
        imageURL: "https://c.tenor.com/O8lgc5CGW8sAAAAC/luffy-nakama.gif",
    },
    {
        name: "Join Support Server",
        imageURL: "https://c.tenor.com/HkszE8gqvykAAAAC/anime-join-now.gif",
    },
    { name: "Select A Prefix", imageURL: "https://c.tenor.com/Ab6fY-ZVqiYAAAAd/yes-yes-yes-oh-yes.gif" },
    // { name: "Staff(Mod) Server", imageURL: "https://c.tenor.com/Ab6fY-ZVqiYAAAAd/yes-yes-yes-oh-yes.gif" },
    { name: "Reminders", imageURL: "https://c.tenor.com/O8lgc5CGW8sAAAAC/luffy-nakama.gif" },
    { name: "Mirrors", imageURL: "https://c.tenor.com/O8lgc5CGW8sAAAAC/luffy-nakama.gif" },
    { name: "Polls", imageURL: "https://c.tenor.com/O8lgc5CGW8sAAAAC/luffy-nakama.gif" },
];

function getFormItem(form: FormData, name: string) {
    const item = form.get(name);
    if (item === null) return;

    return item.toString();
}

type ActionData =
    | {
          prefix?: string;
          maxReminders?: string;
      }
    | undefined;
export const action: ActionFunction = async ({ request, params }) => {
    const form = await request.formData();
    const user = await requireData(request);

    // TODO: check if this user has permission to edit this guild settings. (hackers can send requests directly)

    const changes: Record<string, unknown> = {};
    const errors: Record<string, string> = {
        prefix: "",
        maxReminders: "",
    };

    const prefix = getFormItem(form, "prefix");
    if (prefix) {
        if (prefix.length > 3 || prefix.length < 1) {
            errors.prefix += "Must be between 1-3 characters.";
        }

        changes.prefix = prefix;
    }

    const maxReminders = getFormItem(form, "maxReminders");
    if (maxReminders) {
        try {
            // Validate that it is a number
            let max = Number(maxReminders);
            // Removes decimals
            max = Math.floor(max);

            if (max < 0 || max > 100) {
                errors.maxReminders = "Must be between 0-100.";
            }

            changes.maxReminders = max;
        } catch (err) {
            errors.maxReminders = "Must be between 0-100";
        }
    }

    const reminder = form.get("reminder");
    if (reminder && typeof reminder === "string") {
        const ids = reminder.split("-");
        if (reminder.startsWith("delete-")) {
            ids.shift();
            ids.shift();
            const [id, channelID, serverID] = ids;

            try {
                await prisma.reminders.deleteMany({
                    where: {
                        id: Number(id),
                        server_id: BigInt(serverID),
                        channel_id: BigInt(channelID),
                    },
                });
            } catch (err) {
                return null;
            }

            return null;
        }
    }

    const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
    if (hasErrors) {
        return json<ActionData>(errors);
    }

    await prisma.servers.update({ where: { server_id: BigInt(params.guildId!) }, data: changes });
    return null;
};

export default function Index() {
    const data = useLoaderData<LoaderData>();
    const errors = useActionData<ActionData>();
    const MAX_SETUP_STEPS = steps.length;

    const { t } = useTranslation();

    const [stepCount, setStepCount] = useState(data.settings.initialSetupStep);
    const [skipInvite, setSkipInvite] = useState({ status: false, dismissed: false });
    const [skipJoin, setSkipJoin] = useState({ status: false, dismissed: false });
    const [edited, setEdited] = useState(false);
    const [deletingReminder, setDeletingReminder] = useState([-1]);
    const transition = useTransition();
    const isDeleting = Boolean(transition.submission);

    // If step to invite bot, skip step
    if (stepCount === 1 && data.settings.isInGuild) {
        console.log("pager 1");
        setStepCount(stepCount + 1);
        setSkipInvite({ ...skipInvite, status: true });
        setTimeout(() => {
            setSkipInvite({ ...skipInvite, dismissed: true });
        }, 5000);
    }

    if (stepCount === 2 && data.settings.isInSupport) {
        console.log("pager 2");
        setStepCount(stepCount + 1);
        setSkipJoin({ ...skipJoin, status: true });
        setTimeout(() => {
            setSkipJoin({ ...skipJoin, dismissed: true });
        }, 5000);
    }

    if (stepCount < data.settings.initialSetupStep) console.log("pager 3");
    if (stepCount < data.settings.initialSetupStep) setStepCount(stepCount);

    if (stepCount <= steps.length) {
        return (
            <div>
                <div className="flex flex-col items-center">
                    <div className="hero bg-base-200">
                        <div className="hero-content text-center">
                            <div className="max-w-2xl">
                                <h1 className="text-2xl font-bold text-warning">
                                    <span className="animate-waving-hand">👋🏻</span> Gamer Setup Wizard
                                </h1>
                            </div>
                        </div>
                    </div>
                    {/* <div className="my-5 hero">
                        <h2 className="text-center">
                            Welcome to the Gamer bot setup wizard. This will help you go step by step to setting up all
                            the features on Gamer for your server. If you just want to set up everything in one click
                            with recommended defaults, click the button below.
                        </h2>
                        <p>
                            <strong>Advanced Users: </strong>We highly recommend going step by step, if you have the
                            time to do so, as it will teach you how features will work as well.
                        </p>
                        <p>
                            <strong>Note: </strong>You can come back to this wizard at any time in the future and the
                            teaching material is also in our guides so don't worry about losing it.
                        </p>
                    </div> */}

                    <progress
                        className="progress progress-primary w-full"
                        value={stepCount.toString()}
                        max={MAX_SETUP_STEPS.toString()}
                    ></progress>
                    {/* TODO: onClick setup everything with default features. */}
                    <div className={stepCount < 2 ? "cursor-not-allowed" : ""}>
                        <button
                            className={`btn btn-primary my-3 ${stepCount < 2 ? "cursor-not-allowed" : ""}`}
                            disabled={stepCount < 2}
                        >
                            One Click Default Setup Everything Automatically!
                        </button>
                    </div>
                </div>
                <div className="flex">
                    <ul className="steps steps-vertical w-1/5">
                        {steps.map((step, index) => (
                            <li
                                key={index}
                                className={`step ${
                                    stepCount === index ? "step-primary" : stepCount > index ? "step-success" : ""
                                }`}
                                data-content={stepCount === index ? "★" : stepCount > index ? "✓" : "●"}
                            >
                                <p className={stepCount === index ? "" : "opacity-50"}>{step.name}</p>
                            </li>
                        ))}
                    </ul>
                    <div className="w-full">
                        {skipInvite.status && !skipInvite.dismissed ? (
                            <div className="animate-hide absolute right-5 top-5 z-20 max-w-md rounded-lg bg-warning p-6 shadow backdrop-blur-xl">
                                <h1 className="text-xl font-medium text-slate-700">
                                    Hey! 👋 The bot is already in your server, skipping this step.
                                </h1>
                                <div className="flex items-center justify-between">
                                    <a
                                        href="#"
                                        className="inline-flex items-center space-x-1 text-sm text-slate-500 hover:text-slate-700"
                                    >
                                        <span
                                            onClick={() => {
                                                setSkipInvite({ ...skipInvite, dismissed: true });
                                            }}
                                        >
                                            Dismiss
                                        </span>
                                        <svg
                                            className="h-3 w-3"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                                            ></path>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        ) : null}
                        {skipJoin.status && !skipJoin.dismissed ? (
                            <div className="animate-hide absolute right-5 top-5 z-20 max-w-md rounded-lg bg-success p-6 shadow backdrop-blur-xl">
                                <h1 className="text-xl font-medium text-slate-700">
                                    Hey! 👋 You are already a member in the support server. Skipping this step!
                                </h1>
                                <div className="flex items-center justify-between">
                                    <a
                                        href="#"
                                        className="inline-flex items-center space-x-1 text-sm text-slate-500 hover:text-slate-700"
                                    >
                                        <span
                                            onClick={() => {
                                                setSkipJoin({ ...skipJoin, dismissed: true });
                                            }}
                                        >
                                            Dismiss
                                        </span>
                                        <svg
                                            className="h-3 w-3"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                                            ></path>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        ) : null}
                        {stepCount === 0 ? (
                            <div className="hero">
                                <div className="hero-content text-center items-center flex flex-col">
                                    <div className="max-w-xl">
                                        <h1 className="text-5xl font-bold">
                                            <span className="text-cyan-400">Wizard FAQ!</span>
                                        </h1>
                                        <p className="py-6">Go step by step setting up all the features on Gamer.</p>
                                        <p className="pb-2">
                                            <strong className="text-warning">Too much effort? I feel you! </strong>One
                                            click setup with best defaults! The button will be locked, until you meet
                                            the necessary requirements in a few steps.
                                        </p>
                                        <div>
                                            <img
                                                className="py-6"
                                                src={steps[stepCount].imageURL}
                                                alt="Become my nakama!"
                                            />
                                        </div>
                                        <p className="pb-2">
                                            <strong className="text-error">Advanced Users: </strong>We highly recommend
                                            going step by step, if you have the time to do so, as it will teach you how
                                            features will work as well.
                                        </p>
                                        <p className="pb-2">
                                            <strong className="text-error">Note: </strong>You can come back to this
                                            wizard at any time in the future and the teaching material is also in our
                                            guides so don't worry about losing it.
                                        </p>
                                        <div className="flex justify-center items-center">
                                            <button
                                                className="btn btn-secondary mx-1"
                                                onClick={() => {
                                                    setStepCount(stepCount + 1);
                                                }}
                                            >
                                                Let's Go!
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : stepCount === 1 ? (
                            <div className="hero">
                                <div className="hero-content text-center">
                                    <div className="max-w-xl">
                                        <h1 className="text-5xl font-bold">
                                            Step 1: <span className="text-cyan-400">Invite The Bot!</span>
                                        </h1>
                                        <p className="pt-6">The magic can only happen when the bot is in the server.</p>
                                        <img className="py-6" src={steps[stepCount].imageURL} alt="Become my nakama!" />
                                        <div className="flex justify-center items-center">
                                            <a
                                                href={BOT_INVITE}
                                                target="_blank"
                                                rel="noreferrer noopener"
                                                onClick={() => {
                                                    setStepCount(stepCount + 1);
                                                }}
                                            >
                                                <button className="btn btn-secondary mx-1">Invite Bot</button>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : stepCount === 2 ? (
                            <div className="hero">
                                <div className="hero-content text-center">
                                    <div className="max-w-xl">
                                        <h1 className="text-5xl font-bold">
                                            Step 2: <span className="text-cyan-400">Join Discord!</span>
                                        </h1>
                                        <p className="py-2">
                                            Whenever you need help, you can come ask! Together we are stronger!
                                        </p>
                                        <img className="py-6" src={steps[stepCount].imageURL} alt="Become my nakama!" />
                                        <div className="flex justify-center items-center">
                                            <a
                                                href={SUPPORT_SERVER}
                                                target="_blank"
                                                rel="noreferrer noopener"
                                                onClick={() => {
                                                    setStepCount(stepCount + 1);
                                                }}
                                            >
                                                <button className="btn btn-secondary mx-1">Join Discord!</button>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : stepCount === 3 ? (
                            <div className="hero">
                                <div className="hero-content text-center">
                                    <div className="max-w-xl">
                                        <h1 className="text-5xl font-bold">
                                            Step 3: <span className="text-cyan-400">Select A Prefix!</span>
                                        </h1>
                                        <p className="py-2">
                                            A prefix can be used to run commands much easier than their alternative /
                                            command forms. We highly recommend using the default prefix of{" "}
                                            <strong>.</strong>
                                        </p>
                                        <img className="py-6" src={steps[stepCount].imageURL} alt="Become my nakama!" />

                                        <div className="flex justify-center items-center">
                                            <div className="form-control">
                                                <div className="input-group">
                                                    <input
                                                        type="text"
                                                        placeholder={data.settings.prefix}
                                                        className="input input-bordered"
                                                    />
                                                    <button className="btn btn-primary">Submit</button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-center items-center pt-4">
                                            {/* TODO: Basically skips */}
                                            <button className="btn btn-secondary mx-1">Use Default</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : stepCount === 99 ? (
                            <div className="hero">
                                <div className="hero-content text-center">
                                    <div className="max-w-xl">
                                        <h1 className="text-5xl font-bold">
                                            Step 3: <span className="text-cyan-400">Staff Server!</span>
                                        </h1>
                                        <p className="py-2">
                                            We highly recommend using a staff or mod server. A staff server, is a second
                                            server on Discord that only your admins and moderators will have access to.
                                            This server is used for several features. For example, instead of cluttering
                                            your Official server with a ton of logs and profane messages that were
                                            deleted. Those messages can be kept in your staff server. Support tickets
                                            and other features can be sent here as well.
                                        </p>
                                        <img className="py-6" src={steps[stepCount].imageURL} alt="Become my nakama!" />
                                        <div className="flex justify-center items-center">
                                            <a href={SUPPORT_SERVER} target="_blank" rel="noreferrer noopener">
                                                <button className="btn btn-outline btn-error mx-1">Skip</button>
                                            </a>
                                            <a href={BOT_INVITE} target="_blank" rel="noreferrer noopener">
                                                <button className="btn btn-secondary mx-1">Invite Bot</button>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p>
                                IT SEEMS YOU HAVE FOUND OUR SECRET SECTION. AS A PRIZE YOU WIN THIS BUTTON, TO GO BACK
                                TO THE HOME PAGE.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mt-4">
                <Form
                    method="post"
                    onChange={() => {
                        setEdited(true);
                    }}
                    onReset={() => {
                        setEdited(false);
                    }}
                    onSubmit={() => {
                        setEdited(false);
                    }}
                >
                    <div className="flex flex-wrap items-center justify-center">
                        <div className="card w-96 bg-base-100 shadow-xl mr-2">
                            <div className="card-body">
                                <h2 className="card-title">Prefix</h2>
                                {errors?.prefix ? <em className="text-red-600">{errors.prefix}</em> : null}
                                <input
                                    type="text"
                                    placeholder={data.settings.prefix}
                                    className="input input-bordered"
                                    name="prefix"
                                    maxLength={3}
                                    minLength={1}
                                />
                            </div>
                        </div>

                        <div className="card w-96 bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">Max Reminders Per User</h2>
                                {errors?.maxReminders ? <em className="text-red-600">{errors.maxReminders}</em> : null}
                                <input
                                    defaultValue={data.settings.maxReminders.toString()}
                                    className="input input-bordered"
                                    name="maxReminders"
                                    type="number"
                                    max={100}
                                    min={0}
                                />
                            </div>
                        </div>
                    </div>

                    {data.reminders.length ? (
                        <div className="h-max mt-3">
                            <table className="table table-zebra w-full min-h-max">
                                <thead>
                                    <tr>
                                        <th className="bg-info">Member</th>
                                        <th className="bg-info">Content</th>
                                        <th className="bg-info">Frequency</th>
                                        <th className="bg-info">Manage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.reminders.map((reminder, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className="flex items-center space-x-3">
                                                    <div className="avatar">
                                                        <div className="mask mask-squircle w-12 h-12">
                                                            <img
                                                                src={reminder.imageURL}
                                                                alt="Avatar Tailwind CSS Component"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold">{reminder.serverName}</div>
                                                        <span className="badge badge-secondary badge-sm opacity-50">
                                                            Channel: {reminder.channel_id}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={`${reminder.content.length > 100 ? "text-sm" : "text-md"}`}>
                                                {reminder.content.substring(0, 100)}
                                                {reminder.content.length > 100 ? "…" : ""}
                                            </td>
                                            <td>
                                                <div className="flex items-center">
                                                    <RiRepeatFill className="mr-1" />
                                                    {reminder.interval
                                                        ? humanizeMilliseconds(reminder.interval * 1000)
                                                        : "None"}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex">
                                                    <Form
                                                        method="post"
                                                        onSubmit={() => {
                                                            setDeletingReminder([...deletingReminder, reminder.id]);
                                                        }}
                                                    >
                                                        <input
                                                            className="hidden"
                                                            type={"text"}
                                                            name={`reminder`}
                                                            value={`delete-reminder-${reminder.id}-${reminder.channel_id}-${reminder.server_id}`}
                                                            onChange={() => {}}
                                                        ></input>
                                                        <button
                                                            className={`btn btn-error btn-sm ${
                                                                isDeleting && deletingReminder.includes(reminder.id)
                                                                    ? "animate-pulse"
                                                                    : ""
                                                            }`}
                                                            type="submit"
                                                            disabled={
                                                                isDeleting && deletingReminder.includes(reminder.id)
                                                            }
                                                        >
                                                            {isDeleting && deletingReminder.includes(reminder.id) ? (
                                                                "Deleting..."
                                                            ) : (
                                                                <RiDeleteBin6Line />
                                                            )}
                                                        </button>
                                                    </Form>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th className="bg-info">Member</th>
                                        <th className="bg-info">Content</th>
                                        <th className="bg-info">Frequency</th>
                                        <th className="bg-info">Manage</th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    ) : null}

                    {edited ? (
                        <div className="alert shadow-lg alert-success fixed bottom-0 max-w-max mb-2 flex">
                            <div>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    className="stroke-primary flex-shrink-0 w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    ></path>
                                </svg>
                                <span>Would you like to save all the changes to your settings?</span>
                            </div>
                            <div className="flex-none">
                                <button type="reset" className="btn btn-outline btn-error btn-sm">
                                    Reset
                                </button>

                                <button type="submit" className="btn btn-primary btn-sm">
                                    Save
                                </button>
                            </div>
                            <p></p>
                        </div>
                    ) : null}
                </Form>
            </div>
        </div>
    );
}
