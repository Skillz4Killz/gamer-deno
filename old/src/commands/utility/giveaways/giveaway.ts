import { addRole, botCache, editMember } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { UserSchema } from "../../../database/schemas.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createCommand, humanizeMilliseconds } from "../../../utils/helpers.ts";

createCommand({
  name: "giveaway",
  aliases: ["g", "ga"],
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.MODERATOR],
  guildOnly: true,
  cooldown: {
    seconds: 240,
    allowedUses: 2,
  },
  arguments: [
    { name: "subcommand", type: "subcommand", required: false },
    { name: "IGN", type: "string", required: false },
    { name: "role", type: "role", required: false },
  ] as const,
  execute: async function (message, args, guild) {
    if (!guild) return;

    const giveaways = await db.giveaways.findMany(
      {
        guildID: message.guildID,
        hasStarted: true,
        hasEnded: false,
      },
      true
    );
    if (!giveaways.length) return botCache.helpers.reactError(message);

    let giveawayID = "";

    if (giveaways.length > 1) {
      // More than 1 giveaway found on this server
      await message.reply(
        "There was more than 1 giveaway found on this server at this time. Please provide the giveaway ID number now."
      );
      const choiceMessage = await botCache.helpers.needMessage(message.author.id, message.channelID);
      const isValidGiveaway = giveaways.find((giveaway) => giveaway.id === choiceMessage.content);

      if (!isValidGiveaway) {
        return message.reply("There was no giveaway found with that ID.");
      }
      if (isValidGiveaway.hasEnded) {
        return message.reply("This giveaway has already ended");
      }

      giveawayID = isValidGiveaway.id;
    }

    const giveaway = giveawayID ? giveaways.find((g) => g.id === giveawayID) : giveaways[0];
    if (!giveaway) return botCache.helpers.reactError(message);

    if (giveaway.blockedUserIDs.includes(message.author.id)) {
      return message.alertReply("You are blocked from this giveaway");
    }

    if (!giveaway.allowCommandEntry) {
      await message.alertReply(`this giveaway does not allow entry by command.`);
    }

    let settings: UserSchema | undefined;

    // CHECK IF THE USER MEETS THE GIVEAWAY REQUIREMENTS

    // Check if the user has provided an IGN
    if (giveaway.IGN && !args.IGN) {
      return message.reply("You did not provide your in game name.");
    }

    // Check if the user has provided a valid role
    if (giveaway.setRoleIDs.length) {
      if (!args.role) {
        return message.reply("You did not provide any valid role.");
      }
      if (!giveaway.setRoleIDs.includes(args.role.id)) {
        const validRoles = giveaway.setRoleIDs.map((id) => guild.roles.get(id)?.name).filter((r) => r);
        return message.reply(`You did not provide a valid role. The valid roles are: **${validRoles.join(", ")}**`);
      }
    }

    // Check if the user has enough money
    if (giveaway.costToJoin) {
      settings = await db.users.get(message.author.id);
      if (!settings || giveaway.costToJoin > settings.coins) {
        return message.alertReply(
          `You did not have enough coins to enter the giveaway. To get more coins, please use the **slots** or **daily** command. To check your balance, you can use the **balance** command.`
        );
      }
    }

    // Check if the user has one of the required roles.
    if (giveaway.requiredRoleIDsToJoin.length) {
      const allowed = giveaway.requiredRoleIDsToJoin.some((id) => message.guildMember?.roles.includes(id));
      if (!allowed) {
        return message.alertReply("You did not have one of the required roles to enter this giveaway.");
      }
    }

    // Handle duplicate entries
    if (!giveaway.allowDuplicates) {
      const isParticipant = giveaway.participants.some((participant) => participant.memberID === message.author.id);
      if (isParticipant) {
        return message.alertReply(
          `You are already a participant in this giveaway. You have reached the maximum amount of entries in this giveaway.`
        );
      }
    } else if (giveaway.duplicateCooldown) {
      const relevantParticipants = giveaway.participants.filter(
        (participant) => participant.memberID === message.author.id
      );
      const latestEntry = relevantParticipants.reduce((timestamp, participant) => {
        if (timestamp > participant.joinedAt) return timestamp;
        return participant.joinedAt;
      }, 0);

      const now = Date.now();
      // The user is still on cooldown to enter again
      if (giveaway.duplicateCooldown + latestEntry > now) {
        return message.alertReply(
          `<@!${
            message.author.id
          }>, you are not allowed to enter this giveaway again yet. Please wait another **${humanizeMilliseconds(
            giveaway.duplicateCooldown + latestEntry - now
          )}**.`
        );
      }
    }

    // PROCESS GIVEAWAY ENTRY NOW
    if (giveaway.setRoleIDs.length && args.IGN) {
      // Set the users nickname
      await editMember(message.guildID, message.author.id, {
        nick: `${args.IGN} - ${args.role!.name}`.substring(0, 32),
      });
      // Assign the role to the user
      await addRole(message.guildID, message.author.id, args.role!.id);
    } else if (args.IGN) {
      await editMember(message.guildID, message.author.id, {
        nick: `${args.IGN}`.substring(0, 32),
      });
    }

    // Subtract the coins
    if (giveaway.costToJoin) {
      // Remove the coins from the user
      await db.users.update(message.author.id, {
        coins: settings!.coins - giveaway.costToJoin,
      });
    }

    await db.giveaways.update(giveaway.id, {
      participants: [...giveaway.participants, { memberID: message.author.id, joinedAt: message.timestamp }],
    });

    return botCache.helpers.reactSuccess(message);
  },
});
