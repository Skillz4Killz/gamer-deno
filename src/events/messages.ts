import { Message as DiscordenoMessage } from "@discordeno/bot";
import { Message } from "guilded.js/types/index.js";
import { GamerMessage } from "../base/GamerMessage.js";
import { handlePossibleCommand } from "./helpers/commands.js";

export const messageCreate = async function (payload: DiscordenoMessage | Message) {
    const message = new GamerMessage(payload);

    // TODO: Run automod first if message is deleted we don't want to run commands and such

    // Run all the handling for a new message
    await Promise.all([handlePossibleCommand(message)]);
};
