import { Command } from "../../base/typings.js";
import { Gamer } from "../../bot.js";

export const number: Command = {
    name: "number",
    aliases: ["rng"],
    arguments: [
        {
            name: "min",
            type: "number",
            required: true,
            missing: () => {},
        },
        {
            name: "max",
            type: "number",
            required: true,
            missing: () => {},
        },
    ],
    prefixOnly: true,
    async execute(message, args: { min: number; max: number }) {
        Gamer.commands.get("random")?.execute(message, { number: args });
    },
};

export default number;
