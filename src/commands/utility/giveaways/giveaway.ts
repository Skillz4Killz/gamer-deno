import { botCache, editMember, addRole, sendMessage, deleteMessage } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createCommand, humanizeMilliseconds, sendAlertResponse, sendResponse } from "../../../utils/helpers.ts";

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
        { name: "IGN", type: "string" },
        { name: "role", type: "role", required: false },
    ] as const,
    execute: async function (message, args, guild) {
      if (!guild) return;

        const giveaways = await db.giveaways.findMany({
          guildID: message.guildID,
          hasStarted: true,
          hasEnded: false
        }, true)
        if (!giveaways.length) return botCache.helpers.reactError(message);
      
        let giveawayID = "";

        if (giveaways.length > 1) {
          // More than 1 giveaway found on this server
          sendResponse(
            message,
            'There was more than 1 giveaway found on this server at this time. Please provide the giveaway ID number now.'
          )
          const choiceMessage = await botCache.helpers.needMessage(message.author.id, message.channelID);
          const isValidGiveaway = giveaways.find(giveaway => giveaway.id === choiceMessage.content);
          if (!isValidGiveaway) return sendResponse(message, 'There was no giveaway found with that ID.')
      
          giveawayID = isValidGiveaway.id;
        }
      
        const giveaway = giveawayID ? giveaways.find(g => g.id === giveawayID) : giveaways[0];
        if (!giveaway) return console.log('No giveaway found with the command')
      
        if (!giveaway.allowCommandEntry) {
          sendAlertResponse(
            message,
            `this giveaway does not allow entry by command.`
          )
        }
      
        if (!args.IGN) return sendResponse(message, 'You did not provide your in game name.')
      
        if (giveaway.setRoleIDs.length) {
          if (!args.role) return sendResponse(message, 'You did not provide any valid role.')
      
          if (!giveaway.setRoleIDs.includes(args.role.id)) {
            const validRoles = giveaway.setRoleIDs.map(id => guild.roles.get(id)?.name).filter(r => r)
            return sendResponse(
              message,
              `You did not provide a valid role. The valid roles are: **${validRoles.join(', ')}**`
            )
          }
      
          // Set the users nickname
          await  editMember(message.guildID, message.author.id, { nick: `${args.IGN} - ${args.role.name}`.substring(0, 32) })
          // Assign the role to the user
          await addRole(message.guildID, message.author.id, args.role.id);
        } else {
          await  editMember(message.guildID, message.author.id, { nick: `${args.IGN}`.substring(0, 32) })
        }
      
        // Process giveaway entry now.
      
        // This giveaway has ended.
      
        // Check if the user has enough coins to enter
        if (giveaway.costToJoin) {
          const settings = await db.users.get(message.author.id);
          if (!settings)
            return sendMessage(
              giveaway.notificationsChannelID,
              `<@!${message.author.id}>, you did not have enough coins to enter the giveaway. To get more coins, please use the **slots** or **daily** command. To check your balance, you can use the **balance** command.`
            )
      
          if (giveaway.costToJoin > settings.coins)
            return sendMessage(
              giveaway.notificationsChannelID,
              `<@!${message.author.id}>, you did not have enough coins to enter the giveaway. To get more coins, please use the **slots** or **daily** command. To check your balance, you can use the **balance** command.`
            )
      
          // Remove the coins from the user
          db.users.update(message.author.id, { coins: settings.coins - giveaway.costToJoin });
        }
      
        // Check if the user has one of the required roles.
        if (giveaway.requiredRoleIDsToJoin.length) {
          const allowed = giveaway.requiredRoleIDsToJoin.some(id => message.member?.roles.includes(id))
          if (!allowed)
            return sendMessage(
              giveaway.notificationsChannelID,
              `<@!${message.author.id}>, you did not have one of the required roles to enter this giveaway.`
            ).then(m => deleteMessage(m).catch(console.log)).catch(console.error)
        }
      
        // Handle duplicate entries
        if (!giveaway.allowDuplicates) {
          const isParticipant = giveaway.participants.some(participant => participant.memberID === message.author.id)
          if (isParticipant)
            return sendMessage(
              giveaway.notificationsChannelID,
              `<@!${message.author.id}>, you are already a participant in this giveaway. You have reached the maximum amount of entries in this giveaway.`
            ).then(m => deleteMessage(m).catch(console.log)).catch(console.error)
        } else if (giveaway.duplicateCooldown) {
          const relevantParticipants = giveaway.participants.filter(participant => participant.memberID === message.author.id)
          const latestEntry = relevantParticipants.reduce((timestamp, participant) => {
            if (timestamp > participant.joinedAt) return timestamp
            return participant.joinedAt
          }, 0)
      
          const now = Date.now()
          // The user is still on cooldown to enter again
          if (giveaway.duplicateCooldown + latestEntry > now)
            return sendMessage(
              giveaway.notificationsChannelID,
              `<@!${message.author.id}>, you are not allowed to enter this giveaway again yet. Please wait another **${humanizeMilliseconds(
                giveaway.duplicateCooldown + latestEntry - now
              )}**.`
            ).then(m => deleteMessage(m).catch(console.log)).catch(console.error)
        }
      
        db.giveaways.update(giveaway.id, { participants: [...giveaway.participants, { memberID: message.author.id, joinedAt: message.timestamp }] });
      
        return sendMessage(
          giveaway.notificationsChannelID,
          `<@!${message.author.id}>, you have been **ADDED** to the giveaway.`
        ).then(m => deleteMessage(m).catch(console.log)).catch(console.error)
    }
})