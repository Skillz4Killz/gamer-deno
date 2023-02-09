import { pick } from "accept-language-parser";
import Backend from "i18next-fs-backend";
import { resolve } from "node:path";
import { createCookie } from "remix";
import { RemixI18Next } from "remix-i18next";
import i18n from "~/i18n"; // your i18n configuration file

export const i18next = new RemixI18Next({
    detection: {
        supportedLanguages: i18n.supportedLngs,
        fallbackLanguage: i18n.fallbackLng,
    },
    // This is the configuration for i18next used
    // when translating messages server-side only
    i18next: {
        ...i18n,
        backend: {
            loadPath: resolve("./public/locales/{{lng}}/{{ns}}.json"),
        },
    },
    // The backend you want to use to load the translations
    // Tip: You could pass `resources` to the `i18next` configuration and avoid
    // a backend here
    backend: Backend,
});

// TODO: find a better solution for that

export async function getLocale(request: Request): Promise<string> {
    const url = new URL(request.url);
    const localeFragment = url.pathname.split("/")[1];

    if (["en", "de"].includes(localeFragment)) {
        return localeFragment;
    }

    const cookie = createCookie("locale", {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
    });

    const cookieLocale = await cookie.parse(request.headers.get("Cookie"));
    const locale = cookieLocale ?? pick(["en", "de"], request.headers.get("accept-language") ?? "");

    throw new Response(`/${locale}${url.pathname}`, {
        status: 302,
        headers: {
            Location: `/${locale}${url.pathname}`,
            "Set-Cookie": await cookie.serialize(locale),
        },
    });
}
