import { Command, PermissionLevels } from "../../base/typings.js";
import { prisma } from "../../prisma/client.js";

export const vip: Command = {
    name: "vip",
    aliases: [],
    arguments: [],
    requiredPermissionLevel: PermissionLevels.Admin,
    execute: async function (message) {
        // ONLY GUILDS CAN BE VIP
        if (!message.guildId) return;

        await message.reply(message.translate("VIP_SUCCESS"), { addReplay: false });

        // UPDATE TABLE
        return await Promise.all([
            prisma.vipGuilds.upsert({
                where: { guildId: message.guildId },
                create: {
                    guildId: message.guildId,
                    isVip: true,
                    userId: message.author.id,
                },
                update: {
                    isVip: true,
                    userId: message.author.id,
                },
            }),
            prisma.vipUsers.upsert({
                where: { userId: message.author.id },
                create: {
                    guildIds: [message.guildId],
                    isVip: true,
                    userId: message.author.id,
                },
                update: {
                    guildIds: { push: message.guildId },
                },
            }),
        ]);
    },
};
