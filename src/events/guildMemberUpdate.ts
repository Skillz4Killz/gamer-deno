import type { Guild, Member } from "../../deps.ts";

import { addRole, editMember } from "../../deps.ts";
import { botCache } from "../../mod.ts";
import { db } from "../database/database.ts";

async function handleRoleChanges(
  guild: Guild,
  member: Member,
  roleIDs: string[],
  type: "added" | "removed" = "added",
) {
  if (type === "added") {
    // A set will make sure they are unique ids only and no duplicates.
    const roleIDsToRemove = new Set<string>();
    // Unique role sets check only is done when a role is added
    const uniqueSets = await db.uniquerolesets.findMany(
      { guildID: guild.id },
      true,
    );
    const requiredSets = await db.requiredrolesets.findMany(
      { guildID: guild.id },
      true,
    );

    for (const roleID of roleIDs) {
      const relevantUniqueSets = uniqueSets.filter((set) =>
        set.roleIDs.includes(roleID)
      );
      const relevantRequiredSets = requiredSets.filter((set) =>
        set.roleIDs.includes(roleID)
      );
      if (!relevantUniqueSets.length && !relevantRequiredSets.length) continue;

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
        if (member.roles.includes(set.requiredRoleID)) continue;

        // The member did not have the required role for this set, so we should remove the roles in this set.
        for (const id of set.roleIDs) roleIDsToRemove.add(id);
      }
    }

    // Only edit if the roles need to be removed.
    if (roleIDsToRemove.size) {
      editMember(
        guild.id,
        member.id,
        { roles: member.roles.filter((id) => !roleIDsToRemove.has(id)) },
      );
    }
  } // A role was removed from the user
  else {
    const defaultSets = await db.defaultrolesets.findMany(
      { guildID: guild.id },
      true,
    );

    for (const set of defaultSets) {
      // The member has atleast 1 of the necessary roles
      if (
        [...set.roleIDs, set.defaultRoleID].some((id) =>
          member.roles.includes(id)
        )
      ) {
        continue;
      }

      // Since the user has no roles in this set we need to give them the default role from this set.
      addRole(guild.id, member.id, set.defaultRoleID);
    }
  }
}

botCache.eventHandlers.guildMemberUpdate = function (
  guild,
  member,
  cachedMember,
) {
  if (cachedMember) {
    // Check if the roles changed
    const rolesAdded = member.roles.filter((id) =>
      !cachedMember.roles.includes(id)
    );
    const rolesLost = cachedMember.roles.filter((id) =>
      !member.roles.includes(id)
    );
    if (rolesAdded.length) {
      handleRoleChanges(guild, member, rolesAdded, "added");
    }
    if (rolesLost.length) {
      handleRoleChanges(guild, member, rolesLost, "removed");
    }
  }
};
