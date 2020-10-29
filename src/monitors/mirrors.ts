import {
  bgBlue,
  bgYellow,
  black,
  botID,
  cache,
  chooseRandom,
  deleteMessage,
  executeWebhook,
} from "../../deps.ts";
import { botCache } from "../../cache.ts";
import { getTime } from "../utils/helpers.ts";

const funnyAnonymousNames = ["Anonymous", "God", "Discord CEO", "Discord API"];
const failedMirrors = new Set<string>();

botCache.monitors.set("mirrors", {
  name: "mirrors",
  ignoreBots: false,
  execute: async function (message) {
    const mirrors = botCache.mirrors.get(message.channelID);
    if (!mirrors) return;

    const guild = cache.guilds.get(message.guildID);

    const member = guild?.members.get(message.author.id);
    if (!member) return;

    const botMember = guild?.members.get(botID);
    if (!botMember) return;

    console.log(
      `${bgBlue(`[${getTime()}]`)} => [MONITOR: ${
        bgYellow(black("collector"))
      }] Executed.`,
    );
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
        avatar_url: mirror.anonymous ? botMember.avatarURL : member.avatarURL,
        mentions: { parse: [] },
      }).catch(() => failedMirrors.add(mirror.webhookID));
    });
  },
});
