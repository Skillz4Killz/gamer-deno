import { botCache } from "../../mod.ts";

botCache.eventHandlers.guildCreate = (guild) => {
  console.info(
    `[EVENT=GuildCreate]: ${guild.name} with ${guild.memberCount} members.`,
  );
};
