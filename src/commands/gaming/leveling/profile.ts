import { sendMessage } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/next/src/handlers/channel.ts";
import { botCache, cache } from "../../../../deps.ts";
import { createCommand, sendEmbed } from "../../../utils/helpers.ts";

createCommand({
  name: "profile",
  aliases: ["p", "prof"],
  guildOnly: true,
  arguments: [
    { name: "member", type: "member", required: false },
  ],
  execute: async function (message, args) {
    if (!args.member) args.member = cache.members.get(message.author.id)!;
    if (!args.member) return botCache.helpers.reactError(message);

    const buffer = await botCache.helpers.makeProfileCanvas(
      message.guildID,
      args.member.id,
    );
    if (!buffer) return;

    const embed = botCache.helpers.authorEmbed(message).attachFile(
      buffer,
      "profile.jpg",
    );
    sendMessage(message.channelID, { embed, file: embed.embedFile });
  },
});

// const fileName = `profile.jpg`
// const UNLOCK = language('leveling/profile:UNLOCK', {
//   prefix: Gamer.guildPrefixes.get(message.guildID) || Gamer.prefix
// })

//       await Gamer.database.models.mission.find({ userID: member.id }),

//     const missions = Gamer.missions.map((mission, index) => {
//       if (index > 2 && !upvote) return `${constants.emojis.questionMark} || ${UNLOCK} ||`
//       const relevantMission = missionData.find(m => m.commandName === mission.commandName)
//       if (!relevantMission) return `0 / ${mission.amount} : ${language(mission.title)} **[${mission.reward}] XP**`

//       if (!relevantMission.completed)
//         return `${relevantMission.amount} / ${mission.amount} : ${language(mission.title)} **[${mission.reward}] XP**`

//       return `${constants.emojis.success}: ${language(mission.title)} **[${mission.reward}] XP**`
//     })

//     const embed = new MessageEmbed().attachFile(buffer, fileName)

//     if (guildSettings && !guildSettings.xp.disableMissions) {
//       embed
//         .setDescription(missions.join('\n'))
//         .setTitle(language(`leveling/profile:CURRENT_MISSIONS`))
//         .setFooter(
//           language(`leveling/profile:NEW_IN`, {
//             time: Gamer.helpers.transform.humanizeMilliseconds(
//               milliseconds.MINUTE * 30 - (Date.now() - Gamer.missionsStartTimestamp)
//             )
//           })
//         )
//     }

//     const canAttachFile = Gamer.helpers.discord.checkPermissions(message.channel, Gamer.user.id, ['attachFiles'])
//     if (!canAttachFile)
//       return message.channel.createMessage(
//         language(`leveling/profile:NEED_ATTACH_FILE`, { mention: message.author.mention })
//       )

//     message.channel.createMessage({ embed: embed.code }, { file: buffer, name: `profile.jpg` })

//     return Gamer.helpers.levels.completeMission(message.member, `profile`, message.guildID)
//   })
