import { parsePrefix } from "../../monitors/commandHandler.ts";
import {
  botCache,
  botHasPermission,
  cache,
  deleteMessage,
  memberIDHasPermission,
} from "../../../deps.ts";
import {
  createCommand,
  sendAlertResponse,
  sendEmbed,
  sendResponse,
} from "../../utils/helpers.ts";
import { translate } from "../../utils/i18next.ts";

createCommand({
  name: `help`,
  botChannelPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
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
    const prefix = parsePrefix(message.guildID);

    if (args.all) {
      return sendResponse(
        message,
        [
          "",
          translate(message.guildID, "strings:HELP_WIKI"),
          `${
            translate(message.guildID, "strings:NEED_SUPPORT")
          } ${botCache.constants.botSupportInvite}`,
        ].join("\n"),
      );
    }

    if (!args.command) {
      return sendResponse(
        message,
        [
          "",
          translate(message.guildID, "strings:HELP_ALL", { prefix }),
          translate(message.guildID, "strings:HELP_SPECIFIC", { prefix }),
          translate(message.guildID, "strings:HELP_WIKI"),
          `${
            translate(message.guildID, "strings:NEED_SUPPORT")
          } ${botCache.constants.botSupportInvite}`,
        ].join("\n"),
      );
    }

    // If nsfw command, help only in nsfw channel
    if (args.command.nsfw && !cache.channels.get(message.channelID)?.nsfw) {
      deleteMessage(message).catch(() => undefined);
      return sendAlertResponse(
        message,
        translate(message.guildID, "strings:NSFW_CHANNEL_REQUIRED"),
      );
    }

    // If no permissions to use command, no help for it, unless on support server
    if (args.command.permissionLevels?.length) {
      const missingPermissionLevel = await Promise.all(
        Array.isArray(args.command.permissionLevels)
          ? args.command.permissionLevels.map((lvl) =>
            botCache.permissionLevels.get(lvl)?.(message, args.command!, guild)
          )
          : [args.command.permissionLevels(message, args.command, guild)],
      );
      if (
        missingPermissionLevel.includes(true) &&
        !(await memberIDHasPermission(
          message.author.id,
          message.guildID,
          ["ADMINISTRATOR"],
        ))
      ) {
        return sendResponse(
          message,
          translate(message.guildID, "strings:LACKS_PERM_LEVEL"),
        );
      }
    }

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
            hasPerm
              ? botCache.constants.emojis.success
              : botCache.constants.emojis.failure
          }`,
        );
      }
    }

    if (args.command.botChannelPermissions?.length) {
      for (const perm of args.command.botChannelPermissions) {
        const hasPerm = await botHasPermission(message.guildID, [perm]);
        botChannelPerms.push(
          `**${translate(message.guildID, `strings:${perm}`)}**: ${
            hasPerm
              ? botCache.constants.emojis.success
              : botCache.constants.emojis.failure
          }`,
        );
      }
    }

    if (args.command.userServerPermissions?.length) {
      for (const perm of args.command.userServerPermissions) {
        const hasPerm = await botHasPermission(message.guildID, [perm]);
        userServerPerms.push(
          `**${translate(message.guildID, `strings:${perm}`)}**: ${
            hasPerm
              ? botCache.constants.emojis.success
              : botCache.constants.emojis.failure
          }`,
        );
      }
    }

    if (args.command.userChannelPermissions?.length) {
      for (const perm of args.command.userChannelPermissions) {
        const hasPerm = await botHasPermission(message.guildID, [perm]);
        userChannelPerms.push(
          `**${translate(message.guildID, `strings:${perm}`)}**: ${
            hasPerm
              ? botCache.constants.emojis.success
              : botCache.constants.emojis.failure
          }`,
        );
      }
    }

    args.command.botServerPermissions?.length
      ? await Promise.all(
        args.command.botServerPermissions.map((perm) =>
          botHasPermission(message.guildID, [perm])
        ),
      )
      : NONE;

    const USAGE = `**${translate(message.guildID, "strings:USAGE")}**`;
    const USAGE_DETAILS = translate(
      message.guildID,
      `strings:${args.command.name.toUpperCase()}_USAGE`,
      { prefix, returnObjects: true },
    );

    const embed = botCache.helpers.authorEmbed(message)
      .setTitle(
        translate(
          message.guildID,
          `strings:COMMAND`,
          { name: args.command.name },
        ),
      )
      .setDescription(
        translate(
          message.guildID,
          args.command.description ||
            `strings:${args.command.name.toUpperCase()}_DESCRIPTION`,
        ),
      )
      .addField(
        USAGE,
        typeof args.command.usage === "string"
          ? args.command.usage
          : Array.isArray(args.command.usage)
          ? args.command.usage.map((details) =>
            translate(message.guildID, details, { prefix })
          )
            .join("\n")
          : Array.isArray(USAGE_DETAILS) && USAGE_DETAILS?.length
          ? USAGE_DETAILS.join("\n")
          : `${prefix}${args.command.name}`,
      );

    if (args.command.aliases?.length) {
      embed.addField(
        translate(message.guildID, "strings:ALIASES"),
        args.command.aliases.map((alias) => `${prefix}${alias}`).join(", "),
      );
    }

    if (botServerPerms.length) {
      embed.addField(
        translate(message.guildID, "strings:BOT_SERVER_PERMS"),
        botServerPerms.length ? botServerPerms.join("\n") : NONE,
        true,
      );
    }

    if (botChannelPerms.length) {
      embed.addField(
        translate(message.guildID, "strings:BOT_CHANNEL_PERMS"),
        botChannelPerms.join("\n"),
        true,
      );
    }
    if (userServerPerms.length) {
      embed.addField(
        translate(message.guildID, "strings:USER_SERVER_PERMS"),
        userServerPerms.join("\n"),
        true,
      );
    }
    if (userChannelPerms.length) {
      embed.addField(
        translate(message.guildID, "strings:USER_CHANNEL_PERMS"),
        userChannelPerms.join("\n"),
        true,
      );
    }

    sendEmbed(message.channelID, embed);
  },
});
