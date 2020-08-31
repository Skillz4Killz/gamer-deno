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
