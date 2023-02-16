import { Command } from "../../base/typings.js";

export const info: Command = {
    name: "random",
    aliases: ["randomize"],
    arguments: [
        {
            name: "number",
            type: "subcommand",
            missing: () => {},
            required: false,
            subarguments: [],
        },
    ],
    async execute() {},
};

export default info;
