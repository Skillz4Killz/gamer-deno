import { botCache } from "../../../mod.ts";

botCache.commands.set("shop", {
  name: "shop",
  arguments: [
    { name: "subcommand", type: "subcommand" },
  ],
});
