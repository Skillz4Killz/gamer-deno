// DEV PURPOSES ONLY
import { botCache } from "../../../deps.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { Command, createCommand } from "../../utils/helpers.ts";

createCommand({
  name: "ddb",
  permissionLevels: [PermissionLevels.BOT_OWNER],
  execute: async function (message, args, guild) {
    for (const command of botCache.commands.values()) {
      let fullName = [command.name];

      async function handleSub(subcommand: Command<any>) {
        if (!subcommand.subcommands?.size) {
          fullName.push(subcommand.name);
          message.content = `.help ${fullName.join(" ")}`;
          await botCache.commands.get("help")?.execute?.(
            message,
            {
              // @ts-ignore
              command: subcommand,
            },
            guild
          );
          return;
        }

        for (const sub of subcommand.subcommands.values()) {
          await handleSub(sub).catch(console.log);
        }

        fullName = [command.name];
      }

      message.content = `.help ${command.name}`;
      await botCache.commands.get("help")?.execute?.(
        message,
        {
          // @ts-ignore
          command: command,
        },
        guild
      );
      if (command.subcommands?.size) {
        for (const subcommand of command.subcommands.values()) {
          await handleSub(subcommand).catch(console.log);
        }
      }
    }
  },
});
