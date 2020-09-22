import type {
  Message,
  avatarURL,
  sendMessage,
  deleteMessage,
  bgBlue,
  getTime,
  bgYellow,
  black,
} from "../../deps.ts";
import { botCache } from "../../mod.ts";
import type { Embed } from "../utils/Embed.ts";
import { translate } from "../utils/i18next.ts";

botCache.monitors.set("autoembed", {
  name: "autoembed",
  botChannelPermissions: ["SEND_MESSAGES", "MANAGE_MESSAGES"],
  execute: async function (message: Message) {
    if (!botCache.autoEmbedChannelIDs.has(message.channelID)) return;

    const member = message.member();
    if (!member) return;

    const [attachment] = message.attachments;
    const blob = attachment
      ? await fetch(attachment.url)
        .then((res) => res.blob())
        .catch(() => undefined)
      : undefined;

    const embed = new Embed()
      .setAuthor(member.tag, avatarURL(member))
      .setDescription(message.content)
      .setColor("RANDOM")
      .setFooter(
        translate(message.guildID, "commands/autoembed:EMBED_ENABLED"),
      )
      .setTimestamp();
    if (blob) embed.attachFile(blob, "autoembed.png");

    sendMessage(
      message.channel,
      { embed, file: embed.file },
    );

    deleteMessage(
      message,
      translate(message.guildID, "commands/autoembed:DELETE_REASON"),
    );
    console.log(
      `${bgBlue(`[${getTime()}]`)} => [MONITOR: ${
        bgYellow(black("autoembed"))
      }] Executed.`,
    );
  },
});
