import { Argument } from "../base/typings.js";

export const channel: Argument = {
    name: "channel",
    async execute(_, parameters, message) {
        const [id] = parameters;
        if (!id) return;

        const guild = await message.getGuild();
        if (!guild) return;

        const channelIDOrName = id.startsWith("<#") ? id.substring(2, id.length - 1) : id.toLowerCase();

        const channel =
            guild.channels.get(channelIDOrName) || guild.channels.find((channel) => channel.name === channelIDOrName);

        if (!channel?.isTextBasedChannel) return;

        return channel;
    },
};
