import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { Embed } from "../../../utils/Embed.ts";
import { createSubcommand, sendEmbed } from "../../../utils/helpers.ts";

createSubcommand('settings', {
    name: 'staff',
    permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.SERVER_OWNER],
    arguments: [
        { name: "subcommand", type: "subcommand", required: false }
    ],
    execute: async function (message, args, guild) {
        const settings = await db.guilds.get(message.guildID);
        if (!settings) return botCache.helpers.reactError(message);

        const embed = new Embed()
            .setDescription([
                `Admin Role: ${settings.adminRoleID ? `<@&${settings.adminRoleID}>` : ""}`,
                '',
                `Mod Roles: ${settings.modRoleIDs.map(id => `<@&${id}>`).join(' ')}`
            ].join('\n'))

        sendEmbed(message.channelID, embed);
    }
})