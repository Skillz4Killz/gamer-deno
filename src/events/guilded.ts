import { Gamer } from "../bot.js";
import { messageCreate } from "./messages.js";

export function setEventsOnGuilded() {
    Gamer.guilded.on('messageCreated', messageCreate);
}