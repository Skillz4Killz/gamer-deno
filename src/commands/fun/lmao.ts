import { Command } from "../../base/typings.js";
import { Gamer } from "../../bot.js";

export const lmao: Command = {
    name: "lmao",
    aliases: ["lol", "laugh"],
    arguments: [],
    prefixOnly: true,
    async execute(message) {
        Gamer.commands.get("gif")?.execute(message, { name: "lmao" });
    },
};

export default lmao;
