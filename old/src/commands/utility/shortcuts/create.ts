import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("shortcut", {
  name: "create",
  aliases: ["c"],
  permissionLevels: [PermissionLevels.ADMIN],
  vipServerOnly: true,
  arguments: [
    {
      name: "delete",
      type: "string",
      literals: ["deletetrigger"],
      required: false,
    },
    { name: "name", type: "string", lowercase: true },
    { name: "text", type: "...string" },
  ] as const,
  execute: async function (message, args) {
    const shortcut = await db.shortcuts.get(`${message.guildID}-${args.name}`);
    if (shortcut) return botCache.helpers.reactError(message);

    // This split with | allows users to make multiple commands run back to back
    const splitOptions = args.text.split("|");

    const actions = splitOptions
      .map((action) => {
        // The first will always need to be a command name and the rest are the args
        const [commandName, ...scargs] = action.trim().split(` `);
        if (!commandName || !botCache.commands.get(commandName.toLowerCase())) {
          return;
        }

        return {
          commandName: commandName.toLowerCase(),
          args: scargs.join(" "),
        };
      })
      .filter((a) => a);

    if (!actions) return;

    await db.shortcuts.create(`${message.guildID}-${args.name}`, {
      id: `${message.guildID}-${args.name}`,
      actions: actions.map((a) => a!),
      deleteTrigger: Boolean(args.delete),
      guildID: message.guildID,
      name: args.name,
    });

    return botCache.helpers.reactSuccess(message);
  },
});
