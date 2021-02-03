import { botCache } from "../../../../../deps.ts";
import { db } from "../../../../database/database.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";

createSubcommand("settings-mails", {
  name: "autoresponse",
  aliases: ["ar", "response"],
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  vipServerOnly: true,
  arguments: [{ name: "content", type: "...string" }] as const,
  execute: async function (message, args) {
    await db.guilds.update(message.guildID, {
      mailAutoResponse: args.content,
    });

    return botCache.helpers.reactSuccess(message);
  },
});
