import { addRole, botCache, botHasPermission, botID, higherRolePosition, highestRole, removeRole } from "../../deps.ts";
import { db } from "../database/database.ts";
import { translate } from "../utils/i18next.ts";

// Holds the guildID.memberID for those that are in cooldown per server
const memberCooldowns = new Map<string, number>();
// Holds the userID for those that are in cooldown in global xp system
const userCooldowns = new Map<string, number>();

function checkCooldown(memberID: string, guildID?: string) {
  const now = Date.now();
  if (!guildID) {
    // If the user is on cooldown return true
    const userCooldown = userCooldowns.get(memberID);
    if (userCooldown && now - userCooldown < 60000) return true;
    // If the member is not on cooldown we need to add them or is older than 1 minute
    userCooldowns.set(memberID, now);
    // Return false because user is not on cooldown
    return false;
  }

  // This is for a SERVER XP system

  // Since the member id are not unique per guild we add guild id to make it unique
  const uniqueMemberID = `${guildID}.${memberID}`;
  // If the member is on cooldown return true
  const memberCooldown = memberCooldowns.get(uniqueMemberID);
  if (memberCooldown && now - memberCooldown < 60000) return true;
  // If the member is not on cooldown we need to add them
  memberCooldowns.set(uniqueMemberID, now);
  return false;
}

// The override cooldown is useful for XP command when you want to force add XP like daily command
botCache.helpers.addLocalXP = async function (guildID, memberID, xpAmountToAdd = 1, overrideCooldown = false) {
  // If the member is in cooldown cancel out
  if (!overrideCooldown && checkCooldown(memberID, guildID)) return;

  const settings = await db.xp.get(`${guildID}-${memberID}`);

  let multiplier = 1;

  const memberLevel =
    botCache.constants.levels.find((lvl) => lvl.xpNeeded > (settings?.xp || 0)) || botCache.constants.levels.get(0)!;

  const totalXP = xpAmountToAdd * multiplier + (settings?.xp || 0);
  const newLevel = botCache.constants.levels.find((level) => level.xpNeeded > totalXP);

  // User did not level up
  await db.xp.update(`${guildID}-${memberID}`, {
    xp: totalXP,
    lastUpdatedAt: Date.now(),
    guildID,
    memberID,
  });
  if (memberLevel.xpNeeded > totalXP || !newLevel) return;

  // Fetch all custom guild levels data
  const levelData = await db.levels.get(`${guildID}-${newLevel.id}`);
  // If it has roles to give then give them to the user
  if (!levelData?.roleIDs.length) return;

  // Check if the bots role is high enough to manage the role
  const botsHighestRole = await highestRole(guildID, botID);
  if (!botsHighestRole) return;

  const REASON = translate(guildID, "strings:LEVEL_ROLE_ADDED");

  for (const roleID of levelData.roleIDs) {
    // If the role is too high for the bot to manage skip
    if (!(await higherRolePosition(guildID, botsHighestRole.id, roleID))) {
      continue;
    }

    await addRole(guildID, memberID, roleID, REASON).catch(console.log);
  }
};

botCache.helpers.addGlobalXP = async function (memberID, xpAmountToAdd = 1, overrideCooldown = false) {
  if (!overrideCooldown && checkCooldown(memberID)) return;

  const settings = await db.users.get(memberID);

  await db.users.update(memberID, { xp: xpAmountToAdd + (settings?.xp || 0) });
};

botCache.helpers.removeXP = async function (guildID, memberID, xpAmountToRemove = 1) {
  if (xpAmountToRemove < 1) return;

  const settings = await db.xp.get(`${guildID}-${memberID}`);
  if (!settings) return;

  const currentXP = settings.xp || 0;
  const difference = currentXP - xpAmountToRemove;

  await db.xp.update(`${guildID}-${memberID}`, {
    xp: difference > 0 ? difference : 0,
    lastUpdatedAt: Date.now(),
    guildID,
    memberID,
  });

  // Find the old level based on the remaining XP
  const newLevel = botCache.constants.levels.find((level) => level.xpNeeded > currentXP);
  const oldLevel = botCache.constants.levels.find((level) => level.xpNeeded > settings.xp);
  if (!oldLevel || !newLevel || newLevel.id === oldLevel.id) return;

  if (!(await botHasPermission(guildID, ["MANAGE_ROLES"]))) return;

  // Fetch all custom guild levels data
  const levelData = await db.levels.get(`${guildID}-${oldLevel.id}`);
  if (!levelData?.roleIDs.length) return;

  // Fetch the new as well in case this role had a role to give
  const lowerlevelData = await db.levels.get(`${guildID}-${newLevel.id}`);

  // Check if the bots role is high enough to manage the role
  const botsHighestRole = await highestRole(guildID, botID);
  if (!botsHighestRole) return;

  const REASON = translate(guildID, "strings:LEVEL_ROLE_REMOVE_REASON");

  for (const roleID of levelData.roleIDs) {
    // If the role is too high for the bot to manage skip
    if (!(await higherRolePosition(guildID, botsHighestRole.id, roleID))) {
      continue;
    }
    removeRole(guildID, memberID, roleID, REASON).catch(console.log);
  }

  // If the level drops the loop above removes the roles and this adds the roles from the lower level they just got
  for (const roleID of lowerlevelData?.roleIDs || []) {
    // If the role is too high for the bot to manage skip
    if (!(await higherRolePosition(guildID, botsHighestRole.id, roleID))) {
      continue;
    }
    await addRole(guildID, memberID, roleID, REASON).catch(console.log);
  }
};

botCache.helpers.completeMission = async function (guildID, memberID, commandName) {
  // If this guild has disabled missions turn this off.
  if (botCache.missionsDisabledGuildIDs.has(guildID)) return;

  // Check if this is a daily mission from today
  const mission = botCache.missions.find((m, index) => {
    if (index > 2 && !botCache.activeMembersOnSupportServer.has(memberID)) {
      return;
    }
    return m.commandName === commandName;
  });
  if (!mission) return;

  // Find the data for this user regarding this mission or make it for them
  const missionData = await db.mission.get(`${memberID}-${commandName}`);

  // If there was no data create it
  if (!missionData) {
    await db.mission.update(`${memberID}-${commandName}`, {
      userID: memberID,
      commandName,
      amount: 1,
      completed: mission.amount === 1,
    });

    if (mission.amount === 1) {
      // The mission should be completed now so need to give XP.
      botCache.helpers.addLocalXP(guildID, memberID, mission.reward, true);
      botCache.helpers.addGlobalXP(memberID, mission.reward, true);
    }

    return;
  }

  // If the user already got the rewards for this mission
  if (missionData.completed) return;

  await db.mission.update(`${memberID}-${commandName}`, {
    amount: missionData.amount + 1,
    completed: missionData.amount + 1 === mission.amount,
  });
  if (missionData.amount + 1 === mission.amount) missionData.completed = true;

  // The mission should be completed now so need to give XP.
  botCache.helpers.addLocalXP(guildID, memberID, mission.reward, true);
  botCache.helpers.addGlobalXP(memberID, mission.reward, true);
};
