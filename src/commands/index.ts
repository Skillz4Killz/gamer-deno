import { ApplicationCommandOptionTypes, ApplicationCommandTypes, CreateApplicationCommand } from "@discordeno/bot";
import { translate } from "../base/languages/translate.js";
import { CommandArgument } from "../base/typings.js";
import { Gamer } from "../bot.js";
import avatar from "./general/avatar.js";
import info from "./general/info.js";
import invite from "./general/invite.js";
import ping from "./general/ping.js";
// import random from "./general/random.js";
import gif from "./general/gif.js";

export function loadCommands(preventDuplicates = true) {
    const commands = [
        // General Commands
        avatar,
        info,
        invite,
        ping,
        // random,
        gif,
    ];

    for (const command of commands) {
        if (preventDuplicates && Gamer.commands.has(command.name)) throw new Error(`[Command Loader] The ${command.name} already exists.`);

        Gamer.commands.set(command.name, command);
    }
}

export function makeInteractionCommands(guildId: string = "") {
    // Load the commands if they havent been loaded
    loadCommands(false);

    const argTypes: Record<CommandArgument["type"], ApplicationCommandOptionTypes> = {
        string: ApplicationCommandOptionTypes.String,
        subcommand: ApplicationCommandOptionTypes.SubCommand,
        user: ApplicationCommandOptionTypes.User,
    };

    const commands: CreateApplicationCommand[] = [];

    for (const command of Gamer.commands.values()) {
        // Prefix only commands should not be created in slash form.
        if (command.prefixOnly) continue;

        const name = command.name.toUpperCase();
        commands.push({
            // @ts-expect-error dynamic translation
            name: translate(guildId, `${name}_NAME`),
            // @ts-expect-error dynamic translation
            description: translate(guildId, `${name}_DESCRIPTION`),
            // TODO: subcommands - implement a subcommand functionality
            options: command.arguments.map((argument) => ({
                // @ts-expect-error dynamic translation
                name: translate(guildId, `${name}_${argument.name.toUpperCase()}_NAME`),
                // @ts-expect-error dynamic translation
                description: translate(guildId, `${name}_${argument.name.toUpperCase()}_DESCRIPTION`),
                type: argTypes[argument.type],
            })),
            type: ApplicationCommandTypes.ChatInput,
            nsfw: false,
        });
    }

    return commands;
}
