import { botCache } from "../../mod.ts";
import { Guild, Member, editMember } from "../../deps.ts";
import { uniqueRoleSetsDatabase } from "../database/schemas/uniquerolesets.ts";
import { defaultRoleSetsDatabase } from "../database/schemas/defaultrolesets.ts";
import { addRole } from "https://x.nest.land/Discordeno@8.7.3/src/handlers/member.ts";

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
    const uniqueSets = await uniqueRoleSetsDatabase.find({ guildID: guild.id });

    for (const roleID of roleIDs) {
      const relevantSets = uniqueSets.filter((set) =>
        set.roleIDs.includes(roleID)
      );
      if (!relevantSets) return;

      // These sets includes this role the user recieved so remove all other roles in this set.
      for (const set of relevantSets) {
        for (const id of set.roleIDs) {
          // If this id is the role added dont remove it
          if (id === roleID) continue;
          roleIDsToRemove.add(id);
        }
      }
    }

    // Only edit if the roles need to be removed.
    if (roleIDsToRemove.size) {
      editMember(
        guild.id,
        member.user.id,
        { roles: member.roles.filter((id) => !roleIDsToRemove.has(id)) },
      );
    }
  } // A role was removed from the user
  else {
    const defaultSets = await defaultRoleSetsDatabase.find(
      { guildID: guild.id },
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
      addRole(guild.id, member.user.id, set.defaultRoleID);
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
