import { Camelize, DiscordInteraction } from "@discordeno/bot";
import { GamerMessage } from "../base/GamerMessage.js";
import { Gamer } from "../bot.js";

export async function interactionCreate(payload: Camelize<DiscordInteraction>) {
    if (!payload.data) return Gamer.loggers.discord.debug("Interaction arrived without a data payload", payload);

    Gamer.loggers.discord.info(`[Command] Interaction ${payload.data?.name} seen.`);
    const message = new GamerMessage(payload);
    
    const command = Gamer.commands.get(payload.data.name) ?? Gamer.commands.find(cmd => cmd.aliases.includes(payload.data!.name));
    if (!command) return Gamer.loggers.discord.warn(`[Command] Interaction without a valid command.`, payload);

    // TODO: args - convert interaction options to args
    command.execute(message, {})
}