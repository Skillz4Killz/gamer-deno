import { Camelize, DiscordAuditLogEntry } from "@discordeno/bot"

export async function handleMemberRoleUpdate(payload: Camelize<DiscordAuditLogEntry>) {
    console.log('users role changed', payload)
}