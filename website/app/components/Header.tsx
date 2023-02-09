import { Link, useParams } from "@remix-run/react";
import { SetStateAction } from "react";
import { Image } from "remix-image";
import { themeChange } from "theme-change";
import { avatarUrl } from "~/utils/imageUrl";
import { SessionData } from "~/utils/session.server";
import Logo from "../../public/images/logo.webp";

interface HeaderProps {
    setLastWaveColor?: (value: SetStateAction<string>) => void;
    user?: SessionData | null;
}

export default function Header(props: HeaderProps) {
    const params = useParams();

    return (
        <div className="navbar transparent">
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost lg:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h8m-8 6h16"
                            />
                        </svg>
                    </label>
                    <ul
                        tabIndex={0}
                        className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
                    >
                        {/* <li>
                            <Link to={`/guides`}>Guides</Link>
                        </li> */}

                        <li tabIndex={0}>
                            <a className="justify-between">
                                Themes
                                <svg
                                    className="fill-current"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                                </svg>
                            </a>
                            <ul className="menu dropdown-content p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                                {[
                                    "gamerdark",
                                    "gamerlight",
                                    "dracula",
                                    "winter",
                                    "synthwave",
                                    "retro",
                                    "cyberpunk",
                                    "valentine",
                                    "aqua",
                                ].map((name, index) => (
                                    <li key={index}>
                                        <button
                                            data-set-theme={name}
                                            onClick={() => {
                                                switch (name) {
                                                    case "gamerlight":
                                                    case "winter":
                                                        props.setLastWaveColor?.("#FFF");
                                                        break;
                                                    case "synthwave":
                                                        props.setLastWaveColor?.("#2d1b69");
                                                        break;
                                                    case "retro":
                                                        props.setLastWaveColor?.("#e4d8b4");
                                                        break;
                                                    case "cyberpunk":
                                                        props.setLastWaveColor?.("#ffee00");
                                                        break;
                                                    case "valentine":
                                                        props.setLastWaveColor?.("#f0d6e8");
                                                        break;
                                                    case "aqua":
                                                        props.setLastWaveColor?.("#345da7");
                                                        break;
                                                    default:
                                                        props.setLastWaveColor?.("#292524");
                                                }
                                                // @ts-ignore this libs typins suck but this is how it works
                                                themeChange(name);
                                            }}
                                        >
                                            {`${name.charAt(0).toUpperCase()}${name.slice(1)}`}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    </ul>
                </div>
                <Link className="btn btn-ghost normal-case text-xl" to={`/${params.locale}`}>
                    <Image src={Logo} width={36} height={36} alt="logo" />
                </Link>
            </div>

            <div className="navbar-end">
                <div className="hidden lg:flex rounded-box">
                    <div className="flex justify-end flex-1 px-2">
                        <div className="flex items-stretch">
                            {/* <div className="btn btn-ghost rounded-btn">
                                <Link to={`/guides`}>Guides</Link>
                            </div> */}
                            <div className="dropdown dropdown-end">
                                <label tabIndex={0} className="btn btn-ghost rounded-btn">
                                    Themes
                                </label>
                                <ul
                                    tabIndex={0}
                                    className="menu dropdown-content p-2 shadow bg-base-100 rounded-box w-52 mt-4"
                                >
                                    {[
                                        "gamerdark",
                                        "gamerlight",
                                        "dracula",
                                        "winter",
                                        "synthwave",
                                        "retro",
                                        "cyberpunk",
                                        "valentine",
                                        "aqua",
                                    ].map((name, index) => (
                                        <li key={index}>
                                            <button
                                                data-set-theme={name}
                                                onClick={() => {
                                                    switch (name) {
                                                        case "gamerlight":
                                                        case "winter":
                                                            console.log("testing");
                                                            props.setLastWaveColor?.("#FFF");
                                                            break;
                                                        case "synthwave":
                                                            props.setLastWaveColor?.("#2d1b69");
                                                            break;
                                                        case "retro":
                                                            props.setLastWaveColor?.("#e4d8b4");
                                                            break;
                                                        case "cyberpunk":
                                                            props.setLastWaveColor?.("#ffee00");
                                                            break;
                                                        case "valentine":
                                                            props.setLastWaveColor?.("#f0d6e8");
                                                            break;
                                                        case "aqua":
                                                            props.setLastWaveColor?.("#345da7");
                                                            break;
                                                        default:
                                                            props.setLastWaveColor?.("#292524");
                                                    }
                                                    // @ts-ignore this libs typins suck but this is how it works
                                                    themeChange(name);
                                                }}
                                            >
                                                {`${name.charAt(0).toUpperCase()}${name.slice(1)}`}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {props.user ? (
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">{<img src={avatarUrl(props.user)} />}</div>
                        </label>
                        <ul
                            tabIndex={0}
                            className="top-10 menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
                        >
                            <li className="btn-disabled bg-transparent">
                                <div className="flex flex-row justify-start align-center flex-wrap">
                                    <div>
                                        <div className="">Logged in as</div>
                                        <div className="flex flex-row justify-start align-center flex-nowrap">
                                            <div>{props.user.username}</div>
                                            <span>#{props.user.discriminator}</span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <a className="justify-between">
                                    Profile
                                    <span className="badge bg-secondary text-neutral">New</span>
                                </a>
                            </li>
                            <li>
                                <a>Settings</a>
                            </li>
                            <li>
                                <Link to="/logout" className="text-error">
                                    Logout
                                </Link>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <Link className="btn" to={`/${params.locale}/dashboard`}>
                        Dashboard
                    </Link>
                )}
            </div>
        </div>
    );
}
