import { rawAvatarURL, sendDirectMessage } from "../../../../deps.ts";
import { botCache } from "../../../../cache.ts";
import { createSubcommand, sendEmbed } from "../../../utils/helpers.ts";
import { Embed } from "../../../utils/Embed.ts";
import { db } from "../../../database/database.ts";

createSubcommand("surveys", {
  name: "fill",
  aliases: ["respond"],
  guildOnly: true,
  // vipServerOnly: true,
  arguments: [
    { name: "name", type: "string", lowercase: true },
  ],
  execute: async function (message, args: SurveysFillArgs, guild) {
    const survey = await db.surveys.findOne(
      { guildID: message.guildID, name: args.name },
    );
    if (!survey) return botCache.helpers.reactError(message);

    const member = guild?.members.get(message.author.id);
    if (!member) return botCache.helpers.reactError(message);

    if (
      !survey.allowedRoleIDs.some((id) => member.roles.includes(id))
    ) {
      return botCache.helpers.reactError(message);
    }

    const answers: Record<string, unknown>[] = [];

    const embed = new Embed()
      .setAuthor(
        message.author.username,
        rawAvatarURL(
          message.author.id,
          message.author.discriminator,
          message.author.avatar,
        ),
      );

    // User has the role necessary to fill survey.
    for (const question of survey.questions) {
      await sendDirectMessage(message.author.id, question.question);
      // DM listener
      const response = await botCache.helpers.needMessage(
        message.author.id,
        message.author.id,
      );
      if (!response) return botCache.helpers.reactError(message);

      // User gave a response
      const validate = await botCache.arguments.get(question.type)?.execute(
        { name: "arg" },
        [response.content],
        response,
        { name: "arg" },
      );
      if (!validate) return botCache.helpers.reactError(response);

      if (
        embed.currentTotal + question.question.length +
              String(validate).length > 6000 ||
        embed.fields.length === 25
      ) {
        await sendEmbed(message.channelID, embed);
        embed.fields = [];
      }

      embed.addField(question.question, String(validate));
    }

    return sendEmbed(survey.channelID, embed);
  },
});

interface SurveysFillArgs {
  name: string;
}
