import { BlacklistedType } from "@prisma/client";
import { Milliseconds, Task } from "../base/typings.js";
import { Gamer } from "../bot.js";
import { prisma } from "../prisma/client.js";

export const task: Task = {
    name: "databaseCleaner",
    interval: Milliseconds.Week,
    async execute() {
        // TODO: test Send { op: null } in all shards to force resume => READy with list of guild ids???????
        const currentGuilds: string[] = [...Gamer.guilded.servers.cache.keys()];

        // For each table, remove any entries that have a a guildId that is not in the current list of guilds

        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning automod...`);
        await prisma.automod.deleteMany({ where: { guildId: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned automod.`);

        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning autoreact...`);
        await prisma.autoreact.deleteMany({ where: { guildId: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned autoreact.`);

        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning blacklisted...`);
        await prisma.blacklisted.deleteMany({ where: { type: BlacklistedType.Guild, id: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned blacklisted.`);

        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning commands...`);
        await prisma.commands.deleteMany({ where: { guildId: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned commands.`);

        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning counting...`);
        await prisma.counting.deleteMany({ where: { guildId: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned counting.`);

        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning default role sets...`);
        await prisma.defaultRoleSets.deleteMany({ where: { guildId: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned default role sets.`);

        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning emojis...`);
        await prisma.emojis.deleteMany({ where: { guildId: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned emojis.`);

        // TODO: delete all items that are in relations table
        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning events...`);
        await prisma.events.deleteMany({ where: { guildId: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned events.`);

        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning facebook...`);
        await prisma.facebook.deleteMany({ where: { guildId: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned facebook.`);

        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning feedbacks...`);
        await prisma.feedbacks.deleteMany({ where: { guildId: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned feedbacks.`);

        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning feedback settings...`);
        await prisma.feedbackSettings.deleteMany({ where: { guildId: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned feedback settings.`);
        
        // TODO: delete all items that are in relations table
        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning giveaways...`);
        await prisma.giveaways.deleteMany({ where: { guildId: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned giveaways.`);

        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned grouped role sets...`);
        await prisma.groupedRoleSets.deleteMany({ where: { guildId: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned grouped role sets.`);

        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning guilds...`);
        await prisma.guilds.deleteMany({ where: { id: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned guilds.`);

        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning items...`);
        await prisma.items.deleteMany({ where: { guildId: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned items.`);

        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning instagram...`);
        await prisma.instagram.deleteMany({ where: { guildId: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned instagram.`);

        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning labels...`);
        await prisma.labels.deleteMany({ where: { guildId: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned labels.`);

        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning levels...`);
        await prisma.levels.deleteMany({ where: { guildId: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned levels.`);

        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning leveling...`);
        await prisma.leveling.deleteMany({ where: { guildId: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned leveling.`);

        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning mails...`);
        await prisma.mails.deleteMany({ where: { guildId: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned mails.`);

        // TODO: delete all items that are in relations table
        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning mail settings...`);
        await prisma.mailSettings.deleteMany({ where: { guildId: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned mail settings.`);

        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning manga alerts...`);
        await prisma.mangaAlerts.deleteMany({ where: { guildId: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned manga alerts.`);

        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning mirrors...`);
        await prisma.mirrors.deleteMany({
            where: {
                OR: [{ sourceGuildId: { notIn: currentGuilds } }, { mirrorGuildId: { notIn: currentGuilds } }],
            },
        });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned mirrors.`);

        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning modlogs...`);
        await prisma.modlogs.deleteMany({ where: { guildId: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned modlogs.`);

        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning modules...`);
        await prisma.modules.deleteMany({ where: { guildId: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned modules.`);

        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning mutes...`);
        await prisma.mutes.deleteMany({ where: { guildId: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned mutes.`);

        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning polls...`);
        await prisma.polls.deleteMany({ where: { guildId: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned polls.`);

        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning reddit...`);
        await prisma.reddit.deleteMany({ where: { guildId: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned reddit.`);

        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning reminders...`);
        await prisma.reminders.deleteMany({ where: { guildId: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned reminders.`);

        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning requiredRoleSets...`);
        await prisma.requiredRoleSets.deleteMany({ where: { guildId: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned requiredRoleSets.`);

        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning roleMessages...`);
        await prisma.roleMessages.deleteMany({ where: { guildId: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned roleMessages.`);

        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning serverLogs...`);
        await prisma.serverLogs.deleteMany({ where: { guildId: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned serverLogs.`);

        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning shortcuts...`);
        await prisma.shortcuts.deleteMany({ where: { guildId: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned shortcuts.`);

        // await prisma.surveys.deleteMany({ where: { guildId: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning tags...`);
        await prisma.tags.deleteMany({ where: { guildId: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned tags.`);

        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning todos...`);
        await prisma.todos.deleteMany({ where: { guildId: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned todos.`);

        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning twitch...`);
        await prisma.twitch.deleteMany({ where: { guildId: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned twitch.`);

        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning twitter...`);
        await prisma.twitter.deleteMany({ where: { guildId: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned twitter.`);

        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning uniqueRolesets...`);
        await prisma.uniqueRolesets.deleteMany({ where: { guildId: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned uniqueRolesets.`);

        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning verifications...`);
        await prisma.verifications.deleteMany({ where: { guildId: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned verifications.`);

        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning vipGuilds...`);
        await prisma.vipGuilds.deleteMany({ where: { guildId: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned vipGuilds.`);

        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning xp...`);
        await prisma.xp.deleteMany({ where: { guildId: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned xp.`);

        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning welcome...`);
        await prisma.welcome.deleteMany({ where: { guildId: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned welcome.`);

        Gamer.loggers.discord.info(`[Database Task] ⌛ Cleaning youtube...`);
        await prisma.youtube.deleteMany({ where: { guildId: { notIn: currentGuilds } } });
        Gamer.loggers.discord.info(`[Database Task] ✅ Cleaned youtube.`);

        Gamer.loggers.discord.info(`[Database Task] ✅✅✅ Cleaned all tables.`);
    },
};

export default task;
