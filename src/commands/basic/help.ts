import { parsePrefix } from "../../monitors/commandHandler.ts";
import { botCache, cache, sendMessage } from "../../../deps.ts";
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
    sendMessage(message.channelID, "command ran 1");
    if (!args.command) {
      return sendMessage(message.channelID, `No command provided.`);
    }

    sendMessage(message.channelID, "command ran 2");
    // If nsfw command, help only in nsfw channel
    if (args.command.nsfw && !cache.channels.get(message.channelID)?.nsfw) {
      return sendResponse(
        message,
        translate(message.guildID, "strings:NSFW_CHANNEL_REQUIRED"),
      );
    }
    sendMessage(message.channelID, "command ran 3");

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
    sendMessage(message.channelID, "command ran 4");
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
      );

    sendEmbed(message.channelID, embed);
  },
});

interface CommandArgs {
  command?: Command;
}
