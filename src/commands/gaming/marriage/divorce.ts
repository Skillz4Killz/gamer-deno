import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createCommand, sendResponse } from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";

createCommand({
  name: "divorce",
  execute: async function (message) {
    const marriage = await db.marriages.get(message.author.id);
    if (!marriage) return botCache.helpers.reactError(message);

    await sendResponse(message, translate(message.guildID, "strings:DIVORCED"));
    await db.marriages.delete(message.author.id);

    if (!marriage.accepted) return;

    // Since the marriage was accepted, we must also terminate the other sides marriage
    await sendResponse(
      message,
      {
        content: `<@${marriage.spouseID}>, ${
          translate(message.guildID, "strings:DIVORCED")
        }`,
      },
    );
    await db.marriages.delete(marriage.spouseID);
  },
});
