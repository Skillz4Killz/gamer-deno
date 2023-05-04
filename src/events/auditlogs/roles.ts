import { AuditLogEntry } from "@discordeno/bot";

export async function handleMemberRoleUpdate(payload: AuditLogEntry, _guildId: bigint) {
    console.log("users role changed", payload);
    if (!payload.changes) return;

    // VIP ONLY FEATURES BELOW THIS
    // TODO: vip - Require vip usage

    for (const change of payload.changes) {
        if (change.key === "$remove") {
            // for (const value of change.new) {
            //     if (!value.id) continue;

            //     const roleMessage = await prisma.roleMessages.findUnique({ where: { roleId_roleAdded: { roleId: value.id, roleAdded: false } } });
            //     if (!roleMessage?.roleRemovedText) continue;

            //     // NORMAL TEXT MESSAGE
            //     if (!roleMessage.roleRemovedText.startsWith("{"))
            //         await Gamer.discord.helpers.sendMessage(roleMessage.channelId, {
            //             content: `<@${payload.userId}> ${roleMessage.roleRemovedText}`,
            //         });
            //     // EMBED MESSAGE
            //     else {
            //         try {
            //             const json = JSON.parse(roleMessage.roleRemovedText);

            //             await Gamer.discord.helpers.sendMessage(roleMessage.channelId, {
            //                 content: `<@${payload.userId}>`,
            //                 embeds: [json],
            //             });
            //         } catch {
            //             await Gamer.discord.helpers.sendMessage(roleMessage.channelId, {
            //                 content: `<@${payload.userId}> ${roleMessage.roleRemovedText}`,
            //             });
            //         }
            //     }
            // }

            // const defaultRoleSets = await db.roleSets.default.getAll({ guildId: member.guildId });
            // if (!defaultRoleSets?.length) return;

            // const finalRoleIds = new Set(member.roles);

            // for (const set of defaultRoleSets) {
            //     // MEMBER HAS ATLEAST ONE ROLE IN THIS SET SO NO NEED TO DO ANYTHING
            //     if (set.roleIds.some((id) => member.roles.includes(id))) continue;
            //     // MEMBER HAS NONE OF THE ROLES IN THIS SET SO ASSIGN THE DEFAULT ROLE
            //     await bot.helpers.addRole(member.guildId, payload.userId, set.roleId);
            // }

            return;
        }

        if (change.key === "$add") {
            // for (const value of change.new) {
            //     if (!value.id) continue;
            //     const [uniqueSets, groupedSet, requiredSet, defaultSets, roleMessage] = await Promise.all([
            //         prisma.uniqueRolesets.findMany({ where: { guildId: "", roleIds: { has: value.id } } }),
            //         prisma.groupedRoleSets.findMany({ where: { mainRoleId: value.id } }),
            //         prisma.requiredRoleSets.findMany({ where: { requiredRoleId: value.id } }),
            //         prisma.defaultRoleSets.findMany({ where: { guildId: guildId.toString() } }),
            //         prisma.roleMessages.findUnique({ where: { roleId_roleAdded: { roleId: value.id, roleAdded: true } } }),
            //     ]);
            //     if (uniqueSets) {
            //         // ADD ALL ROLES TO A NEW SET TO ENSURE ONLY HAVING THEM ONLY ONCE TO PREVENT OVERHEAD
            //         const roleIds = uniqueSets.reduce((acc, set) => {
            //             set.roleIds.forEach(acc.add, acc);
            //             return acc;
            //         }, new Set<string>());
            //         for (const roleId of roleIds) {
            //             // DON'T REMOVE NEWLY GAINED ROLE
            //             if (roleId === value.id) continue;
            //             if (payload.userId) await Gamer.discord.helpers.removeRole(guildId, payload.userId, roleId, `Unique Roleset!`);
            //         }
            //     }
            //     let requirementsMet = true;
            //     if (requiredSet) {
            //         for (const set of requiredSet) {
            //             // USER'S NEW ROLE IS IN ROLESET & A REQUIRED ROLE IS MISSING
            //             if (!set.roleIds.every((id) => value.roles.includes(id))) {
            //                 requirementsMet = false;
            //                 // REMOVE THE NEWLY GAINED ROLE
            //                 await Gamer.discord.helpers.removeRole(member.guildId, payload.userId, set.roleId, `Required Roleset!`);
            //             }
            //         }
            //     }
            //     if (requirementsMet && groupedSet) {
            //         for (const roleId of groupedSet.roleIds) {
            //             if (member.roles.includes(roleId)) continue;
            //             await bot.helpers.addRole(member.guildId, payload.userId, roleId, `Grouped Roleset!`);
            //         }
            //     }
            //     if (defaultSets) {
            //         for (const set of defaultSets) {
            //             // MEMBER HAS ATLEAST ONE ROLE IN THIS SET SO NO NEED TO DO ANYTHING
            //             if (set.roleIds.some((id) => member.roles.includes(id))) continue;
            //             await bot.helpers.addRole(member.guildId, payload.userId, set.roleId, `Default Roleset!`);
            //         }
            //     }
            //     if (!roleMessage?.roleAddedText) continue;
            //     // NORMAL TEXT MESSAGE
            //     if (!roleMessage.roleAddedText.startsWith("{"))
            //         await Gamer.discord.helpers.sendMessage(roleMessage.channelId, {
            //             content: `<@${payload.userId}> ${roleMessage.roleAddedText}`,
            //         });
            //     // EMBED MESSAGE
            //     else {
            //         try {
            //             const json = JSON.parse(roleMessage.roleAddedText);
            //             await Gamer.discord.helpers.sendMessage(roleMessage.channelId, {
            //                 content: `<@${payload.userId}>`,
            //                 embeds: [json],
            //             });
            //         } catch {
            //             await Gamer.discord.helpers.sendMessage(roleMessage.channelId, {
            //                 content: `<@${payload.userId}> ${roleMessage.roleAddedText}`,
            //             });
            //         }
            //     }
            // }
        }
    }
}
