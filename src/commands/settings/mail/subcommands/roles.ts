import { botCache } from "../../../../../deps.ts";
import { db } from "../../../../database/database.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";

createSubcommand("settings-mails", {
  name: "roles",
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  arguments: [
    {
      name: "type",
      "type": "string",
      literals: ["add", "remove"],
      defaultValue: "add",
    },
    { name: "roles", type: "...roles" },
  ] as const,
  execute: async (message, args) => {
    const settings = await botCache.helpers.upsertGuild(message.guildID);

    const roleIDs = new Set<string>(
      args.type === "add"
        ? settings?.mailsRoleIDs || []
        : settings?.mailsRoleIDs.filter((id) =>
          !args.roles.find((r) => r.id === id)
        ),
    );

    await db.guilds.update(message.guildID, {
      mailsRoleIDs: [...roleIDs.values()],
    });

    await botCache.helpers.reactSuccess(message);
  },
});
