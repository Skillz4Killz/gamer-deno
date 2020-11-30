// import { PermissionLevels } from "../../../types/commands.ts";
// import { createCommand } from "../../../utils/helpers.ts";

// createCommand({
//     name: "xp",
//     permissionLevels: [PermissionLevels.ADMIN],
//     guildOnly: true,
//     arguments: [
//         { name: "type", type: "string", literals: ["add", "remove"] },
//         { name: "amount", type: "number", minimum: 1 },
//         { name: "member", type: "member" }
//     ],
//     execute: function (message, args) {

// }
// })

// function addLocalXP(member: Member, xpAmountToAdd = 1, overrideCooldown = false) {
//         // If the member is in cooldown cancel out
//         if (!overrideCooldown && checkCooldown(member)) return

//         const memberSettings = await upsertMember(member.id, member.guild.id)
//         const userSettings = await this.Gamer.database.models.user.findOne({ userID: member.id })

//         let multiplier = 1
//         if (userSettings) {
//           for (const boost of userSettings.boosts) {
//             if (!boost.active || !boost.activatedAt) continue
//             if (boost.timestamp && boost.activatedAt + boost.timestamp < Date.now()) continue
//             multiplier += boost.multiplier
//           }
//         }

//         const memberLevel =
//           constants.levels.find(lvl => lvl.xpNeeded > (memberSettings.leveling.xp || 0)) || constants.levels[0]!

//         const totalXP = xpAmountToAdd * multiplier + memberSettings.leveling.xp
//         const newLevel = constants.levels.find(level => level.xpNeeded > totalXP)

//         // User did not level up
//         if (memberLevel.xpNeeded > totalXP || !newLevel) {
//           Gamer.database.models.member
//             .findOneAndUpdate(
//               { memberID: member.id, guildID: member.guild.id },
//               {
//                 leveling: { ...memberSettings.leveling, xp: totalXP > 0 ? totalXP : 0, lastUpdatedAt: Date.now() }
//               }
//             )
//             .exec()
//           return
//         }

//         // Add one level and set the XP to whatever is left
//         Gamer.database.models.member
//           .findOneAndUpdate(
//             { memberID: member.id, guildID: member.guild.id },
//             {
//               leveling: {
//                 ...memberSettings.leveling,
//                 xp: totalXP > 0 ? totalXP : 0,
//                 lastUpdatedAt: Date.now(),
//                 level: newLevel.level
//               }
//             }
//           )
//           .exec()
//         // Fetch all custom guild levels data
//         const levelData = await this.Gamer.database.models.level.findOne({
//           guildID: member.guild.id,
//           level: newLevel.level
//         })
//         // If it has roles to give then give them to the user
//         if (!levelData || !levelData.roleIDs.length) return

//         const bot = await this.Gamer.helpers.discord.fetchMember(member.guild, this.Gamer.user.id)
//         if (!bot) return

//         // Check if the bots role is high enough to manage the role
//         const botsHighestRole = highestRole(bot)
//         const language = this.Gamer.getLanguage(member.guild.id)
//         const REASON = language('leveling/xp:ROLE_ADD_REASON')

//         for (const roleID of levelData.roleIDs) {
//           const role = member.guild.roles.get(roleID)
//           // If the role is too high for the bot to manage skip
//           if (!role || botsHighestRole.position <= role.position) continue
//           addRoleToMember(member, roleID, REASON)
//           this.Gamer.amplitude.push({
//             authorID: member.id,
//             guildID: member.guild.id,
//             timestamp: Date.now(),
//             memberID: member.id,
//             type: 'ROLE_ADDED'
//           })
//         }
// }
