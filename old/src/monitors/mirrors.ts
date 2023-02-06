import {
  bgBlue,
  bgYellow,
  black,
  botCache,
  botID,
  cache,
  chooseRandom,
  deleteMessage,
  executeWebhook,
} from "../../deps.ts";
import { getTime } from "../utils/helpers.ts";

const funnyAnonymousNames = [
  "Anonymous",
  "God",
  "Discord CEO",
  "Discord API",
  "Developer",
  "Pikachu",
  "Stephen J Lurker",
  "Gordan Freeman",
  "Master Chef",
  "Zelda",
  "Link",
  "The Ghost of Clyde",
  "Wannabe VIP",
  "GamerBot Fan",
  "Wumpus",
  "Santa Claus",
];

botCache.monitors.set("mirrors", {
  name: "mirrors",
  ignoreBots: false,
  execute: async function (message) {
    const mirrors = botCache.mirrors.get(message.channelID);
    if (!mirrors) return;

    const member = cache.members.get(message.author.id);
    if (!member) return;

    const botMember = cache.members.get(botID);
    if (!botMember) return;

    console.log(
      `${bgBlue(`[${getTime()}]`)} => [MONITOR: ${bgYellow(black("mirrors"))}] Executed in ${
        message.guild?.name || message.guildID
      } in ${message.channel?.name} (${message.channelID}) by ${message.member?.tag}(${message.author.id}).`
    );
    mirrors.forEach(async (mirror) => {
      // This mirror keeps failing so stop it.
      if (botCache.failedWebhooks.has(mirror.webhookID)) return;

      let username = mirror.anonymous ? `${chooseRandom(funnyAnonymousNames)}#0000` : member.tag;
      if (!username.endsWith(" - Gamer Mirror")) username += " - Gamer Mirror";

      // This is a mirror channel so we need to execute a webhook for it

      // Bots cannot send stickers atm so we just set the content to the sticker name
      if (message.stickers) {
        message.content += `Sent a Sticker: ${message.stickers[0].name}`;
      }

      const [attachment] = message.attachments;
      const blob = attachment
        ? await fetch(attachment.url)
            .then((res) => res.blob())
            .catch(() => undefined)
        : undefined;

      // Prevent annoying infinite spam using webhooks between 2 channels
      if (botCache.vipGuildIDs.has(message.guildID) && message.webhook_id) {
        return;
      }

      if (mirror.deleteSourceMessages) {
        await deleteMessage(message).catch(console.log);
      }

      if (mirror.filterImages && !blob) return;

      if (mirror.filter) {
        const filter = new Function("message", mirror.filter);
        if (!filter(message)) return;
      }

      return executeWebhook(mirror.webhookID, mirror.webhookToken, {
        content: message.content,
        embeds: message.embeds,
        file: blob ? { name: attachment.filename, blob } : undefined,
        username: username.substring(0, 80) || "Unknown User - Gamer Mirror",
        avatar_url: mirror.anonymous ? botMember.avatarURL : member.avatarURL,
        mentions: { parse: [] },
      }).catch(() => botCache.failedWebhooks.add(mirror.webhookID));
    });
  },
});
