import { Command } from "../../base/typings.js";
import { Gamer } from "../../bot.js";

export const ball: Command = {
    name: "8ball",
    aliases: [],
    arguments: [
        {
            name: "question",
            type: "...string",
            required: true,
            missing: () => {},
        },
    ],
    prefixOnly: true,
    async execute(message, args: { question: string }) {
        Gamer.commands.get("random")?.execute(message, { "8ball": args });
    },
};

export default ball;
