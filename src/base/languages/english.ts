export const english = {
    CLEAR_SPAM: "Remove spam messages.",
    INVALID_USER_ID: "❌ Invalid user ID provided!",
    VIP_USER_ID: "⚠️ User id functionality is only available for VIP servers. To check without VIP, you need to `@user` or use / commands bruh.",
    MISSING_REQUIRED_ARG: (name: string, type: string) =>
        `You were missing the **${name}** argument which is required in that command. Please provide the **${type}** now.`,

    // Avatar Command
    AVATAR_NAME: "avatar",
    AVATAR_DESCRIPTION: "🖼️ Shows the avatar of a user or yourself.",
    AVATAR_USER_NAME: "user",
    AVATAR_USER_DESCRIPTION: "Provide a @user to view their avatar.",
    AVATAR_DOWNLOAD_LINK: "🔗 Download Link",

    // Info Command
    INFO_NAME: "info",
    INFO_DESCRIPTION: "ℹ️ Get info of a user or yourself",
    INFO_USER_NAME: "user",
    INFO_USER_DESCRIPTION: "The user",
    INFO_NICKNAME: "Nickname",
    INFO_USER_ID: "User ID",
    INFO_CREATED_ON: "Created on",
    INFO_JOINED_ON: "Joined on",
    INFO_PERMISSIONS: "Permissions",
    INFO_ROLES: "Roles",

    // Invite Command
    INVITE_NAME: "invite",
    INVITE_DESCRIPTION: "🔗 Invite the bot to your server or get help in the support server.",
    INVITE_BOT: "Invite The Bot",
    INVITE_NEED_SUPPORT: "Need Help?",
    INVITE_THANKS: "Thank you for using Gamer bot!",

    // Ping Command
    PING_NAME: "ping",
    PING_DESCRIPTION: "🏓 Shows the response time for the bot.",
    PING_TIME: (time: number) => `🏓 **Response Time**: \`${time}\` seconds 🕙`,

    // Gif command
    GIF_NAME: "gif",
    GIF_DESCRIPTION: "Send a random gif!",
    GIF_NAME_NAME: "name",
    GIF_NAME_DESCRIPTION: "the gif name",
    GIF_BAKA_NAME: "baka",
    GIF_BAKA_DESCRIPTION: "baka",
    GIF_RAPHTALIA_NAME: "raphtalia",
    GIF_RAPHTALIA_DESCRIPTION: "raphtalia",
    GIF_COMPLIMENT_NAME: "compliment",
    GIF_COMPLIMENT_DESCRIPTION: "compliment",
    GIF_CUDDLE_NAME: "cuddle",
    GIF_CUDDLE_DESCRIPTION: "cuddle",
    GIF_MAVIS_NAME: "mavis",
    GIF_MAVIS_DESCRIPTION: "mavis",
    GIF_KISS_NAME: "kiss",
    GIF_KISS_DESCRIPTION: "kiss",
    GIF_HUG_NAME: "hug",
    GIF_HUG_DESCRIPTION: "hug",
    GIF_POKE_NAME: "poke",
    GIF_POKE_DESCRIPTION: "poke",
    GIF_PAT_NAME: "pat",
    GIF_PAT_DESCRIPTION: "pat",
    GIF_PONY_NAME: "pony",
    GIF_PONY_DESCRIPTION: "pony",
    GIF_PUPPY_NAME: "puppy",
    GIF_PUPPY_DESCRIPTION: "puppy",
    GIF_SLAP_NAME: "slap",
    GIF_SLAP_DESCRIPTION: "slap",
    GIF_TICKLE_NAME: "tickle",
    GIF_TICKLE_DESCRIPTION: "tickle",
    GIF_BITE_NAME: "bite",
    GIF_BITE_DESCRIPTION: "bite",
    GIF_DANCE_NAME: "dance",
    GIF_DANCE_DESCRIPTION: "dance",
    GIF_LMAO_NAME: "lmao",
    GIF_LMAO_DESCRIPTION: "lmao",
    GIF_CRY_NAME: "cry",
    GIF_CRY_DESCRIPTION: "cry",
    GIF_ZEROTWO_NAME: "zerotwo",
    GIF_ZEROTWO_DESCRIPTION: "zerotwo",
    GIF_KANNA_NAME: "kanna",
    GIF_KITTEN_NAME: "kitten",
    GIF_SUPERNATURAL_NAME: "supernatural",
    GIF_NEZUKO_NAME: "nezuko",
    GIF_KANNA_DESCRIPTION: "kanna",
    GIF_KITTEN_DESCRIPTION: "kitten",
    GIF_SUPERNATURAL_DESCRIPTION: "supernatural",
    GIF_NEZUKO_DESCRIPTION: "nezuko",

    // Random command
    RANDOM_NAME: "random",
    RANDOM_DESCRIPTION: "WIP Random",

    SERVER_PREFIX: (prefix: string) => [
        `<:info:443803045382324225> The prefix for this server is: \`${prefix}\``,
        "<:g4m3rhappy:458758780121776139> Type **.help** to get started.",
    ],
};

export default english;

export type TranslationKeys = keyof typeof english;
