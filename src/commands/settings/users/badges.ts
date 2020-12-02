import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("settings-users", {
  name: "badges",
  aliases: ["badge"],
  arguments: [
    { name: "subcommand", type: "subcommand" },
  ],
});
