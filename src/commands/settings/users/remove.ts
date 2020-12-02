import { db } from "../../../database/database.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("settings-users-badges", {
  name: "remove",
  aliases: ["r"],
  vipUserOnly: true,
  arguments: [
    { name: "url", type: "string" },
  ],
  execute: async function (message, args) {
    const settings = await db.users.get(message.author.id);
    db.users.update(
      message.guildID,
      { badges: (settings?.badges || []).filter((url) => url !== args.url) },
    );
  },
});
