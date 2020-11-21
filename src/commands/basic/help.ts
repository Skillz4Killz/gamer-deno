import { parsePrefix } from "../../monitors/commandHandler.ts";
import { botCache, sendMessage } from "../../../deps.ts";
import { createCommand, sendEmbed } from "../../utils/helpers.ts";
import { translate } from "../../utils/i18next.ts";

createCommand({
  name: `help`,
  arguments: [
    {
      name: "command",
      type: "string",
      lowercase: true,
    },
  ],
  execute: function (message, args: HelpArgs, guild) {
    if (!args.command) {
      return sendMessage(message.channelID, `No command provided.`);
    }

    const command = botCache.commands.get(args.command);
    if (!command) {
      return sendMessage(
        message.channelID,
        `Command ${args.command} not found.`,
      );
    }

    const prefix = parsePrefix(message.guildID);
    const USAGE = `**${translate(message.guildID, "strings:USAGE")}**`;
    const USAGE_DETAILS = translate(
      message.guildID,
      `strings:${args.command.toUpperCase()}_USAGE`,
      { prefix, returnObjects: true },
    );

    const embed = botCache.helpers.authorEmbed(message)
      .setTitle(
        translate(
          message.guildID,
          `commands/help:COMMAND`,
          { name: args.command },
        ),
      )
      .setDescription(
        translate(
          message.guildID,
          `strings:${args.command.toUpperCase()}_DESCRIPTION`,
        ),
      )
      .addField(
        USAGE,
        typeof command.usage === "string"
          ? command.usage
          : Array.isArray(command.usage)
          ? command.usage.map((details) =>
            translate(message.guildID, details, { prefix })
          )
            .join("\n")
          : USAGE_DETAILS?.length
          ? USAGE_DETAILS.join("\n")
          : `${prefix}${command.name}`,
      );

    sendEmbed(message.channelID, embed);
  },
});

interface HelpArgs {
  command?: string;
}
