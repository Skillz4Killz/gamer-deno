import { botCache } from "../../../mod.ts";
import type { PermissionLevels } from "../../types/commands.ts";
import type {
  sendResponse,
  sendEmbed,
  createSubcommand,
} from "../../utils/helpers.ts";
import type { parsePrefix } from "../../monitors/commandHandler.ts";
import type { Embed } from "../../utils/Embed.ts";
import type { guildsDatabase } from "../../database/schemas/guilds.ts";
import type { addReaction } from "../../../deps.ts";

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

    sendEmbed(message.channelID, embed);
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
    const settings = await botCache.helpers.upsertGuild(message.guildID);
    if (!settings) return;

    guildsDatabase.updateOne(
      { guildID: message.guildID },
      { $set: { prefix: args.prefix } },
    );

    addReaction(message.channelID, message.id, "✅");
  },
});

interface PrefixArgs {
  prefix: string;
}
