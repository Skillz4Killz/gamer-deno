import { Command } from "../../base/typings.js";
import { Gamer } from "../../bot.js";

export const raphtalia: Command = {
    name: "raphtalia",
    aliases: [],
    arguments: [],
    prefixOnly: true,
    async execute(message) {
        Gamer.commands.get("gif")?.execute(message, { name: "raphtalia" });
    },
};

export default raphtalia;
