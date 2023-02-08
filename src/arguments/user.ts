import { Argument } from "../base/typings.js";
import { Gamer } from "../bot.js";

export const user: Argument = {
    name: "user",
    async execute(_argument, parameters, message) {
        const [id] = parameters;
        if (!id) return;

        const userId = message.isOnDiscord ? (id.startsWith("<@") ? id.substring(id.startsWith("<@!") ? 3 : 2, id.length - 1) : id) : id;

        if (message.isOnDiscord && userId.length < 17) return;

        if (message.isOnDiscord && message.isDiscordMessage(message.raw)) {
            if (message.raw.mentions[0]) return message.raw.mentions[0];

            if (userId.length < 17) return;
            if (!Number(userId)) return;

            return await Gamer.discord.rest.getUser(userId).catch(() => undefined);
        }

        // Discord message should be handled by now
        if (message.isOnDiscord) return;
        console.log('in user arg in guilded', message.mentions.users[0], id)
        // Fetch the guilded member, guilded.js will prioritize cached first.
        return await Gamer.guilded.members.fetch(message.guildId!, message.mentions.users[0] ?? id).then(m => m.user).catch(() => undefined);
    },
};
