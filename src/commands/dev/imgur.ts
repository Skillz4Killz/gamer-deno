import { configs } from "../../../configs.ts";
import { botCache } from "../../../deps.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createCommand } from "../../utils/helpers.ts";

createCommand({
  name: "imgur",
  aliases: ["img"],
  permissionLevels: [PermissionLevels.BOT_DEVS, PermissionLevels.BOT_OWNER, PermissionLevels.BOT_SUPPORT],
  arguments: [{ name: "url", type: "string" }],
  vipServerOnly: true,
  execute: async function (message, args) {
    const [attachment] = message.attachments;
    const url = attachment ? attachment.url : args.url ? args.url : undefined;
    if (!url) return botCache.helpers.reactError(message);

    if (url.includes(`imgur.com`)) return botCache.helpers.reactError(message);

    const result = await fetch(`https://api.imgur.com/3/image`, {
      method: `POST`,
      headers: {
        Authorization: `Client-ID ${configs.imgur}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: url, type: `url` }),
    })
      .then((res) => res.json())
      .catch(console.log);

    if (!result || result.status !== 200) {
      return botCache.helpers.reactError(message);
    }

    return message.send(result.data.link);
  },
});
