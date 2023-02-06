import { bgBlue, bgYellow, black, botCache, cache } from "../../deps.ts";
import { getTime } from "../utils/helpers.ts";
import { parseCommand } from "./commandHandler.ts";

botCache.monitors.set("modmail", {
  name: "modmail",
  botChannelPermissions: ["SEND_MESSAGES", "MANAGE_MESSAGES"],
  execute: async function (message) {
    // If this is not a support channel
    if (!botCache.guildSupportChannelIDs.has(message.channelID)) return;

    console.log(
      `${bgBlue(`[${getTime()}]`)} => [MONITOR: ${bgYellow(black("modmail"))}] Executed in ${
        message.guild?.name || message.guildID
      } in ${message.channelID}.`
    );

    const command = parseCommand(message.content.split(" ")[0]);
    if (command?.name === "mail") return;

    await botCache.commands.get("mail")?.execute?.(
      message,
      // @ts-ignore
      { content: message.content },
      cache.guilds.get(message.guildID)
    );

    return message.delete();
  },
});
