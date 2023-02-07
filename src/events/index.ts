import { EventHandlers } from "@discordeno/bot";
import { interactionCreate } from "./interactions.js";
import { messageCreate } from "./messages.js";

export const eventHandlers: Partial<EventHandlers> = {
    messageCreate,
    interactionCreate,
}
