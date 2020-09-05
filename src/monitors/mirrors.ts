import {
  avatarURL,
  botID,
  chooseRandom,
  deleteMessage,
  Message,
  executeWebhook,
} from "../../deps.ts";
import { botCache } from "../../mod.ts";

const funnyAnonymousNames = ["Anonymous", "God", "Discord CEO", "Discord API"];
const failedMirrors = new Set<string>();

botCache.monitors.set("mirrors", {
  name: "mirrors",
  ignoreBots: false,
  execute: async function (message: Message) {
    const mirrors = botCache.mirrors.get(message.channelID);
    if (!mirrors) return;

    const member = message.member();
    if (!member) return;

    const botMember = member.guild().members.get(botID);
    if (!botMember) return;

    mirrors.forEach((mirror) => {
      // This mirror keeps failing so stop it.
      if (failedMirrors.has(mirror.webhookID)) return;

      let username = mirror.anonymous
        ? `${chooseRandom(funnyAnonymousNames)}#0000`
        : member.tag;
      if (!username.endsWith(" - Gamer Mirror")) username += " - Gamer Mirror";

      // This is a mirror channel so we need to execute a webhook for it

      const [attachment] = message.attachments;
      const blob = attachment
        ? fetch(attachment.url).then((res) => res.blob()).catch(() => undefined)
        : undefined;

      if (mirror.deleteSourceMessages) {
        deleteMessage(message).catch(() => undefined);
      }

      if (mirror.filterImages && !blob) return;

      executeWebhook(mirror.webhookID, mirror.webhookToken, {
        content: message.content,
        embeds: message.embeds,
        file: blob ? { name: attachment.filename, blob } : undefined,
        username: username.substring(0, 80) || "Unknown User - Gamer Mirror",
        avatar_url: mirror.anonymous ? avatarURL(botMember) : avatarURL(member),
        mentions: { parse: [] },
      }).catch(() => failedMirrors.add(mirror.webhookID));
    });
  },
});
