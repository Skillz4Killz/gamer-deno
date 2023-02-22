import { Camelize, DiscordInteraction, InteractionTypes } from "@discordeno/bot";
import { interactionCreate } from "../interactions.js";

export default async function replay(payload: Camelize<DiscordInteraction>) {
    if (!payload.data?.customId?.startsWith("cmdReplay-")) return;
    payload.type = InteractionTypes.ApplicationCommand;
    payload.data.name = payload.data.customId.replace("cmdReplay-", "");
    interactionCreate(payload);
}
