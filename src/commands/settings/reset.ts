import { botCache, cache } from "../../../deps.ts";
import { db } from "../../database/database.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createSubcommand } from "../../utils/helpers.ts";

createSubcommand('settings', {
    name: "reset",
    guildOnly: true,
    permissionLevels: [PermissionLevels.SERVER_OWNER],
    execute: async function (message, args, guild) {
        if (!guild) return;

        // REMOVE ALL GUILD RELATED STUFF FROM CACHE
        botCache.analyticsDetails.forEach((value, key) => {
            const [x, guildID] = key.split('-');
            if (guildID === message.guildID) botCache.analyticsDetails.delete(key);
        })
        botCache.analyticsMemberJoin.delete(message.guildID);
        botCache.analyticsMemberLeft.delete(message.guildID);
        botCache.analyticsMessages.delete(message.guildID);
        botCache.autoEmbedChannelIDs.forEach(id => {
            const channel = cache.channels.get(id);
            if (channel?.guildID === message.guildID) return botCache.autoEmbedChannelIDs.delete(id);
        })
        botCache.commandPermissions.forEach((perm, key) => {
            if (perm.guildID === message.guildID) botCache.commandPermissions.delete(key);
        });
        botCache.guildLanguages.delete(message.guildID);
        botCache.guildPrefixes.delete(message.guildID);
        botCache.guildSupportChannelIDs.delete(message.guildID);
        botCache.guildsXPPerMessage.delete(message.guildID);
        botCache.guildsXPPerMinuteVoice.delete(message.guildID);
        botCache.invites.forEach((invite, key) => {
            if (invite.guildID === message.guildID) botCache.invites.delete(key);
        })
        botCache.mirrors.forEach((mirrors, key) => {
            mirrors.forEach((mirror) => {
                if (mirror.guildID === message.guildID) botCache.mirrors.delete(key);
                if (mirror.sourceGuildID === message.guildID) botCache.mirrors.delete(key);
                if (mirror.mirrorGuildID === message.guildID) botCache.mirrors.delete(key);
            })
        });
        botCache.missionsDisabledGuildIDs.delete(message.guildID);
        botCache.tenorDisabledGuildIDs.delete(message.guildID);
        botCache.xpEnabledGuildIDs.delete(message.guildID);

        // REMOVE ALL GUILD RELATED STUFF FROM DATABASE
        db.aggregatedanalytics.deleteMany({ guildID: message.guildID });
        db.analytics.delete(message.guildID);
        db.autoreact.deleteMany({ guildID: message.guildID });
        db.commands.deleteMany({ guildID: message.guildID });
        db.counting.deleteMany({ guildID: message.guildID });
        db.defaultrolesets.deleteMany({ guildID: message.guildID });
        db.emojis.deleteMany({ guildID: message.guildID });
        db.events.deleteMany({ guildID: message.guildID });
        db.feedbacks.deleteMany({ guildID: message.guildID });
        db.giveaways.deleteMany({ guildID: message.guildID });
        db.groupedrolesets.deleteMany({ guildID: message.guildID });
        db.guilds.delete(message.guildID);
        db.labels.deleteMany({ guildID: message.guildID });
        db.levels.deleteMany({ guildID: message.guildID });
        db.mails.deleteMany({ guildID: message.guildID });
        db.mirrors.deleteMany({ guildID: message.guildID });
        db.mirrors.deleteMany({ sourceGuildID: message.guildID });
        db.mirrors.deleteMany({ mirrorGuildID: message.guildID });
        db.modlogs.deleteMany({ guildID: message.guildID });
        db.modules.deleteMany({ guildID: message.guildID });
        db.mutes.deleteMany({ guildID: message.guildID });
        db.polls.deleteMany({ guildID: message.guildID });
        db.reactionroles.deleteMany({ guildID: message.guildID });
        db.reminders.deleteMany({ guildID: message.guildID });
        db.requiredrolesets.deleteMany({ guildID: message.guildID });
        db.rolemessages.deleteMany({ guildID: message.guildID });
        db.serverlogs.delete(message.guildID);
        db.shortcuts.deleteMany({ guildID: message.guildID });
        db.surveys.deleteMany({ guildID: message.guildID });
        db.tags.deleteMany({ guildID: message.guildID });
        db.uniquerolesets.deleteMany({ guildID: message.guildID });
        db.welcome.delete(message.guildID);
        db.xp.deleteMany({ guildID: message.guildID });
        
        // ALERTS ARE HANDLED SPECIALLY
        const [facebook, instagram, manga, reddit, twitch, twitter, youtube] = await Promise.all([
            db.facebook.getAll(true),
            db.instagram.getAll(true),
            db.manga.getAll(true),
            db.reddit.getAll(true),
            db.twitch.getAll(true),
            db.twitter.getAll(true),
            db.youtube.getAll(true),
        ]);

        for (const alert of facebook) {
            if (!alert.subscriptions.some(sub => sub.guildID === message.guildID)) continue;
            db.facebook.update(alert.id, { subscriptions: alert.subscriptions.filter(sub => sub.guildID !== message.guildID) })
        }

        for (const alert of instagram) {
            if (!alert.subscriptions.some(sub => sub.guildID === message.guildID)) continue;
            db.instagram.update(alert.id, { subscriptions: alert.subscriptions.filter(sub => sub.guildID !== message.guildID) })
        }

        for (const alert of manga) {
            if (!alert.subscriptions.some(sub => sub.guildID === message.guildID)) continue;
            db.manga.update(alert.id, { subscriptions: alert.subscriptions.filter(sub => sub.guildID !== message.guildID) })
        }

        for (const alert of reddit) {
            if (!alert.subscriptions.some(sub => sub.guildID === message.guildID)) continue;
            db.reddit.update(alert.id, { subscriptions: alert.subscriptions.filter(sub => sub.guildID !== message.guildID) })
        }

        for (const alert of twitch) {
            if (!alert.subscriptions.some(sub => sub.guildID === message.guildID)) continue;
            db.twitch.update(alert.id, { subscriptions: alert.subscriptions.filter(sub => sub.guildID !== message.guildID) })
        }

        for (const alert of twitter) {
            if (!alert.subscriptions.some(sub => sub.guildID === message.guildID)) continue;
            db.twitter.update(alert.id, { subscriptions: alert.subscriptions.filter(sub => sub.guildID !== message.guildID) })
        }

        for (const alert of youtube) {
            if (!alert.subscriptions.some(sub => sub.guildID === message.guildID)) continue;
            db.youtube.update(alert.id, { subscriptions: alert.subscriptions.filter(sub => sub.guildID !== message.guildID) })
        }
        
    }
})