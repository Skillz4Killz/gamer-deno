import { Command } from "../../base/typings.js";
import { Gamer } from "../../bot.js";

export const hug: Command = {
    name: "hug",
    aliases: [],
    arguments: [],
    prefixOnly: true,
    async execute(message) {
        Gamer.commands.get("gif")?.execute(message, { name: "hug" });
    },
};

export default hug;
