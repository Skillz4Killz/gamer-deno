import { Command } from "../../base/typings.js";
import { Gamer } from "../../bot.js";

export const mavis: Command = {
    name: "mavis",
    aliases: [],
    arguments: [],
    prefixOnly: true,
    async execute(message) {
        Gamer.commands.get("gif")?.execute(message, { name: "mavis" });
    },
};
