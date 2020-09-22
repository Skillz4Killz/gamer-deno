import type { Member } from "../../../../../deps.ts";

import { createSubcommand } from "../../../../utils/helpers.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { modlogsDatabase } from "../../../../database/schemas/modlogs.ts";
import { botCache } from "../../../../../mod.ts";

createSubcommand("modlog", {
  name: "clear",
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.MODERATOR],
  arguments: [
    { name: "member", type: "member", required: false },
  ],
  guildOnly: true,
  execute: async (message, args: ModlogClearArgs) => {
    modlogsDatabase.deleteMany(
      { guildID: message.guildID, userID: args.member.user.id },
    );

    botCache.helpers.reactSuccess(message);
  },
});

interface ModlogClearArgs {
  member: Member;
}
