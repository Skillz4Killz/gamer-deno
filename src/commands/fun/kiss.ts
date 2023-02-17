import { Command } from "../../base/typings.js";
import { Gamer } from "../../bot.js";

export const kiss: Command = {
    name: "kiss",
    aliases: [],
    arguments: [],
    prefixOnly: true,
    async execute(message) {
        Gamer.commands.get("gif")?.execute(message, { name: "kiss" });
    },
};

export default kiss;
