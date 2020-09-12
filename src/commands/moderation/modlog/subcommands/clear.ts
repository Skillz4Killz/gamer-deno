import { createSubcommand } from "../../../../utils/helpers.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { modlogsDatabase } from "../../../../database/schemas/modlogs.ts";
import { botCache } from "../../../../../mod.ts";
import { Member } from "../../../../../deps.ts";

createSubcommand("modlog", {
  name: "clear",
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.MODERATOR],
  arguments: [
    { name: "member", type: "member", required: false },
    { name: "userID", type: "snowflake", required: false },
  ],
  guildOnly: true,
  execute: async (message, args: ModlogClearArgs) => {
    modlogsDatabase.deleteMany(
      { guildID: message.guildID, userID: args.userID },
    );

    botCache.helpers.reactSuccess(message);
  },
});

interface ModlogClearArgs {
  member?: Member;
  userID?: string;
}
