import { botCache } from "../../cache.ts";
import { configs } from "../../configs.ts";
import { sendResponse } from "../utils/helpers.ts";
import { translate } from "../utils/i18next.ts";

botCache.inhibitors.set("vipServer", async function (message, command, guild) {
  // If this command does not need nsfw the inhibitor returns false so the command can run
  if (!command.vipServerOnly) return false;

  if (!guild) {
    sendResponse(message, "sorry this is a VIP server command only.");
    return true;
  }

  // If this is a vip server allow the command
  if (botCache.vipGuildIDs.has(message.guildID)) return false;
  // Allow bots support server
  if (message.guildID === configs.supportServerID) return false;

  sendResponse(message, translate(message.guildID, "strings:NEED_VIP"));
  return true;
});
