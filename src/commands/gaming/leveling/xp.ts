import { botCache, Member } from "../../../../deps.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createCommand } from "../../../utils/helpers.ts";

createCommand({
  name: "xp",
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  arguments: [
    { name: "subcommand", type: "subcommand", required: false },
    { name: "type", type: "string", literals: ["add", "remove"] },
    { name: "amount", type: "number", minimum: 1 },
    { name: "member", type: "member" },
  ] as const,
  execute: function (message, args) {
    if (args.type === "add") {
      botCache.helpers.addLocalXP(
        message.guildID,
        args.member.id,
        args.amount,
        true,
      );
    } else {
      botCache.helpers.removeXP(message.guildID, args.member.id, args.amount);
    }

    botCache.helpers.reactSuccess(message);
  },
});
