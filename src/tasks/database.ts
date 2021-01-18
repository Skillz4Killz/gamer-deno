import { botCache, cache, getChannel } from "../../deps.ts";
import { db } from "../database/database.ts";

botCache.tasks.set("database", {
  name: "database",
  interval: botCache.constants.milliseconds.WEEK,
  execute: async function () {
    const now = Date.now();

    // FOR EVERY TABLE, WE RUN ONCE A WEEK AND CLEAN UP ANYTHING NO LONGER USED

    // AGGREGATED ANALYTICS TABLE
    const aggregatedanalytics = await db.aggregatedanalytics.getAll(true);
    aggregatedanalytics.forEach(async (analytic) => {
      // IF THE GUILD IS NO LONGER VIP WE HAVE NO REASON TO KEEP IT
      if (!botCache.vipGuildIDs.has(analytic.guildID)) {
        return db.aggregatedanalytics.delete(analytic.id);
      }
      // IF IT IS MORE THAN 3 MONTHS OLD DELETE IT
      if (now > botCache.constants.milliseconds.MONTH * 3) {
        await db.aggregatedanalytics.delete(analytic.id);
      }
    });

    // ANALYTICS TABLE CAN BE SKIPPED AS IT IS CLEANED IN ITS OWN TASK DAILY

    // AUTOREACT TABLE
    const autoreacts = await db.autoreact.getAll(true);
    autoreacts.forEach(async (react) => {
      // IF NO LONGER VIP, DELETE IT
      if (!botCache.vipGuildIDs.has(react.guildID)) {
        return db.autoreact.delete(react.id);
      }

      // CHECK IF IT WAS DISPATCHED
      if (botCache.dispatchedGuildIDs.has(react.guildID)) return;
      // CHANNEL WAS DISPATCHED SO SKIP
      if (botCache.dispatchedChannelIDs.has(react.id)) return;

      // CHECK IF GUILD EXISTS STILL
      const guild = cache.guilds.get(react.guildID);
      if (guild) {
        // GUILD STILL EXIST, CHECK IF CHANNEL STILL EXISTS
        const channel = cache.channels.get(react.id);
        if (channel) return;
        // IF CHANNEL WAS DISPATCHED SKIP
        if (botCache.dispatchedChannelIDs.has(react.id)) return;
        // CHANNEL WAS NOT IN CACHE, TRY ONE SAFETY MEASURE CHECK
        if (await getChannel(react.id)) return;
        // CHANNEL NO LONGER EXISTS, DELETE FROM DB
        return db.autoreact.delete(react.id);
      }

      // DELETE
      await db.autoreact.delete(react.id);
    });

    // BLACKLISTED TABLE SHOULD NOT BE CLEANED
    // CLIENT TABLE SHOULD NOT BE CLEANED

    // COMMANDS PERMISSIONS TABLE
    const commandPermissions = await db.commands.getAll();
    commandPermissions.forEach(async (perm) => {
      // CHECK IF IT WAS DISPATCHED
      if (botCache.dispatchedGuildIDs.has(perm.guildID)) return;

      // CHECK IF THE ROLE IDS OR CHANNEL IDS ARE NO LONGER VALID
      const guild = cache.guilds.get(perm.guildID);
      // THE GUILD WAS NOT DISPATCHED AND DOES NOT EXIST ANYMORE SO DELETE
      if (!guild) return db.commands.delete(perm.id);

      // ONLY KEEP VALID ROLES
      const roleIDs = perm.exceptionRoleIDs.filter((id) => guild.roles.has(id));
      // ONLY KEEP VALID CHANNELS
      const channelIDs = perm.exceptionChannelIDs.filter((id) =>
        cache.channels.has(id)
      );

      // REMOVE INVALID IF NECESSARY
      if (
        (roleIDs.length !== perm.exceptionRoleIDs.length) ||
        channelIDs.length !== perm.exceptionChannelIDs.length
      ) {
        await db.commands.update(
          perm.id,
          {
            ...perm,
            exceptionChannelIDs: channelIDs,
            exceptionRoleIDs: roleIDs,
          },
        );
      }
    });

    // COUNTING TABLE
    const counting = await db.counting.getAll();
    counting.forEach(async (count) => {
      // CHECK IF IT WAS DISPATCHED
      if (botCache.dispatchedGuildIDs.has(count.guildID)) return;
      // CHANNEL WAS DISPATCHED SO SKIP
      if (botCache.dispatchedChannelIDs.has(count.id)) return;

      const channel = cache.channels.get(count.id);
      const guild = cache.guilds.get(count.guildID);
      // GUILD & CHANNEL ARE DELETED, SO REMOVE
      if (!channel || !guild) return db.counting.delete(count.id);

      // LOSER ROLE NO LONGER EXISTS SO CLEAN IT
      if (!guild.roles.has(count.loserRoleID)) {
        await db.counting.update(count.id, { loserRoleID: "" });
      }
    });

    // DEFAULT ROLE SETS
    const defaultSets = await db.defaultrolesets.getAll();
    defaultSets.forEach(async (set) => {
      // IF NO LONGER VIP DELETE
      if (!botCache.vipGuildIDs.has(set.guildID)) {
        return db.defaultrolesets.delete(set.id);
      }

      // CHECK IF IT WAS DISPATCHED
      if (botCache.dispatchedGuildIDs.has(set.guildID)) return;

      // CHECK IF GUILD STILL EXISTS
      const guild = cache.guilds.get(set.guildID);
      if (!guild) return db.defaultrolesets.delete(set.id);

      // GUILD EXISTS, MAKE SURE ROLES ARE VALID
      if (!guild.roles.has(set.defaultRoleID)) {
        return db.defaultrolesets.delete(set.id);
      }
      if (set.roleIDs.some((id) => !guild.roles.has(id))) {
        await db.defaultrolesets.update(set.id, {
          roleIDs: set.roleIDs.filter((id) => guild.roles.has(id)),
        });
      }
    });

    // EMOJIS TABLE
    const emojis = await db.emojis.getAll();
    emojis.forEach(async (emoji) => {
      // CHECK IF IT WAS DISPATCHED
      if (botCache.dispatchedGuildIDs.has(emoji.guildID)) return;

      // CHECK IF GUILD STILL EXISTS
      const guild = cache.guilds.get(emoji.guildID);
      if (!guild) return db.emojis.delete(emoji.id);

      // EMOJI NO LONGER EXISTS
      if (!guild.emojis.find((e) => e.id && e.id === emoji.emojiID)) {
        return db.emojis.delete(emoji.id);
      }
    });

    // EVENTS TABLE
    const events = await db.events.getAll();
    events.forEach(async (event) => {
      // CHECK IF IT WAS DISPATCHED
      if (botCache.dispatchedGuildIDs.has(event.guildID)) return;

      // CHECK IF GUILD STILL EXISTS
      const guild = cache.guilds.get(event.guildID);
      if (!guild) return db.events.delete(event.id);
    });

    // EVENTS TABLE
    const feedbacks = await db.feedbacks.getAll();
    feedbacks.forEach(async (feedback) => {
      // CHECK IF IT WAS DISPATCHED
      if (botCache.dispatchedGuildIDs.has(feedback.guildID)) return;

      // CHECK IF GUILD STILL EXISTS
      const guild = cache.guilds.get(feedback.guildID);
      if (!guild) return db.feedbacks.delete(feedback.id);
    });

    // EVENTS TABLE
    const giveaways = await db.giveaways.getAll();
    giveaways.forEach(async (giveaway) => {
      // CHECK IF IT WAS DISPATCHED
      if (botCache.dispatchedGuildIDs.has(giveaway.guildID)) return;

      // CHECK IF GUILD STILL EXISTS
      const guild = cache.guilds.get(giveaway.guildID);
      if (!guild) return db.giveaways.delete(giveaway.id);
    });

    // GROUPED ROLE SETS
    const groupedSets = await db.groupedrolesets.getAll();
    groupedSets.forEach(async (set) => {
      // IF NO LONGER VIP DELETE
      if (!botCache.vipGuildIDs.has(set.guildID)) {
        return db.groupedrolesets.delete(set.id);
      }

      // CHECK IF IT WAS DISPATCHED
      if (botCache.dispatchedGuildIDs.has(set.guildID)) return;

      // CHECK IF GUILD STILL EXISTS
      const guild = cache.guilds.get(set.guildID);
      if (!guild) return db.groupedrolesets.delete(set.id);

      // GUILD EXISTS, MAKE SURE ROLES ARE VALID
      if (!guild.roles.has(set.mainRoleID)) {
        return db.groupedrolesets.delete(set.id);
      }
      if (set.roleIDs.some((id) => !guild.roles.has(id))) {
        await db.groupedrolesets.update(set.id, {
          roleIDs: set.roleIDs.filter((id) => guild.roles.has(id)),
        });
      }
    });

    const guilds = await db.guilds.getAll();
    guilds.forEach(async (guild) => {
      // CHECK IF IT WAS DISPATCHED
      if (botCache.dispatchedGuildIDs.has(guild.id)) return;

      // CHECK IF GUILD STILL EXISTS
      const cached = cache.guilds.get(guild.id);
      if (!cached) return db.guilds.delete(guild.id);
    });

    // IDLE TABLE
    const idles = await db.idle.getAll();
    idles.forEach(async (idle) => {
      const idsToRemove: string[] = [];

      for (const id of idle.guildIDs) {
        // CHECK IF IT WAS DISPATCHED.
        if (botCache.dispatchedGuildIDs.has(id)) continue;

        // CHECK IF GUILD STILL EXISTS
        const guild = cache.guilds.get(id);
        if (guild) continue;

        // GUILD WAS REMOVED
        await db.idle.update(
          idle.id,
          { guildIDs: idle.guildIDs.filter((id) => idsToRemove.includes(id)) },
        );
      }
    });

    // LABELS TABLE
    const labels = await db.labels.getAll();
    labels.forEach(async (label) => {
      // CHECK IF IT WAS DISPATCHED. BOTH OF EM
      if (
        botCache.dispatchedGuildIDs.has(label.guildID) &&
        botCache.dispatchedGuildIDs.has(label.mainGuildID)
      ) {
        return;
      }

      // CHECK IF GUILD STILL EXISTS
      const guild = cache.guilds.get(label.guildID);
      const main = cache.guilds.get(label.mainGuildID);
      if (!guild || !main) return db.labels.delete(label.id);
    });

    // TODO: FINISH THE REST
    //   levels: new SabrTable<LevelSchema>(sabr, "levels"),
    //   mails: new SabrTable<MailSchema>(sabr, "mails"),
    //   marriages: new SabrTable<MarriageSchema>(sabr, "marriages"),
    //   mirrors: new SabrTable<MirrorSchema>(sabr, "mirrors"),
    //   mission: new SabrTable<MissionSchema>(sabr, "mission"),
    //   modlogs: new SabrTable<ModlogSchema>(sabr, "modlogs"),
    //   modules: new SabrTable<ModulesSchema>(sabr, "modules"),
    //   mutes: new SabrTable<MuteSchema>(sabr, "mutes"),
    //   polls: new SabrTable<PollsSchema>(sabr, "polls"),
    //   reactionroles: new SabrTable<ReactionRoleSchema>(sabr, "reactionroles"),
    //   reminders: new SabrTable<ReminderSchema>(sabr, "reminders"),
    //   requiredrolesets: new SabrTable<RequiredRoleSetsSchema>(
    //     sabr,
    //     "requiredrolesets",
    //   ),

    // ROLE MESSAGES
    const rolemessages = await db.rolemessages.getAll();
    rolemessages.forEach(async (rm) => {
      // IF NO LONGER VIP DELETE
      if (!botCache.vipGuildIDs.has(rm.guildID)) {
        return db.rolemessages.delete(rm.id);
      }

      // CHECK IF IT WAS DISPATCHED
      if (botCache.dispatchedGuildIDs.has(rm.guildID)) return;

      // CHECK IF GUILD STILL EXISTS
      const guild = cache.guilds.get(rm.guildID);
      if (!guild) return db.rolemessages.delete(rm.id);

      // GUILD EXISTS, MAKE SURE ROLE IS VALID
      if (!guild.roles.has(rm.id)) {
        return db.rolemessages.delete(rm.id);
      }
    });

    //   serverlogs: new SabrTable<ServerlogsSchema>(sabr, "serverlogs"),
    //   shortcuts: new SabrTable<ShortcutSchema>(sabr, "shortcuts"),
    //   spy: new SabrTable<SpySchema>(sabr, "spy"),
    //   surveys: new SabrTable<SurveySchema>(sabr, "surveys"),
    //   tags: new SabrTable<TagSchema>(sabr, "tags"),
    //   uniquerolesets: new SabrTable<UniqueRoleSetsSchema>(sabr, "uniquerolesets"),
    //   users: new SabrTable<UserSchema>(sabr, "users"),
    //   xp: new SabrTable<XPSchema>(sabr, "xp"),
    //   welcome: new SabrTable<WelcomeSchema>(sabr, "welcome"),

    //   // Alerts tables
    //   reddit: new SabrTable<AlertsSchema>(sabr, "reddit"),
    //   manga: new SabrTable<AlertsSchema>(sabr, "manga"),
    //   twitch: new SabrTable<AlertsSchema>(sabr, "twitch"),
    //   youtube: new SabrTable<AlertsSchema>(sabr, "youtube"),
    //   twitter: new SabrTable<AlertsSchema>(sabr, "twitter"),
    //   instagram: new SabrTable<AlertsSchema>(sabr, "instagram"),
    //   facebook: new SabrTable<AlertsSchema>(sabr, "facebook"),
  },
});
