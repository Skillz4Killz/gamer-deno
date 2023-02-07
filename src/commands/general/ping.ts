import { Command } from "../../base/typings.js";

export const ping: Command = {
    name: "ping",
    aliases: ["pong"],
    arguments: [],
    async execute(message) {
        const now = Date.now();
        return await message.reply(message.translate("PING_TIME", now > message.timestamp ? (now - message.timestamp) / 1000 : 1));
    },
};

export default ping;
