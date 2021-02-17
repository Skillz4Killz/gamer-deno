import { botCache, cache, getUser } from "../../deps.ts";
import { db } from "../database/database.ts";
import { Embed } from "../utils/Embed.ts";
import { humanizeMilliseconds, sendEmbed } from "../utils/helpers.ts";
import { translate } from "../utils/i18next.ts";

botCache.helpers.createModlog = async function (message, options) {
  const settings = await db.serverlogs.get(message.guildID);

  const modlogChannel = settings ? cache.channels.get(settings.modChannelID) : undefined;
  // If it is disabled we don't need to do anything else. Return 0 for the case number response
  if (!modlogChannel) return 0;

  const allLogs = await db.modlogs.findMany({ guildID: message.guildID }, true);
  const highestID = allLogs.reduce((id, log) => (id > log.modlogID ? id : log.modlogID), 0);
  const modlogID = highestID + 1;
  const embed = await botCache.helpers.modlogEmbed(message, modlogID, options);

  let messageID = "";

  if (modlogChannel) {
    const logMessage = await sendEmbed(modlogChannel.id, embed).catch(console.log);
    if (logMessage) messageID = logMessage.id;
  }
  console.log("ml 3");

  await db.modlogs.create(messageID, {
    action: options.action,
    guildID: message.guildID,
    modID: message.author.id,
    modlogID,
    messageID: messageID,
    reason: options.reason,
    timestamp: message.timestamp,
    userID: options.member?.id || options.userID || "NO ID FOUND",
    duration: options.action === "mute" && options.duration ? options.duration : undefined,
    needsUnmute: options.action === "mute" && options.duration ? true : false,
    mainGuildID: message.guildID || "",
  });

  const publicChannel = cache.channels.find(
    (c) => c.guildID === message.guildID && Boolean(c.topic?.includes("gamerPublicLogChannel"))
  );
  if (!publicChannel) return modlogID;

  embed.setDescription(
    [
      translate(message.guildID, `strings:MODLOG_MEMBER`, {
        name: `${options.member?.tag} *(${options.member?.id || options.userID})*`,
      }),
      translate(message.guildID, `strings:REASON`, { reason: options.reason }),
    ].join("\n")
  );

  await sendEmbed(publicChannel.id, embed);
  return modlogID;
};

botCache.helpers.modlogEmbed = async function (message, id, options) {
  let color = botCache.constants.modlogs.colors.warn;
  let image = botCache.constants.modlogs.images.warn;
  switch (options.action) {
    case `ban`:
      color = botCache.constants.modlogs.colors.ban;
      image = botCache.constants.modlogs.images.ban;
      break;
    case `unban`:
      color = botCache.constants.modlogs.colors.unban;
      image = botCache.constants.modlogs.images.unban;
      break;
    case `mute`:
      color = botCache.constants.modlogs.colors.mute;
      image = botCache.constants.modlogs.images.mute;
      break;
    case `unmute`:
      color = botCache.constants.modlogs.colors.unmute;
      image = botCache.constants.modlogs.images.unmute;
      break;
    case `kick`:
      color = botCache.constants.modlogs.colors.kick;
      image = botCache.constants.modlogs.images.kick;
      break;
  }

  const REASON = translate(message.guildID, `strings:REASON`, {
    reason: options.reason,
  });
  const MODERATOR = translate(message.guildID, `strings:MODLOG_MODERATOR`, {
    name: `${message.author.username}#${message.author.discriminator} *(${message.author.id})*`,
  });

  const UNKNOWN = translate(message.guildID, "strings:UNKNOWN");
  let user = options.member?.tag;
  if (!user) {
    user = options.userID
      ? (await getUser(options.userID)
          .then((u) => `${u.username}#${u.discriminator}`)
          .catch(console.log)) || UNKNOWN
      : UNKNOWN;
  }

  const MEMBER = translate(message.guildID, `strings:MODLOG_MEMBER`, {
    name: `${user} *(${options.member?.id || options.userID})*`,
  });
  const DURATION = options.duration
    ? translate(message.guildID, `strings:MODLOG_DURATION`, {
        duration: humanizeMilliseconds(options.duration),
      })
    : undefined;

  const description = [MODERATOR, MEMBER, REASON];

  if (DURATION) description.push(DURATION);

  return new Embed()
    .setAuthor(botCache.helpers.toTitleCase(options.action), options.member ? options.member.avatarURL : undefined)
    .setColor(color)
    .setThumbnail(image)
    .setDescription(description.join(`\n`))
    .setFooter(translate(message.guildID, `strings:MODLOG_CASE`, { id }))
    .setTimestamp();
};
