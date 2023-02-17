import { GamerMessage } from "../../base/GamerMessage.js";
import { Command } from "../../base/typings.js";
import { Gamer } from "../../bot.js";
import { configs } from "../../configs.js";
import { deleteMessages, needResponse } from "../../utils/platforms/messages.js";

async function invalidCommand(message: GamerMessage, commandName: string, parameters: string[], prefix: string) {
    if (!message.guildId) return;
    if (!Gamer.vip.guilds.has(message.guildId)) return;

    console.log("invalid command", commandName, parameters, prefix);

    // TODO: shortcut - implement shortcut feature
    // const shortcut = await db.shortcuts.get(`${message.guildId}-${commandName}`);
    // if (!shortcut) return;

    // // Valid shortcut was found now we need to process it
    // for (const action of shortcut.actions) {
    //     const command = Gamer.commands.get(action.commandName);
    //     if (!command) continue;

    //     let content = `${prefix}${action.commandName} ${action.args}`;

    //     // Replace all variables args in the shortcut
    //     for (const [index, arg] of parameters.entries()) {
    //         content = content.replace(`{{${index + 1}}}`, arg);
    //     }

    //     message.content = content;

    //     // Execute the command
    //     await Gamer.eventHandlers.messageCreate?.(message);

    //     // Make the bot wait 2 seconds before running next command so it doesnt get inhibited by the slowmode
    //     await delay(2000);
    // }

    // if (shortcut.deleteTrigger) await deleteMessage(message).catch(console.log);
}

export const parsePrefix = (guildId: string | undefined) => {
    const prefix = guildId ? Gamer.vip.prefixes.get(guildId) : configs.prefix;
    return prefix || configs.prefix;
};

export const parseCommand = (commandName: string) => {
    const command = Gamer.commands.get(commandName);
    if (command) return command;

    // Check aliases if the command wasn't found
    return Gamer.commands.find((cmd) => Boolean(cmd.aliases.includes(commandName)));
};

export const logCommand = (
    message: GamerMessage,
    type: "Failure" | "Success" | "Trigger" | "Slowmode" | "Missing" | "Inhibit",
    commandName: string,
) => {
    if (type === "Trigger") {
        Gamer.stats.commands.executed += 1;
    }

    Gamer.loggers[message.isOnDiscord ? "discord" : "guilded"].info(
        `[Command] (${type}) ${commandName} by ${message.author.id} in ${message.guildId ?? "DM"}`,
    );
};

/** Parses all the arguments for the command based on the message sent by the user. */
async function parseArguments(message: GamerMessage, command: Command, parameters: string[]) {
    const args: { [key: string]: unknown } = {};
    if (!command.arguments) return args;

    let missingRequiredArg = false;

    // Clone the parameters so we can modify it without editing original array
    const params = [...parameters];

    // Loop over each argument and validate
    for (const argument of command.arguments) {
        const resolver = Gamer.arguments.get(argument.type || "string");
        if (!resolver) continue;

        const result = await resolver.execute(argument, params, message, command);

        if (result !== undefined) {
            // Assign the valid argument
            // This will use up all args so immediately exist the loop.
            if (argument.type && ["subcommand", "...string", "...roles", "...emojis", "...snowflakes"].includes(argument.type)) {
                if (
                    result &&
                    typeof result === "object" &&
                    "arguments" in result &&
                    Array.isArray(result.arguments) &&
                    "name" in result &&
                    typeof result.name === "string"
                ) {
                    args[result.name] = {};

                    params.shift();

                    for (const arg of result.arguments) {
                        const resolver = Gamer.arguments.get(arg.type || "string");
                        if (!resolver) continue;

                        const res = await resolver.execute(arg, params, message, command);

                        if (res !== undefined) {
                            // TODO fix ts screaming
                            // @ts-ignore
                            args[result.name][arg.name] = res;
                        }
                    }
                }
                break;
            }
            args[argument.name] = result;
            // Remove a param for the next argument
            params.shift();
            continue;
        }

        // Invalid arg provided.
        if (Object.prototype.hasOwnProperty.call(argument, "defaultValue")) {
            args[argument.name] = argument.defaultValue;
        } else if (argument.required !== false) {
            // A REQUIRED ARG WAS MISSING TRY TO COLLECT IT
            const question = await message
                .reply(
                    message.translate(
                        "MISSING_REQUIRED_ARG",
                        argument.name,
                        argument.type === "subcommand" ? command.subcommands?.map((sub) => sub.name).join(", ") || "subcommands" : argument.type,
                    ),
                )
                .catch(console.log);
            if (question) {
                const response = await needResponse(message).catch(console.log);
                if (response) {
                    const responseArg = await resolver.execute(argument, [response.content], message, command);
                    if (responseArg) {
                        args[argument.name] = responseArg;
                        params.shift();
                        // TODO: gamer - this should be message.deleteBulk()
                        await deleteMessages(message.channelId, [question.id, response.id], message.translate("CLEAR_SPAM"), {
                            platform: message.platform,
                        }).catch(console.log);
                        continue;
                    }
                }
            }

            // console.log("Required Arg Missing: ", message.content, command, argument);
            missingRequiredArg = true;
            argument.missing(message);
            break;
        }
    }

    // If an arg was missing then return false so we can error out as an object {} will always be truthy

    console.log(args);

    return missingRequiredArg ? false : args;
}

/** Runs the inhibitors to see if a command is allowed to run. */
async function commandAllowed(message: GamerMessage, command: Command) {
    const inhibitorResults = await Promise.all([
        // TODO: inhibitors - call inhibitors functions here
        false,
    ]);

    if (inhibitorResults.includes(true)) {
        logCommand(message, "Inhibit", command.name);
        return false;
    }

    return true;
}

async function executeCommand(message: GamerMessage, command: Command, parameters: string[]) {
    try {
        Gamer.vip.slowmode.set(message.author.id, message.timestamp);

        // Parsed args and validated
        const args = await parseArguments(message, command, parameters);
        // Some arg that was required was missing and handled already
        if (!args) {
            return logCommand(message, "Missing", command.name);
        }

        // If no subcommand execute the command
        const [argument] = command.arguments || [];
        const subcommand = argument ? (args[argument.name] as Command) : undefined;

        if (!argument || argument.type !== "subcommand" || !subcommand) {
            // Check subcommand permissions and options
            if (!(await commandAllowed(message, command))) return;

            // @ts-ignore
            await command.execute?.(message, args);
            // TODO: xp - implement xp system with missions
            // await Gamer.helpers.completeMission(message.guildId, message.authorId, command.name);
            return logCommand(message, "Success", command.name);
        }

        // A subcommand was asked for in this command
        if (![subcommand.name, ...(subcommand.aliases || [])].includes(parameters[0]!)) {
            executeCommand(message, subcommand, parameters);
        } else {
            const subParameters = parameters.slice(1);
            executeCommand(message, subcommand, subParameters);
        }
    } catch (error) {
        console.log(error);
        logCommand(message, "Failure", command.name);
        // TODO: reactors - implement a easy react system
        // await Gamer.helpers.reactError(message).catch(console.log);
        // TODO: errors - implement a webhook system to send errors too so we can debug them
    }
}

export async function handlePossibleCommand(message: GamerMessage) {
    // If the message was sent by a bot we can just ignore it
    if (message.isFromABot) return;

    const basePrefix = parsePrefix(message.guildId);
    let prefix = [...basePrefix].join("");

    const mentions = [`<@!${Gamer.discord.rest.applicationId}>`, `<@${Gamer.discord.rest.applicationId}>`, `@${configs.bot.name}`, configs.bot.name];
    // TODO: guilded - Determine how a bot mention appears on guilded
    const botMention = mentions.find((mention) => mention === message.content) ?? `${configs.bot.name}`;

    // If the message is not using the valid prefix or bot mention cancel the command
    if (message.content === botMention) {
        return await message.send(message.translate("SERVER_PREFIX", parsePrefix(message.guildId)));
    }

    for (const mention of mentions) {
        if (message.content.toLowerCase().startsWith(mention.toLowerCase())) prefix = mention;
        if (message.content.toLowerCase().startsWith(mention.toLowerCase() + " ")) prefix = `${mention} `;
    }

    if (!message.content.startsWith(prefix) && prefix === basePrefix) return;

    // Get the first word of the message without the prefix so it is just command name. `.ping testing` becomes `ping`
    const [commandName, ...parameters] = message.content.substring(prefix.length).split(" ");
    if (!commandName) {
        return Gamer.loggers[message.isOnDiscord ? "discord" : "guilded"].debug(`[Command] Executed with a prefix but no command name.`);
    }

    // Check if this is a valid command
    const command = parseCommand(commandName);
    if (!command) {
        return invalidCommand(message, commandName, parameters, prefix);
    }

    logCommand(message, "Trigger", commandName);

    // TODO: vip - slowmode check requires cache so make it a behind a vip check
    if (message.guildId && Gamer.vip.guilds.has(message.guildId)) {
        const lastUsed = Gamer.vip.slowmode.get(message.author.id);
        // Check if this user is spamming by checking slowmode
        if (lastUsed && message.timestamp - lastUsed < 2000) {
            if (message.guildId) await message.delete(message.translate("CLEAR_SPAM"));

            return logCommand(message, "Slowmode", commandName);
        }
    }

    executeCommand(message, command, parameters);
}
