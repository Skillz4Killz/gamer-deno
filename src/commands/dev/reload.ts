import { botCache } from "../../../cache.ts";
import { updateEventHandlers } from "../../../deps.ts";
import {
  createCommand,
  importDirectory,
  sendResponse,
} from "../../utils/helpers.ts";
import { PermissionLevels } from "../../types/commands.ts";
import i18next from "https://deno.land/x/i18next@v19.6.3/index.js";

const folderPaths = new Map(
  [
    ["arguments", "./src/arguments"],
    ["commands", "./src/commands"],
    ["events", "./src/events"],
    ["inhibitors", "./src/inhibitors"],
    ["monitors", "./src/monitors"],
    ["tasks", "./src/tasks"],
    ["perms", "./src/permissionLevels"],
    ["helpers", "./src/helpers"],
    ["constants", "./src/constants"],
  ],
);

createCommand({
  name: `reload`,
  permissionLevels: [PermissionLevels.BOT_OWNER],
  botChannelPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES"],
  arguments: [
    {
      name: "folder",
      type: "string",
      literals: [
        "arguments",
        "commands",
        "events",
        "inhibitors",
        "monitors",
        "tasks",
        "perms",
        "helpers",
        "constants",
      ],
      required: false,
    },
  ],
  execute: async function (message, args: ReloadArgs) {
    // Reload a specific folder
    if (args.folder) {
      const path = folderPaths.get(args.folder);
      if (!path) {
        return sendResponse(
          message,
          "The folder you provided did not have a path available.",
        );
      }

      await importDirectory(Deno.realPathSync(path));
      return sendResponse(message, `The **${args.folder}** has been reloaded.`);
    }

    // Reloads the main folders:
    await Promise.all(
      [...folderPaths.values()].map((path) =>
        importDirectory(Deno.realPathSync(path))
      ),
    );
    // Updates the events in the library
    updateEventHandlers(botCache.eventHandlers);
    i18next.reloadResources(
      botCache.constants.personalities.map((p) => p.id),
      undefined,
      undefined,
    );

    return sendResponse(message, "Reloaded everything.");
  },
});

interface ReloadArgs {
  folder?:
    | "arguments"
    | "commands"
    | "events"
    | "inhibitors"
    | "monitors"
    | "tasks"
    | "perms"
    | "helpers"
    | "constants";
}
