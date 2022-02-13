import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("roles", {
  name: "unique",
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    {
      name: "subcommand",
      type: "subcommand",
      required: false,
    },
  ],
  guildOnly: true,
  vipServerOnly: true,
  execute: async (message) => {
    return message.reply('/roles unique')
    // const sets = await db.uniquerolesets.findMany({ guildID: message.guildID }, true);
    // if (!sets?.length) return botCache.helpers.reactError(message);

    // const responses = botCache.helpers.chunkStrings(
    //   sets.map((set) => `**${set.name}**: ${set.roleIDs.map((id) => `<@&${id}>`).join(" ")}`)
    // );

    // for (const response of responses) {
    //   await message
    //     .send({
    //       content: response,
    //       mentions: { parse: [] },
    //     })
    //     .catch(console.log);
    // }
  },
});
