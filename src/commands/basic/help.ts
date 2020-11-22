import { parsePrefix } from "../../monitors/commandHandler.ts";
import {
  botCache,
  botHasPermission,
  cache,
  sendMessage,
} from "../../../deps.ts";
import { createCommand, sendEmbed, sendResponse } from "../../utils/helpers.ts";
import { translate } from "../../utils/i18next.ts";
import { Command } from "../../types/commands.ts";

createCommand({
  name: `help`,
  arguments: [
    {
      name: "command",
      type: "nestedcommand",
      required: false,
    },
  ],
  execute: async function (message, args: CommandArgs, guild) {
    if (!args.command) {
      return sendMessage(message.channelID, `No command provided.`);
    }

    // If nsfw command, help only in nsfw channel
    if (args.command.nsfw && !cache.channels.get(message.channelID)?.nsfw) {
      return sendResponse(
        message,
        translate(message.guildID, "strings:NSFW_CHANNEL_REQUIRED"),
      );
    }

    // If no permissions to use command, no help for it, unless on support server
    if (args.command.permissionLevels?.length) {
      const missingPermissionLevel = await Promise.all(
        args.command.permissionLevels.map((lvl) =>
          botCache.permissionLevels.get(lvl)?.(message, args.command, guild)
        ),
      );
      if (missingPermissionLevel.includes(true)) {
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
        const hasPerm = await botHasPermission(message.guildID, perm);
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
        const hasPerm = await botHasPermission(message.guildID, perm);
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
        const hasPerm = await botHasPermission(message.guildID, perm);
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
        const hasPerm = await botHasPermission(message.guildID, perm);
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
          botHasPermission(message.guildID, perm)
        ),
      )
      : NONE;

    const prefix = parsePrefix(message.guildID);
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
          { name: args.command },
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
          : USAGE_DETAILS?.length
          ? USAGE_DETAILS.join("\n")
          : `${prefix}${args.command.name}`,
      )
      .addField(
        translate(message.guildID, "strings:BOT_SERVER_PERMS"),
        botServerPerms.length ? botServerPerms.join("\n") : NONE,
        true,
      )
      .addField(
        translate(message.guildID, "strings:BOT_CHANNEL_PERMS"),
        botChannelPerms.length ? botChannelPerms.join("\n") : NONE,
        true,
      )
      .addField(
        translate(message.guildID, "strings:USER_SERVER_PERMS"),
        userServerPerms.length ? userServerPerms.join("\n") : NONE,
        true,
      )
      .addField(
        translate(message.guildID, "strings:USER_CHANNEL_PERMS"),
        userChannelPerms.length ? userChannelPerms.join("\n") : NONE,
        true,
      );

    sendEmbed(message.channelID, embed);
  },
});

interface CommandArgs {
  command?: Command;
}
