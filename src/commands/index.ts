import { ApplicationCommandOptionTypes, ApplicationCommandTypes, CreateApplicationCommand } from '@discordeno/bot';
import { translate } from '../base/languages/translate.js';
import { CommandArgument } from '../base/typings.js';
import { Gamer } from '../bot.js';
import avatar from './general/avatar.js';
import invite from './general/invite.js';
import ping from './general/ping.js';

export function loadCommands() {
    // General Commands
    Gamer.commands.set(avatar.name, avatar);
    Gamer.commands.set(invite.name, invite);
    Gamer.commands.set(ping.name, ping);
}

export function makeInteractionCommands(guildId: string = "") {
    // Load the commands if they havent been loaded
    loadCommands()

    const argTypes: Record<CommandArgument["type"], ApplicationCommandOptionTypes> = {
        string: ApplicationCommandOptionTypes.String,
        subcommand: ApplicationCommandOptionTypes.SubCommand,
        user: ApplicationCommandOptionTypes.User,
    }

    const commands: CreateApplicationCommand[] = []
    
    for (const command of Gamer.commands.values()) {
        const name = command.name.toUpperCase()
        commands.push({
            // @ts-expect-error dynamic translation
            name: translate(guildId, `${name}_NAME`),
            // @ts-expect-error dynamic translation
            description: translate(guildId, `${name}_DESCRIPTION`),
            // TODO: subcommands - implement a subcommand functionality
            options: command.arguments.map(argument => ({
                // @ts-expect-error dynamic translation
                name: translate(guildId, `${name}_${argument.name.toUpperCase()}_NAME`),
                // @ts-expect-error dynamic translation
                description: translate(guildId, `${name}_${argument.name.toUpperCase()}_DESCRIPTION`),
                type: argTypes[argument.type],
            })),
            type: ApplicationCommandTypes.ChatInput,
            nsfw: false,
        })
    }

    return commands
}