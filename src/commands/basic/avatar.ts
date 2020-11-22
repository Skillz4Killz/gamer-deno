import { translate } from "../../utils/i18next.ts";
import { botCache, cache, guildIconURL, Member } from "../../../deps.ts";
import { createCommand } from "../../utils/helpers.ts";

createCommand({
  name: "avatar",
  aliases: ["pfp"],
  guildOnly: true,
  botChannelPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
  arguments: [
    { name: "server", type: "string", literals: ["server"], required: false },
    { name: "member", type: "member", required: false },
  ],
  execute: (message, args: CommandArgs, guild) => {
    const member = args.member || cache.members.get(
      message.mentions.length ? message.mentions[0] : message.author.id,
    );
    if (!member) return botCache.helpers.reactError(message);

    const url = args.server && guild
      ? guildIconURL(guild, 2048)
      : member.avatarURL.replace("?size=128", "?size=2048");

    const description = `[${
      translate(message.guildID, "strings:DOWNLOAD_LINK")
    }](${url})`;

    return botCache.helpers.authorEmbed(message).setDescription(description)
      .setImage(url!).setColor("random");
  },
});

interface CommandArgs {
  server?: "server";
  member?: Member;
}
