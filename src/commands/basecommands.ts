import { PermissionLevels } from "../types/commands.ts";
import { createCommand, createSubcommand } from "../utils/helpers.ts";

// Put inside a function so garbage collector cleans it up
function loadBaseCommands() {
  const commandNames = [
    {
      name: "settings",
      aliases: ["s"],
      subcommands: [
        { name: "tags", aliases: [] },
        { name: "feedback", aliases: ["fb"] },
        { name: "users", aliases: [] },
      ],
    },
  ];

  commandNames.forEach((command) => {
    createCommand({
      name: command.name,
      aliases: command.aliases,
      vipServerOnly: true,
      permissionLevels: [PermissionLevels.BOT_OWNER],
      arguments: [
        { name: "subcommand", type: "subcommand" },
      ],
    });

    // Add the remaining subcommands
    command.subcommands.forEach((subcommand) => {
      createSubcommand(command.name, {
        name: subcommand.name,
        aliases: subcommand.aliases,
        arguments: [
          { name: "subcommand", type: "subcommand" },
        ],
      });
    });
  });
}

loadBaseCommands();
