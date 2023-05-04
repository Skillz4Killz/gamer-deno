import { Gamer } from "../bot.js";
import { messageCreate } from "./messages/index.js";

export function setEventsOnGuilded() {
    Gamer.guilded.on("messageCreated", messageCreate);
}
