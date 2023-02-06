import { EventHandlers } from "@discordeno/bot";
import { messageCreate } from "./messages";

export const eventHandlers: Partial<EventHandlers> = {
    messageCreate,
}