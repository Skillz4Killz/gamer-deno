import { Command } from "../../base/typings.js";
import { Gamer } from "../../bot.js";

export const dance: Command = {
    name: "dance",
    aliases: [],
    arguments: [],
    prefixOnly: true,
    async execute(message) {
        Gamer.commands.get("gif")?.execute(message, { name: "dance" });
    },
};

export default dance;
