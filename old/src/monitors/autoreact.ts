import { addReactions, bgBlue, bgYellow, black, botCache } from "../../deps.ts";
import { db } from "../database/database.ts";
import { getTime } from "../utils/helpers.ts";

const SPECIAL_SERVER_IDS = new Set();

botCache.monitors.set("autoreact", {
  name: "autoreact",
  botChannelPermissions: [
    "SEND_MESSAGES",
    "MANAGE_MESSAGES",
    "ADD_REACTIONS",
    "USE_EXTERNAL_EMOJIS",
    "READ_MESSAGE_HISTORY",
  ],
  ignoreBots: false,
  execute: async function (message) {
    if (!botCache.autoreactChannelIDs.has(message.channelID)) return;

    if (message.author.bot && !SPECIAL_SERVER_IDS.has(message.guildID)) return;

    const settings = await db.autoreact.get(message.channelID);
    if (!settings) return;

    await addReactions(message.channelID, message.id, settings.reactions, true);
    console.log(
      `${bgBlue(`[${getTime()}]`)} => [MONITOR: ${bgYellow(black("autoreact"))}] Executed in Guild: ${
        message.guildID
      } in Channel: ${message.channelID} by User: ${message.author.id}.`
    );
  },
});
