import { Command } from "../../base/typings.js";
import { Gamer } from "../../bot.js";

export const puppy: Command = {
    name: "puppy",
    aliases: ["dog"],
    arguments: [],
    prefixOnly: true,
    async execute(message) {
        Gamer.commands.get("gif")?.execute(message, { name: "puppy" });
    },
};

export default puppy;
