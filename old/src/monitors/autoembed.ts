import { bgBlue, bgYellow, black, deleteMessage, sendMessage } from "../../deps.ts";
import { botCache } from "../../deps.ts";
import { getTime } from "../utils/helpers.ts";
import { translate } from "../utils/i18next.ts";

botCache.monitors.set("autoembed", {
  name: "autoembed",
  botChannelPermissions: ["SEND_MESSAGES", "MANAGE_MESSAGES"],
  execute: async function (message) {
    if (!botCache.autoEmbedChannelIDs.has(message.channelID)) return;

    console.log(`${bgBlue(`[${getTime()}]`)} => [MONITOR: ${bgYellow(black("autoembed"))}] Started.`);

    const [attachment] = message.attachments;
    const blob = attachment
      ? await fetch(attachment.url)
          .then((res) => res.blob())
          .catch(console.log)
      : undefined;

    const embed = botCache.helpers
      .authorEmbed(message)
      .setDescription(message.content)
      .setColor("RANDOM")
      .setFooter(translate(message.guildID, "strings:AUTOEMBED_EMBED_ENABLED"))
      .setTimestamp();
    if (blob) embed.attachFile(blob, "autoembed.png");

    await sendMessage(message.channelID, { embed, file: embed.embedFile });

    await deleteMessage(message, translate(message.guildID, "strings:AUTOEMBED_DELETE_REASON"));
    console.log(`${bgBlue(`[${getTime()}]`)} => [MONITOR: ${bgYellow(black("autoembed"))}] Executed.`);
  },
});
