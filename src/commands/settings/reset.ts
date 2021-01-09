import { botCache, cache } from "../../../deps.ts";
import { db } from "../../database/database.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createSubcommand } from "../../utils/helpers.ts";

createSubcommand("settings", {
  name: "reset",
  guildOnly: true,
  permissionLevels: [PermissionLevels.SERVER_OWNER],
  execute: async function (message, args, guild) {
    if (!guild) return;

    // REMOVE ALL GUILD RELATED STUFF FROM CACHE
    botCache.analyticsDetails.forEach(async (value, key) => {
      const [x, guildID] = key.split("-");
      if (guildID === message.guildID) botCache.analyticsDetails.delete(key);
    });
    botCache.analyticsMemberJoin.delete(message.guildID);
    botCache.analyticsMemberLeft.delete(message.guildID);
    botCache.analyticsMessages.delete(message.guildID);
    botCache.autoEmbedChannelIDs.forEach(async (id) => {
      const channel = cache.channels.get(id);
      if (channel?.guildID === message.guildID) {
        return botCache.autoEmbedChannelIDs.delete(id);
      }
    });
    botCache.commandPermissions.forEach(async (perm, key) => {
      if (perm.guildID === message.guildID) {
        botCache.commandPermissions.delete(key);
      }
    });
    botCache.guildLanguages.delete(message.guildID);
    botCache.guildPrefixes.delete(message.guildID);
    botCache.guildSupportChannelIDs.delete(message.guildID);
    botCache.guildsXPPerMessage.delete(message.guildID);
    botCache.guildsXPPerMinuteVoice.delete(message.guildID);
    botCache.invites.forEach(async (invite, key) => {
      if (invite.guildID === message.guildID) botCache.invites.delete(key);
    });
    botCache.mirrors.forEach(async (mirrors, key) => {
      mirrors.forEach(async (mirror) => {
        if (mirror.guildID === message.guildID) botCache.mirrors.delete(key);
        if (mirror.sourceGuildID === message.guildID) {
          botCache.mirrors.delete(key);
        }
        if (mirror.mirrorGuildID === message.guildID) {
          botCache.mirrors.delete(key);
        }
      });
    });
    botCache.missionsDisabledGuildIDs.delete(message.guildID);
    botCache.tenorDisabledGuildIDs.delete(message.guildID);
    botCache.xpEnabledGuildIDs.delete(message.guildID);

    // REMOVE ALL GUILD RELATED STUFF FROM DATABASE
    await db.aggregatedanalytics.deleteMany({ guildID: message.guildID });
    await db.analytics.delete(message.guildID);
    await db.autoreact.deleteMany({ guildID: message.guildID });
    await db.commands.deleteMany({ guildID: message.guildID });
    await db.counting.deleteMany({ guildID: message.guildID });
    await db.defaultrolesets.deleteMany({ guildID: message.guildID });
    await db.emojis.deleteMany({ guildID: message.guildID });
    await db.events.deleteMany({ guildID: message.guildID });
    await db.feedbacks.deleteMany({ guildID: message.guildID });
    await db.giveaways.deleteMany({ guildID: message.guildID });
    await db.groupedrolesets.deleteMany({ guildID: message.guildID });
    await db.guilds.delete(message.guildID);
    await db.labels.deleteMany({ guildID: message.guildID });
    await db.levels.deleteMany({ guildID: message.guildID });
    await db.mails.deleteMany({ guildID: message.guildID });
    await db.mirrors.deleteMany({ guildID: message.guildID });
    await db.mirrors.deleteMany({ sourceGuildID: message.guildID });
    await db.mirrors.deleteMany({ mirrorGuildID: message.guildID });
    await db.modlogs.deleteMany({ guildID: message.guildID });
    await db.modules.deleteMany({ guildID: message.guildID });
    await db.mutes.deleteMany({ guildID: message.guildID });
    await db.polls.deleteMany({ guildID: message.guildID });
    await db.reactionroles.deleteMany({ guildID: message.guildID });
    await db.reminders.deleteMany({ guildID: message.guildID });
    await db.requiredrolesets.deleteMany({ guildID: message.guildID });
    await db.rolemessages.deleteMany({ guildID: message.guildID });
    await db.serverlogs.delete(message.guildID);
    await db.shortcuts.deleteMany({ guildID: message.guildID });
    await db.surveys.deleteMany({ guildID: message.guildID });
    await db.tags.deleteMany({ guildID: message.guildID });
    await db.uniquerolesets.deleteMany({ guildID: message.guildID });
    await db.welcome.delete(message.guildID);
    await db.xp.deleteMany({ guildID: message.guildID });

    // ALERTS ARE HANDLED SPECIALLY
    const [facebook, instagram, manga, reddit, twitch, twitter, youtube] =
      await Promise.all([
        await db.facebook.getAll(true),
        await db.instagram.getAll(true),
        await db.manga.getAll(true),
        await db.reddit.getAll(true),
        await db.twitch.getAll(true),
        await db.twitter.getAll(true),
        await db.youtube.getAll(true),
      ]);

    for (const alert of facebook) {
      if (
        !alert.subscriptions.some((sub) => sub.guildID === message.guildID)
      ) {
        continue;
      }
      await db.facebook.update(
        alert.id,
        {
          subscriptions: alert.subscriptions.filter((sub) =>
            sub.guildID !== message.guildID
          ),
        },
      );
    }

    for (const alert of instagram) {
      if (
        !alert.subscriptions.some((sub) => sub.guildID === message.guildID)
      ) {
        continue;
      }
      await db.instagram.update(
        alert.id,
        {
          subscriptions: alert.subscriptions.filter((sub) =>
            sub.guildID !== message.guildID
          ),
        },
      );
    }

    for (const alert of manga) {
      if (
        !alert.subscriptions.some((sub) => sub.guildID === message.guildID)
      ) {
        continue;
      }
      await db.manga.update(
        alert.id,
        {
          subscriptions: alert.subscriptions.filter((sub) =>
            sub.guildID !== message.guildID
          ),
        },
      );
    }

    for (const alert of reddit) {
      if (
        !alert.subscriptions.some((sub) => sub.guildID === message.guildID)
      ) {
        continue;
      }
      await db.reddit.update(
        alert.id,
        {
          subscriptions: alert.subscriptions.filter((sub) =>
            sub.guildID !== message.guildID
          ),
        },
      );
    }

    for (const alert of twitch) {
      if (
        !alert.subscriptions.some((sub) => sub.guildID === message.guildID)
      ) {
        continue;
      }
      await db.twitch.update(
        alert.id,
        {
          subscriptions: alert.subscriptions.filter((sub) =>
            sub.guildID !== message.guildID
          ),
        },
      );
    }

    for (const alert of twitter) {
      if (
        !alert.subscriptions.some((sub) => sub.guildID === message.guildID)
      ) {
        continue;
      }
      await db.twitter.update(
        alert.id,
        {
          subscriptions: alert.subscriptions.filter((sub) =>
            sub.guildID !== message.guildID
          ),
        },
      );
    }

    for (const alert of youtube) {
      if (
        !alert.subscriptions.some((sub) => sub.guildID === message.guildID)
      ) {
        continue;
      }
      await db.youtube.update(
        alert.id,
        {
          subscriptions: alert.subscriptions.filter((sub) =>
            sub.guildID !== message.guildID
          ),
        },
      );
    }
  },
});
