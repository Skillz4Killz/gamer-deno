import Embeds from "../../base/Embeds.js";
import { GamerMessage } from "../../base/GamerMessage.js";
import { Command, CommandArgument, Platforms } from "../../base/typings.js";
import { Gamer } from "../../bot.js";
import { configs } from "../../configs.js";
import { alertDevs } from "../../utils/devs.js";
import { deleteMessages } from "../../utils/platforms/messages.js";

export async function invalidCommand(message: GamerMessage, commandName: string, parameters: string[], prefix: string) {
    if (!message.guildId) return;
    if (!Gamer.vip.guilds.has(message.guildId)) return;

    console.log("invalid command", commandName, parameters, prefix);

    let shouldAlertForAlias = true;

    for (const txt of [".."]) {
        // Skip these as they are nthing related to a command
        if (!message.content.startsWith(txt)) continue;

        shouldAlertForAlias = false;
    }

    // User mistyped a command, possible alias worth adding for the command
    if (shouldAlertForAlias) {
        alertDevs(
            new Embeds()
                .setTitle("Possible Useful Alias")
                .setDescription(message.content.substring(0, 50))
                .addField("Platform", Platforms[message.platform] ?? "Unknown"),
        );
    }

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

async function resolveArguments(cmdargs: CommandArgument[], params: string[], message: GamerMessage, command: Command) {
    const args: Record<string, any> | false = {};

    let missingRequiredArg = false;

    // Loop over each argument and validate
    for (const argument of cmdargs) {
        const resolver = Gamer.arguments.get(argument.type || "string");
        if (!resolver) continue;

        const result = await resolver.execute(argument, params, message, command);
        console.log(argument.name, result);
        if (result !== undefined) {
            // Assign the valid argument
            args[argument.name] = result;
            // Remove a param for the next argument
            params.shift();

            if (result && argument.type === "subcommand") {
                const subargs = await resolveArguments((result as CommandArgument).arguments!, params, message, command);
                if (subargs.missingRequiredArg) missingRequiredArg = true;
                else args[argument.name] = subargs.args;
            }

            // This will use up all args so immediately exist the loop.
            if (argument.type && ["subcommand", "...string", "...roles", "...emojis", "...snowflakes"].includes(argument.type)) {
                break;
            }
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
                    { addReplay: false },
                )
                .catch(console.log);
            if (question) {
                // TODO: fix this functionality
                const response = await message
                    .needResponse({
                        title: `Please provide the proper argument for ${argument.name}`,
                        customId: `missingArg-${message.author.id}-${message.channelId}`,
                        questions: [
                            {
                                inputCustomId: argument.name,
                                label: argument.name,
                                long: true,
                                minLength: 1,
                                maxLength: 2000,
                                placeholder: "",
                            },
                        ],
                    })
                    .catch(console.log);
                if (response) {
                    const responseArg = await resolver.execute(
                        argument,
                        [typeof response === "string" ? response : response.content],
                        message,
                        command,
                    );
                    if (responseArg) {
                        args[argument.name] = responseArg;
                        params.shift();
                        // TODO: gamer - this should be message.deleteBulk()
                        if (typeof response !== "string")
                            await deleteMessages(message.channelId, [question.id.toString(), response.id], message.translate("CLEAR_SPAM"), {
                                platform: message.platform,
                            }).catch(console.log);
                        continue;
                    }
                }
            }

            // console.log("Required Arg Missing: ", message.content, command, argument);
            missingRequiredArg = true;
            argument.missing?.(message);
            break;
        }
    }

    return { args, missingRequiredArg };
}

/** Parses all the arguments for the command based on the message sent by the user. */
export async function parseArguments(message: GamerMessage, command: Command, parameters: string[]) {
    if (!command.arguments) return {};

    // Clone the parameters so we can modify it without editing original array
    const params = [...parameters];

    const { args, missingRequiredArg } = await resolveArguments(command.arguments, params, message, command);

    // If an arg was missing then return false so we can error out as an object {} will always be truthy
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

export async function executeCommand(message: GamerMessage, command: Command, parameters: string[]) {
    try {
        Gamer.vip.slowmode.set(message.author.id, message.timestamp);

        // Parsed args and validated
        const args = await parseArguments(message, command, parameters);
        // Some arg that was required was missing and handled already
        if (!args) {
            return logCommand(message, "Missing", command.name);
        }

        // Check subcommand permissions and options
        if (!(await commandAllowed(message, command))) return;

        await command.execute(message, args);
        // TODO: xp - implement xp system with missions
        // await Gamer.helpers.completeMission(message.guildId, message.authorId, command.name);
        return logCommand(message, "Success", command.name);
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
