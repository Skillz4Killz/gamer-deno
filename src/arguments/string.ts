import { Argument } from "../base/typings.js";

export const string: Argument = {
    name: "string",
    async execute(_argument, parameters, message, command) {
        return parameters[0];
    },
};
