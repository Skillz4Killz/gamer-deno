// This command is intentionally different from other commands to show that they can also be done this way.
// This is the ideal way because it will give you automated typings.
import { botCache } from "../../../mod.ts";
import { avatarURL, guildIconURL, sendMessage } from "../../../deps.ts";
import { translate } from "../../utils/i18next.ts";

botCache.commands.set(`avatar`, {
  name: `avatar`,
  guildOnly: true,
  arguments: [
    { name: "server", type: "string", literals: ["server"], required: false },
  ],
  execute: (message, args: AvatarArgs, guild) => {
    const member = message.mentions.length
      ? message.mentions()[0]
      : message.member()!;

    const url = args.server && guild
      ? guildIconURL(guild, 2048)
      : avatarURL(member, 2048);

    const description = `[${
      translate(message.guildID, "common:DOWNLOAD_LINK")
    }](${url})`;

    return sendMessage(message.channel, {
      embed: {
        description,
        author: { name: member.tag, icon_url: avatarURL(member) },
        image: { url },
      },
    });
  },
});

interface AvatarArgs {
  server?: "server";
}
