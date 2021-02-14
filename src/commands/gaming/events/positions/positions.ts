import { createSubcommand } from "../../../../utils/helpers.ts";

createSubcommand("events", {
  name: "positions",
  aliases: ["p", "position"],
  arguments: [{ name: "subcommand", type: "subcommand" }],
});
