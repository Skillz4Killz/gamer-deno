import { cache } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/next/src/utils/cache.ts";
import { botCache } from "../../deps.ts";
import { db } from "../database/database.ts";

botCache.tasks.set('database', {
    name: "database",
    interval: botCache.constants.milliseconds.WEEK,
    execute: async function () {
        const now = Date.now();

        // FOR EVERY TABLE, WE RUN ONCE A WEEK AND CLEAN UP ANYTHING NO LONGER USED

        // AGGREGATED ANALYTICS TABLE
        const aggregatedanalytics = await db.aggregatedanalytics.getAll(true);
        aggregatedanalytics.forEach(analytic => {
            // IF THE GUILD IS NO LONGER VIP WE HAVE NO REASON TO KEEP IT
            if (!botCache.vipGuildIDs.has(analytic.guildID)) return db.aggregatedanalytics.delete(analytic.id);
            // IF IT IS MORE THAN 3 MONTHS OLD DELETE IT
            if (now > botCache.constants.milliseconds.MONTH * 3) db.aggregatedanalytics.delete(analytic.id);
        })

        // ANALYTICS TABLE CAN BE SKIPPED AS IT IS CLEANED IN ITS OWN TASK DAILY

        // AUTOREACT TABLE
        const autoreacts = await db.autoreact.getAll(true);
        autoreacts.forEach(react => {
            // IF NO LONGER VIP, DELETE IT
            if (!botCache.vipGuildIDs.has(react.guildID)) return db.autoreact.delete(react.id);
            
            // CHECK IF GUILD EXISTS STILL
            const guild = cache.guilds
            const channel = cache.channels.get(react.id);
        })
        
        //   autoreact: new SabrTable<AutoreactSchema>(sabr, "autoreact"),
        //   blacklisted: new SabrTable<BlacklistedSchema>(sabr, "blacklisted"),
        //   client: new SabrTable<ClientSchema>(sabr, "client"),
        //   commands: new SabrTable<CommandSchema>(sabr, "commands"),
        //   counting: new SabrTable<CountingSchema>(sabr, "counting"),
        //   defaultrolesets: new SabrTable<DefaultRoleSetsSchema>(
        //     sabr,
        //     "defaultrolesets",
        //   ),
        //   emojis: new SabrTable<EmojiSchema>(sabr, "emojis"),
        //   events: new SabrTable<EventsSchema>(sabr, "events"),
        //   feedbacks: new SabrTable<FeedbackSchema>(sabr, "feedbacks"),
        //   gachas: new SabrTable<GachaSchema>(sabr, "gachas"),
        //   giveaways: new SabrTable<GiveawaySchema>(sabr, "giveaways"),
        //   groupedrolesets: new SabrTable<GroupedRoleSetsSchema>(
        //     sabr,
        //     "groupedrolesets",
        //   ),
        //   guilds: new SabrTable<GuildSchema>(sabr, "guilds"),
        //   idle: new SabrTable<IdleSchema>(sabr, "idle"),
        //   items: new SabrTable<ItemSchema>(sabr, "items"),
        //   labels: new SabrTable<LabelSchema>(sabr, "labels"),
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
        //   rolemessages: new SabrTable<RolemessageSchema>(sabr, "rolemessages"),
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
    }
})