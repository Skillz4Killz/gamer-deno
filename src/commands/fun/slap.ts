import { Command } from "../../base/typings.js";
import { Gamer } from "../../bot.js";

export const slap: Command = {
    name: "slap",
    aliases: [],
    arguments: [],
    prefixOnly: true,
    async execute(message) {
        Gamer.commands.get("gif")?.execute(message, { name: "slap" });
    },
};

export default slap;
