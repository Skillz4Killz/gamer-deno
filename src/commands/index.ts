import { ApplicationCommandOptionTypes, ApplicationCommandTypes, CreateApplicationCommand } from '@discordeno/bot';
import { CommandArgument } from '../base/typings.js';
import { Gamer } from '../bot.js';
import ping from './general/ping.js';

export function loadCommands() {
    Gamer.commands.set(ping.name, ping);
}

export function makeInteractionCommands() {
    // Load the commands if they havent been loaded
    loadCommands()

    const argTypes: Record<CommandArgument["type"], ApplicationCommandOptionTypes> = {
        string: ApplicationCommandOptionTypes.String,
        subcommand: ApplicationCommandOptionTypes.SubCommand,
    }

    const commands: CreateApplicationCommand[] = []
    
    for (const command of Gamer.commands.values()) {
        const name = command.name.toUpperCase()
        commands.push({
            name: `${name}_NAME`,
            description: `${name}_DESCRIPTION`,
            // TODO: subcommands - implement a subcommand functionality
            options: command.arguments.map(argument => ({
                name: `${name}_${argument.name.toUpperCase()}_NAME`,
                description: `${name}_${argument.name.toUpperCase()}_DESCRIPTION`,
                type: argTypes[argument.type],
            })),
            type: ApplicationCommandTypes.ChatInput,
            nsfw: false,
        })
    }
    return commands
}