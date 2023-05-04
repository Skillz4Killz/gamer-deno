import { EventHandlers } from "@discordeno/bot";
import { interactionCreate } from "./interactions.js";
import { guildAuditLogEntryCreate } from "./auditlogs/index.js";
import { messageCreate } from "./messages/index.js";

export const eventHandlers: Partial<EventHandlers> = {
    messageCreate,
    interactionCreate,
    guildAuditLogEntryCreate,
}
