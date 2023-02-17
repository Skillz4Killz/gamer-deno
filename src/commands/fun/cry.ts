import { Command } from "../../base/typings.js";
import { Gamer } from "../../bot.js";

export const cry: Command = {
    name: "cry",
    aliases: ["sad", "cwy"],
    arguments: [],
    prefixOnly: true,
    async execute(message) {
        Gamer.commands.get("gif")?.execute(message, { name: "cry" });
    },
};

export default cry;
