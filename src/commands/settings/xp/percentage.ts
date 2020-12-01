import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("settings-xp-decay", {
  name: "percentage",
  aliases: ["percent", "p", "%"],
  vipServerOnly: true,
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "amount", type: "number", minimum: 1, maximum: 100 },
  ],
  execute: function (message, args: CommandArgs) {
    db.guilds.update(message.guildID, { decayPercentange: args.amount });
    botCache.helpers.reactSuccess(message);
  },
});

interface CommandArgs {
  amount: number;
}
