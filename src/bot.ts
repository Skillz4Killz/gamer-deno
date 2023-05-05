import { Bot, Collection, createBot, createLogger, GatewayIntents } from "@discordeno/bot";
import { Client } from "guilded.js";
import languages from "./base/languages/index.js";
import { Argument, Command } from "./base/typings.js";
import { configs } from "./configs.js";
import { eventHandlers } from "./events/index.js";
import { NeedResponseOptions } from "./utils/platforms/messages.js";

export const Gamer: GamerBot = {
    arguments: new Collection(),
    commands: new Collection(),
    collectors: new Collection(),
    stats: {
        commands: {
            executed: 0,
        },
    },
    discord: createBot({
        intents: GatewayIntents.GuildMessages | GatewayIntents.MessageContent | GatewayIntents.GuildModeration,
        token: configs.platforms.discord.token,
        events: eventHandlers,
    }),
    guilded: new Client({
        token: configs.platforms.guilded.token,
        cache: {
            fetchMessageAuthorOnCreate: true,
        },
    }),
    loggers: {
        discord: createLogger({ name: "Discord" }),
        guilded: createLogger({ name: "Guilded" }),
    },
    vip: {
        guilds: new Set(),
        users: new Set(),
        slowmode: new Map(),
        prefixes: new Map(),
        languages: new Map(),
    },
};

export interface GamerBot {
    /** The arguments that are able to be used. */
    arguments: Collection<string, Argument>;
    /** The commands that are able to be used. */
    commands: Collection<string, Command>;
    /** The recent collectors that users need to respond to. */
    collectors: Collection<string, Collector>;
    /** The cached stats for this bot. */
    stats: {
        commands: {
            executed: number;
        };
    };
    /** The bot on discord platform. */
    discord: Bot;
    /** The bot on guilded platform. */
    guilded: Client;
    /** Loggers for each platform. */
    loggers: {
        discord: ReturnType<typeof createLogger>;
        guilded: ReturnType<typeof createLogger>;
    };
    /** The vip related settings. */
    vip: {
        /** The ids of the guilds that are vip. */
        guilds: Set<string>;
        /** The ids of the users that are vip. */
        users: Set<string>;
        /** The ids of users who are currently frozen in slowmode. */
        slowmode: Map<string, number>;
        /** The custom prefixes that a guild can set. */
        prefixes: Map<string, string>;
        /** The custom languages that a guild can set. */
        languages: Map<string, keyof typeof languages>;
    };
}

const props = Gamer.discord.transformers.desiredProperties;

props.attachment = {
    ...props.attachment,
    id: true,
    filename: true,
    contentType: true,
    size: true,
    url: true,
    proxyUrl: true,
    height: true,
    width: true,
    ephemeral: true,
    description: true,
};

props.channel = {
    ...props.channel,
    type: true,
    position: true,
    name: true,
    topic: true,
    nsfw: true,
    bitrate: true,
    userLimit: true,
    rateLimitPerUser: true,
    rtcRegion: true,
    videoQualityMode: true,
    guildId: true,
    lastPinTimestamp: true,
    permissionOverwrites: true,
    id: true,
    permissions: true,
    lastMessageId: true,
    ownerId: true,
    applicationId: true,
    managed: true,
    parentId: true,
    memberCount: true,
    messageCount: true,
    archiveTimestamp: true,
    autoArchiveDuration: true,
    botIsMember: true,
    archived: true,
    locked: true,
    invitable: true,
    createTimestamp: true,
    newlyCreated: true,
    flags: true,
};

props.emoji = {
    ...props.emoji,
    id: true,
    name: true,
    roles: true,
    user: true,
};

props.guild = {
    ...props.guild,
    afkTimeout: true,
    approximateMemberCount: true,
    approximatePresenceCount: true,
    defaultMessageNotifications: true,
    description: true,
    explicitContentFilter: true,
    maxMembers: true,
    maxPresences: true,
    maxVideoChannelUsers: true,
    mfaLevel: true,
    name: true,
    nsfwLevel: true,
    preferredLocale: true,
    premiumSubscriptionCount: true,
    premiumTier: true,
    stageInstances: true,
    systemChannelFlags: true,
    vanityUrlCode: true,
    verificationLevel: true,
    welcomeScreen: true,
    discoverySplash: true,
    joinedAt: true,
    memberCount: true,
    shardId: true,
    icon: true,
    banner: true,
    splash: true,
    id: true,
    ownerId: true,
    permissions: true,
    afkChannelId: true,
    widgetChannelId: true,
    applicationId: true,
    systemChannelId: true,
    rulesChannelId: true,
    publicUpdatesChannelId: true,
    premiumProgressBarEnabled: true,
};

props.interaction = {
    ...props.interaction,
    id: true,
    applicationId: true,
    type: true,
    guildId: true,
    channelId: true,
    member: true,
    user: true,
    token: true,
    version: true,
    message: true,
    data: true,
    locale: true,
    guildLocale: true,
    appPermissions: true,
};

props.invite = {
    ...props.invite,
    channelId: true,
    code: true,
    createdAt: true,
    guildId: true,
    inviter: true,
    maxAge: true,
    maxUses: true,
    targetType: true,
    targetUser: true,
    targetApplication: true,
    temporary: true,
    uses: true,
};

props.member = {
    ...props.member,
    id: true,
    guildId: true,
    user: true,
    nick: true,
    roles: true,
    joinedAt: true,
    premiumSince: true,
    avatar: true,
    permissions: true,
    communicationDisabledUntil: true,
    deaf: true,
    mute: true,
    pending: true,
};

props.message = {
    ...props.message,
    activity: true,
    application: true,
    applicationId: true,
    attachments: true,
    author: true,
    channelId: true,
    components: true,
    content: true,
    editedTimestamp: true,
    embeds: true,
    guildId: true,
    id: true,
    interaction: {
        ...props.message.interaction,
        id: true,
        member: true,
        name: true,
        user: true,
        type: true,
    },
    member: true,
    mentionedChannelIds: true,
    mentionedRoleIds: true,
    mentions: true,
    messageReference: {
        messageId: true,
        channelId: true,
        guildId: true,
    },
    nonce: true,
    reactions: true,
    stickerItems: true,
    thread: true,
    type: true,
    webhookId: true,
};

props.role = {
    ...props.role,
    name: true,
    guildId: true,
    position: true,
    color: true,
    id: true,
    botId: true,
    integrationId: true,
    permissions: true,
    icon: true,
    unicodeEmoji: true,
    mentionable: true,
    hoist: true,
    managed: true,
    subscriptionListingId: true,
};

props.scheduledEvent = {
    ...props.scheduledEvent,
    id: true,
    guildId: true,
    channelId: true,
    creatorId: true,
    scheduledStartTime: true,
    scheduledEndTime: true,
    entityId: true,
    creator: true,
    name: true,
    description: true,
    privacyLevel: true,
    status: true,
    entityType: true,
    userCount: true,
    location: true,
    image: true,
};

props.stageInstance = {
    ...props.stageInstance,
    id: true,
    guildId: true,
    channelId: true,
    topic: true,
    guildScheduledEventId: true,
};

props.sticker = {
    ...props.sticker,
    id: true,
    packId: true,
    name: true,
    description: true,
    tags: true,
    type: true,
    formatType: true,
    available: true,
    guildId: true,
    user: true,
    sortValue: true,
};

props.user = {
    ...props.user,
    username: true,
    locale: true,
    flags: true,
    premiumType: true,
    publicFlags: true,
    accentColor: true,
    id: true,
    discriminator: true,
    avatar: true,
    bot: true,
    system: true,
    mfaEnabled: true,
    verified: true,
    email: true,
    banner: true,
};

props.webhook = {
    ...props.webhook,
    id: true,
    type: true,
    guildId: true,
    channelId: true,
    user: true,
    name: true,
    avatar: true,
    token: true,
    applicationId: true,
    sourceGuild: true,
    sourceChannel: true,
    url: true,
};

export interface Collector {
    /** When this collector was created. If it takes too long, we remove it from cache. */
    createdAt: number;
    /** The channel where we are listening for messages. */
    channelId: string;
    /** The user id of person we are needing a response from. */
    userId: string;
    /** Any followup questions that need to be answered as well. */
    questions: NeedResponseOptions["questions"];
    /** The handler to resolve the promise when the user responds. */
    resolve: (value: string | PromiseLike<string>) => void;
    /** The handler to reject the promise when the user does not respond in time. */
    reject: (reason?: any) => void;
}
