import { cache } from "../../deps.ts";
import { botCache } from "../../cache.ts";
import { sendResponse } from "../utils/helpers.ts";

botCache.inhibitors.set("nsfw", async function (message, command, guild) {
  // If this command does not need nsfw the inhibitor returns false so the command can run
  if (!command.nsfw) return false;

  // DMs are not considered NSFW channels by Discord so we return true to cancel nsfw commands on dms
  if (!guild) {
    return true;
  }

  // Not an nsfw channel return true to inhibit the command
  if (!cache.channels.get(message.channelID)?.nsfw) {
    sendResponse(
      message,
      "sorry this is an NSFW command. Please try this in an NSFW channel or send a direct message to the bot.",
    );
    return true;
  }

  // if it is a nsfw channel return false so the command runs
  return false;
});
