import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("settings", {
  name: "tags",
  arguments: [
    { name: "subcommand", type: "subcommand" },
  ],
});
