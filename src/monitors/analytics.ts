import { botCache, cache } from "../../deps.ts";
import { analyticsDetails, analyticsMessages } from "../tasks/analytics.ts";

botCache.monitors.set("analytics", {
  name: "analytics",
  ignoreBots: false,
  execute: function (message) {
    if (!botCache.vipGuildIDs.has(message.guildID)) return;

    // Sets the total message count on the server
    const current = analyticsMessages.get(message.guildID);
    analyticsMessages.set(message.guildID, (current || 0) + 1);

    // Sets the channel id for determining channel activity
    const currentChannel = analyticsDetails.get(message.channelID);
    analyticsDetails.set(message.channelID, (currentChannel || 0) + 1);

    // Sets the user id for determining user activity
    const currentUser = analyticsDetails.get(message.author.id);
    analyticsDetails.set(message.author.id, (currentUser || 0) + 1);

    const guild = cache.guilds.get(message.guildID);
    if (!guild) return;

    // Check if any of the words in the message was an custom server emoji
    for (const word of message.content.split(" ")) {
      // If not a valid emoji form skip
      if (!word.startsWith("<:") || !word.startsWith("<a:")) continue;
      // A valid custom emoji now we check if its from this server.
      const validEmoji = guild.emojis.find((emoji) =>
        `<${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}>`
      );
      if (validEmoji) {
        // Sets the emoji id for determining emoji activity
        const currentEmoji = analyticsDetails.get(validEmoji.id!);
        analyticsDetails.set(validEmoji.id!, (currentEmoji || 0) + 1);
      }
    }
  },
});
