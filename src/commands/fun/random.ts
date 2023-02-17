import Embeds from "../../base/Embeds.js";
import { Command } from "../../base/typings.js";
import { MAX_SAFE_INTEGER } from "../../utils/constants.js";
import { random } from "../../utils/helpers.js";

export const info: Command = {
    name: "random",
    aliases: ["randomize"],
    arguments: [
        {
            name: "number",
            type: "subcommand",
            missing: () => {},
            required: false,
            arguments: [
                {
                    name: "min",
                    type: "number",
                    required: true,
                    missing: () => {},
                    defaultValue: 1,
                },
                {
                    name: "max",
                    type: "number",
                    required: true,
                    missing: () => {},
                    defaultValue: 100,
                },
            ],
        },
        {
            name: "8ball",
            type: "subcommand",
            missing: () => {},
            required: false,
            arguments: [
                {
                    name: "question",
                    type: "...string",
                    required: true,
                    missing: () => {},
                },
            ],
        },
        {
            name: "advice",
            type: "subcommand",
            missing: () => {},
            required: false,
            arguments: [],
        },
    ],
    async execute(message, args: { advice?: {}; "8ball"?: { question: string }; number: { min: number; max: number } }) {
        console.log(args)
        if (args["8ball"]) {
            return await message.reply([args["8ball"].question, message.translate("RANDOM_8BALL_QUOTES")].join("\n"));
        }

        if (args.number) {
            const embeds = new Embeds()
                .setAuthor(message.tag, message.avatarURL)
                .addField(message.translate("RANDOM_NUMBER_MINIMUM"), args.number.min.toLocaleString(), true);

            if (args.number.min > args.number.max) {
                embeds.addField(message.translate("RANDOM_NUMBER_MAXIMUM"), message.translate("RANDOM_NUMBER_MAX_WAS_TOO_LOW"))
                args.number.max = MAX_SAFE_INTEGER;
            } else {
                embeds.addField(message.translate("RANDOM_NUMBER_MAXIMUM"), args.number.max.toLocaleString(), true)
            }
            
            embeds.setDescription(`#️⃣ **${(args.number.min + Math.floor((Math.abs(args.number.max - args.number.min) + 1) * Math.random())).toLocaleString()}**`)

            return await message.reply({ content: "", embeds});
        }

        // Anything left is advice command
        return await message.reply(random(message.translateArray("RANDOM_ADVICE_QUOTES")));
    },
};

export default info;
