import { botCache, cache, fetchMembers } from "../../../deps.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createSubcommand } from "../../utils/helpers.ts";
import { Embed } from "../../utils/Embed.ts";
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

    let botCount = 0;
    let memberCount = 0;

    args.role.members.forEach((member) => (member.bot ? ++botCount : ++memberCount));

    const color = args.role.color.toString(16);
    const embed = new Embed()
      .setColor(color)
      .setTitle(args.role.name)
      .addField(translate(message.guildID, "strings:ROLE_USERCOUNT"), memberCount.toLocaleString(), false)
      .addField(translate(message.guildID, "strings:ROLE_BOTCOUNT"), botCount.toLocaleString(), false)
      .setFooter(translate(message.guildID, "strings:CREATED_AT"))
      .setTimestamp(botCache.helpers.snowflakeToTimestamp(args.role.id));

    return message.send({ embed });
  },
});
