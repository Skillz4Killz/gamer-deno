import { ApplicationCommandOptionTypes, Interaction, InteractionTypes, MessageComponentTypes } from "@discordeno/bot";
import { GamerMessage } from "../base/GamerMessage.js";
import { Gamer } from "../bot.js";
import reactionRoles from "./buttons/reactionroles.js";
import replay from "./buttons/replay.js";

export async function interactionCreate(payload: Interaction) {
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
                args[option.name] = payload.data.resolved?.users?.get(Gamer.discord.transformers.snowflake(option.value as string));
                continue;
            }

            if (option.type === ApplicationCommandOptionTypes.Role) {
                args[option.name] = payload.data.resolved?.roles?.get(Gamer.discord.transformers.snowflake(option.value as string));
                continue;
            }

            if (option.type === ApplicationCommandOptionTypes.Channel) {
                args[option.name] = payload.data.resolved?.channels?.get(Gamer.discord.transformers.snowflake(option.value as string));
                continue;
            }

            if (option.type === ApplicationCommandOptionTypes.SubCommand && option.options) {
                args[option.name] = {};
                for (const opt of option.options) {
                    if (opt.type === ApplicationCommandOptionTypes.User) {
                        args[option.name][opt.name] = payload.data.resolved?.users?.get(Gamer.discord.transformers.snowflake(opt.value as string));
                        continue;
                    }
        
                    if (opt.type === ApplicationCommandOptionTypes.Role) {
                        args[option.name][opt.name] = payload.data.resolved?.roles?.get(Gamer.discord.transformers.snowflake(opt.value as string));
                        continue;
                    }
        
                    if (opt.type === ApplicationCommandOptionTypes.Channel) {
                        args[option.name][opt.name] = payload.data.resolved?.channels?.get(Gamer.discord.transformers.snowflake(opt.value as string));
                        continue;
                    }

                    args[option.name][opt.name] = opt.value;
                }

                continue;
            }

            if (option.type === ApplicationCommandOptionTypes.SubCommandGroup && option.options) {
                args[option.name] = {};
                for (const opt of option.options) {
                    args[option.name][opt.name] = {};
                    for (const o of opt.options ?? []) {
                        if (o.type === ApplicationCommandOptionTypes.User) {
                            args[option.name][opt.name][o.name] = payload.data.resolved?.users?.get(Gamer.discord.transformers.snowflake(o.value as string));
                            continue;
                        }

                        if (o.type === ApplicationCommandOptionTypes.Role) {
                            args[option.name][opt.name][o.name] = payload.data.resolved?.roles?.get(Gamer.discord.transformers.snowflake(o.value as string));
                            continue;
                        }

                        if (o.type === ApplicationCommandOptionTypes.Channel) {
                            args[option.name][opt.name][o.name] = payload.data.resolved?.channels?.get(Gamer.discord.transformers.snowflake(o.value as string));
                            continue;
                        }

                        args[option.name][opt.name][o.name] = o.value;
                    }
                }

                continue;
            }

            args[option.name] = option.value;
        }
        return await command.execute(message, args);
    }

    if (payload.type === InteractionTypes.MessageComponent) {
        if (payload.data.componentType === MessageComponentTypes.Button) {
            Gamer.loggers.discord.info(
                `[Button] The ${payload.data.customId} button was clicked in Guild: ${payload.guildId} by ${payload.user.id}.`,
            );

            await Promise.allSettled([
                replay(payload),
                reactionRoles(payload),
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
