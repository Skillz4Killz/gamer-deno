import { GamerMessage } from "../../base/GamerMessage.js";
import { Gamer } from "../../bot.js";

export function handlePossibleCollector(message: GamerMessage) {
    const key = `${message.author.id}-${message.channelId}`
    const collector = Gamer.collectors.get(key)
    if (!collector || !message.content) return;

    // A collector was found for this user in this channel.
    collector.resolve(message.content);
    Gamer.collectors.delete(key);
}