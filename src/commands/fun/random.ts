import { Command } from "../../base/typings.js";

export const info: Command = {
    name: "random",
    aliases: ["randomize"],
    arguments: [
        {
            name: "number",
            type: "subcommand",
            missing: () => {},
            required: true,
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
        },
        {
            name: "8ball",
            type: "subcommand",
            missing: () => {},
            required: true,
            arguments: [
                {
                    name: "question",
                    type: "string",
                    required: true,
                    missing: () => {},
                },
            ],
        },
        {
            name: "advice",
            type: "subcommand",
            missing: () => {},
            required: true,
            arguments: [],
        },
    ],
    async execute(message, args: { advice: {} } | { "8ball": { question: string } } | { number: { min: number; max: number } }) {
        console.log(args);
        if ("advice" in args) {
            return message.reply(message.translate("RANDOM_ADVICE_QUOTES"));
        }
        if ("8ball" in args) {
            return message.reply([args["8ball"].question, message.translate("RANDOM_8BALL_QUOTES")].join("\n"));
        }
        if ("number" in args) {
            return message.reply(
                [
                    `min: ${args.number.min} max: ${args.number.max}`,
                    args.number.min + Math.floor((Math.abs(args.number.max - args.number.min) + 1) * Math.random()),
                ].join("\n"),
            );
        }
    },
};

export default info;
