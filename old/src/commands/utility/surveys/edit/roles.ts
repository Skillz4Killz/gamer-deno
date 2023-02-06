import { botCache } from "../../../../../deps.ts";
import { db } from "../../../../database/database.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";

createSubcommand("surveys-edit", {
  name: "roles",
  arguments: [
    {
      name: "name",
      type: "string",
      lowercase: true,
    },
    {
      name: "roles",
      type: "...roles",
    },
  ] as const,
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  vipServerOnly: true,
  guildOnly: true,
  execute: async function (message, args) {
    const survey = await db.surveys.get(`${message.guildID}-${args.name}`);
    if (!survey) return botCache.helpers.reactError(message);

    const newRoleIDs = new Set<string>([
      ...survey.allowedRoleIDs.filter((id) => !args.roles.find((r) => r.id === id)),
      ...args.roles.filter((r) => !survey.allowedRoleIDs.includes(r.id)).map((r) => r.id),
    ]);

    // Survey found, edit now
    await db.surveys.update(`${message.guildID}-${args.name}`, {
      allowedRoleIDs: [...newRoleIDs.values()],
    });

    return botCache.helpers.reactSuccess(message);
  },
});
