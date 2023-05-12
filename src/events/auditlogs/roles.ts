import { AuditLogEntry } from "@discordeno/bot";
import { Gamer } from "../../bot.js";
import { prisma } from "../../prisma/client.js";

export async function handleMemberRoleUpdate(payload: AuditLogEntry, guildId: bigint) {
    if (!payload.changes || !payload.targetId) return;

    // VIP ONLY FEATURES BELOW THIS
    // TODO: vip - Require vip usage

    for (const change of payload.changes) {
        if (change.key === "$remove") {
            if (!Array.isArray(change.new)) continue;

            for (const value of change.new) {
                if (!value.id) continue;

                const roleMessage = await prisma.roleMessages.findUnique({
                    where: { roleId_roleAdded: { roleId: value.id.toString(), roleAdded: false } },
                });
                if (!roleMessage?.roleRemovedText) continue;

                // NORMAL TEXT MESSAGE
                if (!roleMessage.roleRemovedText.startsWith("{"))
                    await Gamer.discord.helpers.sendMessage(roleMessage.channelId, {
                        content: `<@${payload.targetId}> ${roleMessage.roleRemovedText}`,
                    });
                // EMBED MESSAGE
                else {
                    try {
                        const json = JSON.parse(roleMessage.roleRemovedText);

                        await Gamer.discord.helpers.sendMessage(roleMessage.channelId, {
                            content: `<@${payload.targetId}>`,
                            embeds: [json],
                        });
                    } catch {
                        await Gamer.discord.helpers.sendMessage(roleMessage.channelId, {
                            content: `<@${payload.targetId}> ${roleMessage.roleRemovedText}`,
                        });
                    }
                }
            }

            const defaultRoleSets = await prisma.defaultRoleSets.findMany({ where: { guildId: guildId.toString() } });
            if (!defaultRoleSets?.length) return;

            const member = await Gamer.discord.rest.getMember(guildId, payload.targetId);

            for (const set of defaultRoleSets) {
                // MEMBER HAS ATLEAST ONE ROLE IN THIS SET SO NO NEED TO DO ANYTHING
                if (set.roleIds.some((id) => member.roles.includes(id))) continue;
                // MEMBER HAS NONE OF THE ROLES IN THIS SET SO ASSIGN THE DEFAULT ROLE
                await Gamer.discord.helpers.addRole(guildId, payload.targetId, set.defaultRoleId);
            }

            return;
        }

        if (change.key === "$add") {
            if (!Array.isArray(change.new)) continue;
            
            for (const value of change.new) {
                if (!value.id) continue;
                
                const roleId = value.id.toString();

                const [member, uniqueSets, groupedSet, requiredSet, defaultSets, roleMessage] = await Promise.all([
                    Gamer.discord.rest.getMember(guildId, payload.targetId),
                    prisma.uniqueRolesets.findMany({ where: { guildId: guildId.toString(), roleIds: { has: roleId } } }),
                    prisma.groupedRoleSets.findMany({ where: { mainRoleId: roleId } }),
                    prisma.requiredRoleSets.findMany({ where: { requiredRoleId: roleId } }),
                    prisma.defaultRoleSets.findMany({ where: { guildId: guildId.toString() } }),
                    prisma.roleMessages.findUnique({ where: { roleId_roleAdded: { roleId, roleAdded: true } } }),
                ]);

                if (uniqueSets) {
                    // ADD ALL ROLES TO A NEW SET TO ENSURE ONLY HAVING THEM ONLY ONCE TO PREVENT OVERHEAD
                    const roleIds = uniqueSets.reduce((acc, set) => {
                        set.roleIds.forEach(acc.add, acc);
                        return acc;
                    }, new Set<string>());

                    for (const id of roleIds) {
                        // DON'T REMOVE NEWLY GAINED ROLE
                        if (id === roleId) continue;
                        if (payload.targetId) await Gamer.discord.helpers.removeRole(guildId, payload.targetId, id, `Unique Roleset!`);
                    }
                }
                let requirementsMet = true;
                if (requiredSet) {
                    for (const set of requiredSet) {
                        // USER'S NEW ROLE IS IN ROLESET & A REQUIRED ROLE IS MISSING
                        if (!set.roleIds.every((id) => member.roles.includes(id))) {
                            requirementsMet = false;
                            // REMOVE THE NEWLY GAINED ROLE
                            await Gamer.discord.helpers.removeRole(guildId, payload.targetId, value.id, `Required Roleset!`);
                        }
                    }
                }
                if (requirementsMet && groupedSet) {
                    for (const set of groupedSet) {
                        for (const id of set.roleIds) {
                            if (member.roles.includes(id)) continue;
                            await Gamer.discord.helpers.addRole(guildId, payload.targetId, id, `Grouped Roleset!`);
                        }
                    }
                }
                if (defaultSets) {
                    for (const set of defaultSets) {
                        // MEMBER HAS ATLEAST ONE ROLE IN THIS SET SO NO NEED TO DO ANYTHING
                        if (set.roleIds.some((id) => member.roles.includes(id))) continue;
                        await Gamer.discord.helpers.addRole(guildId, payload.targetId, set.defaultRoleId, `Default Roleset!`);
                    }
                }
                if (!roleMessage?.roleAddedText) continue;

                // NORMAL TEXT MESSAGE
                if (!roleMessage.roleAddedText.startsWith("{"))
                    await Gamer.discord.helpers.sendMessage(roleMessage.channelId, {
                        content: `<@${payload.targetId}> ${roleMessage.roleAddedText}`,
                    });
                // EMBED MESSAGE
                else {
                    try {
                        const json = JSON.parse(roleMessage.roleAddedText);
                        await Gamer.discord.helpers.sendMessage(roleMessage.channelId, {
                            content: `<@${payload.targetId}>`,
                            embeds: [json],
                        });
                    } catch {
                        await Gamer.discord.helpers.sendMessage(roleMessage.channelId, {
                            content: `<@${payload.targetId}> ${roleMessage.roleAddedText}`,
                        });
                    }
                }
            }
        }
    }
}
