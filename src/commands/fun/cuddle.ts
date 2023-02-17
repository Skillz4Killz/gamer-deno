import { Command } from "../../base/typings.js";
import { Gamer } from "../../bot.js";

export const cuddle: Command = {
    name: "cuddle",
    aliases: [],
    arguments: [],
    prefixOnly: true,
    async execute(message) {
        Gamer.commands.get("gif")?.execute(message, { name: "cuddle" });
    },
};

export default cuddle;
