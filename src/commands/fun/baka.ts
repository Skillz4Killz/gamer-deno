import { Command } from "../../base/typings.js";
import { Gamer } from "../../bot.js";

export const baka: Command = {
    name: "baka",
    aliases: [],
    arguments: [],
    prefixOnly: true,
    async execute(message) {
        Gamer.commands.get("gif")?.execute(message, { name: "baka" });
    },
};
