import { botCache, cache, sendMessage } from "../../deps.ts";
import { db } from "../database/database.ts";
import { TagSchema } from "../database/schemas.ts";
import { Embed } from "../utils/Embed.ts";
import { sendEmbed } from "../utils/helpers.ts";

botCache.monitors.set('tags', {
	name: "tags",
	botChannelPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "USE_EXTERNAL_EMOJIS"],
	execute: async function (message) {
		const guild = cache.guilds.get(message.guildID);
		if (!guild) return;

		const member = guild.members.get(message.author.id);
		if (!member) return;

		const lowercaseContent = message.content.toLowerCase();
		const words = lowercaseContent.split(' ');
		const [firstWord] = words;
		const tagNames = [...botCache.tagNames.values()]
		// Filter out all tag names to those even on other guilds
		const possiblyRelevant = words.filter(word => botCache.tagNames.has(`${message.guildID}-${word}`) || tagNames.some(name => name.endsWith(word)));
		// If none of the words are even possible cancel out
		if (!possiblyRelevant.length) return;

		let tag: TagSchema | undefined

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

		// TODO: xp stuff
		// Gamer.helpers.levels.processXP(message)

      const transformed = await botCache.helpers.variables(
        tag.embedCode,
        member,
        guild,
        member,
      )

			const usage = `Tag ${tag.name} used by ${member.tag}`;

			// Not an embed
      if (!transformed.startsWith('{')) {
				if (botCache.vipGuildIDs.has(message.guildID)) return sendMessage(message.channelID, transformed);
				return sendMessage(message.channelID, [usage, "", transformed].join('\n'));
      }

      try {
				const json = JSON.parse(transformed)
				const embed = new Embed(json);
				sendEmbed(message.channelID, embed)
      } catch {
				// Ignore errors as monitors are too spammy.
			}
    }
})
