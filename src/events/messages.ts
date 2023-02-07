import { Camelize, DiscordMessage } from "@discordeno/bot";
import { Message } from "guilded.js/types/index.js";
import { GamerMessage } from "../base/GamerMessage.js";
import { handlePossibleCommand } from "./helpers/commands.js";

export async function messageCreate(payload: Camelize<DiscordMessage> | Message) {
    const message = new GamerMessage(payload);

    // Run all the handling for a new message
    await Promise.all([
        handlePossibleCommand(message)
    ])
}
