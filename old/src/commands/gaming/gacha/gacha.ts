import { createCommand } from "../../../utils/helpers.ts";

createCommand({
  name: "gacha",
  arguments: [{ name: "subcommand", type: "subcommand" }],
});
