import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { Embed } from "../../../utils/Embed.ts";
import { createSubcommand, sendEmbed } from "../../../utils/helpers.ts";

createSubcommand("tag", {
  name: "show",
  aliases: ["s"],
  guildOnly: true,
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  arguments: [{ name: "name", type: "string", lowercase: true }] as const,
  execute: async function (message, args) {
    const tag = await db.tags.get(`${message.guildID}-${args.name}`);
    if (!tag) return botCache.helpers.reactError(message);

    const embed = new Embed().setDescription(["```json", tag.embedCode, "```"].join("\n"));

    return sendEmbed(message.channelID, embed);
  },
});
