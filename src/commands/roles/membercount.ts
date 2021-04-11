import { botCache, fetchMembers } from "../../../deps.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { Embed } from "../../utils/Embed.ts";
import { createSubcommand } from "../../utils/helpers.ts";
import { translate } from "../../utils/i18next.ts";

createSubcommand("roles", {
  name: "membercount",
  aliases: ["mc"],
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.MODERATOR],
  botChannelPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
  guildOnly: true,
  vipServerOnly: true,
  arguments: [{ name: "role", type: "role" }] as const,
  execute: async function (message, args, guild) {
    if (!guild) return;

    if (guild.members.size !== guild.memberCount) {
      await fetchMembers(guild);
    }

    let botCount = 0;
    let memberCount = 0;

    args.role.members.forEach((member) => (member.bot ? ++botCount : ++memberCount));

    const embed = new Embed()
      .setColor(args.role.color.toString(16))
      .setTitle(args.role.name)
      .addField(translate(message.guildID, "strings:ROLE_USERCOUNT"), memberCount.toLocaleString("en-US"), false)
      .addField(translate(message.guildID, "strings:ROLE_BOTCOUNT"), botCount.toLocaleString("en-US"), false)
      .setFooter(translate(message.guildID, "strings:CREATED_AT"))
      .setTimestamp(botCache.helpers.snowflakeToTimestamp(args.role.id));

    return message.send({ embed });
  },
});
