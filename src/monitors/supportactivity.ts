import { botCache } from "../../cache.ts";
import { db } from "../database/database.ts";
import { sendResponse } from "../utils/helpers.ts";

botCache.monitors.set("supportactivity", {
  name: "supportactivity",
  execute: async function (message) {
    if (message.guildID !== botCache.constants.botSupportServerID) return;
    if (botCache.activeMembersOnSupportServer.has(message.author.id)) return;

    const settings = await db.users.get(message.author.id);
    db.users.update(message.author.id, { coins: (settings?.coins || 0) + 100 });
    sendResponse(
      message,
      "Thank you for being active on our server today! As a thank you, I have granted you some free coins to play with.",
    );

    botCache.activeMembersOnSupportServer.add(message.author.id);
  },
});
