import { Argument } from "../base/typings.js";
import { Gamer } from "../bot.js";

export const user: Argument = {
    name: "user",
    async execute(_argument, parameters, message) {
        const [id] = parameters;
        if (!id) return;

        const userId = message.isOnDiscord ? (id.startsWith("<@") ? id.substring(id.startsWith("<@!") ? 3 : 2, id.length - 1) : id) : id;

        if (message.isOnDiscord && message.isDiscordMessage(message.raw)) {
            if (message.raw.mentions?.[0]) return message.raw.mentions?.[0];

            if (userId.length < 17 || !Number(userId)) {
                await message.reply(message.translate("INVALID_USER_ID"));
                return;
            }

            // VIP servers or users can try to request using an id
            if (message.isFromVIP) {
                return await Gamer.discord.helpers.getUser(userId).catch(() => undefined);
            }
        }

        // Discord message should be handled by now
        if (message.isOnDiscord) return;

        // Fetch the guilded member, guilded.js will prioritize cached first.
        return await Gamer.guilded.members
            .fetch(message.guildId!, message.mentions.users[0] ?? id)
            .then((m) => m.user)
            .catch(() => undefined);
    },
};
