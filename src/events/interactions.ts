import { ApplicationCommandOptionTypes, Camelize, DiscordInteraction, InteractionTypes, MessageComponentTypes } from "@discordeno/bot";
import { GamerMessage } from "../base/GamerMessage.js";
import { Gamer } from "../bot.js";

export async function interactionCreate(payload: Camelize<DiscordInteraction>) {
    if (!payload.data) return Gamer.loggers.discord.debug("Interaction arrived without a data payload", payload);

    payload.user = payload.user ?? payload.member!.user;

    if (payload.type === InteractionTypes.ApplicationCommand) {
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
        return await command.execute(message, args);
    }

    if (payload.type === InteractionTypes.MessageComponent) {
        if (payload.data.componentType === MessageComponentTypes.Button) {
            Gamer.loggers.discord.info(
                `[Button] The ${payload.data.customId} button was clicked in Guild: ${payload.data.guildId} by ${payload.user.id}.`,
            );

            await Promise.allSettled([
                // Button handlers can go here
            ]).catch(console.log);
        }

        return;
    }

    if (payload.type === InteractionTypes.ModalSubmit) {
        Gamer.loggers.discord.info(
            `[Modal] The ${payload.data?.customId || "UNKNOWN"} modal was submitted in Guild: ${payload.guildId} by ${payload.user.id}.`,
        );
        
        return await Promise.allSettled([
            // Modal handlers can go here
        ]).catch(console.log);
    }
}