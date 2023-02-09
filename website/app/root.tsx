import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useCatch, useLoaderData } from "@remix-run/react";
import { useChangeLanguage } from "remix-i18next";
import { ExternalScripts } from "remix-utils";
import { themeChange } from "theme-change";

import styles from "./app.css";
import { getLocale } from "./i18next.server";

export function links() {
    return [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "apple-touch-icon", href: "/favicon.ico" },
        { rel: "apple-touch-startup-icon", href: "/favicon.ico" },

        { rel: "stylesheet", href: styles },
    ];
}

export const meta: MetaFunction = () => {
    return {
        charset: "utf-8",
        viewport: "width=device-width, initial-scale=1.0",
    };
};

type LoaderData = { locale: string };

export const loader: LoaderFunction = async function ({ request }) {
    const locale = await getLocale(request);

    return json<LoaderData>({ locale });
};

function Document({ children, locale, title = "Gamer" }: { children: React.ReactNode; title?: string; locale?: any }) {
    useChangeLanguage(locale);
    const theme = typeof window === "undefined" ? undefined : window.localStorage.getItem("theme");
    // @ts-ignore shut up
    if (theme) themeChange(theme);

    return (
        <html lang={locale ?? "en"}>
            <head>
                <Meta />
                <title>{title}</title>
                <Links />
            </head>
            <body>
                {children}
                <ScrollRestoration />
                <ExternalScripts />
                <Scripts />
                <script src="/scripts/global.js" />
                {process.env.NODE_ENV === "development" && <LiveReload port={9082} />}
            </body>
        </html>
    );
}

export default function App() {
    const { locale } = useLoaderData<LoaderData>();
    return (
        <Document locale={locale}>
            <Outlet />
        </Document>
    );
}

function statusDescription(status: number) {
    switch (status) {
        case 404:
            return "Sorry, we couldn't find the page you're looking for.";
        default:
            return "An Internal Server Error Occurred";
    }
}

// TODO: Use Gamer color for gradient
export function CatchBoundary() {
    const caught = useCatch();

    return (
        <Document title={`${caught.status} ${caught.statusText}`}>
            <div
                className="
    flex
    items-center
    justify-center
    w-screen
    h-screen
    bg-gradient-to-r
    from-indigo-600
    to-blue-400
  "
            >
                <div className="md:px-40 md:py-20 md:bg-white md:rounded-md md:shadow-xl">
                    <div className="flex flex-col items-center">
                        <h1 className="font-bold text-white md:text-blue-600 text-9xl">{caught.status}</h1>

                        <h6 className="mb-2 text-2xl font-bold text-center text-gray-800 md:text-3xl">
                            <span className="text-red-500">Oops!</span> {caught.statusText}
                        </h6>

                        <p className="px-3 md:px-0 mb-8 text-center text-black md:text-gray-500 md:text-lg">
                            {statusDescription(caught.status)}
                        </p>

                        <a href="/" className="btn btn-outline btn-ghost">
                            go home
                        </a>
                    </div>
                </div>
            </div>
        </Document>
    );
}

export function ErrorBoundary({ error }: { error: Error }) {
    console.error("what the", error);
    console.error("what the1", error.message);

    return (
        <Document title="Uh-oh!">
            <div className="alert-danger">
                <h1>App Error</h1>
                <pre>{error.message}</pre>
            </div>
        </Document>
    );
}
