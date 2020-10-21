import { botCache } from "../../../../mod.ts";

botCache.commands.set("feedback", {
  name: "feedback",
  aliases: ["fb"],
  arguments: [
    { name: "subcommand", type: "subcommand" },
  ],
  guildOnly: true,
  execute: async function (message, args, guild) {
  },
});
