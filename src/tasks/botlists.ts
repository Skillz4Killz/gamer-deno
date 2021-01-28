import { botCache, botID, cache, sendMessage } from "../../deps.ts";
import { configs } from "../../configs.ts";
import { Embed } from "../utils/Embed.ts";

botCache.tasks.set(`botlists`, {
  name: `botlists`,
  // Runs this function once an hour
  interval: botCache.constants.milliseconds.HOUR,
  execute: async function () {
    // Only run when the bot is fully ready. In case guilds are still loading dont want to send wrong stats.
    if (!botCache.fullyReady) return;

    const totalUsers = cache.guilds.map((g) => g.memberCount).reduce(
      (a, b) => a + b,
      0,
    );
    const totalGuilds = cache.guilds.size + botCache.dispatchedGuildIDs.size;

    // Make the variable here to get the guild count accurately
    const botLists = [
      {
        name: "discordbots.gg",
        url: `https://discordbots.org/api/bots/${botID}/stats`,
        token: configs.botListTokens.DISCORD_BOT_ORG,
        data: { server_count: totalGuilds },
      },
      {
        name: "botsondiscord.xzy",
        url: `https://bots.ondiscord.xyz/bot-api/bots/${botID}/guilds`,
        token: configs.botListTokens.BOTS_ON_DISCORD,
        data: { guildCount: totalGuilds },
      },
      {
        name: "discordbotlist.com",
        url: `https://discordbotlist.com/api/bots/${botID}/stats`,
        token: configs.botListTokens.DISCORD_BOT_LIST,
        data: {
          guilds: totalGuilds,
          users: totalUsers,
        },
      },
      {
        name: "botsfordiscord.com",
        url: `https://botsfordiscord.com/api/bot/${botID}`,
        token: configs.botListTokens.BOTS_FOR_DISCORD,
        data: { server_count: totalGuilds },
      },
      {
        name: "discordbots.group",
        url: `https://api.discordbots.group/v1/bot/${botID}`,
        token: configs.botListTokens.DISCORD_BOTS_GROUP,
        data: { server_count: totalGuilds },
      },
      {
        name: "discord.boats",
        url: `https://discord.boats/api/bot/${botID}`,
        token: configs.botListTokens.DISCORD_BOATS,
        data: { server_count: totalGuilds },
      },
      {
        name: "discord.bots.gg",
        url: `https://discord.bots.gg/api/v1/bots/${botID}/stats`,
        token: configs.botListTokens.DISCORD_BOTS_GG,
        data: { guildCount: totalGuilds },
      },
    ];

    // For each botlist we have we need to post
    for (const list of botLists) {
      if (!list.token) continue;
      // Send update request to this bot list
      fetch(list.url, {
        method: "post",
        headers: {
          Authorization: list.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(list.data),
      }).then(() => {
        console.log(
          `Update Bot Lists: [${list.name}] ${totalGuilds} Guilds | ${totalUsers} Users`,
        );
      }).catch((err) => {
        console.log({ location: "botlists file", err });
      });
    }
  },
});
