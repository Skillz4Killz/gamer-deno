import { Role } from "../../../../../deps.ts";
import { botCache } from "../../../../../mod.ts";
import { createSubcommand, sendResponse } from "../../../../utils/helpers.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { surveysDatabase } from "../../../../database/schemas/surveys.ts";

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
  ],
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  vipServerOnly: true,
  guildOnly: true,
  execute: async function (message, args: SurveysEditRolesArgs) {
    const survey = await surveysDatabase.findOne(
      { guildID: message.guildID, name: args.name },
    );
    if (!survey) return botCache.helpers.reactError(message);

    const newRoleIDs = new Set<string>([
      ...survey.allowedRoleIDs.filter((id) =>
        !args.roles.find((r) => r.id === id)
      ),
      ...args.roles.filter((r) => !survey.allowedRoleIDs.includes(r.id)).map(
        (r) => r.id,
      ),
    ]);

    // Survey found, edit now
    surveysDatabase.updateOne({
      guildID: message.guildID,
      name: args.name,
    }, {
      $set: {
        allowedRoleIDs: [...newRoleIDs.values()],
      },
    });

    botCache.helpers.reactSuccess(message);
  },
});

interface SurveysEditRolesArgs {
  name: string;
  roles: Role[];
}
