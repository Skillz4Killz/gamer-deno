import { configs } from "../../../configs.ts";
import { botCache, botHasPermission, cache, memberIDHasPermission } from "../../../deps.ts";
import { parsePrefix } from "../../monitors/commandHandler.ts";
import { Command, createCommand } from "../../utils/helpers.ts";
import { translate } from "../../utils/i18next.ts";

createCommand({
  name: "help",
  aliases: ["h"],
  botChannelPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS", "READ_MESSAGE_HISTORY"],
  arguments: [
    {
      name: "all",
      type: "string",
      literals: ["all"],
      required: false,
    },
    {
      name: "command",
      type: "nestedcommand",
      required: false,
    },
  ] as const,
  execute: async function (message, args, guild) {
    if (!guild) return;

    const prefix = parsePrefix(message.guildID);

    if (args.all) {
      return message.reply(
        [
          "",
          translate(message.guildID, "strings:HELP_WIKI"),
          `${translate(message.guildID, "strings:NEED_SUPPORT")} ${botCache.constants.botSupportInvite}`,
        ].join("\n")
      );
    }

    if (!args.command || (args.command.nsfw && !cache.channels.get(message.channelID)?.nsfw)) {
      return message.reply(
        [
          "",
          translate(message.guildID, "strings:HELP_SPECIFIC", { prefix }),
          translate(message.guildID, "strings:HELP_WIKI"),
          `${translate(message.guildID, "strings:NEED_SUPPORT")} ${botCache.constants.botSupportInvite}`,
        ].join("\n")
      );
    }

    const [help, ...commandNames] = message.content.split(" ");
    // const commandName = commandNames.join("_").toUpperCase();

    let commandName = "";
    let relevantCommand: Command<any> | undefined;

    for (const name of commandNames) {
      // If no command name yet we search for a command itself
      if (!commandName) {
        const cmd =
          botCache.commands.get(name) ||
          botCache.commands.find((c) => Boolean(c.aliases?.includes(name.toLowerCase())));
        if (!cmd) return botCache.helpers.reactError(message);

        commandName = cmd.name.toUpperCase();
        relevantCommand = cmd;
        continue;
      }

      // Look for a subcommand inside the latest command
      const cmd =
        relevantCommand?.subcommands?.get(name) ||
        relevantCommand?.subcommands?.find((c) => Boolean(c.aliases?.includes(name.toLowerCase())));
      if (!cmd) break;

      commandName += `_${cmd.name.toUpperCase()}`;
      relevantCommand = cmd;
    }

    // IGNORE NSFW COMMANDS IN NON-NSFW
    if (args.command.nsfw && !message.channel?.nsfw) return;

    // If no permissions to use command, no help for it, unless on support server
    // if (args.command.permissionLevels?.length && guild.id !== configs.supportServerID) {
    //   const missingPermissionLevel = await Promise.all(
    //     Array.isArray(args.command.permissionLevels)
    //       ? args.command.permissionLevels.map((lvl) =>
    //           botCache.permissionLevels.get(lvl)?.(message, args.command!, guild)
    //         )
    //       : [args.command.permissionLevels(message, args.command, guild)]
    //   );
    //   if (
    //     missingPermissionLevel.includes(true) &&
    //     !(await memberIDHasPermission(message.author.id, message.guildID, ["ADMINISTRATOR"]))
    //   ) {
    //     return message.reply(translate(message.guildID, "strings:LACKS_PERM_LEVEL"));
    //   }
    // }

    const NONE = translate(message.guildID, "strings:NONE");

    const botServerPerms: string[] = [];
    const botChannelPerms: string[] = [];
    const userServerPerms: string[] = [];
    const userChannelPerms: string[] = [];

    if (args.command.botServerPermissions?.length) {
      for (const perm of args.command.botServerPermissions) {
        const hasPerm = await botHasPermission(message.guildID, [perm]);
        botServerPerms.push(
          `**${translate(message.guildID, `strings:${perm}`)}**: ${
            hasPerm ? botCache.constants.emojis.success : botCache.constants.emojis.failure
          }`
        );
      }
    }

    if (args.command.botChannelPermissions?.length) {
      for (const perm of args.command.botChannelPermissions) {
        const hasPerm = await botHasPermission(message.guildID, [perm]);
        botChannelPerms.push(
          `**${translate(message.guildID, `strings:${perm}`)}**: ${
            hasPerm ? botCache.constants.emojis.success : botCache.constants.emojis.failure
          }`
        );
      }
    }

    if (args.command.userServerPermissions?.length) {
      for (const perm of args.command.userServerPermissions) {
        const hasPerm = await botHasPermission(message.guildID, [perm]);
        userServerPerms.push(
          `**${translate(message.guildID, `strings:${perm}`)}**: ${
            hasPerm ? botCache.constants.emojis.success : botCache.constants.emojis.failure
          }`
        );
      }
    }

    if (args.command.userChannelPermissions?.length) {
      for (const perm of args.command.userChannelPermissions) {
        const hasPerm = await botHasPermission(message.guildID, [perm]);
        userChannelPerms.push(
          `**${translate(message.guildID, `strings:${perm}`)}**: ${
            hasPerm ? botCache.constants.emojis.success : botCache.constants.emojis.failure
          }`
        );
      }
    }

    const USAGE = `**${translate(message.guildID, "strings:USAGE")}**`;
    const USAGE_DETAILS = translate(message.guildID, `strings:${commandName}_USAGE`, { prefix, returnObjects: true });
    let DESCRIPTION = args.command.description
      ? args.command.description.startsWith("strings:")
        ? translate(message.guildID, args.command.description, {
            returnObjects: true,
          })
        : args.command.description
      : "";
    if (Array.isArray(DESCRIPTION)) DESCRIPTION = DESCRIPTION.join("\n");

    const embed = botCache.helpers
      .authorEmbed(message)
      .setTitle(
        translate(message.guildID, `strings:COMMAND`, {
          name: commandNames.join(" "),
        })
      )
      .setDescription(DESCRIPTION || translate(message.guildID, `strings:${commandName}_DESCRIPTION`))
      .addField(
        USAGE,
        typeof args.command.usage === "string"
          ? args.command.usage
          : Array.isArray(args.command.usage)
          ? args.command.usage.map((details) => translate(message.guildID, details, { prefix })).join("\n")
          : Array.isArray(USAGE_DETAILS) && USAGE_DETAILS?.length
          ? USAGE_DETAILS.join("\n")
          : `${prefix}${commandNames.join(" ")}`
      );

    if (args.command.aliases?.length) {
      embed.addField(
        translate(message.guildID, "strings:ALIASES"),
        args.command.aliases.map((alias) => `${prefix}${alias}`).join(", ")
      );
    }

    if (botServerPerms.length) {
      embed.addField(
        translate(message.guildID, "strings:BOT_SERVER_PERMS"),
        botServerPerms.length ? botServerPerms.join("\n") : NONE,
        true
      );
    }

    if (botChannelPerms.length) {
      embed.addField(translate(message.guildID, "strings:BOT_CHANNEL_PERMS"), botChannelPerms.join("\n"), true);
    }
    if (userServerPerms.length) {
      embed.addField(translate(message.guildID, "strings:USER_SERVER_PERMS"), userServerPerms.join("\n"), true);
    }
    if (userChannelPerms.length) {
      embed.addField(translate(message.guildID, "strings:USER_CHANNEL_PERMS"), userChannelPerms.join("\n"), true);
    }

    await message.send({ embed });
  },
});
