import { Command } from "../../base/typings.js";
import { Gamer } from "../../bot.js";

export const compliment: Command = {
    name: "compliment",
    aliases: ["comp"],
    arguments: [],
    prefixOnly: true,
    async execute(message) {
        Gamer.commands.get("gif")?.execute(message, { name: "compliment" });
    },
};
