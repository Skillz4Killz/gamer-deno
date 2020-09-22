import { createCommand } from "../../utils/helpers.ts";

createCommand({
  name: "shop",
  arguments: [
    { name: "subcommand", type: "subcommand" },
  ],
});
