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

    SERVER_PREFIX: (prefix: string) => [
        `<:info:443803045382324225> The prefix for this server is: \`${prefix}\``,
        "<:g4m3rhappy:458758780121776139> Type **.help** to get started.",
    ],
};

export default english;

export type TranslationKeys = keyof typeof english;
