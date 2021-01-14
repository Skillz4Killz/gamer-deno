import { botCache } from "../../deps.ts";
import { sendResponse } from "../utils/helpers.ts";
import { translate } from "../utils/i18next.ts";

botCache.inhibitors.set("vipUser", async function (message, command) {
  if (!command.vipUserOnly) return false;

  if (botCache.vipUserIDs.has(message.author.id)) return false;

  await sendResponse(message, translate(message.guildID, "strings:NEED_VIP"));
  console.log(`${command.name} Inhibited: VIP USER`);
  return true;
});
