import { botCache } from "../../cache.ts";
import { sendResponse } from "../utils/helpers.ts";
import { translate } from "../utils/i18next.ts";

botCache.inhibitors.set("vipServer", async function (message, command, guild) {
  // If this command does not need nsfw the inhibitor returns false so the command can run
  if (!command.vipServerOnly) return false;

  // DMs are not considered NSFW channels by Discord so we return true to cancel nsfw commands on dms
  if (!guild) {
    sendResponse(message, "sorry this is a VIP server command only.");
    return true;
  }

  // If this is a vip server allow the command
  if (botCache.vipGuildIDs.has(message.guildID)) return false;

  sendResponse(message, translate(message.guildID, "common:NEED_VIP"));
  return true;
});
