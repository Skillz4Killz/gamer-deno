import { addReactions, bgBlue, bgYellow, black, cache } from "../../deps.ts";
import { botCache } from "../../cache.ts";
import { getTime } from "../utils/helpers.ts";
import { db } from "../database/database.ts";

botCache.monitors.set("autoreact", {
  name: "autoreact",
  botChannelPermissions: ["SEND_MESSAGES", "MANAGE_MESSAGES"],
  execute: async function (message) {
    const channel = cache.channels.get(message.channelID);
    if (!channel?.topic?.includes("gamerAutoReact")) return;

    const settings = await db.autoreact.get(message.channelID);
    if (!settings) return;

    addReactions(message.channelID, message.id, settings.reactions);
    console.log(
      `${bgBlue(`[${getTime()}]`)} => [MONITOR: ${
        bgYellow(black("autoreact"))
      }] Executed in Guild: ${message.guildID} in Channel: ${message.channelID} by User: ${message.author.id}.`,
    );
  },
});
