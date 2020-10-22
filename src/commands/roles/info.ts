import { Role } from "../../../deps.ts";
import { botCache } from "../../../mod.ts";
import { Embed } from "../../utils/Embed.ts";
import { createSubcommand, sendEmbed } from "../../utils/helpers.ts";

createSubcommand("roles", {
  name: "info",
  botChannelPermissions: ["EMBED_LINKS", "SEND_MESSAGES"],
  arguments: [{
    name: "role",
    type: "role",
  }],
  execute: function (message, args: RoleInfoArgs) {
    const color = `#${args.role.color.toString(16).toUpperCase()}`;
    const embed = new Embed()
      .setColor(color)
      .addField("Role Name", args.role.name, true)
      .addField("Role ID", args.role.id, true)
      .addField("Role Color", color, true)
      .addField(
        "Show Separately",
        args.role.hoist
          ? botCache.constants.emojis.success
          : botCache.constants.emojis.failure,
        true,
      )
      .addField(
        "Mentionable",
        args.role.mentionable
          ? botCache.constants.emojis.success
          : botCache.constants.emojis.failure,
        true,
      )
      .addField("Position", args.role.position.toString(), true)
      .setFooter("Created At:")
      .setTimestamp(botCache.helpers.snowflakeToTimestamp(args.role.id));

    sendEmbed(message.channelID, embed);
  },
});

interface RoleInfoArgs {
  role: Role;
}
