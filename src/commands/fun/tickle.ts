import { Command } from "../../base/typings.js";
import { Gamer } from "../../bot.js";

export const tickle: Command = {
    name: "tickle",
    aliases: [],
    arguments: [],
    prefixOnly: true,
    async execute(message) {
        Gamer.commands.get("gif")?.execute(message, { name: "tickle" });
    },
};

export default tickle;
