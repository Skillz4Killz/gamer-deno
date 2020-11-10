import { Channel, Role } from "../../../../deps.ts";
import { createSubcommand } from "../../../utils/helpers.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { botCache } from "../../../../cache.ts";
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
  ],
  guildOnly: true,
  vipServerOnly: true,
  execute: async (message, args: RoleMessageCreateArgs, guild) => {
    const roleAdded = ["add"].includes(args.type);
    const roleMessage = await db.rolemessages.get(args.role.id);

    db.rolemessages.update(args.role.id, {
      type: roleAdded,
      channelID: args.channel.id,
      roleAddedText: roleAdded ? args.text : roleMessage?.roleAddedText || "",
      roleRemovedText: roleAdded
        ? roleMessage?.roleRemovedText || ""
        : args.text,
      guildID: message.guildID,
    });
    botCache.helpers.reactSuccess(message);
  },
});

interface RoleMessageCreateArgs {
  type: "add" | "remove";
  channel: Channel;
  role: Role;
  text: string;
}
