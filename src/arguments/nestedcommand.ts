import { botCache } from "../../cache.ts";
botCache.arguments.set("nestedcommand", {
  name: "nestedcommand",
  execute: function (_argument, parameters) {
    let command = botCache.commands.get(parameters[0]!);

    for (const word of parameters) {
      const isCommand = command
        ? command.subcommands.get(word)
        : botCache.commands.get(word);
      if (!isCommand) continue;

      command = isCommand;
    }

    return command;
  },
});
