import { Guild } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/next/src/structures/guild.ts";
import { UserPayload } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/next/src/types/guild.ts";
import type { EventHandlers, Member } from "../../deps.ts";

// This interface is a placeholder that allows you to easily add on custom events for your need.
// deno-lint-ignore no-empty-interface
export interface CustomEvents extends EventHandlers {
    memberAdd: (guild: Guild, user: UserPayload, member?: Member) => unknown;
    memberRemove: (guild: Guild, user: UserPayload, member?: Member) => unknown;
}
