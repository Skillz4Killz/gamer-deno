import { Command } from "../../base/typings.js";
import { Gamer } from "../../bot.js";

export const nezuko: Command = {
    name: "nezuko",
    aliases: [],
    arguments: [],
    prefixOnly: true,
    async execute(message) {
        Gamer.commands.get("gif")?.execute(message, { name: "nezuko" });
    },
};

export default nezuko;
