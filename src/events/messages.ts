import { Camelize, DiscordMessage } from "@discordeno/bot";
import { Message } from "guilded.js";
import { GamerMessage } from "../base/GamerMessage";
import { Gamer } from "../bot";
import { handlePossibleCommand } from "./helpers/commands";

export async function messageCreate(payload: Camelize<DiscordMessage> | Message) {
    const message = new GamerMessage(payload);
    if (message.isOnDiscord) {
        Gamer.loggers.discord.info(`[Event] MessageCreate: ${message.content}`);
    } else {
        Gamer.loggers.guilded.info(`[Event] MessageCreate: ${message.content}`)
    }

    // Run all the handling for a new message
    await Promise.all([
        handlePossibleCommand(message)
    ])
}
