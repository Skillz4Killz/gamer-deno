export const english = {
    CLEAR_SPAM: "Remove spam messages.",
    MISSING_REQUIRED_ARG: (name: string, type: string) =>
        `You were missing the **${name}** argument which is required in that command. Please provide the **${type}** now.`,

    PING_NAME: "ping",
    PING_DESCRIPTION: "🏓 Shows the response time for the bot.",
    PING_TIME: (time: number) => `🏓 **Response Time**: \`${time}\` seconds 🕙`,

    SERVER_PREFIX: (prefix: string) => [`<:info:443803045382324225> The prefix for this server is: \`${prefix}\``, "<:g4m3rhappy:458758780121776139> Type **.help** to get started."],
};

export default english;

export type TranslationKeys = keyof typeof english;
