import { redirect, TypedResponse } from "@remix-run/node";
import { useEffect, useState } from "react";
import Countdown, { zeroPad } from "react-countdown";
import CountUp from "react-countup";
import Slider from "react-slick";

import { LoaderFunction, SessionData } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { configs } from "configs.server";
import { useTranslation } from "react-i18next";
import Image from "remix-image";
import Layout from "~/components/Layout";
import { BOT_INVITE, SUPPORT_SERVER } from "~/utils/constants";
import prisma from "~/utils/db.server";
import { getData } from "~/utils/session.server";

export function links() {
    return [
        { rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" },
        { rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" },
    ];
}

type LoaderData = {
    user: SessionData | null;
    stats: { commands: number; messagesProcessed: number; servers: number; users: number };
};
export const loader: LoaderFunction = async ({ request, params }): Promise<LoaderData | TypedResponse<never>> => {
    const user = await getData(request);
    // If user is logged in, just re-route to dashboard
    if (user) return redirect(`/${params.locale}/dashboard`);

    const [botstats, serverCount, memberCount] = await Promise.all([
        prisma.bot_stats.findUnique({ where: { bot_id: configs.bot.id } }),
        prisma.bot_server_stats.count(),
        prisma.bot_server_stats.aggregate({ _sum: { member_count: true } }),
    ]).catch(() => []);

    const data: LoaderData = {
        user,
        stats: {
            commands: Number(botstats?.commands_ran || 0),
            messagesProcessed: Number(botstats?.messages_processed || 0),
            servers: serverCount || 0,
            users: memberCount ? Number(memberCount._sum.member_count) : 0,
        },
    };

    return data;
};

const features = [
    {
        title: "Feedback / Bug Reports Feature",
        description:
            "Collect suggestions or bug reports from your users. A flexible and customizable feedback feature that provides the best experience for not just developers but users as well for sending feedback.",
        imageURL: "https://i.imgur.com/Q0dNsCc.png",
        alt: "feedback and bug reports feature",
        badges: [{ name: "Tools", type: "badge-warning" }],
        hot: true,
        color: "text-primary",
        modal: "feedback",
    },
    {
        title: "Games (Idle, Counting & more!)",
        description:
            "An amazingly entertaining idle game to keep your server constantly active and giving your users a chance to win Discord Nitro!",
        imageURL: "https://i.imgur.com/54JXspA.png",
        alt: "idle game",
        badges: [
            { name: "Game", type: "badge-info" },
            { name: "Economy", type: "badge-success" },
        ],
        hot: false,
        color: "text-secondary",
        modal: "idle",
    },
    {
        title: "Leveling, Missions/Quests, XP!",
        description:
            "The most beautiful and extremely customizable profile/rank cards on Discord! Give or take roles when users gain or lose levels. Remove XP automatically for inactivity and reward XP for activity!",
        imageURL: "https://i.imgur.com/3MTeIXH.png",
        alt: "leveling, missions, quests, and xp",
        badges: [
            { name: "Game", type: "badge-info" },
            { name: "Economy", type: "badge-success" },
        ],
        hot: false,
        color: "text-accent",
        modal: "xp",
    },
    {
        title: "Looking For Group / Events",
        description:
            "Organize and schedule a gathering whether it be in real life, or on the server. It will provide you with a method of sending out pertinent information to those you want, while allowing users the ability to RSVP to the event to let you know they’ll be there (or that they can’t make it).",
        imageURL: "https://i.imgur.com/iKaUFKU.gif",
        alt: "looking for group and events",
        badges: [
            { name: "Game", type: "badge-info" },
            { name: "Tools", type: "badge-warning" },
        ],
        hot: true,
        color: "text-info",
        modal: "lfg",
    },
    {
        title: "Subscribe To Alerts You Care About!",
        description:
            "Don't you hate getting @ mentions for posts that don't matter? Using Gamers advanced alerts system you can filter them to be exactly what you want!",
        imageURL: "https://i.imgur.com/gSAJCUL.png",
        alt: "rss alerts and subscription alerts",
        badges: [{ name: "Tools", type: "badge-warning" }],
        hot: false,
        color: "text-success",
        modal: "alerts",
    },
    {
        title: "Best Support System Ever!",
        description:
            "Allow users to create private tickets right on Discord! Create a list of questions users must answer to send a ticket! And so much more!!! Why waste money on third party support who don't really understand your game, when you can just have your most helpful players like your moderators help the players! They understand the players needs and concerns better than anyone else!",
        imageURL: "https://i.imgur.com/VPCA4oz.png",
        alt: "ticket style support system",
        badges: [{ name: "Tools", type: "badge-warning" }],
        hot: true,
        color: "text-error",
        modal: "tickets",
    },
];

const servers = [
    {
        name: "LOUD",
        count: 600000,
        imageURL: "https://cdn.discordapp.com/icons/550143369184280607/0719f8e00693ff518d3f794987279b08.jpg?size=128",
        partner: true,
    },
    {
        name: "Canal PlayHard",
        count: 221521,
        imageURL: "https://cdn.discordapp.com/icons/334791529296035840/a_e633fade91a50564489249ee38398a8d.gif?size=128",
        partner: true,
    },
    {
        name: "Identity V | Official",
        count: 88898,
        imageURL: "https://cdn.discordapp.com/icons/441545164985597952/c191ee9612b339fcaa2a3aeb32db0a88.jpg?size=128",
        partner: false,
    },
    {
        name: "Vainglory",
        count: 70996,
        imageURL: "https://cdn.discordapp.com/icons/67200685216641024/19285184f4d966be1e64b46fd26dc1db.jpg?size=128",
        partner: false,
    },
    {
        name: "Zooba: Zoo Battle Arena",
        count: 43131,
        imageURL: "https://cdn.discordapp.com/icons/623498061230112788/b18cdd649a2eca64254367b514c40f34.jpg?size=128",
        partner: false,
    },
    {
        name: "Apex Legends Germany",
        count: 42344,
        imageURL: "https://cdn.discordapp.com/icons/542304652381782016/a_02108126c124e7ded7b6e6f355349203.gif?size=128",
        partner: true,
    },
    {
        name: "Arena of Valor",
        count: 39624,
        imageURL: "https://cdn.discordapp.com/icons/293208951473045504/e765eccc9655ee3b3ef2fbd77800dd91.jpg?size=128",
        partner: false,
    },
    {
        name: "Crusher Fooxi",
        count: 28951,
        imageURL: "https://cdn.discordapp.com/icons/580501998705836067/6864611a87c2748a3328054a7bfdde10.jpg?size=128",
        partner: true,
    },
    {
        name: "Metal Revolution",
        count: 28263,
        imageURL: "https://cdn.discordapp.com/icons/545831076321427466/a_018317ed62224c97936db0257d9aebda.gif?size=128",
        partner: false,
    },
    {
        name: "Rules of Survival Official",
        count: 21386,
        imageURL: "https://cdn.discordapp.com/icons/383908501170290690/dd612d581f26d243bbf465e9abbc4a30.jpg?size=128",
        partner: false,
    },
    {
        name: "Mighty Quest",
        count: 20386,
        imageURL: "https://cdn.discordapp.com/icons/484362621928341535/d4f88085366b4360450e183d8c959f2f.jpg?size=128",
        partner: false,
    },
    {
        name: "Grimescord",
        count: 15295,
        imageURL: "https://cdn.discordapp.com/icons/505718251292983308/a_e21032a978b3e291bd583698a0bed129.gif?size=128",
        partner: true,
    },
    {
        name: "Might & Magic: Era of Chaos",
        count: 14666,
        imageURL: "https://cdn.discordapp.com/icons/616107025474125824/e8d0c7a59512403402a2ca503e988270.jpg?size=128",
        partner: false,
    },
    {
        name: "Rainychville",
        count: 11145,
        imageURL: "https://cdn.discordapp.com/icons/641229791101583360/57c924fe8b6bb8c61b90adcc68f4b610.jpg?size=128",
        partner: true,
    },
    {
        name: "MADD Army",
        count: 8002,
        imageURL: "https://cdn.discordapp.com/icons/272134272234684416/dd677ec8e6f617cd981e50ba1f908731.jpg?size=128",
        partner: true,
    },
    {
        name: "TOG - The Older Gamers",
        count: 2712,
        imageURL: "https://cdn.discordapp.com/icons/313467016985968641/47d9c4055a41b44d74fdc2c0912ee09c.jpg?size=128",
        partner: true,
    },
    {
        name: "El rincónde TNT",
        count: 1722,
        imageURL: "https://cdn.discordapp.com/icons/314142323078594562/a_2a7772308575733feb059ebb3523a6eb.gif?size=128",
        partner: true,
    },
];

const renderer = ({ hours, minutes, seconds }: { hours: number; minutes: number; seconds: number }) => (
    <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
        <div className="flex flex-col p-2 bg-accent rounded-box text-accent-content">
            <span className="countdown font-mono text-5xl">
                <span></span>
            </span>
            days
        </div>
        <div className="flex flex-col p-2 bg-accent rounded-box text-accent-content">
            <span className="countdown font-mono text-5xl">
                <span id="countdown-hours">{zeroPad(hours)}</span>
            </span>
            hours
        </div>
        <div className="flex flex-col p-2 bg-accent rounded-box text-accent-content">
            <span className="countdown font-mono text-5xl">
                <span id="countdown-minutes">{zeroPad(minutes)}</span>
            </span>
            min
        </div>
        <div className="flex flex-col p-2 bg-accent rounded-box text-accent-content">
            <span className="countdown font-mono text-5xl">
                <span id="countdown-seconds">{zeroPad(seconds)}</span>
            </span>
            sec
        </div>
    </div>
);

export default function Index() {
    const data = useLoaderData<LoaderData>();

    const { t } = useTranslation("common");

    const [lastWaveColor, setLastWaveColor] = useState("#292524");
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);
    const [activeSlideIndex2, setActiveSlideIndex2] = useState(0);

    useEffect(() => {
        const theme = window.localStorage.getItem("theme");
        switch (theme) {
            case "gamerlight":
            case "winter":
                setLastWaveColor("#FFF");
                break;
            case "synthwave":
                setLastWaveColor("#2d1b69");
                break;
            case "retro":
                setLastWaveColor("#e4d8b4");
                break;
            case "cyberpunk":
                setLastWaveColor("#ffee00");
                break;
            case "valentine":
                setLastWaveColor("#f0d6e8");
                break;
            case "aqua":
                setLastWaveColor("#345da7");
                break;
            default:
                setLastWaveColor?.("#292524");
        }
    }, []);

    return (
        <div className="w-full">
            {/* Wave */}

            <div className="mx-auto absolute w-full -z-10">
                <div className="relative py-10 px-8 md:py-24 md:px-12 overflow-hidden" data-aos="zoom-y-out">
                    <div className="absolute left-0 right-0 bottom-0">
                        <div className="headerWaves w-full">
                            <div className="inner-headerWaves flex"></div>
                            <div>
                                <svg
                                    className="waves"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    viewBox="0 24 150 28"
                                    preserveAspectRatio="none"
                                    shapeRendering="auto"
                                >
                                    <defs>
                                        <path
                                            id="gentle-wave"
                                            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
                                        />
                                    </defs>
                                    <g className="parallax">
                                        <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(34,211,238,0.9)" />
                                        <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(34,211,238,0.5)" />
                                        <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(34,211,238,0.1)" />
                                        <use xlinkHref="#gentle-wave" x="48" y="7" fill={lastWaveColor} />
                                    </g>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <Layout setLastWaveColor={setLastWaveColor}>
                    {/* Hero */}
                    <div className="hero min-h-screen">
                        <div className="hero-content text-center">
                            <div className="max-w-xl">
                                <h1 className="text-5xl font-bold">
                                    Designed For <span className="text-cyan-400">Official Gaming Discord Servers</span>
                                </h1>
                                <p className="py-6">
                                    The Discord bot for every gamer! Games, moderation, leveling, alerts, and much more!
                                </p>
                                <div className="flex justify-center items-center">
                                    <a href={SUPPORT_SERVER} target="_blank" rel="noreferrer noopener">
                                        <button className="btn btn-outline btn-primary mx-1">Join Discord</button>
                                    </a>
                                    <a href={BOT_INVITE} target="_blank" rel="noreferrer noopener">
                                        <button className="btn btn-secondary mx-1">Invite Bot</button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="divider"></div>

                    {/* Stats Section */}
                    <div className="flex items-center justify-center">
                        <div className="stats shadow">
                            <div className="stat">
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
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        ></path>
                                    </svg>
                                </div>
                                <div className="stat-title">Servers</div>
                                <div className="stat-value text-primary">
                                    <CountUp end={data.stats.servers} separator="," suffix={"+"} />
                                </div>
                            </div>

                            <div className="stat">
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
                                <div className="stat-title">Users</div>
                                <div className="stat-value text-secondary">
                                    <CountUp end={data.stats.users} separator="," suffix={"+"} />
                                </div>
                            </div>

                            {/* <div className="stat">
                                <div className="stat-figure text-info">
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
                                <div className="stat-title">Features</div>
                                <div className="stat-value text-error">
                                    <CountUp end={300} separator="," suffix={"+"} />
                                </div>
                            </div> */}

                            <div className="stat">
                                <div className="stat-figure text-info">
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
                                <div className="stat-title">Commands Ran</div>
                                <div className="stat-value text-success">
                                    <CountUp end={data.stats.commands} separator="," suffix={"+"} />
                                </div>
                            </div>

                            <div className="stat">
                                <div className="stat-figure text-info">
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
                                <div className="stat-title">Messages Processed</div>
                                <div className="stat-value text-warning">
                                    <CountUp end={data.stats.messagesProcessed} separator="," suffix={"+"} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="divider"></div>

                    {/* Features Section */}
                    <div>
                        <div className="hero">
                            <div className="hero-content text-center">
                                <div className="max-w-xl">
                                    <h2 className="text-4xl font-bold text-primary">What Gamer Can Do For You!</h2>
                                    <p className="py-6">
                                        Gamer is one of the most advanced bots on Discord. It was designed specifically
                                        for official gaming servers. But it is built in a way that it can be used by any
                                        server!
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center items-center flex-wrap">
                            {features.map((feature, index) => (
                                <div key={index}>
                                    <label htmlFor={feature.modal} className="hover:cursor-pointer">
                                        <div className="mx-3">
                                            <div className="card w-96 bg-base-200 shadow-xl">
                                                <figure>
                                                    <Image src={feature.imageURL} alt={feature.alt} className="h-56" />
                                                </figure>

                                                <div className="card-body">
                                                    <h2 className={`card-title ${feature.color}`}>
                                                        {feature.title}
                                                        {feature.hot ? (
                                                            <div className="badge badge-error">HOT!</div>
                                                        ) : null}
                                                    </h2>
                                                    <p>{feature.description}</p>
                                                    <div className="card-actions justify-end">
                                                        {feature.badges.map((badge, i) => (
                                                            <div key={i} className={`badge ${badge.type}`}>
                                                                {badge.name}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </label>

                                    <input type="checkbox" id={feature.modal} className="modal-toggle" />
                                    <label htmlFor={feature.modal} className="modal cursor-pointer">
                                        <label className="modal-box relative" htmlFor="">
                                            <Image src={feature.imageURL} />
                                        </label>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="divider"></div>

                    {/* Piece by Piece Section */}
                    <div>
                        <div className="hero">
                            <div className="hero-content text-center">
                                <div className="max-w-xl">
                                    <h2 className="text-4xl font-bold text-primary">Bot that just works!</h2>
                                    <p className="py-6">
                                        Each and every feature in Gamer is designed as a separate piece. You can combine
                                        multiple pieces together to create amazing possibilities!
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center flex-wrap">
                            <div className="hero">
                                <div className="hero-content flex-col lg:flex-row">
                                    <img
                                        src="https://i.imgur.com/GeKZHQ0.png"
                                        className="max-w-sm rounded-lg shadow-2xl"
                                    />
                                    <div>
                                        <p className="text-error">LIGHTNING FAST!</p>
                                        <h3 className="text-3xl font-bold text-accent">Reaction Roles</h3>
                                        <p className="py-6 max-w-xl">
                                            Reaction roles are a fun, easy and visual way for users to assign roles to
                                            themselves without having to go through the effort of having to type .give
                                            role. Once setup, users can now join your server and give themself the right
                                            roles.
                                        </p>
                                        <a href={BOT_INVITE} target="_blank" rel="noreferrer noopener">
                                            <button className="btn btn-secondary mx-1">Setup In Your Server!</button>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="hero">
                                <div className="hero-content flex-col lg:flex-row-reverse">
                                    <img
                                        src="https://i.imgur.com/Is6e0gR.png"
                                        className="max-w-sm rounded-lg shadow-2xl"
                                    />
                                    <div>
                                        <p className="text-error">SEND A @ALERT WHEN SOMEONE CHANGES ROLES</p>
                                        <h3 className="text-3xl font-bold text-info">Role Messages</h3>
                                        <p className="py-6 max-w-xl">
                                            Setup customizable messages to be sent when a user gains or loses a role!
                                            Role messages can be used as welcome or goodbye messages for specific
                                            roles/groups on your server. For example, you can use this to give players a
                                            specific code to enter for their specific region role. Mix this with your XP
                                            system to alert users that are inactive! And so much more!
                                        </p>
                                        <a href={BOT_INVITE} target="_blank" rel="noreferrer noopener">
                                            <button className="btn btn-secondary mx-1">Setup In Your Server!</button>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="hero">
                                <div className="hero-content flex-col lg:flex-row">
                                    <img
                                        src="https://i.imgur.com/wpdSPpm.gif"
                                        className="max-w-sm rounded-lg shadow-2xl"
                                    />
                                    <div>
                                        <p className="text-error">A ROLE SET FOR EVERYONE!</p>
                                        <h3 className="text-3xl font-bold text-success">Automatic Role Management</h3>
                                        <div className="max-w-xl">
                                            <p className="pb-1 pt-6">
                                                - Use a Unique role set to make sure users can only have one role in
                                                that set.
                                            </p>
                                            <p className="py-1">
                                                - Use the Grouped role sets to assign a Player role whenever a user
                                                gains a role from the reaction role!
                                            </p>
                                            <p className="py-1">
                                                - Use the Default role sets to automatically assign a role when a user
                                                does not have any role in that set.
                                            </p>
                                            <p className="py-1 pb-6">
                                                - Use the Required role sets to make sure the user has the required role
                                                in order to gain another role.
                                            </p>
                                        </div>

                                        <a href={BOT_INVITE} target="_blank" rel="noreferrer noopener">
                                            <button className="btn btn-secondary mx-1">Setup In Your Server!</button>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="divider"></div>

                    {/* Testimonial Section */}
                    <div>
                        <div className="hero">
                            <div className="hero-content text-center">
                                <div className="max-w-xl">
                                    <h2 className="text-4xl font-bold text-primary">
                                        Trusted By The Biggest And Best Servers All Over The World!
                                    </h2>
                                    <p className="py-6">
                                        Gamer supports many Official Discord Partners and Verified Servers. Let's add
                                        your server to the list!
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Slider
                            autoplay
                            // adaptiveHeight
                            // centerMode
                            draggable
                            pauseOnHover
                            infinite
                            swipeToSlide
                            swipe
                            touchMove
                            useCSS
                            useTransform
                            // variableWidth
                            slidesToShow={4}
                            slidesToScroll={servers.length}
                            autoplaySpeed={0}
                            speed={1000 * servers.length * 2}
                            // rows={1}
                            // slidesPerRow={1}
                            arrows={false}
                            dots={false}
                            fade={false}
                            rtl={false}
                            // centerPadding="300px"
                            // easing="ease"
                            cssEase="linear"
                            className="server-avatar-list"
                        >
                            {servers.map((server, index) => (
                                <div key={index}>
                                    <div key={index} className="flex flex-col items-center justify-center mx-10 py-6">
                                        <div className="server-avatar server-avatar-large">
                                            <img
                                                src={server.imageURL}
                                                alt={server.name}
                                                className="server-avatar-image"
                                            />
                                            <img
                                                src={randomItem([
                                                    "https://i.imgur.com/cuaCwYj.png",
                                                    "https://i.imgur.com/T1lahme.png",
                                                    "https://i.imgur.com/0aDdQyR.png",
                                                    "https://i.imgur.com/0bCzwK4.png",
                                                ])}
                                                alt="border frame"
                                                className={`server-avatar-frame ${randomItem([
                                                    "anim-spin",
                                                    "anim-hue",
                                                ])}`}
                                            />
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <p className="text-md font-bold text-success text-center">{server.name}</p>
                                            <img
                                                src={`https://cdn.discordapp.com/emojis/${
                                                    server.partner ? "921157453419266048" : "751159037378297976"
                                                }.webp?size=240&quality=lossless`}
                                                className={"h-6 w-6 ml-2 mt-1"}
                                            />
                                        </div>
                                        <p className="text-center">{server.count.toLocaleString()} members</p>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>

                    <div className="divider"></div>

                    {/* Call To Action */}
                    <div>
                        <div className="hero">
                            <div className="hero-content text-center">
                                <div className="max-w-xl">
                                    <h2 className="text-4xl font-bold text-primary">Invite The Bot Now!</h2>
                                    <p className="py-6">Try 3 month FREE premium access with this special link:</p>
                                    <Countdown
                                        date={Date.now() + 1000 * 60 * 5}
                                        renderer={renderer}
                                        onTick={(time) => {
                                            document
                                                .getElementById("countdown-hours")
                                                ?.style.setProperty("--value", time.hours.toString());
                                            document
                                                .getElementById("countdown-minutes")
                                                ?.style.setProperty("--value", time.minutes.toString());
                                            document
                                                .getElementById("countdown-seconds")
                                                ?.style.setProperty("--value", time.seconds.toString());
                                        }}
                                    />

                                    <div className="flex justify-center items-center pt-6">
                                        <a href={SUPPORT_SERVER} target="_blank" rel="noreferrer noopener">
                                            <button className="btn btn-outline btn-primary mx-1">Join Discord</button>
                                        </a>
                                        <a href={BOT_INVITE} target="_blank" rel="noreferrer noopener">
                                            <button className="btn btn-secondary mx-1">Invite Bot</button>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="divider"></div>
                </Layout>
            </div>
        </div>
    );
}

function randomItem(arr: any[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}
