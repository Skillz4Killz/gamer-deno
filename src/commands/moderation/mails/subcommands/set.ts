import { editChannel } from "../../../../../deps.ts";
import { botCache } from "../../../../../mod.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { db } from "../../../../database/database.ts";

createSubcommand("labels", {
  name: "set",
  arguments: [{ name: "name`", type: "string", lowercase: true }],
  cooldown: {
    seconds: 5,
    allowedUses: 2,
  },
  guildOnly: true,
  vipServerOnly: true,
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  botServerPermissions: ["MANAGE_CHANNELS"],
  execute: async (message, args: LabelsDeleteArgs) => {
    const labelToSet = await db.labels.findOne({
      name: args.name,
      guildID: message.guildID,
    });
    if (!labelToSet) return botCache.helpers.reactError(message);

    const mail = await db.mails.get(message.channelID);
    if (!mail) return botCache.helpers.reactError(message);

    return editChannel(message.channelID, { parentID: labelToSet.categoryID });
  },
});

interface LabelsDeleteArgs {
  name: string;
}
