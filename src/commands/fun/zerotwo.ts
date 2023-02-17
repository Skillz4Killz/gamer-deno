import { Command } from "../../base/typings.js";
import { Gamer } from "../../bot.js";

export const zerotwo: Command = {
    name: "zerotwo",
    aliases: [],
    arguments: [],
    prefixOnly: true,
    async execute(message) {
        Gamer.commands.get("gif")?.execute(message, { name: "zerotwo" });
    },
};

export default zerotwo;
