import { createSubcommand } from "../../../utils/helpers.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";

createSubcommand("roles-messages", {
  name: "create",
  aliases: ["c"],
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "type", type: "string", literals: ["add", "remove"] },
    { name: "role", type: "role" },
    { name: "channel", type: "guildtextchannel" },
    { name: "text", type: "...string" },
  ] as const,
  guildOnly: true,
  vipServerOnly: true,
  execute: async (message, args) => {
    const roleAdded = ["add"].includes(args.type);
    const roleMessage = await db.rolemessages.get(args.role.id);

    await db.rolemessages.update(args.role.id, {
      channelID: args.channel.id,
      roleAddedText: roleAdded ? args.text : roleMessage?.roleAddedText || "",
      roleRemovedText: roleAdded
        ? roleMessage?.roleRemovedText || ""
        : args.text,
      guildID: message.guildID,
    });
    await botCache.helpers.reactSuccess(message);
  },
});
