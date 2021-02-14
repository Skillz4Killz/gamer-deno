import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("settings", {
  name: "automod",
  arguments: [{ name: "subcommand", type: "subcommand" }],
});
