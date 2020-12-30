import { botCache } from "../../../deps.ts";
import { botID, sendMessage } from "../../../deps.ts";
import { translate } from "../../utils/i18next.ts";
import { createCommand } from "../../utils/helpers.ts";

createCommand({
  name: `invite`,
  botChannelPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES"],
  execute: async function (message) {
    await sendMessage(
      message.channelID,
      [
        `${botCache.constants.emojis.coin} **${
          translate(message.guildID, "strings:INVITE_BOT")
        }:** <https://discordapp.com/oauth2/authorize?client_id=${botID}&scope=bot+applications.commands&permissions=2111302911>`,
        "",
        `${botCache.constants.emojis.bot} **${
          translate(message.guildID, "strings:NEED_SUPPORT")
        }:** discord.gg/J4NqJ72`,
      ].join("\n"),
    );
  },
});
