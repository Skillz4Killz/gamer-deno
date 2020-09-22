import { createCommand, sendEmbed } from "../../utils/helpers.ts";

createCommand({
  name: `roles`,
  guildOnly: true,
  arguments: [
    { name: "subcommand", type: "subcommand", literals: ["unique"] },
  ],
  execute: async (message, _args, guild) => {
  },
});
