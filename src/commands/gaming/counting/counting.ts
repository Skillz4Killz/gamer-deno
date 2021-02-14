import { createCommand } from "../../../utils/helpers.ts";

createCommand({
  name: "counting",
  aliases: ["counter", "count"],
  arguments: [{ name: "subcommand", type: "subcommand" }],
});
