import { createSubcommand } from "../../../../utils/helpers.ts";

createSubcommand("events-edit", {
  name: "show",
  arguments: [
    { name: "subcommand", type: "subcommand" },
  ],
});
