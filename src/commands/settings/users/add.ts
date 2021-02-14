import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("settings-users-badges", {
  name: "add",
  aliases: ["a"],
  vipUserOnly: true,
  arguments: [{ name: "url", type: "string" }] as const,
  execute: async function (message, args) {
    const settings = await db.users.get(message.author.id);
    await db.users.update(message.author.id, {
      badges: [...(settings?.badges || []), args.url],
    });
    return botCache.helpers.reactSuccess(message);
  },
});
