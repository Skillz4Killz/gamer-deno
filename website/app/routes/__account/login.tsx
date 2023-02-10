import { LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import db from "~/utils/db.server";
import { generateOauthUrl, getTokens, getUser } from "~/utils/oauth.server";
import { createSession } from "~/utils/session.server";

export const meta: MetaFunction = () => {
    return {
        title: "Komi | Login",
        description: "Login to the website!",
    };
};

// TODO: validate state
// TODO: redirect to
export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const redirectTo = url.searchParams.get("redirectTo");

    // User got redirected back from a successful code grant
    if (code) {
        const res = await getTokens(code);
        const user = await getUser(res.accessToken);

        let avatarUrl = user.avatar
            ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${
                  user.avatar.startsWith("a_") ? "gif" : "png"
              }?size=1024`
            : `https://cdn.discordapp.com/embed/avatars/${Number(user.discriminator) % 5}.png?size=1024`;

        await db.discord_oauth.upsert({
            create: {
                user_id: BigInt(user.id),
                avatar: user.avatar,
                username: user.username,
                discriminator: user.discriminator,
            },
            where: { user_id: BigInt(user.id) },
            update: {
                avatar: user.avatar,
                username: user.username,
                discriminator: user.discriminator,
            },
        });

        // TODO: improve this
        const redirectTo = url.searchParams.get("state");

        return await createSession(
            {
                accessToken: res.accessToken,
                avatar: user.avatar ?? null,
                discriminator: user.discriminator,
                userId: user.id,
                username: user.username,
            },
            redirectTo ? Buffer.from(redirectTo, "base64").toString("utf-8") : "/",
        );
    }

    return redirect(generateOauthUrl(Buffer.from(redirectTo ?? "/").toString("base64")));
};
