import { Argument } from "../base/typings.js";

export const string: Argument = {
    name: "string",
    async execute(argument, parameters) {
        const [text] = parameters;
        const valid = argument.literals?.length && text ? (argument.literals.includes(text.toLowerCase()) ? text : undefined) : text;

        if (valid) {
            return argument.lowercase ? valid.toLowerCase() : valid;
        }
        return;
    },
};
