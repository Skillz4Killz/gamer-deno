import { Command } from "../../base/typings.js";
import { Gamer } from "../../bot.js";

export const pat: Command = {
    name: "pat",
    aliases: [],
    arguments: [],
    prefixOnly: true,
    async execute(message) {
        Gamer.commands.get("gif")?.execute(message, { name: "pat" });
    },
};

export default pat;
