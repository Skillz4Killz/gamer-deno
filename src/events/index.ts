import { EventHandlers } from "@discordeno/bot";
import { interactionCreate } from "./interactions.js";
import { messageCreate } from "./messages.js";
import { auditLogEntryCreate } from "./auditlogs/index.js";

export const eventHandlers: Partial<EventHandlers> = {
    messageCreate,
    interactionCreate,
    auditLogEntryCreate,
}
