import { botCache, cache, sendMessage } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createCommand, humanizeMilliseconds } from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";

createCommand({
  name: "profile",
  aliases: ["p", "prof"],
  guildOnly: true,
  botChannelPermissions: [
    "VIEW_CHANNEL",
    "SEND_MESSAGES",
    "ATTACH_FILES",
    "EMBED_LINKS",
  ],
  arguments: [
    { name: "member", type: "member", required: false },
  ] as const,
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

    const settings = await db.guilds.get(message.guildID);
    if (!settings?.missionsDisabled) {
      const missions = await Promise.all(
        botCache.missions.map(async (mission, index) => {
          if (
            index > 2 &&
            !botCache.activeMembersOnSupportServer.has(args.member!.id) && !botCache.vipUserIDs.has(args.member!.id)
          ) {
            return `❓ || ${botCache.constants.botSupportInvite} ||`;
          }

          const relevantMission = await db.mission.get(
            `${args.member!.id}-${mission.commandName}`,
          );
          if (!relevantMission) {
            return `0 / ${mission.amount} : ${
              translate(message.guildID, mission.title)
            } **[${mission.reward}] XP**`;
          }

          if (!relevantMission.completed) {
            return `${relevantMission.amount} / ${mission.amount} : ${
              translate(message.guildID, mission.title)
            } **[${mission.reward}] XP**`;
          }
          return `${botCache.constants.emojis.success}: ${
            translate(message.guildID, mission.title)
          } **[${mission.reward}] XP**`;
        }),
      );

      embed
        .setDescription(missions.join("\n"))
        .setFooter(
          translate(message.guildID, `strings:NEW_IN`, {
            time: humanizeMilliseconds(
              botCache.constants.milliseconds.MINUTE * 30 -
                (Date.now() - botCache.missionStartedAt),
            ),
          }),
        );
    }

    return sendMessage(message.channelID, { embed, file: embed.embedFile });
  },
});
