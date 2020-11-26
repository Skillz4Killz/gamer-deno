import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createCommand, sendResponse } from "../../../utils/helpers.ts";

createCommand({
    name: "balance",
    aliases: ["bal"],
    cooldown: {
        seconds: 30,
        allowedUses: 6
    },
    execute: async function (message) {
        const settings = await db.users.get(message.author.id);
        if (!settings) return botCache.helpers.reactError(message);

        sendResponse(message, `${botCache.helpers.cleanNumber(settings.coins)} ${botCache.constants.emojis.coin}`);
    }
})