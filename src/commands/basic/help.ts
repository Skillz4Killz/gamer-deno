import { Embed } from "../../utils/Embed.ts";
import { parsePrefix } from "../../monitors/commandHandler.ts";
import { sendMessage } from "../../../deps.ts";
import { createCommand, sendEmbed, sendResponse } from "../../utils/helpers.ts";
import { botCache } from "../../../cache.ts";
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
    const USAGE = `**${translate(message.guildID, "commands/help:USAGE")}**`;

    const member = guild?.members.get(message.author.id);
    if (!member) {
      return sendResponse(message, {
        content: [
          "",
          translate(
            message.guildID,
            `commands/help:COMMAND`,
            { name: args.command },
          ),
          "",
          translate(message.guildID, `commands/${args.command}:DESCRIPTION`),
          "",
          typeof command.usage === "string"
            ? `${USAGE} ${prefix}${command.usage}`
            : Array.isArray(command.usage)
            ? [USAGE, ...command.usage.map((details) => `${prefix}${details}`)]
              .join("\n")
            : `${USAGE} ${prefix}${command.name}`,
        ].join("\n"),
        mentions: { parse: [] },
      });
    }

    const embed = new Embed()
      .setAuthor(
        translate(
          message.guildID,
          `commands/help:COMMAND`,
          { name: args.command },
        ),
        member.avatarURL,
      )
      .setDescription(
        translate(message.guildID, `commands/${args.command}:DESCRIPTION`),
      )
      .addField(
        USAGE,
        typeof command.usage === "string"
          ? `${prefix}${command.usage}`
          : Array.isArray(command.usage)
          ? command.usage.map((details) => `${prefix}${details}`)
            .join("\n")
          : `${prefix}${command.name}`,
      );

    sendEmbed(message.channelID, embed);
  },
});

interface HelpArgs {
  command?: string;
}
