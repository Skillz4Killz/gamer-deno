import { Command } from "../../base/typings.js";
import { Gamer } from "../../bot.js";

export const supernatural: Command = {
    name: "supernatural",
    aliases: [],
    arguments: [],
    prefixOnly: true,
    async execute(message) {
        Gamer.commands.get("gif")?.execute(message, { name: "supernatural" });
    },
};

export default supernatural;
