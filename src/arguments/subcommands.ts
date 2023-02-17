import { Argument } from "../base/typings.js";

export const subcommand: Argument = {
    name: "subcommand",
    async execute(_argument, parameters, _, command) {
        const [subcommandName] = parameters;

        if (!subcommandName) return;

        const sub = command.arguments?.find((sub) => sub.name === subcommandName);
        if (sub) return sub;

        return;
    },
};
