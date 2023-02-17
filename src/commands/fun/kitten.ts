import { Command } from "../../base/typings.js";
import { Gamer } from "../../bot.js";

export const kitten: Command = {
    name: "kitten",
    aliases: ["kitty", "cat"],
    arguments: [],
    prefixOnly: true,
    async execute(message) {
        Gamer.commands.get("gif")?.execute(message, { name: "kitten" });
    },
};

export default kitten;
