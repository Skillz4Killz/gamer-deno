import {
  botCache,
  botHasPermission,
  editMember,
  Guild,
  guildIconURL,
  Member,
} from "../../deps.ts";
import { db } from "../database/database.ts";
import { Embed } from "../utils/Embed.ts";
import { sendEmbed } from "../utils/helpers.ts";
import { translate } from "../utils/i18next.ts";

botCache.eventHandlers.roleLost = async function (guild, member, roleID) {
  // VIP ONLY STUFF
  if (!botCache.vipGuildIDs.has(guild.id)) return;
  if (!botCache.fullyReady) return;

  handleServerLog(guild, member, roleID, "removed").catch(console.log);
  // handleRoleMessages(guild, member, roleID, "removed").catch(console.log);

  // EVERYTHING BELOW REQUIRES MANAGING ROLES PERM
  if (!(await botHasPermission(guild.id, ["MANAGE_ROLES"]))) return;

  const defaultSets = await db.defaultrolesets.findMany({ guildID: guild.id }, true);

  const memberRoles = member.guilds.get(guild.id)?.roles ?? [];
  const roleIDs = new Set(memberRoles);

  for (const set of defaultSets) {
    // The member has atleast 1 of the necessary roles
    if ([...set.roleIDs, set.defaultRoleID].some((id) => roleIDs.has(id))) continue;

    // Since the user has no roles in this set we need to give them the default role from this set.
    roleIDs.add(set.defaultRoleID);
  }

  if (![...roleIDs].some((id) => !memberRoles.includes(id))) return;

  await editMember(guild.id, member.id, {
    roles: [...roleIDs],
  }).catch(console.log);
};

botCache.eventHandlers.roleGained = async function (guild, member, roleID) {
  // VIP ONLY STUFF
  if (!botCache.vipGuildIDs.has(guild.id)) return;

  handleServerLog(guild, member, roleID, "added");
  // handleRoleMessages(guild, member, roleID, "added");

  // EVERYTHING BELOW REQUIRES MANAGING ROLES PERM
  if (!(await botHasPermission(guild.id, ["MANAGE_ROLES"]))) return;

  const memberRoles = member.guilds.get(guild.id)?.roles ?? [];

  // A set will make sure they are unique ids only and no duplicates.
  const roleIDsToRemove = new Set<string>();
  const roleIDsToAdd = new Set<string>();

  // Unique role sets check only is done when a role is added
  const uniqueSets = await db.uniquerolesets.findMany({ guildID: guild.id }, true);
  const requiredSets = await db.requiredrolesets.findMany({ guildID: guild.id }, true);
  const groupedSets = await db.groupedrolesets.findMany({ guildID: guild.id }, true);

  const relevantUniqueSets = uniqueSets.filter((set) => set.roleIDs.includes(roleID));
  const relevantRequiredSets = requiredSets.filter((set) => set.roleIDs.includes(roleID));
  if (!relevantUniqueSets.length && !relevantRequiredSets.length) return;

  // These sets includes this role the user recieved so remove all other roles in this set.
  for (const set of relevantUniqueSets) {
    for (const id of set.roleIDs) {
      // If this id is the role added dont remove it
      if (id === roleID) continue;
      roleIDsToRemove.add(id);
    }
  }

  // These sets includes this role the user recieved so check if they have the required role, else remove.
  for (const set of relevantRequiredSets) {
    // The member has the required role, so we skip this set.
    if (memberRoles.includes(set.requiredRoleID)) continue;

    // The member did not have the required role for this set, so we should remove the roles in this set.
    for (const id of set.roleIDs) roleIDsToRemove.add(id);
  }

  // These sets add other roles when a main role is added
  for (const set of groupedSets) {
    if (set.mainRoleID !== roleID) continue;

    for (const id of set.roleIDs) roleIDsToAdd.add(id);
  }

  if (![...roleIDsToRemove].some((id) => memberRoles.includes(id))) return;

  const finalRoleIDs = memberRoles.filter((id) => !roleIDsToRemove.has(id));
  for (const id of roleIDsToAdd.values()) finalRoleIDs.push(id);

  await editMember(guild.id, member.id, { roles: finalRoleIDs }).catch(console.log);
};

async function handleServerLog(guild: Guild, member: Member, roleID: string, type: "added" | "removed") {
  // VIP ONLY STUFF
  if (!botCache.vipGuildIDs.has(guild.id)) return;

  const logs = botCache.recentLogs.has(guild.id)
    ? botCache.recentLogs.get(guild.id)
    : await db.serverlogs.get(guild.id);

  botCache.recentLogs.set(guild.id, logs);

  if (!logs?.roleMembersChannelID) return;

  const texts = [
    translate(guild.id, type === "added" ? "strings:ROLE_GAINED" : "strings:ROLE_LOST"),
    translate(guild.id, "strings:USER", {
      tag: `<@!${member.id}>`,
      id: member.id,
    }),
    translate(guild.id, "strings:ROLE_LOG", { role: `<@&${roleID}> - ***${guild.roles.get(roleID)?.name}***` }),
  ];

  const role = guild.roles.get(roleID);

  const embed = new Embed()
    .setAuthor(member.tag, member.avatarURL)
    .setDescription(texts.join("\n"))
    .setFooter(member.tag, guildIconURL(guild))
    .setThumbnail(member.avatarURL)
    .setTimestamp();

  if (role) embed.color = role.color;

  // SEND PUBLIC LOG
  if (logs?.roleMembersPublic) {
    await sendEmbed(logs.publicChannelID, embed);
  }
  // SEND PRIVATE LOG
  return sendEmbed(logs.roleMembersChannelID, embed);
}

// async function handleRoleMessages(guild: Guild, member: Member, roleID: string, type: "added" | "removed" = "added") {
//   const roleMessage = botCache.recentRoleMessages.has(roleID)
//     ? botCache.recentRoleMessages.get(roleID)
//     : await db.rolemessages.get(roleID);
//   botCache.recentRoleMessages.set(roleID, roleMessage);

//   // If this role id did not have a role message cancel.
//   if (!roleMessage) return;
//   // No perms to send message in the designated channel
//   if (!(await botHasChannelPermissions(roleMessage.channelID, ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"]))) {
//     return;
//   }

//   const text = type === "added" ? roleMessage.roleAddedText : roleMessage.roleRemovedText;
//   // If there is no text for this role.
//   if (!text) return;

//   const transformed = await botCache.helpers.variables(
//     type === "added" ? roleMessage.roleAddedText : roleMessage.roleRemovedText,
//     member,
//     guild,
//     member
//   );

//   // The text is not an embed so just send it as is
//   if (!text.startsWith("{")) {
//     return sendMessage(roleMessage.channelID, `<@!${member.id}> ${transformed}`);
//   }

//   try {
//     const json = JSON.parse(transformed);
//     const embed = new Embed(json);
//     await sendEmbed(roleMessage.channelID, embed, `<@!${member.id}>`);
//   } catch {
//     // Events can be too spammy to do anything
//   }
// }
