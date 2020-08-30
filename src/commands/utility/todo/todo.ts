// This command is intentionally done in an un-optimized way. This command is only to show you how to await a users response.
import { botCache } from "../../../../mod.ts";

botCache.commands.set(`todo`, {
  name: `todo`,
  guildOnly: true,
  arguments: [{
    name: "subcommand",
    type: "subcommand",
  }],
  execute: async (message, _args, guild) => {
  },
});
