// import { botCache, Member } from "../../deps.ts";
// import { db } from "../database/database.ts";

// // Holds the guildID.memberID for those that are in cooldown per server
// const memberCooldowns = new Map<string, number>()
// // Holds the userID for those that are in cooldown in global xp system
// const userCooldowns = new Map<string, number>()

// function checkCooldown(guildID: string, memberID: string, isGlobal = false) {
//     const now = Date.now()
//     if (isGlobal) {
//       // If the user is on cooldown return true
//       const userCooldown = userCooldowns.get(memberID)
//       if (userCooldown && now - userCooldown < 60000) return true
//       // If the member is not on cooldown we need to add them or is older than 1 minute
//       userCooldowns.set(memberID, now)
//       // Return false because user is not on cooldown
//       return false
//     }

//     // This is for a SERVER XP system

//     // Since the member id are not unique per guild we add guild id to make it unique
//     const uniqueMemberID = `${guildID}.${memberID}`
//     // If the member is on cooldown return true
//     const memberCooldown = memberCooldowns.get(uniqueMemberID)
//     if (memberCooldown && now - memberCooldown < 60000) return true
//     // If the member is not on cooldown we need to add them
//     memberCooldowns.set(uniqueMemberID, now)
//     return false
//   }

// // The override cooldown is useful for XP command when you want to force add XP like daily command
// botCache.helpers.addLocalXP = async function (guildID: string, memberID: string, xpAmountToAdd = 1, overrideCooldown = false) {
//     // If the member is in cooldown cancel out
//     if (!overrideCooldown && checkCooldown(guildID, memberID)) return

//     const settings = await db.users.get(memberID)

//     let multiplier = 1
//     // if (userSettings) {
//     //   for (const boost of userSettings.boosts) {
//     //     if (!boost.active || !boost.activatedAt) continue
//     //     if (boost.timestamp && boost.activatedAt + boost.timestamp < Date.now()) continue
//     //     multiplier += boost.multiplier
//     //   }
//     // }

//     const localXP = settings?.localXPs?.find(s => s.guildID === guildID);

//     const memberLevel =
//       botCache.constants.levels.find(lvl => lvl.xpNeeded > (localXP?.xp || 0)) || botCache.constants.levels.get(0)!;

//     const totalXP = xpAmountToAdd * multiplier + (localXP?.xp || 0);
//     const newLevel = constants.levels.find(level => level.xpNeeded > totalXP)

//     // User did not level up
//     if (memberLevel.xpNeeded > totalXP || !newLevel) {
//       Gamer.database.models.member
//         .findOneAndUpdate(
//           { memberID: member.id, guildID: member.guild.id },
//           {
//             leveling: { ...memberSettings.leveling, xp: totalXP > 0 ? totalXP : 0, lastUpdatedAt: Date.now() }
//           }
//         )
//         .exec()
//       return
//     }

//     // Add one level and set the XP to whatever is left
//     Gamer.database.models.member
//       .findOneAndUpdate(
//         { memberID: member.id, guildID: member.guild.id },
//         {
//           leveling: {
//             ...memberSettings.leveling,
//             xp: totalXP > 0 ? totalXP : 0,
//             lastUpdatedAt: Date.now(),
//             level: newLevel.level
//           }
//         }
//       )
//       .exec()
//     // Fetch all custom guild levels data
//     const levelData = await Gamer.database.models.level.findOne({
//       guildID: member.guild.id,
//       level: newLevel.level
//     })
//     // If it has roles to give then give them to the user
//     if (!levelData || !levelData.roleIDs.length) return

//     const bot = await Gamer.helpers.discord.fetchMember(member.guild, Gamer.user.id)
//     if (!bot) return

//     // Check if the bots role is high enough to manage the role
//     const botsHighestRole = highestRole(bot)
//     const language = Gamer.getLanguage(member.guild.id)
//     const REASON = language('leveling/xp:ROLE_ADD_REASON')

//     for (const roleID of levelData.roleIDs) {
//       const role = member.guild.roles.get(roleID)
//       // If the role is too high for the bot to manage skip
//       if (!role || botsHighestRole.position <= role.position) continue
//       addRoleToMember(member, roleID, REASON)
//       Gamer.amplitude.push({
//         authorID: member.id,
//         guildID: member.guild.id,
//         timestamp: Date.now(),
//         memberID: member.id,
//         type: 'ROLE_ADDED'
//       })
//     }
//   }

//   botCache.helpers.addGlobalXP = async function (member: Member, xpAmountToAdd = 1, overrideCooldown = false) {
//     if (!overrideCooldown && checkCooldown(member, true)) return

//     const userSettings = await upsertUser(member.id, [member.guild.id])
//     let multiplier = 1

//     for (const boost of userSettings.boosts) {
//       if (!boost.active || !boost.activatedAt) continue
//       if (boost.timestamp && boost.activatedAt + boost.timestamp < Date.now()) continue
//       multiplier += boost.multiplier
//     }

//     const totalXP = xpAmountToAdd * multiplier + userSettings.xp

//     const globalLevelDetails = constants.levels.find(lev => lev.xpNeeded > (userSettings?.xp || 0))
//     // Get the details on the users next level
//     const nextLevelInfo = constants.levels.find(lvl => lvl.level === (globalLevelDetails?.level || 0) + 1)
//     // User did not level up
//     if (nextLevelInfo && nextLevelInfo.xpNeeded > totalXP)
//       Gamer.database.models.user.findOneAndUpdate({ userID: member.id }, { xp: totalXP }).exec()

//     return
//   }

//   botCache.helpers.removeXP = async (member: Member, xpAmountToRemove = 1) {
//     if (xpAmountToRemove < 1) return

//     const settings = await Gamer.database.models.member.findOne({ memberID: member.id, guildID: member.guild.id })
//     if (!settings) return

//     // If the XP is less than 0 after removing then set it to 0
//     const difference = settings.leveling.xp - xpAmountToRemove
//     // Find the new level based on the remaining XP
//     const newLevel = constants.levels.find(level => level.xpNeeded > settings.leveling.xp)
//     if (!newLevel || newLevel.level === settings.leveling.level) {
//       Gamer.database.models.member
//         .findOneAndUpdate(
//           { memberID: member.id, guildID: member.guild.id },
//           {
//             leveling: { ...settings.leveling, xp: difference > 0 ? difference : 0 }
//           }
//         )
//         .exec()
//       return
//     }

//     Gamer.database.models.member
//       .findOneAndUpdate(
//         { memberID: member.id, guildID: member.guild.id },
//         {
//           leveling: { ...settings.leveling, xp: difference > 0 ? difference : 0, level: newLevel.level }
//         }
//       )
//       .exec()

//     // Need to check if roles need to be updated now for level rewards
//     const oldLevel = constants.levels.find(level => level.level === settings.leveling.level)
//     const bot = await Gamer.helpers.discord.fetchMember(member.guild, Gamer.user.id)
//     if (!oldLevel || !bot?.permissions.has('manageRoles')) return

//     // Fetch all custom guild levels data
//     const levelData = await Gamer.database.models.level.findOne({
//       guildID: member.guild.id,
//       level: oldLevel.level
//     })

//     // If it has roles to give then give them to the user
//     if (!levelData || !levelData.roleIDs.length) return

//     // Check if the bots role is high enough to manage the role
//     const botsHighestRole = highestRole(bot)

//     const language = Gamer.getLanguage(member.guild.id)

//     const REASON = language('leveling/xp:ROLE_REMOVE_REASON')

//     for (const roleID of levelData.roleIDs) {
//       const role = member.guild.roles.get(roleID)
//       // If the role is too high for the bot to manage skip
//       if (!role || botsHighestRole.position <= role.position) continue

//       removeRoleFromMember(member, roleID, REASON)
//       Gamer.amplitude.push({
//         authorID: member.id,
//         guildID: member.guild.id,
//         timestamp: Date.now(),
//         memberID: member.id,
//         type: 'ROLE_REMOVED'
//       })
//     }
//   }

//   botCache.helpers.completeMission = function (member: Member, commandName: string, guildID: string) {
//     // If this guild has disabled missions turn this off.
//     const guildSettings = await Gamer.database.models.guild.findOne({ guildID: member.guild.id })
//     if (guildSettings?.xp.disableMissions) return

//     const upvoted = await Gamer.database.models.upvote.findOne({
//       userID: member.id,
//       timestamp: { $gt: Date.now() - milliseconds.HOUR * 12 }
//     })
//     // Check if this is a daily mission from today
//     const mission = Gamer.missions.find((m, index) => {
//       if (index > 2 && !upvoted) return
//       return m.commandName === commandName
//     })
//     if (!mission) return

//     // Find the data for this user regarding this mission or make it for them
//     const missionData = await Gamer.database.models.mission.findOne({
//       userID: member.id,
//       commandName: commandName
//     })

//     // If there was no data create it
//     if (!missionData) {
//       await Gamer.database.models.mission.create({
//         userID: member.id,
//         commandName,
//         guildID,
//         amount: 1,
//         completed: mission.amount === 1
//       })

//       if (mission.amount === 1) {
//         // The mission should be completed now so need to give XP.
//         addLocalXP(member, mission.reward, true)
//         addGlobalXP(member, mission.reward, true)
//       }

//       // Return void to prevent collectors from breaking
//       return
//     }

//     // If the user already got the rewards for this mission
//     if (missionData.completed) return

//     missionData.amount += 1
//     if (missionData.amount === mission.amount) missionData.completed = true

//     missionData.save()

//     // The mission should be completed now so need to give XP.
//     addLocalXP(member, mission.reward, true)
//     addGlobalXP(member, mission.reward, true)
//   }

//   botCache.helpers.processInactiveXPRemoval = function () {
//     // Fetch all guilds from db as anything with default settings wont need to be checked
//     const allGuildSettings = await Gamer.database.models.guild.find({ 'xp.inactiveDaysAllowed': { $gt: 0 } })

//     for (const guildSettings of allGuildSettings) {
//       const guild = Gamer.guilds.get(guildSettings.guildID)
//       if (!guild) continue

//       // Get all members from the database as anyone with default settings dont need to be checked
//       const allMemberSettings = await Gamer.database.models.member.find({ guildID: guild.id })

//       allMemberSettings.forEach(botCache.helpers.memberSettings => {
//         // If they have never been updated skip. Or if their XP is below 100 the minimum threshold
//         if (!memberSettings.leveling.lastUpdatedAt || memberSettings.leveling.xp < 100) return

//         // Calculate how many days it has been since this user was last updated
//         const daysSinceLastUpdated = (Date.now() - memberSettings.leveling.lastUpdatedAt) / milliseconds.DAY
//         if (daysSinceLastUpdated < guildSettings.xp.inactiveDaysAllowed) return

//         // Get the member object
//         const member = await Gamer.helpers.discord.fetchMember(guild, memberSettings.memberID)
//         if (!member) return

//         // Remove 1% of XP from the user for being inactive today.
//         removeXP(
//           member,
//           Math.floor(memberSettings.leveling.xp * ((guildSettings.xp.inactivePercentage || 1) / 1000))
//         )
//       })
//     }
//   }

//   botCache.helpers.processXP = function (message: Message) {
//     // If a bot or in dm, no XP we want to encourage activity in servers not dms
//     if (message.author.bot || !message.member) return

//     const guildXP = Gamer.guildsXPPerMessage.get(message.member.guild.id)
//     // Update XP for the member locally
//     Gamer.helpers.levels.addLocalXP(message.member, guildXP || 1)
//     // Update XP for the user globally
//     Gamer.helpers.levels.addGlobalXP(message.member, 1)
//   }
