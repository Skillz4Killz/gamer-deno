import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { Embed } from "../../../utils/Embed.ts";
import { createSubcommand } from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";

createSubcommand("settings", {
  name: "staff",
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.SERVER_OWNER],
  arguments: [{ name: "subcommand", type: "subcommand", required: false }],
  execute: async function (message) {
    const settings = await db.guilds.get(message.guildID);
    if (!settings) return botCache.helpers.reactError(message);

    const embed = new Embed().setDescription(
      [
        translate(message.guildID, "strings:ADMIN_ROLE", {
          roles: `<@&${settings.adminRoleID}>`,
        }),
        "",
        translate(message.guildID, "strings:MOD_ROLES", {
          roles: settings.modRoleIDs.map((id) => `<@&${id}>`).join(" "),
        }),
      ].join("\n")
    );

    return message.send({ embed });
  },
});
