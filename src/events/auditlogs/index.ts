import { AuditLogEvents, EventHandlers } from "@discordeno/bot";
import { Gamer } from "../../bot.js";
import { handleMemberRoleUpdate } from "./roles.js";

export const guildAuditLogEntryCreate: EventHandlers["guildAuditLogEntryCreate"] = async function (payload, guildId) {
    switch (payload.actionType) {
        case AuditLogEvents.MemberRoleUpdate:
            return await handleMemberRoleUpdate(payload, guildId);
        default:
            return Gamer.loggers.discord.warn(`[AuditLog] Missing handling of auditlog event.`);
    }
};
