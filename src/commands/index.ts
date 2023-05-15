import { ApplicationCommandOptionTypes, ApplicationCommandTypes, CreateApplicationCommand } from "@discordeno/bot";
import { translate } from "../base/languages/translate.js";
import { CommandArgument } from "../base/typings.js";
import { Gamer } from "../bot.js";
import ball from "./fun/8ball.js";
import advice from "./fun/advice.js";
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
import number from "./fun/number.js";
import pat from "./fun/pat.js";
import poke from "./fun/poke.js";
import pony from "./fun/pony.js";
import puppy from "./fun/puppy.js";
import random from "./fun/random.js";
import raphtalia from "./fun/raphtalia.js";
import slap from "./fun/slap.js";
import supernatural from "./fun/supernatural.js";
import tickle from "./fun/tickle.js";
import zerotwo from "./fun/zerotwo.js";
import avatar from "./general/avatar.js";
import info from "./general/info.js";
import invite from "./general/invite.js";
import ping from "./general/ping.js";
import embed from "./settings/embed.js";
import roles from "./settings/roles.js";

export function loadCommands(preventDuplicates = true) {
    const commands = [
        // General Commands
        avatar,
        info,
        invite,
        ping,
        // Fun Commands
        random,
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
        number,
        ball,
        advice,
        // Settings Commands
        embed,
        roles,
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
        number: ApplicationCommandOptionTypes.Number,
        "...string": ApplicationCommandOptionTypes.String,
        boolean: ApplicationCommandOptionTypes.Boolean,
        channel: ApplicationCommandOptionTypes.Channel,
        role: ApplicationCommandOptionTypes.Role,
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
            options: command.arguments.map((argument) => {
                const isSubcommandGroup = argument.type === "subcommand" && argument.arguments?.find((arg) => arg.type === "subcommand");

                return {
                    // @ts-expect-error dynamic translation
                    name: translate(guildId, `${name}_${argument.name.toUpperCase()}_NAME`),
                    // @ts-expect-error dynamic translation
                    description: translate(guildId, `${name}_${argument.name.toUpperCase()}_DESCRIPTION`),
                    type: isSubcommandGroup ? ApplicationCommandOptionTypes.SubCommandGroup : argTypes[argument.type],
                    choices: argument.literals?.map((literal) => {
                        const literalIsString = typeof literal === "string";
                        const literalName = literalIsString ? literal : literal.value;
                        const value = literalIsString ? literal : literal.value;

                        return {
                            // @ts-expect-error dynamic translation
                            name: translate(guildId, `${name}_${literalName.toUpperCase()}_NAME`),
                            value,
                            // type:
                            //     literalIsString
                            //         ? ApplicationCommandOptionTypes.String
                            //         : // TODO: Handle other option types
                            //           ApplicationCommandOptionTypes.String,
                            // // @ts-expect-error dynamic translation
                            // description: translate(guildId, `${name}_${literalName.toUpperCase()}_DESCRIPTION`),
                        };
                    }),
                    options: argument.arguments?.map((arg) => {
                        // console.log(name, argument.name, arg.name, `${name}_${argument.name.toUpperCase()}_${arg.name.toUpperCase()}_NAME`);
                        return {
                            // @ts-expect-error dynamic translation
                            name: translate(guildId, `${name}_${argument.name.toUpperCase()}_${arg.name.toUpperCase()}_NAME`),
                            // @ts-expect-error dynamic translation
                            description: translate(guildId, `${name}_${argument.name.toUpperCase()}_${arg.name.toUpperCase()}_DESCRIPTION`),
                            type: argTypes[arg.type],
                            required: arg.required,
                            choices: arg.literals?.map((literal) => {
                                const literalIsString = typeof literal === "string";
                                const literalName = literalIsString ? literal : literal.value;
                                const value = literalIsString ? literal : literal.value;

                                return {
                                    name: translate(
                                        guildId,
                                        // @ts-expect-error dynamic translation
                                        `${name}_${argument.name.toUpperCase()}_${arg.name.toUpperCase()}_${literalName.toUpperCase()}_NAME`,
                                    ),
                                    value,
                                };
                            }),
                            options: arg.arguments?.map((a) => {
                                // console.log(2, name, argument.name, arg.name, a.name, `${name}_${argument.name.toUpperCase()}_${arg.name.toUpperCase()}_${a.name.toUpperCase()}_NAME`);
                                return {
                                name: translate(
                                    guildId,
                                    // @ts-expect-error dynamic translation
                                    `${name}_${argument.name.toUpperCase()}_${arg.name.toUpperCase()}_${a.name.toUpperCase()}_NAME`,
                                ),
                                description: translate(
                                    guildId,
                                    // @ts-expect-error dynamic translation
                                    `${name}_${argument.name.toUpperCase()}_${arg.name.toUpperCase()}_${a.name.toUpperCase()}_DESCRIPTION`,
                                ),
                                type: argTypes[a.type],
                                required: a.required,
                                choices: a.literals?.map((literal) => {
                                    const literalIsString = typeof literal === "string";
                                    const literalName = literalIsString ? literal : literal.name;
                                    const value = literalIsString ? literal : literal.value;

                                    return {
                                        name: translate(
                                            guildId,
                                            // @ts-expect-error dynamic translation
                                            `${name}_${argument.name.toUpperCase()}_${arg.name.toUpperCase()}_${a.name.toUpperCase()}_${literalName.toUpperCase()}_NAME`,
                                        ),
                                        value,
                                    };
                                }),
                            }}),
                        };
                    }),
                    required: argument.type === "subcommand" ? undefined : argument.required,
                };
            }),
            type: ApplicationCommandTypes.ChatInput,
            nsfw: false,
        });
    }

    // console.log('command check', JSON.stringify(commands.find(command => command.name === "roles")))
    // console.log('command check', commands.find(command => command.name === "roles")?.options?.[0]?.options)
    // console.log(
    //     "command check",
    //     JSON.stringify(
    //         // @ts-expect-error testing
    //         commands.find((command) => command.name === "roles")?.options[0],
    //         undefined,
    //         2,
    //     ),
    // );

    // return [];
    return commands;
}
