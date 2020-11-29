import { createSubcommand } from "../../../../utils/helpers.ts";

createSubcommand("events", {
  name: "edit",
  aliases: ["e"],
  arguments: [
    { name: "subcommand", type: "subcommand" },
  ],
});
