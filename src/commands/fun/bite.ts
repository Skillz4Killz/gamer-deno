import { Command } from "../../base/typings.js";
import { Gamer } from "../../bot.js";

export const bite: Command = {
    name: "bite",
    aliases: [],
    arguments: [],
    prefixOnly: true,
    async execute(message) {
        Gamer.commands.get("gif")?.execute(message, { name: "bite" });
    },
};

export default bite;
