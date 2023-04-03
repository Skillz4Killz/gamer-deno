import { EventHandlers } from "@discordeno/bot";
import { auditLogEntryCreate } from "./auditlogs/index.js";
import { interactionCreate } from "./interactions.js";
import { messageCreate } from "./messages/index.js";

export const eventHandlers: Partial<EventHandlers> = {
    messageCreate,
    interactionCreate,
    auditLogEntryCreate,
};
