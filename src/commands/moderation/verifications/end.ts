import { botCache, Image, sendMessage, addRole, removeRole, deleteChannel } from "../../../../deps.ts";
import fonts from "../../../../fonts.ts";
import { db } from "../../../database/database.ts";
import { createSubcommand, sendEmbed } from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";

createSubcommand('verify', {
    name: "end",
    guildOnly: true,
    execute: async function (message, args, guild) {
        const settings = await db.guilds.get(message.guildID);
        if (!settings) return botCache.helpers.reactError(message);

      if (!settings.verifyChannelIDs?.includes(message.channelID)) return botCache.helpers.reactError(message);
        
      // Make sure the role exists
      const role = guild?.roles.get(settings.verifyRoleID);
      if (!role) return botCache.helpers.reactError(message);

      // Generate and ask the user for the captcha code
      const captchaCode = await createCaptcha()
      sendMessage(message.channelID, { content: "Please type the text in the Captcha to unlock access to the server.", file: { blob: new Blob([captchaCode.buffer], { type: "image/png" }), name: "captcha.png" } })

      const response = await botCache.helpers.needMessage(message.author.id, message.channelID);
      
      // FAILED CAPTCHA
      if (response.content !== captchaCode.text) {
        await sendEmbed(message.channelID, botCache.helpers.authorEmbed(message).setDescription(translate(message.guildID, "strings:INVALID_CAPTCHA_CODE", { code: captchaCode.text })))

        // RERUN THE COMMAND
        return botCache.commands.get('verify')?.subcommands?.get('end')?.execute?.(message, {}, guild);
      }

      // PASSED CAPTCHA

      // Remove the verify role
      removeRole(message.guildID, message.author.id, role.id);
       
      if (!settings.discordVerificationStrictnessEnabled && settings.userAutoRoleID) {
        addRole(message.guildID, message.author.id, settings.userAutoRoleID)
      }

      deleteChannel(message.guildID, message.channelID);
    }
})

async function createCaptcha() {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'
    const characters = [...alphabet, ...alphabet.toUpperCase(), ...'0123456789']
    const getRandomCharacters = (amount: number) => {
      let text = ``
      for (let i = 0; i < amount; i++) {
        text += characters[Math.floor(Math.random() * characters.length)]
      }
      return text
    }
  
    const text = getRandomCharacters(6)
  
    const canvas = new Image(400, 100)
      .drawBox(0,0, 400, 100, parseInt("EEEEEEFF", 16))
      .composite(Image.renderText(fonts.SFTHeavy, 60, getRandomCharacters(6), parseInt("0088CCFF", 16)), 105, 60)
      .composite(Image.renderText(fonts.SFTLight, 60, getRandomCharacters(6), parseInt("0088CCFF", 16)), 115, 60)
      .composite(Image.renderText(fonts.SFTHeavy, 60, getRandomCharacters(6), parseInt("0088CCFF", 16)), 125, 60)
      .composite(Image.renderText(fonts.SFTHeavy, 60, getRandomCharacters(6), parseInt("0088CCFF", 16)), 105, 70)
      .composite(Image.renderText(fonts.SFTLight, 60, getRandomCharacters(6), parseInt("0088CCFF", 16)), 115, 70)
      .composite(Image.renderText(fonts.SFTHeavy, 60, getRandomCharacters(6), parseInt("0088CCFF", 16)), 125, 70)
      .composite(Image.renderText(fonts.SFTHeavy, 60, getRandomCharacters(6), parseInt("0088CCFF", 16)), 105, 80)
      .composite(Image.renderText(fonts.SFTLight, 60, getRandomCharacters(6), parseInt("0088CCFF", 16)), 115, 80)
      .composite(Image.renderText(fonts.SFTHeavy, 60, getRandomCharacters(6), parseInt("0088CCFF", 16)), 125, 80)

      .composite(Image.renderText(fonts.LatoBold, 60, text, parseInt("0088CCFF", 16)), 115, 70)

      return {
        text,
        buffer: await canvas.encode()
      }
  }