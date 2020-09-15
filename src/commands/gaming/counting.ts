import { botCache } from "../../../mod.ts";

botCache.commands.set("counting", {
  name: "counting",
  aliases: ["counter", "count"],
  arguments: [
    { name: "subcommand", type: "subcommand" },
  ],
});
