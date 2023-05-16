import { GamerMessage } from "../../base/GamerMessage.js";
import { Command } from "../../base/typings.js";
import { prisma } from "../../prisma/client.js";

export async function isVip(message: GamerMessage, command: Command): Promise<boolean> {
    if (!command.vipOnly) return false;

    const vip = await prisma.vipGuilds.findUnique({ where: { guildId: message.guildId } });
    if (vip?.isVip) return false;

    const userVip = await prisma.vipUsers.findUnique({ where: { userId: message.author.id } });
    if (userVip?.isVip) return false;
    
    return true;
}