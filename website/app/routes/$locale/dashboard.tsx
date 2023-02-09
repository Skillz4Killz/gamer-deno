import { LoaderFunction } from "@remix-run/node";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { PartialGuild } from "discord-oauth2";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image } from "remix-image";
import Layout from "~/components/Layout";
import { avatarUrl, guildIconUrl } from "~/utils/imageUrl";
import { getGuilds } from "~/utils/oauth.server";
import { requireData, SessionData } from "~/utils/session.server";

type LoaderData = { user: SessionData; guilds: PartialGuild[]; guildId?: string };
export const loader: LoaderFunction = async ({ request, params }) => {
    const user = await requireData(request);
    const guilds = await getGuilds(user.accessToken);

    return {
        guildId: params.guildId,
        user,
        guilds: guilds
            .sort((a, b) => {
                if (!a.icon) return 1;

                if (a["name"] < b["name"]) return -1;
                if (a["name"] > b["name"]) return 1;
                return 0;
            })
            .filter((g) => BigInt(g.permissions ?? "") & 32n),
    };
};

function genImage(guild: PartialGuild) {
    const iconUrl = guildIconUrl(guild, 128);

    if (!iconUrl) {
        return (
            <div className="avatar placeholder">
                <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                    <span className="text-md">
                        {guild.name
                            .split(" ")
                            .map((word) => word[0])
                            .join("")}
                    </span>
                </div>
            </div>
        );
    }

    return <img className="mask mask-circle w-10" src={iconUrl} alt={`${guild.name} Guild`} />;
}

export default function Index() {
    const data = useLoaderData<LoaderData>();

    const t = useTranslation("common").t;

    const [visible, setVisible] = useState(true);

    return (
        <Layout user={data.user}>
            <div className="flex bg-base-200 pt-4">
                {/* Left Sidebar */}
                <div
                    className="btn btn-primary drawer-button lg:hidden fixed right-8 z-40 bottom-5"
                    onClick={() => {
                        setVisible(!visible);
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                    </svg>
                </div>

                {visible ? (
                    <ul className="menu bg-base-100 rounded-box max-w-min ml-3">
                        <li
                            className="max-h-min px-3 -mb-3 tooltip tooltip-right tooltip-primary z-50"
                            data-tip={`${data.user.username}#${data.user.discriminator}`}
                        >
                            <Link to={""} className="rounded-2xl hover:cursor-pointer my-2 p-1 active:bg-secondary">
                                <Image className="mask mask-circle w-10" src={avatarUrl(data.user)} />
                            </Link>
                        </li>
                        {data.guilds.map((g, i) => (
                            <li
                                key={i}
                                className="max-h-min px-3 -mb-3 tooltip tooltip-right tooltip-primary z-50"
                                data-tip={g.name}
                            >
                                <NavLink
                                    to={g.id}
                                    key={g.id}
                                    className="rounded-2xl hover:cursor-pointer my-2 p-1 active:bg-secondary"
                                >
                                    {genImage(g as PartialGuild)}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                ) : null}

                {/* Settings side */}
                <div className="w-full mr-6 ml-3">
                    {/* Ad box */}
                    <a className="alert alert-info shadow-lg bg-primary" href="https://discord.gg/ddeno">
                        <div>
                            <Image
                                src="https://cdn.discordapp.com/icons/785384884197392384/7cb67c989d54d824239b2bb4270955b1.png?size=1024"
                                height={50}
                                width={50}
                                className="mask mask-circle"
                            />
                            <div>
                                <h1 className="font-bold text-2xl capitalize">New software update available.</h1>
                                <span>
                                    Join us now at discordeno to get the latest and greatest discord library for your
                                    bots.
                                </span>
                            </div>
                        </div>
                    </a>

                    <Outlet />
                </div>
            </div>
        </Layout>
        // <div className="drawer drawer-mobile">
        //     <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        //     <div className="drawer-content flex flex-col">
        //         <div className="navbar bg-base-100">
        //             <div className="flex-none lg:hidden">
        //                 <button className="btn btn-square btn-ghost">
        //                     <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost">
        //                         <svg
        //                             xmlns="http://www.w3.org/2000/svg"
        //                             fill="none"
        //                             viewBox="0 0 24 24"
        //                             className="inline-block w-5 h-5 stroke-current"
        //                         >
        //                             <path
        //                                 strokeLinecap="round"
        //                                 strokeLinejoin="round"
        //                                 strokeWidth="2"
        //                                 d="M4 6h16M4 12h16M4 18h16"
        //                             ></path>
        //                         </svg>
        //                     </label>
        //                 </button>
        //             </div>
        //             <div className="flex-1">
        //                 <a className="btn btn-ghost normal-case text-xl" href="/dashboard">
        //                     Gamer
        //                 </a>
        //             </div>
        //             <div className="dropdown dropdown-end">
        //                 <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
        //                     <div className="w-10 rounded-full">{<img src={avatarUrl(data.user)} />}</div>
        //                 </label>
        //                 <ul
        //                     tabIndex={0}
        //                     className="top-10 menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
        //                 >
        //                     <li className="btn-disabled bg-transparent">
        //                         {/* <div className="btn-disabled bg-transparent grid justify-items-stretch text-left">
        //                             <div>Logged in as</div>
        //                             <div>ITOH#0933</div>
        //                         </div> */}
        //                         <div
        //                             className="flex flex-row justify-start align-center flex-wrap"
        //                             // style="flex: 1 1 auto;"
        //                         >
        //                             <div>
        //                                 <div className="">Logged in as</div>
        //                                 <div
        //                                     className="flex flex-row justify-start align-center flex-nowrap"
        //                                     // style="flex: 1 1 auto;"
        //                                 >
        //                                     <div
        //                                         className=""
        //                                         // style="flex-grow: 0; flex-shrink: 1;"
        //                                     >
        //                                         ITOH
        //                                     </div>
        //                                     <span
        //                                         className=""
        //                                         // style="flex-grow: 0; flex-shrink: 0;"
        //                                     >
        //                                         #0933
        //                                     </span>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     </li>
        //                     <li>
        //                         <a className="justify-between">
        //                             Profile
        //                             <span className="badge">New</span>
        //                         </a>
        //                     </li>
        //                     <li>
        //                         <a>Settings</a>
        //                     </li>
        //                     <li>
        //                         <a className="text-red-600">Logout</a>
        //                     </li>
        //                 </ul>
        //             </div>
        //         </div>
        //         <Outlet />
        //     </div>
        //     {data.guildId && (
        //         <div className="drawer-side">
        //             <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        //             <ul className="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
        //                 {/* <!-- Sidebar content here --> */}
        //                 <li>
        //                     <a>Sidebar Item 1</a>
        //                 </li>
        //                 <li>
        //                     <a>Sidebar Item 2</a>
        //                 </li>
        //             </ul>
        //         </div>
        //     )}
        // </div>
    );
}
