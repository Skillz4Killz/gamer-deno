import { botCache } from "../../../../../deps.ts";
import { db } from "../../../../database/database.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { createCommand } from "../../../../utils/helpers.ts";

createCommand({
    name: "message",
    permissionLevels: [PermissionLevels.ADMIN],
    guildOnly: true,
    arguments: [
        { name: "text", type: "string" },
    ] as const,
    execute: function (message, args) {
        try {
            // Validate the json
            JSON.parse(args.text);
            db.welcome.update(message.guildID, { text: args.text });
            botCache.helpers.reactSuccess(message);
        } catch {
            botCache.helpers.reactError(message);
        }
    }
})