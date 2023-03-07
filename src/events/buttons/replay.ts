import { Camelize, DiscordInteraction } from "@discordeno/bot";
import { GamerMessage } from "../../base/GamerMessage.js";
import { Gamer } from "../../bot.js";
import { parseArguments } from "../helpers/commands.js";

export default async function replay(payload: Camelize<DiscordInteraction>) {
    const [type, ...content] = payload.data?.customId?.split("-") ?? [];
    if (type !== "cmdReplay") return;

    const [cmdName, ...args] = content.join(' ').split(' ');
    console.log('cmd', cmdName, args, payload.data?.customId, content)
    const command = Gamer.commands.get(cmdName!);
    if (!command) return;

    const message = new GamerMessage(payload);
    const cmdArgs = await parseArguments(message, command, args)
    await command.execute(message, cmdArgs);
}
