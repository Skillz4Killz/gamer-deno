import { configs } from "../../configs.ts";
import { botCache, botID, sendMessage } from "../../deps.ts";
import { Embed } from "../utils/Embed.ts";

botCache.eventHandlers.guildCreate = async (guild) => {
  console.info(`[EVENT=GuildCreate]: ${guild.name} with ${guild.memberCount} members.`);

  const embed = new Embed()
    .setColor("RANDOM")
    .setTitle("NEW SERVER ADDED")
    .addField("Name", guild.name, true)
    .addField("ID", guild.id, true)
    .addField("Members", guild.memberCount.toLocaleString("en-US"), true)
    .addField("Shard ID", `${guild.shardID}`)
    .setTimestamp();

  await sendMessage(configs.channelIDs.serverStats, { embed }).catch(console.log);

  // IF A ENTERPRISE BOT CHECK IF WE NEED TO LEAVE
  if (botID !== "270010330782892032") {
    botCache.tasks.get("enterprise")?.execute();
  }
};

botCache.eventHandlers.guildDelete = async (guild) => {
  console.info(`[EVENT=GuildDelete]: ${guild.name} with ${guild.memberCount} members.`);

  const embed = new Embed()
    .setColor("RANDOM")
    .setTitle("SERVER REMOVED")
    .addField("Name", guild.name, true)
    .addField("ID", guild.id, true)
    .addField("Members", guild.memberCount.toLocaleString("en-US"), true)
    .setTimestamp();

  await sendMessage(configs.channelIDs.serverStats, { embed }).catch(console.log);
};
