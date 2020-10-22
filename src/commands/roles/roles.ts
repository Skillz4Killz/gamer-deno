import { createCommand, sendEmbed } from "../../utils/helpers.ts";

createCommand({
  name: `roles`,
  aliases: ["role"],
  guildOnly: true,
  arguments: [
    { name: "subcommand", type: "subcommand" },
  ],
  execute: async (message, _args, guild) => {
  },
});
