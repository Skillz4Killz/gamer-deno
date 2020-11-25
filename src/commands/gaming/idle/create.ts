import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { parsePrefix } from "../../../monitors/commandHandler.ts";
import {
  createSubcommand,
  sendEmbed,
  sendResponse,
} from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";

createSubcommand("idle", {
  name: "create",
  execute: async function (message) {
    const exists = await db.idle.get(message.author.id);
    if (exists) {
      return sendResponse(
        message,
        translate(message.guildID, "strings:IDLE_PROFILE_EXISTS"),
      );
    }

    // Create the database object
    db.idle.update(message.author.id, {
      lastUpdatedAt: Date.now(),
      currency: "10",
      guildIDs: [message.guildID],
      friends: 0,
      servers: 0,
      channels: 0,
      roles: 0,
      perms: 0,
      messages: 0,
      invites: 0,
      bots: 0,
      hypesquads: 0,
      nitro: 0,
    });

    const prefix = parsePrefix(message.guildID);
    const embed = botCache.helpers.authorEmbed(message)
      .setColor("random")
      .setDescription([
        translate(message.guildID, "strings:IDLE_CREATE_1"),
        "",
        translate(message.guildID, "strings:IDLE_CREATE_2"),
        "",
        translate(message.guildID, "strings:IDLE_CREATE_3"),
        "",
        translate(message.guildID, "strings:IDLE_CREATE_4", { prefix }),
        "",
        translate(message.guildID, "strings:IDLE_GET_RICH"),
      ].join("\n"));

    sendEmbed(message.channelID, embed);
  },
});
