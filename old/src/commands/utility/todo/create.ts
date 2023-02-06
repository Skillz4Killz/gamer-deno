import { addReactions, botCache, cache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { Embed } from "../../../utils/Embed.ts";
import { createSubcommand, sendEmbed } from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";

const todoCreateColors = {
  lowest: "#51E898",
  low: "#61BD4F",
  medium: "#F2D600",
  high: "#EB5A46",
  highest: "#C377E0",
};

createSubcommand("todo", {
  name: "create",
  aliases: ["new"],
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.BOT_OWNER],
  guildOnly: true,
  arguments: [
    { name: "member", type: "member", required: false },
    {
      name: "priority",
      type: "string",
      literals: ["lowest", "low", "medium", "high", "highest"],
    },
    { name: "points", type: "number" },
    { name: "label", type: "string" },
    { name: "content", type: "...string" },
  ] as const,
  execute: async (message, args, guild) => {
    if (!guild) return;

    const creator = cache.members.get(message.author.id);
    if (!creator) return botCache.helpers.reactError(message);

    const member = args.member || creator;
    if (!member) return botCache.helpers.reactError(message);

    const settings = await db.guilds.get(message.guildID);
    if (!settings?.todoBacklogChannelID) {
      return botCache.helpers.reactError(message);
    }

    const embed = new Embed()
      .setAuthor(member.tag, member.avatarURL)
      .setDescription(args.content)
      // @ts-ignore
      .setColor(todoCreateColors[args.priority])
      .addField(translate(message.guildID, "strings:TODO_PRIORITY"), args.priority, true)
      .addField(translate(message.guildID, "strings:TODO_POINTS"), args.points.toLocaleString("en-US"), true)
      .addField(translate(message.guildID, "strings:TODO_LABEL"), args.label, true)
      .setFooter(creator.tag)
      .setTimestamp();

    if (botCache.vipGuildIDs.has(message.guildID)) {
      // Incase there was an image used
      const [attachment] = message.attachments;
      if (attachment) {
        const blob = await fetch(attachment.url)
          .then((res) => res.blob())
          .catch(() => undefined);
        if (blob) embed.attachFile(blob, attachment.filename);
      }
    }

    const card = await sendEmbed(settings.todoBacklogChannelID, embed);
    if (!card) return botCache.helpers.reactError(message);

    await addReactions(card.channelID, card.id, Object.values(botCache.constants.emojis.todo), true);

    return botCache.helpers.reactSuccess(message);
  },
});
