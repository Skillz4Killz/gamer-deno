-- CreateEnum
CREATE TYPE "BlacklistedType" AS ENUM ('User', 'Guild');

-- CreateEnum
CREATE TYPE "ItemGames" AS ENUM ('Counting');

-- CreateEnum
CREATE TYPE "ItemTypes" AS ENUM ('Buff', 'Debuff');

-- CreateEnum
CREATE TYPE "ModlogActions" AS ENUM ('Warn');

-- CreateEnum
CREATE TYPE "TagsType" AS ENUM ('Basic', 'Advanced', 'Random');

-- CreateEnum
CREATE TYPE "UsersTheme" AS ENUM ('Light', 'Dark');

-- CreateTable
CREATE TABLE "automod" (
    "guildId" TEXT NOT NULL,
    "publicRoleIds" TEXT[],
    "muteRoleId" TEXT NOT NULL,
    "capitalPercentage" INTEGER NOT NULL,
    "profanityEnabled" BOOLEAN NOT NULL,
    "profanityWords" TEXT[],
    "profanityStrictWords" TEXT[],
    "profanityPhrases" TEXT[],
    "linksEnabled" BOOLEAN NOT NULL,
    "linksChannelIds" TEXT[],
    "linksUserIds" TEXT[],
    "linksRoleIds" TEXT[],
    "linksUrls" TEXT[],
    "linksRestrictedUrls" TEXT[],

    CONSTRAINT "automod_pkey" PRIMARY KEY ("guildId")
);

-- CreateTable
CREATE TABLE "autoreact" (
    "guildId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "reactions" TEXT[],

    CONSTRAINT "autoreact_pkey" PRIMARY KEY ("channelId")
);

-- CreateTable
CREATE TABLE "blacklisted" (
    "id" TEXT NOT NULL,
    "type" "BlacklistedType" NOT NULL,

    CONSTRAINT "blacklisted_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client" (
    "id" TEXT NOT NULL,
    "automod" TEXT NOT NULL,
    "commandsRan" TEXT NOT NULL,
    "messagesSent" TEXT NOT NULL,
    "feedbacksSent" TEXT NOT NULL,
    "messagesEdited" TEXT NOT NULL,
    "messagesDeleted" TEXT NOT NULL,
    "messagesProcessed" TEXT NOT NULL,
    "reactionsAddedProcessed" TEXT NOT NULL,
    "reactionsRemovedProcessed" TEXT NOT NULL,

    CONSTRAINT "client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commands" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "exceptionRoleIds" TEXT[],
    "exceptionChannelIds" TEXT[],

    CONSTRAINT "commands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "counting" (
    "count" INTEGER NOT NULL,
    "buffs" INTEGER[],
    "debuffs" INTEGER[],
    "guildId" TEXT NOT NULL,
    "localOnly" BOOLEAN NOT NULL,
    "channelId" TEXT NOT NULL,
    "loserRoleId" TEXT,
    "deleteInvalid" BOOLEAN NOT NULL,

    CONSTRAINT "counting_pkey" PRIMARY KEY ("channelId")
);

-- CreateTable
CREATE TABLE "defaultRoleSets" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "roleIds" TEXT[],
    "defaultRoleId" TEXT NOT NULL,

    CONSTRAINT "defaultRoleSets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emojis" (
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emojiId" TEXT NOT NULL,
    "unicode" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,

    CONSTRAINT "emojis_pkey" PRIMARY KEY ("emojiId")
);

-- CreateTable
CREATE TABLE "enterprise" (
    "botId" TEXT NOT NULL,
    "botName" TEXT NOT NULL,
    "botToken" TEXT NOT NULL,
    "guildIds" TEXT[],

    CONSTRAINT "enterprise_pkey" PRIMARY KEY ("botId")
);

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "eventId" INTEGER NOT NULL,
    "guildId" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "messageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "isRecurring" BOOLEAN NOT NULL,
    "minutesFromNow" INTEGER NOT NULL,
    "game" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "frequency" INTEGER,
    "description" TEXT NOT NULL,
    "dmReminders" BOOLEAN NOT NULL,
    "showUtcTime" BOOLEAN NOT NULL,
    "backgroundUrl" TEXT,
    "showAttendees" BOOLEAN NOT NULL,
    "channelReminders" BOOLEAN NOT NULL,
    "removeRecurringAttendees" BOOLEAN NOT NULL,
    "reminders" INTEGER[],
    "executedReminders" INTEGER[],
    "hasStarted" BOOLEAN NOT NULL,
    "duration" INTEGER NOT NULL,
    "maxAttendees" INTEGER NOT NULL,
    "deniedUserIds" TEXT[],
    "bannedUserIds" TEXT[],
    "allowedRoleIds" TEXT[],
    "alertRoleIds" TEXT[],
    "joinRoleId" TEXT NOT NULL,
    "maybeUserIds" TEXT[],
    "cardChannelId" TEXT,
    "cardMessageId" TEXT,
    "templateName" TEXT,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventWaiting" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" INTEGER NOT NULL,
    "position" TEXT NOT NULL,

    CONSTRAINT "EventWaiting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventAttendee" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" INTEGER NOT NULL,
    "position" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventAttendee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventPosition" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "EventPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facebook" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "filter" TEXT,
    "username" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,

    CONSTRAINT "facebook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedbacks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "isBugReport" BOOLEAN NOT NULL,

    CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedbackSettings" (
    "guildId" TEXT NOT NULL,
    "approvalChannelId" TEXT,
    "solvedChannelId" TEXT,
    "rejectedChannelId" TEXT,
    "solvedMessage" TEXT,
    "rejectedMessage" TEXT,
    "logChannelId" TEXT,
    "ideaChannelId" TEXT,
    "bugsChannelId" TEXT,

    CONSTRAINT "feedbackSettings_pkey" PRIMARY KEY ("guildId")
);

-- CreateTable
CREATE TABLE "giveaways" (
    "id" SERIAL NOT NULL,
    "emoji" TEXT,
    "simple" BOOLEAN NOT NULL,
    "userId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "hasEnded" BOOLEAN NOT NULL,
    "messageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "channelId" TEXT NOT NULL,
    "setRoleIds" TEXT[],
    "requireIgn" BOOLEAN NOT NULL,
    "costToJoin" INTEGER NOT NULL,
    "hasStarted" BOOLEAN NOT NULL,
    "pickWinners" BOOLEAN NOT NULL,
    "pickInterval" INTEGER,
    "delayTillStart" INTEGER,
    "blockedUserIds" TEXT[],
    "allowDuplicates" BOOLEAN NOT NULL,
    "amountOfWinners" INTEGER NOT NULL,
    "duplicateCooldown" INTEGER,
    "allowCommandEntry" BOOLEAN NOT NULL,
    "allowReactionEntry" BOOLEAN NOT NULL,
    "requiredRoleIdsToJoin" TEXT[],
    "notificationsChannelId" TEXT,

    CONSTRAINT "giveaways_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GiveawayParticipant" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL,
    "giveawayId" INTEGER NOT NULL,

    CONSTRAINT "GiveawayParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GiveawayPickedParticipants" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL,
    "giveawayId" INTEGER NOT NULL,

    CONSTRAINT "GiveawayPickedParticipants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groupedRoleSets" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "roleIds" TEXT[],
    "mainRoleId" TEXT NOT NULL,

    CONSTRAINT "groupedRoleSets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guilds" (
    "id" TEXT NOT NULL,
    "prefix" TEXT,
    "language" TEXT,
    "adminRoleId" TEXT,
    "modRoleIds" TEXT[],
    "tenorEnabled" BOOLEAN NOT NULL,
    "eventsAdvertiseChannelId" TEXT,
    "autoEmbedChannelIds" TEXT[],
    "disabledTagChannelIds" TEXT[],
    "analyticsChannelId" TEXT,
    "createEventsRoleId" TEXT,

    CONSTRAINT "guilds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" TEXT NOT NULL,
    "game" "ItemGames" NOT NULL,
    "channelId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "itemId" INTEGER NOT NULL,
    "type" "ItemTypes" NOT NULL,
    "guildId" TEXT NOT NULL,
    "expiresAt" INTEGER NOT NULL,
    "currentCount" INTEGER,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instagram" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "filter" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "webhookId" TEXT NOT NULL,
    "webhookToken" TEXT NOT NULL,

    CONSTRAINT "instagram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "labels" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "mainGuildId" TEXT NOT NULL,

    CONSTRAINT "labels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "levels" (
    "id" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "guildId" TEXT NOT NULL,
    "roleIds" TEXT[],

    CONSTRAINT "levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leveling" (
    "guildId" TEXT NOT NULL,
    "xpEnabled" BOOLEAN NOT NULL,
    "missionsEnabled" BOOLEAN NOT NULL,
    "xpDecayDays" INTEGER NOT NULL,
    "xpDecayPercentage" INTEGER NOT NULL,
    "xpPerMessage" INTEGER NOT NULL,
    "xpPerMinuteVoice" INTEGER NOT NULL,
    "allowedBackgroundUrls" TEXT[],
    "showMarriage" BOOLEAN NOT NULL,
    "disabledXpChannelIds" TEXT[],
    "disabledXpRoleIds" TEXT[],

    CONSTRAINT "leveling_pkey" PRIMARY KEY ("guildId")
);

-- CreateTable
CREATE TABLE "mails" (
    "channelId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "mainGuildId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,

    CONSTRAINT "mails_pkey" PRIMARY KEY ("channelId")
);

-- CreateTable
CREATE TABLE "mailSettings" (
    "guildId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "roleIds" TEXT[],
    "modServerId" TEXT,
    "logChannelId" TEXT,
    "ratingChanelId" TEXT,
    "categoryId" TEXT,
    "autoResponse" TEXT NOT NULL,
    "supportChannelId" TEXT,

    CONSTRAINT "mailSettings_pkey" PRIMARY KEY ("guildId")
);

-- CreateTable
CREATE TABLE "MailQuestion" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "options" TEXT[],
    "question" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,

    CONSTRAINT "MailQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mangaAlerts" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "filter" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "webhookId" TEXT NOT NULL,
    "webhookToken" TEXT NOT NULL,

    CONSTRAINT "mangaAlerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marriages" (
    "step" INTEGER NOT NULL,
    "love" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "spouseId" TEXT NOT NULL,
    "accepted" BOOLEAN NOT NULL,
    "lifeStep" INTEGER NOT NULL,

    CONSTRAINT "marriages_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "mirrors" (
    "id" TEXT NOT NULL,
    "filter" TEXT NOT NULL,
    "anonymous" BOOLEAN NOT NULL,
    "filterImages" BOOLEAN NOT NULL,
    "sourceChannelId" TEXT NOT NULL,
    "mirrorChannelId" TEXT NOT NULL,
    "sourceGuildId" TEXT NOT NULL,
    "mirrorGuildId" TEXT NOT NULL,
    "deleteSourceMessages" BOOLEAN NOT NULL,

    CONSTRAINT "mirrors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL,
    "commandName" TEXT NOT NULL,

    CONSTRAINT "mission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modlogs" (
    "id" SERIAL NOT NULL,
    "modId" TEXT NOT NULL,
    "action" "ModlogActions" NOT NULL,
    "reason" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "duration" INTEGER,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "messageId" TEXT NOT NULL,
    "mainGuildId" TEXT NOT NULL,
    "needsUnmute" BOOLEAN NOT NULL,

    CONSTRAINT "modlogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modules" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "sourceGuildId" TEXT NOT NULL,

    CONSTRAINT "modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mutes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleIds" TEXT[],
    "guildId" TEXT NOT NULL,
    "unmuteAt" INTEGER NOT NULL,

    CONSTRAINT "mutes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "polls" (
    "endsAt" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "options" TEXT[],
    "maxVotes" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "allowedRoleIds" TEXT[],
    "resultsChannelId" TEXT NOT NULL,

    CONSTRAINT "polls_pkey" PRIMARY KEY ("messageId")
);

-- CreateTable
CREATE TABLE "pollVotes" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "option" INTEGER NOT NULL,

    CONSTRAINT "pollVotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reddit" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "filter" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "webhookId" TEXT NOT NULL,
    "webhookToken" TEXT NOT NULL,

    CONSTRAINT "reddit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reminders" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "interval" INTEGER,
    "memberId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "recurring" BOOLEAN NOT NULL,
    "timestamp" INTEGER NOT NULL,

    CONSTRAINT "reminders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requiredRoleSets" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "roleIds" TEXT[],
    "requiredRoleId" TEXT NOT NULL,

    CONSTRAINT "requiredRoleSets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roleMessages" (
    "id" SERIAL NOT NULL,
    "guildId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "roleAdded" BOOLEAN NOT NULL,
    "channelId" TEXT NOT NULL,
    "roleAddedText" TEXT NOT NULL,
    "roleRemovedText" TEXT NOT NULL,

    CONSTRAINT "roleMessages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "serverLogs" (
    "guildId" TEXT NOT NULL,
    "publicChannelID" TEXT NOT NULL,
    "modChannelID" TEXT NOT NULL,
    "automodChannelID" TEXT NOT NULL,
    "banAddChannelID" TEXT NOT NULL,
    "banAddPublic" BOOLEAN NOT NULL,
    "banRemoveChannelID" TEXT NOT NULL,
    "banRemovePublic" BOOLEAN NOT NULL,
    "roleCreateChannelID" TEXT NOT NULL,
    "roleCreatePublic" BOOLEAN NOT NULL,
    "roleDeleteChannelID" TEXT NOT NULL,
    "roleDeletePublic" BOOLEAN NOT NULL,
    "roleUpdateChannelID" TEXT NOT NULL,
    "roleUpdatePublic" BOOLEAN NOT NULL,
    "roleMembersChannelID" TEXT NOT NULL,
    "roleMembersPublic" BOOLEAN NOT NULL,
    "memberAddChannelID" TEXT NOT NULL,
    "memberAddPublic" BOOLEAN NOT NULL,
    "memberRemoveChannelID" TEXT NOT NULL,
    "memberRemovePublic" BOOLEAN NOT NULL,
    "memberNickChannelID" TEXT NOT NULL,
    "memberNickPublic" BOOLEAN NOT NULL,
    "messageDeleteChannelID" TEXT NOT NULL,
    "messageDeletePublic" BOOLEAN NOT NULL,
    "messageDeleteIgnoredChannelIDs" TEXT[],
    "messageDeleteIgnoredRoleIDs" TEXT[],
    "messageEditChannelID" TEXT NOT NULL,
    "messageEditPublic" BOOLEAN NOT NULL,
    "messageEditIgnoredChannelIDs" TEXT[],
    "messageEditIgnoredRoleIDs" TEXT[],
    "emojiCreateChannelID" TEXT NOT NULL,
    "emojiCreatePublic" BOOLEAN NOT NULL,
    "emojiDeleteChannelID" TEXT NOT NULL,
    "emojiDeletePublic" BOOLEAN NOT NULL,
    "channelCreateChannelID" TEXT NOT NULL,
    "channelCreatePublic" BOOLEAN NOT NULL,
    "channelDeleteChannelID" TEXT NOT NULL,
    "channelDeletePublic" BOOLEAN NOT NULL,
    "channelUpdateChannelID" TEXT NOT NULL,
    "channelUpdatePublic" BOOLEAN NOT NULL,
    "channelUpdateIgnoredChannelIDs" TEXT[],
    "voiceJoinChannelID" TEXT NOT NULL,
    "voiceJoinPublic" BOOLEAN NOT NULL,
    "voiceJoinIgnoredChannelIDs" TEXT[],
    "voiceLeaveChannelID" TEXT NOT NULL,
    "voiceLeavePublic" BOOLEAN NOT NULL,
    "voiceLeaveIgnoredChannelIDs" TEXT[],
    "imageChannelID" TEXT NOT NULL,
    "imageIgnoredChannelIDs" TEXT[],
    "imageIgnoredRoleIDs" TEXT[],

    CONSTRAINT "serverLogs_pkey" PRIMARY KEY ("guildId")
);

-- CreateTable
CREATE TABLE "shortcuts" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "deleteTrigger" BOOLEAN NOT NULL,

    CONSTRAINT "shortcuts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spy" (
    "words" TEXT[],
    "userId" TEXT NOT NULL,

    CONSTRAINT "spy_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "surveys" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "allowedRoleIds" TEXT[],
    "useDM" BOOLEAN NOT NULL,

    CONSTRAINT "surveys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveyQuestion" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "options" TEXT[],
    "question" TEXT NOT NULL,
    "surveyId" INTEGER NOT NULL,

    CONSTRAINT "SurveyQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "TagsType" NOT NULL,
    "guildId" TEXT NOT NULL,
    "mailOnly" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL,
    "embedCode" TEXT NOT NULL,
    "randomOptions" TEXT[],
    "secondsUntilDelete" INTEGER NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "todos" (
    "guildId" TEXT NOT NULL,
    "backlogChannelId" TEXT NOT NULL,
    "sprintChannelId" TEXT NOT NULL,
    "nextSprintChannelId" TEXT NOT NULL,
    "archiveChannelId" TEXT NOT NULL,
    "completedChannelId" TEXT NOT NULL,

    CONSTRAINT "todos_pkey" PRIMARY KEY ("guildId")
);

-- CreateTable
CREATE TABLE "twitch" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "filter" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "webhookId" TEXT NOT NULL,
    "webhookToken" TEXT NOT NULL,

    CONSTRAINT "twitch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "twitter" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "filter" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "webhookId" TEXT NOT NULL,
    "webhookToken" TEXT NOT NULL,

    CONSTRAINT "twitter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "uniqueRolesets" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "roleIds" TEXT[],

    CONSTRAINT "uniqueRolesets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "xp" INTEGER NOT NULL,
    "coins" INTEGER NOT NULL,
    "theme" "UsersTheme" NOT NULL,
    "badges" TEXT[],
    "guildIds" TEXT[],
    "afkEnabled" BOOLEAN NOT NULL,
    "afkMessage" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "showMarriage" BOOLEAN NOT NULL,
    "backgroundId" INTEGER NOT NULL,
    "backgroundUrl" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verifications" (
    "guildId" TEXT NOT NULL,
    "categoryId" TEXT,
    "enabled" BOOLEAN NOT NULL,
    "channelIds" TEXT[],
    "firstMessageJson" TEXT NOT NULL,
    "userAutoRoleId" TEXT,
    "botsAutoRoleId" TEXT,
    "discordVerificationStrictnessEnabled" BOOLEAN NOT NULL,

    CONSTRAINT "verifications_pkey" PRIMARY KEY ("guildId")
);

-- CreateTable
CREATE TABLE "vipGuilds" (
    "isVip" BOOLEAN NOT NULL,
    "userId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,

    CONSTRAINT "vipGuilds_pkey" PRIMARY KEY ("guildId")
);

-- CreateTable
CREATE TABLE "vipUsers" (
    "isVip" BOOLEAN NOT NULL,
    "userId" TEXT NOT NULL,
    "guildIds" TEXT[],

    CONSTRAINT "vipUsers_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "xp" (
    "id" SERIAL NOT NULL,
    "xp" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "voiceXp" INTEGER NOT NULL,
    "lastUpdatedAt" INTEGER NOT NULL,
    "joinedVoiceAt" INTEGER NOT NULL,

    CONSTRAINT "xp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhooks" (
    "channelId" TEXT NOT NULL,
    "hookId" TEXT NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "webhooks_pkey" PRIMARY KEY ("channelId")
);

-- CreateTable
CREATE TABLE "welcome" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,

    CONSTRAINT "welcome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "youtube" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "filter" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "webhookId" TEXT NOT NULL,
    "webhookToken" TEXT NOT NULL,

    CONSTRAINT "youtube_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "defaultRoleSets_guildId_name_key" ON "defaultRoleSets"("guildId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "groupedRoleSets_guildId_name_key" ON "groupedRoleSets"("guildId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "requiredRoleSets_guildId_name_key" ON "requiredRoleSets"("guildId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "roleMessages_roleId_roleAdded_key" ON "roleMessages"("roleId", "roleAdded");

-- CreateIndex
CREATE UNIQUE INDEX "uniqueRolesets_guildId_name_key" ON "uniqueRolesets"("guildId", "name");

-- AddForeignKey
ALTER TABLE "EventWaiting" ADD CONSTRAINT "EventWaiting_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventAttendee" ADD CONSTRAINT "EventAttendee_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventPosition" ADD CONSTRAINT "EventPosition_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiveawayParticipant" ADD CONSTRAINT "GiveawayParticipant_giveawayId_fkey" FOREIGN KEY ("giveawayId") REFERENCES "giveaways"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiveawayPickedParticipants" ADD CONSTRAINT "GiveawayPickedParticipants_giveawayId_fkey" FOREIGN KEY ("giveawayId") REFERENCES "giveaways"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MailQuestion" ADD CONSTRAINT "MailQuestion_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "mailSettings"("guildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyQuestion" ADD CONSTRAINT "SurveyQuestion_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "surveys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
