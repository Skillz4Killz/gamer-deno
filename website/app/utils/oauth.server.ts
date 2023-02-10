import DiscordOauth2 from "discord-oauth2";
import { configs } from "../../configs.server";

const SCOPE = "identify email guilds";

const oauth = new DiscordOauth2({
    version: "v10",
    clientId: configs.komi.id,
    clientSecret: configs.komi.secret,
    redirectUri: `${configs.baseUrl}/login`,
});

export const oauthUrl = oauth.generateAuthUrl({
    scope: SCOPE,
});

export function generateOauthUrl(state: string) {
    return oauth.generateAuthUrl({
        scope: SCOPE,
        state,
    });
}

export async function getTokens(code: string): Promise<Tokens> {
    return await oauth
        .tokenRequest({
            code,
            grantType: "authorization_code",
            scope: SCOPE,
        })
        .then((res) => ({ accessToken: res.access_token, refreshToken: res.refresh_token }));
}

export async function refreshTokens(refreshToken: string): Promise<Tokens> {
    return await oauth
        .tokenRequest({
            refreshToken,
            grantType: "refresh_token",
            scope: SCOPE,
        })
        .then((res) => ({ accessToken: res.access_token, refreshToken: res.refresh_token }));
}

export async function getUser(accessToken: string) {
    return await oauth.getUser(accessToken);
}

export async function getGuilds(accessToken: string) {
    return await oauth.getUserGuilds(accessToken);
}

interface Tokens {
    accessToken: string;
    refreshToken: string;
}
