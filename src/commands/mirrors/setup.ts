import { botCache, botID, cache, createGuildChannel, createWebhook, OverwriteType } from "../../../deps.ts";
import { db } from "../../database/database.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createSubcommand } from "../../utils/helpers.ts";
import { translate } from "../../utils/i18next.ts";

createSubcommand("mirrors", {
  name: "setup",
  permissionLevels: [PermissionLevels.ADMIN],
  botServerPermissions: ["ADMINISTRATOR"],
  guildOnly: true,
  arguments: [
    {
      name: "type",
      type: "string",
      literals: ["confessions"],
      required: false,
    },
  ] as const,
  execute: async function (message, args, guild) {
    if (!guild) return;

    // Sets up all types
    if (!args.type || args.type === "confessions") {
      // Create new channel called confess-here where users can talk
      // Create new channel called #confessions where users can't talk
      const [confessional, exposed] = await Promise.all([
        createGuildChannel(guild, translate(message.guildID, "strings:CONFESS_CHANNEL_NAME_1")),
        createGuildChannel(guild, translate(message.guildID, "strings:CONFESS_CHANNEL_NAME_2"), {
          permissionOverwrites: [
            {
              id: message.guildID,
              type: OverwriteType.ROLE,
              allow: ["VIEW_CHANNEL"],
              deny: ["SEND_MESSAGES"],
            },
          ],
        }),
      ]);

      // All requirements passed time to create a webhook.
      const webhook = await createWebhook(exposed.id, {
        name: "Gamer Mirror",
        avatar: cache.members.get(botID)?.avatarURL,
      });

      await db.mirrors.create(message.id, {
        id: message.id,
        sourceChannelID: confessional.id,
        mirrorChannelID: exposed.id,
        sourceGuildID: message.guildID,
        mirrorGuildID: message.guildID,
        webhookToken: webhook.token!,
        webhookID: webhook.id,
        deleteSourceMessages: botCache.vipGuildIDs.has(message.guildID),
        anonymous: botCache.vipGuildIDs.has(message.guildID),
        filterImages: false,
      });

      const mirrorSettings = await db.mirrors.get(message.id);
      if (!mirrorSettings) return botCache.helpers.reactError(message);

      botCache.mirrors.set(confessional.id, [mirrorSettings]);
      return botCache.helpers.reactSuccess(message);
    }
  },
});
