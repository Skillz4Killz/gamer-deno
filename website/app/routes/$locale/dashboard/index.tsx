import { reminders } from "@prisma/client";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, Link, useLoaderData, useTransition } from "@remix-run/react";
import { useState } from "react";
// import { MdDeleteForever, MdEdit } from "react-icons/md";
import { RiDeleteBin6Line, RiRepeatFill } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import prisma from "~/utils/db.server";
import { guildIconUrl } from "~/utils/imageUrl";
import { getGuilds } from "~/utils/oauth.server";
import { requireData } from "~/utils/session.server";

type LoaderData = { reminders: (reminders & { imageURL?: string; serverName?: string })[] };
export const loader: LoaderFunction = async ({ request }) => {
    const user = await requireData(request);
    const reminders = await prisma.reminders.findMany({
        where: { user_id: BigInt(user.userId) },
        orderBy: { server_id: "asc" },
    });
    if (!reminders.length) {
        console.log("NO REMINDERS< LETS CREATE FIVE");
        await prisma.reminders.create({
            data: {
                channel_id: 858720707390472202n,
                content: "Finally fix that one bug 1",
                id: 1,
                interval: 54654132,
                server_id: 547046977578336286n,
                timestamp: new Date(),
                user_id: BigInt(user.userId),
            },
        });
        await prisma.reminders.create({
            data: {
                channel_id: 858720707390472202n,
                content: "Finally fix that one bug 2",
                id: 2,
                interval: 54654132,
                server_id: 547046977578336286n,
                timestamp: new Date(),
                user_id: BigInt(user.userId),
            },
        });
        await prisma.reminders.create({
            data: {
                channel_id: 858720707390472202n,
                content: "Finally fix that one bug 3",
                id: 3,
                interval: 54654132,
                server_id: 547046977578336286n,
                timestamp: new Date(),
                user_id: BigInt(user.userId),
            },
        });
        await prisma.reminders.create({
            data: {
                channel_id: 858720707390472202n,
                content: "Finally fix that one bug 4",
                id: 4,
                interval: 54654132,
                server_id: 547046977578336286n,
                timestamp: new Date(),
                user_id: BigInt(user.userId),
            },
        });
        await prisma.reminders.create({
            data: {
                channel_id: 858720707390472202n,
                content: "Finally fix that one bug 5",
                id: 5,
                interval: 54654132,
                server_id: 547046977578336286n,
                timestamp: new Date(),
                user_id: BigInt(user.userId),
            },
        });
    }

    const guilds = await getGuilds(user.accessToken);
    const server = guilds.find((g) => g.id === "547046977578336286");

    // Fetch user db
    return {
        reminders:
            reminders?.map((reminder) => ({
                ...reminder,
                channel_id: reminder.channel_id.toString(),
                server_id: reminder.server_id.toString(),
                user_id: reminder.user_id.toString(),
                imageURL: server ? guildIconUrl(server) : undefined,
                serverName: server?.name,
            })) ?? [],
    };
};

type ActionData =
    | {
          reminderContent?: string;
      }
    | undefined;
export const action: ActionFunction = async ({ request, params, context }) => {
    const form = await request.formData();
    const user = await requireData(request);

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
                        user_id: BigInt(user.userId),
                    },
                });
            } catch (err) {
                return null;
            }

            return null;
        }
    }
    return null;
};

export default function Index() {
    const data = useLoaderData<LoaderData>();
    const [deletingReminder, setDeletingReminder] = useState([-1]);
    const transition = useTransition();
    const isDeleting = Boolean(transition.submission);

    return (
        <div className="max-w-full mt-4">
            <div className="stats shadow flex flex-col md:flex-row">
                <div className="stat place-items-center">
                    <div className="stat-figure text-secondary">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="inline-block w-8 h-8 stroke-current"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                        </svg>
                    </div>
                    <div className="stat-title">Global XP</div>
                    <div className="stat-value text-primary">31K</div>
                    <div className="stat-desc text-primary">↗︎ 2K (1%)</div>
                </div>

                <div className="stat place-items-center">
                    <div className="stat-figure text-secondary">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="inline-block w-8 h-8 stroke-current"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                            ></path>
                        </svg>
                    </div>
                    <div className="stat-title">Commands Used</div>
                    <div className="stat-value text-secondary">4,200</div>
                    <div className="stat-desc text-secondary">↗︎ 40 (2%)</div>
                </div>

                <div className="stat place-items-center">
                    <div className="stat-figure text-secondary">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="inline-block w-8 h-8 stroke-current"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                            ></path>
                        </svg>
                    </div>
                    <div className="stat-title">Messages Sent</div>
                    <div className="stat-value text-accent">1,200</div>
                    <div className="stat-desc text-accent">↘︎ 90 (14%)</div>
                </div>

                <div className="stat place-items-center">
                    <div className="stat-figure text-primary">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="inline-block w-8 h-8 stroke-current"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            ></path>
                        </svg>
                    </div>
                    <div className="stat-title">Minutes In Voice</div>
                    <div className="stat-value text-success">15</div>
                    <div className="stat-desc text-success">↘︎ 90 (14%)</div>
                </div>
            </div>

            {data.reminders.length ? (
                <div className="max-w-full mt-3">
                    <table className="table max-w-full min-w-full w-full mx-auto">
                        <thead>
                            <tr>
                                <th className="bg-info">Server</th>
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
                                                    <img src={reminder.imageURL} alt="Avatar Tailwind CSS Component" />
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
                                            {reminder.interval ? humanizeMilliseconds(reminder.interval * 1000) : "None"}
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
                                                    disabled={isDeleting && deletingReminder.includes(reminder.id)}
                                                >
                                                    {isDeleting && deletingReminder.includes(reminder.id) ? (
                                                        "Deleting..."
                                                    ) : (
                                                        <RiDeleteBin6Line />
                                                    )}
                                                </button>
                                            </Form>

                                            <Link to={`reminders/${reminder.id}`}>
                                                <button
                                                    className={`btn btn-info btn-sm ml-2`}
                                                    type="button"
                                                    disabled={isDeleting && deletingReminder.includes(reminder.id)}
                                                >
                                                    <TbEdit height={64} width={64} />
                                                </button>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th className="bg-info">Server</th>
                                <th className="bg-info">Content</th>
                                <th className="bg-info">Frequency</th>
                                <th className="bg-info">Manage</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            ) : null}

            {/* Logout button */}
            <div className="py-3">
                <button className="btn btn-error">
                    <Link to="/logout">Log out</Link>
                </button>
            </div>
        </div>
    );
}

export function humanizeMilliseconds(milliseconds: number) {
    // Gets ms into seconds
    const time = milliseconds / 1000;
    if (time < 1) return "1s";

    const days = Math.floor(time / 86400);
    const hours = Math.floor((time % 86400) / 3600);
    const minutes = Math.floor(((time % 86400) % 3600) / 60);
    const seconds = Math.floor(((time % 86400) % 3600) % 60);

    const dayString = days ? `${days}d ` : "";
    const hourString = hours ? `${hours}h ` : "";
    const minuteString = minutes ? `${minutes}m ` : "";
    const secondString = seconds ? `${seconds}s ` : "";

    return `${dayString}${hourString}${minuteString}${secondString}`;
}
