import { botCache, cache, chooseRandom, deleteMessageByID, sendMessage } from "../../deps.ts";
import { db } from "../database/database.ts";
import { TagSchema } from "../database/schemas.ts";
import { Embed } from "../utils/Embed.ts";
import { sendEmbed } from "../utils/helpers.ts";

botCache.monitors.set("tags", {
  name: "tags",
  botChannelPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "USE_EXTERNAL_EMOJIS"],
  execute: async function (message) {
    const guild = cache.guilds.get(message.guildID);
    if (!guild) return;

    const member = cache.members.get(message.author.id);
    if (!member) return;

    const lowercaseContent = message.content.toLowerCase();
    const words = lowercaseContent.split(" ");
    const [firstWord] = words;
    const tagNames = [...botCache.tagNames.values()];
    // Filter out all tag names to those even on other guilds
    const possiblyRelevant = words.filter(
      (word) => botCache.tagNames.has(`${message.guildID}-${word}`) || tagNames.some((name) => name.endsWith(word))
    );
    // If none of the words are even possible cancel out
    if (!possiblyRelevant.length) return;

    let tag: TagSchema | undefined;

    const modules = await db.modules.findMany({ guildID: message.guildID }, true);

    for (const word of possiblyRelevant) {
      const serverTag = botCache.tagNames.has(`${message.guildID}-${word}`);
      if (serverTag) {
        tag = await db.tags.get(`${message.guildID}-${word}`);
        if (tag) break;
      }

      // No valid tag found, time to search for if it has a module for it.
      if (!modules.length) continue;

      for (const module of modules) {
        tag = await db.tags.get(`${module.sourceGuildID}-${word}`);
        if (tag) {
          if (!tag.isPublic) return;
          break;
        }
      }
    }

    // No valid tag was found
    if (!tag) return;

    const usage = `Tag ${tag.name} used by ${member.tag}`;

    if (tag.type === "basic" && firstWord !== tag.name) return;
    const isVIPGuild = botCache.vipGuildIDs.has(message.guildID);

    if (tag.type === "random" && firstWord === tag.name) {
      const random = chooseRandom(tag.randomOptions);
      if (isVIPGuild) {
        return sendMessage(message.channelID, random);
      }
      return sendMessage(message.channelID, [usage, "", random].join("\n"));
    }

    const transformed = await botCache.helpers.variables(tag.embedCode, member, guild, member);

    // Not an embed
    if (!transformed.startsWith("{")) {
      if (isVIPGuild) {
        return sendMessage(message.channelID, transformed);
      }
      return sendMessage(message.channelID, [usage, "", transformed].join("\n"));
    }

    try {
      const json = JSON.parse(transformed);
      const embed = new Embed(json);
      if (!isVIPGuild) embed.setFooter(usage, member.avatarURL);

      const response = await sendEmbed(message.channelID, embed);
      if (!response || !isVIPGuild) return;

      await deleteMessageByID(message.channelID, response.id, "Spam clean", botCache.constants.milliseconds.MINUTE * 5);
      if (tag.type === "basic") {
        await deleteMessageByID(message.channelID, message.id, "Spam clean");
      }
    } catch {
      // Ignore errors as monitors are too spammy.
    }
  },
});
