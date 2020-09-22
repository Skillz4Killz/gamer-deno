import { botCache } from "../../../../mod.ts";
import { createCommand } from "../../../utils/helpers.ts";

createCommand({
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
