import { botCache, cache, guildIconURL, hasChannelPermissions, sendDirectMessage } from "../../deps.ts";
import { Embed } from "../utils/Embed.ts";
import { translate } from "../utils/i18next.ts";

botCache.monitors.set("spy", {
  name: "spy",
  execute: async function (message) {
    return;
    const guild = cache.guilds.get(message.guildID);
    if (!guild) return;

    const handledWords = new Set<string>();

    for (const word of message.content.toLowerCase().split(" ")) {
      // First check if this is even a word for spies
      const records = botCache.spyRecords.get(word);
      if (!records) continue;

      // If this word is already set to dm skip
      if (handledWords.has(word)) return;
      // Prevents the next words from being triggerred if its the same word
      handledWords.add(word);

      const embed = new Embed()
        .setDescription(message.content)
        .setTimestamp(message.timestamp)
        .setFooter(word)
        .setTitle(
          translate(message.guildID, "strings:CLICK_HERE_TO_MESSAGE"),
          `https://discord.com/channels/${message.guildID}/${message.channelID}/${message.id}`
        );
      if (guild) embed.setThumbnail(guildIconURL(guild)!);

      records.forEach(async (userID) => {
        // Don't send alerts for messages you send yourself
        if (message.author.id === userID) return;

        // Fetch member to make sure the user is in this guild. MUST be before permission check
        const member = await botCache.helpers.fetchMember(message.guildID, userID);
        if (!member) return;

        // Don't send messages if the user doesnt have view channel
        const hasPerms = await hasChannelPermissions(message.channelID, userID, ["VIEW_CHANNEL"]);
        if (!hasPerms) return;

        await sendDirectMessage(userID, {
          embed,
          content: translate(guild.id, "strings:SPY_TRIGGER_FOUND", {
            guild: guild.name,
            channel: `<#${message.channelID}>`,
          }),
        }).catch(console.log);
      });
    }
  },
});
