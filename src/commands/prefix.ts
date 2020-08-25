import { botCache } from "../../mod.ts";
import { PermissionLevels } from "../types/commands.ts";
import { sendResponse, sendEmbed, createSubcommand } from "../utils/helpers.ts";
import { parsePrefix } from "../monitors/commandHandler.ts";
import { Embed } from "../utils/Embed.ts";
import Guild from "../database/schemas/guilds.ts";

// This command will only execute if there was no valid sub command: !prefix
botCache.commands.set("prefix", {
  name: "prefix",
  arguments: [
    {
      name: "sub commmand",
      type: "subcommand",
      literals: ["set"],
    },
  ],
  guildOnly: true,
  permissionLevels: [PermissionLevels.MEMBER],
  execute: (message, args) => {
    const embed = new Embed()
      .setTitle("Prefix Information")
      .setDescription(`
            **Guild**: \`${message.guild()?.name}\`
            **Current Prefix**: \`${parsePrefix(message.guildID)}\`
      `)
      .setTimestamp();

    sendEmbed(message.channel, embed);
  },
});

// Create a subcommand for when users do !prefix set $
createSubcommand("prefix", {
  name: "set",
  arguments: [
    {
      name: "prefix",
      type: "string",
      required: true,
      missing: (message) => {
        sendResponse(message, `${message.member()} please provid a prefix`);
      },
    },
  ],
  permissionLevels: [PermissionLevels.ADMIN],
  execute: async (message, args: PrefixArgs) => {
    if (args.prefix.length > 3) {
      return sendResponse(message, "Prefix input too long");
    }

    const oldPrefix = parsePrefix(message.guildID);
    botCache.guildPrefixes.set(message.guildID, args.prefix);
    const settings = await Guild.find(message.guildID);
    if (!settings) {
      Guild.create({ id: message.guildID, prefix: args.prefix });
    } else {
      Guild.where("id", message.guildID).update("prefix", args.prefix);
    }

    const embed = new Embed()
      .setTitle("Success, prefix was changed")
      .setDescription(`
        **Old Prefix**: \`${oldPrefix}\`
        **New Prefix**: \`${args.prefix}\`
      `)
      .setTimestamp();

    sendEmbed(message.channel, embed);
  },
});

interface PrefixArgs {
  prefix: string;
}
