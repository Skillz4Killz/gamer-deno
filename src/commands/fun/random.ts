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
            required: false,
            arguments: [
                {
                    name: "min",
                    type: "number",
                    required: true,
                    defaultValue: 1,
                },
                {
                    name: "max",
                    type: "number",
                    required: true,
                    defaultValue: 100,
                },
            ],
        },
        {
            name: "8ball",
            type: "subcommand",
            required: false,
            arguments: [
                {
                    name: "question",
                    type: "...string",
                    required: true,
                },
            ],
        },
        {
            name: "advice",
            type: "subcommand",
            required: false,
            arguments: [],
        },
    ],
    async execute(message, args: { advice?: {}; "8ball"?: { question: string }; number: { min: number; max: number } }) {
        if (args["8ball"]) {
            const embeds = new Embeds()
                .setAuthor(message.tag, message.avatarURL)
                .setTitle(`❓ ${args["8ball"].question}`)
                .setDescription(message.translate("RANDOM_8BALL_QUOTES"));

            return await message.reply({ content: "", embeds });
        }

        if (args.number) {
            const embeds = new Embeds()
                .setAuthor(message.tag, message.avatarURL)
                .addField(message.translate("RANDOM_NUMBER_MINIMUM"), args.number.min.toLocaleString(), true);

            if (args.number.min > args.number.max) {
                embeds.addField(message.translate("RANDOM_NUMBER_MAXIMUM"), message.translate("RANDOM_NUMBER_MAX_WAS_TOO_LOW"));
                args.number.max = MAX_SAFE_INTEGER;
            } else {
                embeds.addField(message.translate("RANDOM_NUMBER_MAXIMUM"), args.number.max.toLocaleString(), true);
            }

            embeds.setDescription(
                `#️⃣ **${(args.number.min + Math.floor((Math.abs(args.number.max - args.number.min) + 1) * Math.random())).toLocaleString()}**`,
            );

            return await message.reply({ content: "", embeds });
        }

        // Anything left is advice command
        return await message.reply({
            content: "",
            embeds: new Embeds().setAuthor(message.tag, message.avatarURL).setDescription(random(message.translateArray("RANDOM_ADVICE_QUOTES"))),
        });
    },
};

export default info;
