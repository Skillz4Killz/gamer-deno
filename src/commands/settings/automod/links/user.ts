import { botCache, Member } from "../../../../../deps.ts";
import { db } from "../../../../database/database.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";

createSubcommand("settings-automod-links", {
  name: "user",
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  arguments: [
    { name: "type", type: "string", literals: ["add", "remove"] },
    { name: "member", type: "member" },
  ],
  execute: async function (message, args: SettingsAutomodLinksUserArgs) {
    const settings = await db.guilds.get(message.guildID);
    const links = new Set(settings?.linksUserIDs);

    if (args.type === "add") {
      links.add(args.member.id);
    } else {
      links.delete(args.member.id);
    }

    db.guilds.update(
      message.guildID,
      { linksUserIDs: [...links.values()] },
    );
    botCache.helpers.reactSuccess(message);
  },
});

interface SettingsAutomodLinksUserArgs {
  type: "add" | "remove";
  member: Member;
}
