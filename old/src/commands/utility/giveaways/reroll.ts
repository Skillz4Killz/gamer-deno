import { db } from "../../../database/database.ts";
import { pickGiveawayWinners } from "../../../tasks/giveaways.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("giveaway", {
  name: "reroll",
  aliases: ["roll", "rr", "pick"],
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.MODERATOR],
  vipServerOnly: true,
  arguments: [
    { name: "giveawayID", type: "snowflake" },
    { name: "memberID", type: "snowflake" },
  ] as const,
  execute: async function (_message, args) {
    const giveaway = await db.giveaways.get(args.giveawayID);
    if (!giveaway) return;

    // Filter out the user
    await db.giveaways.update(args.giveawayID, {
      participants: giveaway.participants.filter((p) => p.memberID !== args.memberID),
      pickedParticipants: giveaway.pickedParticipants.filter((p) => p.memberID !== args.memberID),
    });

    // Process the giveaway
    pickGiveawayWinners(giveaway);
  },
});
