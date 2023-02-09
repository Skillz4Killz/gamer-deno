import { Cookie, CookieOptions, createSessionStorage, redirect, Session } from "remix";
import { dragon } from "./dragon.server";
import { decodeToken, tokenize } from "./fernet.server";
import nanoid from "./id.server";

// TODO: encrypt session data

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
    throw new Error("SESSION_SECRET must be set");
}

function createDragonSessionStorage(settings: {
    cookie:
        | Cookie
        | (CookieOptions & {
              name?: string;
          });
}) {
    return createSessionStorage({
        cookie: settings.cookie,
        async createData(data, expires) {
            if (!expires) throw new Error("Session expire Date is missing.");

            const key = createSessionKey(expires);
            await dragon.session.set(key, data, expires);

            return key;
        },
        async readData(key) {
            return (await dragon.session.get(key)) ?? null;
        },
        async updateData(id, data, expires) {
            if (expires && expires.getTime() - 5000 < Date.now()) throw new Error("Session is about to expire");

            await dragon.session.update(id, data);
        },
        async deleteData(id) {
            await dragon.session.delete(id);
        },
    });
}

const storage = createDragonSessionStorage({
    cookie: {
        name: "id",
        // normally you want this to be `secure: true`
        // but that doesn't work on localhost for Safari
        // https://web.dev/when-to-use-local-https/
        secure: process.env.NODE_ENV === "production",
        secrets: [sessionSecret],
        sameSite: "lax",
        path: "/",
        // discord access token lifetime
        maxAge: 604800,
        httpOnly: true,
    },
});

export interface SessionData {
    accessToken: string;
    avatar: string | null;
    discriminator: string;
    userId: string;
    username: string;
}

export async function createSession(data: SessionData, redirectTo: string) {
    const session = await storage.getSession();
    session.set("data", data);

    return redirect(redirectTo, {
        headers: {
            "Set-Cookie": await storage.commitSession(session),
        },
    });
}

export async function destroySession(request: Request, redirectTo: string = "/login"): Promise<Response> {
    const session = await getSession(request);

    return redirect(redirectTo, {
        headers: {
            "Set-Cookie": await storage.destroySession(session),
        },
    });
}

export async function getSession(request: Request): Promise<Session> {
    return await storage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request): Promise<string | null> {
    const session = await getSession(request);
    const userId = session.get("userId");
    if (typeof userId !== "string") {
        return null;
    }

    return userId;
}

export async function requireUserId(
    request: Request,
    redirectTo: string = new URL(request.url).pathname,
): Promise<string> {
    const session = await getSession(request);
    const userId = session.get("userId");
    if (typeof userId !== "string") {
        const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);

        throw redirect(`/login?${searchParams}`);
    }

    return userId;
}

export async function getData(request: Request): Promise<SessionData | null> {
    const session = await getSession(request);
    const data = session.get("data");
    if (!isSessionData(data)) {
        return null;
    }

    return data;
}

export async function requireData(
    request: Request,
    redirectTo: string = new URL(request.url).pathname,
): Promise<SessionData> {
    const session = await getSession(request);
    const data = session.get("data");
    if (!isSessionData(data)) {
        const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);

        throw redirect(`/login?${searchParams}`);
    }

    return data;
}

function isSessionData(data: any): data is SessionData {
    return data && data.accessToken && data.discriminator && data.userId && data.username;
}

export function createSessionKey(expire: Date): string {
    const id = nanoid();
    return tokenize(`${expire.getTime()}-${id}`);
}

export function validateSessionKey(key: string) {
    const expire = decodeToken(key).split("-")[0];
    if (expire - 5000 < Date.now()) throw new Error("Session Key is expired.");
}
