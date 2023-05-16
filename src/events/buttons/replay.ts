import { Interaction } from "@discordeno/bot";
import { GamerMessage } from "../../base/GamerMessage.js";
import { Gamer } from "../../bot.js";
import { parseArguments } from "../helpers/commands.js";

export default async function replay(payload: Interaction) {
    const [type, ...content] = payload.data?.customId?.split("-") ?? [];
    if (type !== "cmdReplay") return;

    const [cmdName, ...args] = content.join(" ").split(" ");
    const command = Gamer.commands.get(cmdName!);
    if (!command) return;

    const message = new GamerMessage(payload);
    message.content = content.join(" ");
    const cmdArgs = await parseArguments(message, command, args);
    await command.execute(message, cmdArgs);
}