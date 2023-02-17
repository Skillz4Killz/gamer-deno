import { Argument } from "../base/typings.js";

export const number: Argument = {
    name: "number",
    async execute(argument, parameters) {
        const [number] = parameters;

        const valid = Number(number);
        if (isNaN(valid)) return;

        if (argument.minimum && valid < argument.minimum) return;
        if (argument.maximum && valid > argument.maximum) return;
        if (!argument.allowDecimals) return Math.floor(valid);

        if (valid) return valid;

        return;
    },
};
