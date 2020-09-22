import type { Role } from "../../../../../deps.ts";
import { botCache } from "../../../../../mod.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";
import type { guildsDatabase } from "../../../../database/schemas/guilds.ts";

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
  ],
  execute: async (message, args: SettingsMailsRolesArgs) => {
    const settings = await botCache.helpers.upsertGuild(message.guildID);

    const roleIDs = new Set<string>(
      args.type === "add"
        ? settings?.mailsRoleIDs || []
        : settings?.mailsRoleIDs.filter((id) =>
          !args.roles.find((r) => r.id === id)
        ),
    );

    guildsDatabase.updateOne({ guildID: message.guildID }, {
      $set: { mailsRoleIDs: [...roleIDs.values()] },
    });

    botCache.helpers.reactSuccess(message);
  },
});

interface SettingsMailsRolesArgs {
  type: "add" | "remove";
  roles: Role[];
}
