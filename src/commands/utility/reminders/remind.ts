import { botCache } from "../../../../cache.ts";
import { createCommand } from "../../../utils/helpers.ts";

createCommand({
  name: `remind`,
  aliases: ["reminders", "remindme"],
  guildOnly: true,
  description: "strings:REMIND_DESCRIPTION",
  arguments: [{ name: "subcommand", type: "subcommand" }],
  execute: async (message, args, guild) => {
    botCache.commands.get("remind")
      ?.subcommands?.get("list")
      ?.execute?.(message, {}, guild);
  },
});
