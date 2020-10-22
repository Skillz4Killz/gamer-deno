import type { Member } from "../../../../../deps.ts";

import { createSubcommand } from "../../../../utils/helpers.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { botCache } from "../../../../../mod.ts";
import { db } from "../../../../database/database.ts";

createSubcommand("modlog", {
  name: "clear",
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.MODERATOR],
  arguments: [
    { name: "member", type: "member", required: false },
  ],
  guildOnly: true,
  execute: async (message, args: ModlogClearArgs) => {
    db.modlogs.deleteMany(
      { guildID: message.guildID, userID: args.member.id },
    );

    botCache.helpers.reactSuccess(message);
  },
});

interface ModlogClearArgs {
  member: Member;
}
