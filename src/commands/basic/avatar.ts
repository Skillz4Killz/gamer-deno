import { translate } from "../../utils/i18next.ts";
import { botCache } from "../../../cache.ts";
import { guildIconURL, sendMessage } from "../../../deps.ts";
import { createCommand } from "../../utils/helpers.ts";

createCommand({
  name: "avatar",
  aliases: ["pfp"],
  guildOnly: true,
  arguments: [
    { name: "server", type: "string", literals: ["server"], required: false },
  ],
  execute: (message, args: AvatarArgs, guild) => {
    const member = guild?.members.get(
      message.mentions.length ? message.mentions[0] : message.author.id,
    );
    if (!member) return botCache.helpers.reactError(message);

    const url = args.server && guild
      ? guildIconURL(guild, 2048)
      : member.avatarURL.replace("?size=128", "?size=2048");

    const description = `[${
      translate(message.guildID, "common:DOWNLOAD_LINK")
    }](${url})`;

    return sendMessage(message.channelID, {
      embed: {
        description,
        author: { name: member.tag, icon_url: url },
        image: { url },
      },
    });
  },
});

interface AvatarArgs {
  server?: "server";
}
