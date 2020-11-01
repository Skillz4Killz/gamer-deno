import { createCommand } from "../../../utils/helpers.ts";

createSubcommand('settings', {
    name: 'staff',
    arguments: [
        { name: "subcommand", type: "subcommand" }
    ],
})