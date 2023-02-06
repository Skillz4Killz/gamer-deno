import { createCommand } from "../../../utils/helpers.ts";

createCommand({
  name: "polls",
  arguments: [{ name: "subcommand", type: "subcommand" }],
});
