import { botCache } from "../../deps.ts";
import { botID } from "../../deps.ts";

botCache.eventHandlers.guildCreate = (guild) => {
  console.info(
    `[EVENT=GuildCreate]: ${guild.name} with ${guild.memberCount} members.`,
  );

  // IF A ENTERPRISE BOT CHECK IF WE NEED TO LEAVE
  if (botID !== "270010330782892032") {
    botCache.tasks.get("enterprise")?.execute();
  }
};
