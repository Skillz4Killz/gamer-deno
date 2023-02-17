import { Argument } from "../base/typings.js";

export const subcommand: Argument = {
    name: "subcommand",
    async execute(argument, parameters) {
        const [subcommandName] = parameters;

        if (!subcommandName) return;

        return argument.name === subcommandName ? argument : undefined
    },
};
