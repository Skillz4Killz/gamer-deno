import Embeds from "../../base/Embeds.js";
import { Command } from "../../base/typings.js";

export const ping: Command = {
    name: "ping",
    aliases: ["pong"],
    arguments: [],
    async execute(message) {
        const now = Date.now();

        return await message.reply({
            content: "",
            embeds: new Embeds()
                .setAuthor(message.tag, message.avatarURL)
                .setDescription(message.translate("PING_TIME", now > message.timestamp ? (now - message.timestamp) / 1000 : 1)),
        });
    },
};

export default ping;
