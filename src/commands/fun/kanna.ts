import { Command } from "../../base/typings.js";
import { Gamer } from "../../bot.js";

export const kanna: Command = {
    name: "kanna",
    aliases: [],
    arguments: [],
    prefixOnly: true,
    async execute(message) {
        Gamer.commands.get("gif")?.execute(message, { name: "kanna" });
    },
};

export default kanna;
