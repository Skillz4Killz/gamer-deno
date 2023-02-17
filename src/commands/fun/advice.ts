import { Command } from "../../base/typings.js";
import { Gamer } from "../../bot.js";

export const advice: Command = {
    name: "advice",
    aliases: [],
    arguments: [],
    prefixOnly: true,
    async execute(message) {
        Gamer.commands.get("random")?.execute(message, { advice: {} });
    },
};

export default advice;
