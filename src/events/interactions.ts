import { ApplicationCommandOptionTypes, Camelize, DiscordInteraction } from "@discordeno/bot";
import { GamerMessage } from "../base/GamerMessage.js";
import { Gamer } from "../bot.js";

export async function interactionCreate(payload: Camelize<DiscordInteraction>) {
    if (!payload.data) return Gamer.loggers.discord.debug("Interaction arrived without a data payload", payload);

    Gamer.loggers.discord.info(`[Command] Interaction ${payload.data?.name} seen.`);
    const message = new GamerMessage(payload);

    const command = Gamer.commands.get(payload.data.name) ?? Gamer.commands.find((cmd) => cmd.aliases.includes(payload.data!.name));
    if (!command) return Gamer.loggers.discord.warn(`[Command] Interaction without a valid command.`, payload);

    // TODO: args - convert interaction options to args
    // console.log(JSON.stringify(payload, undefined, 2));

    const args: Record<string, any> = {};
    for (const option of payload.data.options ?? []) {
        if (option.type === ApplicationCommandOptionTypes.User) {
            args[option.name] = payload.data.resolved?.users?.[option.value as string];
            continue;
        }

        args[option.name] = option.value;
    }
    command.execute(message, args);
}
