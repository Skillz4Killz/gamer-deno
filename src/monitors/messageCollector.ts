import { bgBlue, bgYellow, black } from "../../deps.ts";
import { botCache } from "../../deps.ts";
import { getTime } from "../utils/helpers.ts";

botCache.monitors.set("messageCollector", {
  name: "messageCollector",
  /** The main code that will be run when this monitor is triggered. */
  execute: async function (message) {
    const collector = botCache.messageCollectors.get(message.author.id);
    // This user has no collectors pending or the message is in a different channel
    if (!collector || message.channelID !== collector.channelID) return;

    console.log(
      `${bgBlue(`[${getTime()}]`)} => [MONITOR: ${bgYellow(black("collector"))}] Executed in ${
        message.guild?.name || message.guildID
      } in ${message.channel?.name} (${message.channelID}) by ${message.member?.tag}(${message.author.id}).`
    );
    // This message is a response to a collector. Now running the filter function.
    if (!collector.filter(message)) return;

    // If the necessary amount has been collected
    if (collector.amount === 1 || collector.amount === collector.messages.length + 1) {
      // Remove the collector
      botCache.messageCollectors.delete(message.author.id);
      // Resolve the collector
      return collector.resolve([...collector.messages, message]);
    }

    // More messages still need to be collected
    collector.messages.push(message);
  },
});
