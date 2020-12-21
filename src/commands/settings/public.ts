import { botID, higherRolePosition, highestRole } from "../../../deps.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createSubcommand } from "../../utils/helpers.ts";
import { db } from "../../database/database.ts";
import { botCache } from "../../../deps.ts";

createSubcommand("settings", {
  name: "public",
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  arguments: [
    {
      name: "type",
      type: "string",
      literals: ["add", "a", "remove", "r"],
      lowercase: true,
    },
    { name: "roles", type: "...roles" },
  ] as const,
  execute: async function (message, args) {
    const botsHighestRole = await highestRole(message.guildID, botID);
    if (!botsHighestRole) return;

    const settings = await db.guilds.get(message.guildID);

    const roleIDs = new Set(settings?.publicRoleIDs);
    let changes = false;

    for (const role of args.roles) {
      if (["add", "a"].includes(args.type)) {
        if (
          higherRolePosition(message.guildID, botsHighestRole.id, role.id)
        ) {
          continue;
        }
        if (settings?.publicRoleIDs?.includes(role.id)) continue;

        roleIDs.add(role.id);
        changes = true;
        continue;
      }

      if (!settings?.publicRoleIDs?.includes(role.id)) continue;

      roleIDs.delete(role.id);
      changes = true;
    }

    if (!changes) return botCache.helpers.reactError(message);

    db.guilds.update(message.guildID, { publicRoleIDs: [...roleIDs.values()] });
    botCache.helpers.reactSuccess(message);
  },
});
