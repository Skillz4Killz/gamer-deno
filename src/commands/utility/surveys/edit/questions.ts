import { rawAvatarURL } from "../../../../../deps.ts";
import { botCache } from "../../../../../cache.ts";
import { createSubcommand, sendEmbed } from "../../../../utils/helpers.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { Embed } from "../../../../utils/Embed.ts";
import { db } from "../../../../database/database.ts";

createSubcommand("surveys-edit", {
  name: "questions",
  arguments: [
    { name: "subcommand", type: "subcommand" },
    { name: "name", type: "string", required: false },
  ] as const,
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  vipServerOnly: true,
  guildOnly: true,
  execute: async function (message, args) {
    if (!args.name) return botCache.helpers.reactError(message);

    const survey = await db.surveys.findOne(
      { guildID: message.guildID, name: args.name },
    );
    if (!survey) return botCache.helpers.reactError(message);

    const embed = new Embed()
      .setAuthor(
        message.author.username,
        rawAvatarURL(
          message.author.id,
          message.author.discriminator,
          message.author.avatar,
        ),
      );

    for (const [index, question] of survey.questions.entries()) {
      const name = `**[${index + 1}]** (*${question.type}*)`;

      if (
        embed.currentTotal + name.length + question.question.length > 6000 ||
        embed.fields.length === 25
      ) {
        await sendEmbed(message.channelID, embed);
        embed.fields = [];
      }

      embed.addField(name, question.question);
    }

    return sendEmbed(message.channelID, embed);
  },
});
