import { ApplicationCommandOptionTypes, ApplicationCommandTypes, CreateApplicationCommand } from "@discordeno/bot";
import { translate } from "../base/languages/translate.js";
import { CommandArgument } from "../base/typings.js";
import { Gamer } from "../bot.js";
import { baka } from "./fun/baka.js";
import bite from "./fun/bite.js";
import { compliment } from "./fun/compliment.js";
import cry from "./fun/cry.js";
import cuddle from "./fun/cuddle.js";
import dance from "./fun/dance.js";
import gif from "./fun/gif.js";
import hug from "./fun/hug.js";
import kanna from "./fun/kanna.js";
import kiss from "./fun/kiss.js";
import kitten from "./fun/kitten.js";
import lmao from "./fun/lmao.js";
import { mavis } from "./fun/mavis.js";
import nezuko from "./fun/nezuko.js";
import pat from "./fun/pat.js";
import poke from "./fun/poke.js";
import pony from "./fun/pony.js";
import puppy from "./fun/puppy.js";
import raphtalia from "./fun/raphtalia.js";
import slap from "./fun/slap.js";
import supernatural from "./fun/supernatural.js";
import tickle from "./fun/tickle.js";
import zerotwo from "./fun/zerotwo.js";
import avatar from "./general/avatar.js";
import info from "./general/info.js";
import invite from "./general/invite.js";
import ping from "./general/ping.js";
import random from "./general/random.js";

export function loadCommands(preventDuplicates = true) {
    const commands = [
        // General Commands
        avatar,
        info,
        invite,
        ping,
        random,
        // Fun Commands
        gif,
        baka,
        bite,
        compliment,
        cry,
        cuddle,
        dance,
        hug,
        kanna,
        kiss,
        kitten,
        lmao,
        mavis,
        nezuko,
        pat,
        poke,
        pony,
        puppy,
        raphtalia,
        slap,
        supernatural,
        tickle,
        zerotwo,
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
                choices: argument.literals?.map((literal) => ({
                    // @ts-expect-error dynamic translation
                    name: translate(guildId, `${name}_${literal.toUpperCase()}_NAME`),
                    value: literal,
                    type:
                        typeof literal === "string"
                            ? ApplicationCommandOptionTypes.String
                            : // TODO: Handle other option types
                              ApplicationCommandOptionTypes.String,
                    // @ts-expect-error dynamic translation
                    description: translate(guildId, `${name}_${literal.toUpperCase()}_DESCRIPTION`),
                })),
                required: argument.required,
            })),
            type: ApplicationCommandTypes.ChatInput,
            nsfw: false,
        });
    }

    return commands;
}
