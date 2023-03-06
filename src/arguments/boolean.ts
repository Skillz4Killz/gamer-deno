import { Argument } from "../base/typings.js";

export const number: Argument = {
    name: "number",
    async execute(_, parameters, message) {
        const [boolean] = parameters;
        if (!boolean) return;

        if (
            ![
                "true",
                "false",
                "on",
                "off",
                "enable",
                "disable",
                message.translate("TRUE"),
                message.translate("FALSE"),
                message.translate("ON"),
                message.translate("OFF"),
                message.translate("ENABLE"),
                message.translate("DISABLE"),
            ].includes(boolean)
        ) {
            return;
        }

        return ["true", "on", "enable", message.translate("TRUE"), message.translate("ON"), message.translate("ENABLE")].includes(boolean);
    },
};
