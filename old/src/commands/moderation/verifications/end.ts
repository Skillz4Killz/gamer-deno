import { addRole, botCache, deleteChannel, Image, removeRole } from "../../../../deps.ts";
import fonts from "../../../../fonts.ts";
import { db } from "../../../database/database.ts";
import { createSubcommand } from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";

createSubcommand("verify", {
  name: "end",
  guildOnly: true,
  execute: async function (message, args, guild) {
    const settings = await db.guilds.get(message.guildID);
    if (!settings) return botCache.helpers.reactError(message);

    if (!settings.verifyChannelIDs?.includes(message.channelID)) {
      return botCache.helpers.reactError(message);
    }

    // Make sure the role exists
    const role = guild?.roles.get(settings.verifyRoleID);
    if (!role) return botCache.helpers.reactError(message);

    // Generate and ask the user for the captcha code
    const captchaCode = await createCaptcha();
    await message.send({
      content: "Please type the text in the Captcha to unlock access to the server.",
      file: {
        blob: new Blob([captchaCode.buffer], { type: "image/png" }),
        name: "captcha.png",
      },
    });

    const response = await botCache.helpers.needMessage(message.author.id, message.channelID);

    // FAILED CAPTCHA
    if (response.content !== captchaCode.text) {
      await message.send({
        embed: botCache.helpers.authorEmbed(message).setDescription(
          translate(message.guildID, "strings:INVALID_CAPTCHA_CODE", {
            code: captchaCode.text,
          })
        ),
      });

      // RERUN THE COMMAND
      return botCache.commands.get("verify")?.subcommands?.get("end")?.execute?.(message, {}, guild);
    }

    // PASSED CAPTCHA

    // Remove the verify role
    await removeRole(message.guildID, message.author.id, role.id).catch(console.log);

    if (!settings.discordVerificationStrictnessEnabled && settings.userAutoRoleID) {
      await addRole(message.guildID, message.author.id, settings.userAutoRoleID);
    }

    return deleteChannel(message.guildID, message.channelID);
  },
});

async function createCaptcha() {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const characters = [...alphabet, ...alphabet.toUpperCase(), ..."0123456789"];
  const getRandomCharacters = (amount: number) => {
    let text = ``;
    for (let i = 0; i < amount; i++) {
      text += characters[Math.floor(Math.random() * characters.length)];
    }
    return text;
  };

  const text = getRandomCharacters(6);

  const canvas = new Image(400, 100).drawBox(0, 0, 400, 100, parseInt("EEEEEEFF", 16));

  let degree = 0;

  while (degree < 360) {
    canvas.composite(
      Image.renderText(fonts.SFTHeavy, 100, getRandomCharacters(6), Math.floor(Math.random() * (0xffffff + 1))).rotate(
        degree
      ),
      10,
      5
    );
    degree += 20;
  }

  canvas.composite(Image.renderText(fonts.LatoBold, 60, text, parseInt("0088CCFF", 16)), 100, 15);
  canvas.composite(Image.renderText(fonts.LatoBold, 60, text, parseInt("0088CCFF", 16)), 100, 15);

  return {
    text,
    buffer: await canvas.encode(),
  };
}
