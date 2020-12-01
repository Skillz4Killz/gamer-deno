import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("settings-xp", {
  name: "decay",
  arguments: [
    { name: "subcommand", type: "subcommand" },
  ],
});
