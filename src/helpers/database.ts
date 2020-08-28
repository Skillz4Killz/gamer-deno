import { botCache } from "../../mod.ts";
import { guildsDatabase } from "../database/schemas/guilds.ts";

botCache.helpers.upsertGuild = async function (id: string) {
  const settings = await guildsDatabase.findOne({ guildID: id });
  if (settings) return settings;

  // Create a new settings for this guild.
  await guildsDatabase.insertOne({
    guildID: id,
    prefix: ".",
    language: "en_US",
  });

  return guildsDatabase.findOne({ guildID: id });
};
