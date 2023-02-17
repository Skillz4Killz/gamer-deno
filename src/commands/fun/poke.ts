import { Command } from "../../base/typings.js";
import { Gamer } from "../../bot.js";

export const poke: Command = {
    name: "poke",
    aliases: [],
    arguments: [],
    prefixOnly: true,
    async execute(message) {
        Gamer.commands.get("gif")?.execute(message, { name: "poke" });
    },
};

export default poke;
