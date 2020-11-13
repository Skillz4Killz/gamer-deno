import { createSubcommand } from "../../../../utils/helpers.ts";

createSubcommand("settings-automod", {
  name: "links",
  arguments: [
    { name: "subcommand", type: "subcommand" },
  ],
});
