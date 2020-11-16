import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("tags", {
  name: "public",
  aliases: ["p"],
  guildOnly: true,
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "tags", type: "...string", lowercase: true },
  ],
  execute: async function (message, args: TagPublicArgs) {
    await Promise.all(
      // For all tag names provided we mark tags as publis so they can be installed
      args.tags.split(" ").map(async (name) => {
        const tag = await db.tags.get(`${message.guildID}-${name}`);
        if (!tag) return;

        db.tags.update(tag.id, { isPublic: true });
      }),
    );

    botCache.helpers.reactSuccess(message);
  },
});

interface TagPublicArgs {
  tags: string;
}
