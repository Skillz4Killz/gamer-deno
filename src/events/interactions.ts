import { Camelize, DiscordInteraction } from "@discordeno/bot";
import { GamerMessage } from "../base/GamerMessage.js";
import { Gamer } from "../bot.js";

export async function interactionCreate(payload: Camelize<DiscordInteraction>) {
    if (!payload.data) return Gamer.loggers.discord.debug("Interaction arrived without a data payload", payload);

    Gamer.loggers.discord.info(`[Command] Interaction ${payload.data?.name} seen.`);
    const message = new GamerMessage(payload);
    console.log(message)
    
    // const commandName = Gamer.commands.has(payload.data.name) ? payload.data.name : "unknown"
}