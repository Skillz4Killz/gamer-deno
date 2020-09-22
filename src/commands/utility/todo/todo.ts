import { createCommand } from "../../../utils/helpers.ts";

createCommand({
  name: `todo`,
  guildOnly: true,
  arguments: [{
    name: "subcommand",
    type: "subcommand",
  }],
  execute: async (message, _args, guild) => {
  },
});
