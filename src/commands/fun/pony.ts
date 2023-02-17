import { Command } from "../../base/typings.js";
import { Gamer } from "../../bot.js";

export const pony: Command = {
    name: "pony",
    aliases: [],
    arguments: [],
    prefixOnly: true,
    async execute(message) {
        Gamer.commands.get("gif")?.execute(message, { name: "pony" });
    },
};

export default pony;
