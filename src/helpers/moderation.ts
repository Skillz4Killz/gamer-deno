import { cache, avatarURL, getUser } from "../../deps.ts";
import { botCache } from "../../mod.ts";
import { guildsDatabase } from "../database/schemas/guilds.ts";
import { modlogsDatabase } from "../database/schemas/modlogs.ts";
import { Embed } from "../utils/Embed.ts";
import { humanizeMilliseconds, sendEmbed } from "../utils/helpers.ts";
import { translate } from "../utils/i18next.ts";

botCache.helpers.createModlog = async function (message, options) {
  const settings = botCache.vipGuildIDs.has(message.guildID)
    ? await guildsDatabase.findOne({ guildID: message.guildID })
    : undefined;
  const user = options.member
    ? options.member.user
    : options.userID
    ? await getUser(options.userID).catch(() => undefined)
    : undefined;

  const guild = settings?.logsGuildID
    ? cache.guilds.get(settings.logsGuildID)
    : cache.guilds.get(message.guildID);

  const modlogChannel = guild?.channels.find((c) =>
    Boolean(c.topic?.includes("gamerModlogChannel"))
  );

  // If it is disabled we don't need to do anything else. Return 0 for the case number response
  if (!modlogChannel) return 0;

  const [highestID] = await modlogsDatabase.aggregate([
    { $match: { guildID: message.guildID } },
    { $group: { _id: "$guildID", modlogID: { $max: "$modlogID" } } },
  ]);

  const modlogID = highestID?.modlogID || 1;

  const embed = botCache.helpers.modlogEmbed(message, modlogID, options);

  let messageID = "";

  if (modlogChannel) {
    const logMessage = await sendEmbed(modlogChannel.id, embed);
    if (logMessage) messageID = logMessage.id;
  }

  modlogsDatabase.insertOne({
    action: options.action,
    guildID: message.guildID,
    modID: message.author.id,
    modlogID,
    messageID: messageID,
    reason: options.reason,
    timestamp: message.timestamp,
    userID: options.member?.user.id || options.userID,
    duration: options.action === "mute" && options.duration
      ? options.duration
      : undefined,
    needsUnmute: options.action === "mute" && options.duration ? true : false,
  });

  const publicChannel = guild?.channels.find((c) =>
    Boolean(c.topic?.includes("gamerPublicLogChannel"))
  );
  if (!publicChannel) return modlogID;

  embed.setDescription(
    [
      translate(
        message.guildID,
        `commands/modlog:MEMBER`,
        {
          name: `${options.member?.tag} *(${options.member?.user.id ||
            options.userID})*`,
        },
      ),
      translate(
        message.guildID,
        `commands/modlog:REASON`,
        { reason: options.reason },
      ),
    ].join("\n"),
  );

  sendEmbed(publicChannel.id, embed);
  return modlogID;
};

botCache.helpers.modlogEmbed = function (message, id, options) {
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

  const REASON = translate(
    message.guildID,
    `commands/modlog:REASON`,
    { reason: options.reason },
  );
  const MODERATOR = translate(
    message.guildID,
    `commands/modlog:MODERATOR`,
    { name: `${message.member()?.tag} *(${message.author.id})*` },
  );
  const MEMBER = translate(
    message.guildID,
    `commands/modlog:MEMBER`,
    {
      name: `${options.member?.tag} *(${options.member?.user.id ||
        options.userID})*`,
    },
  );
  const DURATION = options.duration
    ? translate(
      message.guildID,
      `commands/modlog:DURATION`,
      { duration: humanizeMilliseconds(options.duration) },
    )
    : undefined;

  const description = [
    MODERATOR,
    MEMBER,
    REASON,
  ];

  if (DURATION) description.push(DURATION);

  return new Embed()
    .setAuthor(
      botCache.helpers.toTitleCase(options.action),
      options.member ? avatarURL(options.member) : undefined,
    )
    .setColor(color)
    .setThumbnail(image)
    .setDescription(description.join(`\n`))
    .setFooter(
      translate(message.guildID, `commands/modlog:CASE`, { id }),
    )
    .setTimestamp();
};
