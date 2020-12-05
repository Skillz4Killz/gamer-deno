import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand('giveaway', {
    name: "block",
    aliases: ["b"],
    permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.MODERATOR],
    vipServerOnly: true,
    arguments: [
        { name: "giveawayID", type: "snowflake" },
        { name: "member", type: "member" },
    ] as const,
    execute: async function (message, args) {
        const giveaway = await db.giveaways.get(args.giveawayID);
        if (!giveaway) return botCache.helpers.reactError(message);

        db.giveaways.update(args.giveawayID, { blockedUserIDs: [...(giveaway.blockedUserIDs || []), args.member.id] });
        botCache.helpers.reactSuccess(message);
    }
})