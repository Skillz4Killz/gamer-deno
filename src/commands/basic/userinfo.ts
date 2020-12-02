import { botCache } from "../../../cache.ts";
import {
  cache,
  memberIDHasPermission,
  Permission,
  Permissions,
} from "../../../deps.ts";
import { translate } from "../../utils/i18next.ts";
import {
  createCommand,
  humanizeMilliseconds,
  sendEmbed,
} from "../../utils/helpers.ts";

createCommand({
  name: `user`,
  aliases: ["userinfo", "ui"],
  botChannelPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
  guildOnly: true,
  arguments: [
    {
      name: "member",
      type: "member",
      required: false,
    },
  ] as const,
  execute: async (message, args, guild) => {
    if (!guild) return;

    const member = args.member || cache.members.get(message.author.id);
    if (!member) return;

    const guildMember = member.guilds.get(message.guildID);
    if (!guildMember) return;

    const roles = guildMember.roles.filter((id) => guild.roles.has(id))
      .sort((a, b) =>
        (guild.roles.get(b)?.position || 0) -
        (guild.roles.get(a)?.position || 0)
      )
      .map((id) => `<@&${id}>`)
      .join(`, `);

    const createdAt = botCache.helpers.snowflakeToTimestamp(member.id);
    const memberPerms = Object.keys(Permissions).filter((key) =>
      isNaN(Number(key))
    )
      .map((key) =>
        memberIDHasPermission(
            member.id,
            message.guildID,
            [key as Permission],
          )
          ? key
          : ""
      ).filter((k) => k);

    const embed = botCache.helpers.authorEmbed(message)
      .setThumbnail(member.avatarURL)
      .addField(translate(guild.id, "strings:USER_ID"), member.id, true)
      .addField(
        translate(guild.id, "strings:CREATED_ON"),
        [
          new Date(createdAt)
            .toISOString().substr(0, 10),
          humanizeMilliseconds(Date.now() - createdAt),
        ].join("\n"),
        true,
      )
      .addField(
        translate(guild.id, "strings:JOINED_ON"),
        [
          new Date(guildMember.joinedAt).toISOString().substr(0, 10),
          humanizeMilliseconds(Date.now() - guildMember.joinedAt),
        ].join("\n"),
        true,
      )
      .addField(
        translate(guild.id, `strings:PERMISSIONS`),
        memberPerms.includes("ADMINISTRATOR")
          ? translate(guild.id, `strings:ADMIN`)
          : memberPerms.sort().join(`, `),
      );

    if (roles) embed.addField(translate(guild.id, `strings:ROLES`), roles);

    sendEmbed(message.channelID, embed);
    // TODO: Complete mission
  },
});
