import { Components } from "../../base/Components.js";
import { Command } from "../../base/typings.js";
import { Gamer } from "../../bot.js";
import emojis from "../../utils/emojis.js";

export const invite: Command = {
    name: "invite",
    aliases: ["inv", "join"],
    arguments: [],
    async execute(message) {
        return await message.reply({
            content: message.translate("INVITE_THANKS"),
            embeds: [],
            components: new Components()
                .addButton(
                    message.translate("INVITE_BOT"),
                    "Link",
                    message.isOnDiscord
                        ? `https://discordapp.com/oauth2/authorize?client_id=${Gamer.discord.rest.applicationId}&scope=bot+applications.commands&permissions=2111302911`
                        : "https://www.guilded.gg/b/72093a2d-33e1-4c4b-ac1b-12e7acd171a3",
                    { emoji: emojis.coin },
                )
                .addButton(message.translate("INVITE_NEED_SUPPORT"), "Link", message.isOnDiscord ? "https://discord.gg/J4NqJ72" : "https://www.guilded.gg/dligence", {
                    emoji: emojis.bot,
                }),
        });
    },
};

export default invite;
