import { botCache } from "../../../../mod.ts";

botCache.commands.set(`remind`, {
  name: `remind`,
  aliases: ["reminders", "remindme"],
  guildOnly: true,
  arguments: [{ name: "subcommand", type: "subcommand" }],
  execute: async (message, args, guild) => {
    botCache.commands.get("remind")
      ?.subcommands?.get("list")
      ?.execute?.(message, args, guild);
  },
});
