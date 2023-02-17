import Embeds from "../base/Embeds.js";
import { Gamer } from "../bot.js";
import { configs } from "../configs.js";

export async function alertDevs(embeds: Embeds) {
    return await Gamer.discord.rest.executeWebhook("", "", {
        content: configs.bot.devs.map(id => `<@${id}>`).join(' '),
        embeds
    })
}