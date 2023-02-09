import { PartialGuild } from "discord-oauth2";
import { SessionData } from "./session.server";

export function avatarUrl(ses: SessionData, size = 1024, format?: string): string {
    return ses.avatar
        ? `https://cdn.discordapp.com/avatars/${ses.userId}/${ses.avatar}.${
              format ?? ses.avatar.startsWith("a_") ? "gif" : "webp"
          }?size=${size}`
        : `https://cdn.discordapp.com/embed/avatars/${Number(ses.discriminator) % 5}.png?size=${size}`;
}

export function guildIconUrl(guild: PartialGuild, size = 1024, format?: string): string | null {
    return guild.icon
        ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${
              format ?? guild.icon?.startsWith("a_") ? "gif" : "webp"
          }?size=${size}`
        : null;
}
