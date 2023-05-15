import { Interaction, MessageComponentTypes } from "@discordeno/bot";
import Embeds from "../../base/Embeds.js";
import { GamerMessage } from "../../base/GamerMessage.js";
import { translate } from "../../base/languages/translate.js";
import { validateHex, validateImageUrl, validateUrl } from "../../utils/helpers.js";
import { fetchMessage } from "../../utils/platforms/messages.js";

export async function embedsModals(interaction: Interaction) {
    if (!interaction.guildId || !interaction.member || !interaction.channelId) return;
    if (!interaction.data?.customId) return;

    const [type, id] = interaction.data.customId.split("-");
    if (!type?.startsWith("embeds") || !id) return;

    const message = new GamerMessage(interaction);

    const embed = await fetchMessage(message.channelId, id, { platform: message.platform });
    if (!embed?.embeds.length) return await interaction.respond(translate(interaction.guildId, "EMBED_MODAL_MESSAGE_UNKNOWN"));

    const embeds = new Embeds().setFromEmbed(embed.embeds[0]!);

    const field = {
        name: "",
        value: "",
        inline: true,
    };

    let editedContent = "";

    if (interaction.data.components) {
        for (const row of interaction.data.components) {
            if (row.components) {
                for (const component of row.components) {
                    if (component.type !== MessageComponentTypes.InputText) continue;

                    const value = component.value!;
                    switch (component.customId) {
                        case "title":
                            embeds.setTitle(value);
                            break;
                        case "description":
                            embeds.setDescription(value);
                            break;
                        case "content":
                            editedContent = value;
                            break;
                        case "url":
                            if (!validateUrl(value)) return await interaction.respond(message.translate("INVALID_URL"));
                            embeds.setURL(value);
                            break;
                        case "authorname":
                            embeds.setAuthor(value);
                            break;
                        case "authoricon":
                            if (!value) {
                                embeds.setAuthor(embeds.getLastEmbed().author!.name, undefined, embeds.getLastEmbed().author?.url);
                                break;
                            }

                            if (!validateImageUrl(value)) return await interaction.respond(message.translate("INVALID_IMAGE_URL"));

                            embeds.setAuthor(embeds.getLastEmbed().author!.name, value);
                            break;
                        case "authorurl":
                            if (!value) continue;
                            if (!validateUrl(value)) return await interaction.respond(message.translate("INVALID_URL"));

                            embeds.setAuthor(embeds.getLastEmbed().author!.name, embeds.getLastEmbed().author!.iconUrl, value);
                            break;
                        case "footer":
                            embeds.setFooter(value);
                            break;
                        case "footericon":
                            if (!value) {
                                embeds.setFooter(embeds.getLastEmbed().footer!.text);
                                break;
                            }

                            if (!validateImageUrl(value)) return await interaction.respond(message.translate("INVALID_IMAGE_URL"));

                            embeds.setFooter(embeds.getLastEmbed().footer!.text, value);
                            break;
                        case "image":
                            if (!value) {
                                embeds.setImage("")
                                break;
                            }

                            if (!validateImageUrl(value)) return await interaction.respond(message.translate("INVALID_IMAGE_URL"));

                            embeds.setImage(value);
                            break;
                        case "thumbnail":
                            if (!value) {
                                embeds.setThumbnail("")
                                break;
                            }
                            if (!validateImageUrl(value)) return await interaction.respond(message.translate("INVALID_IMAGE_URL"));

                            embeds.setThumbnail(value);
                            break;
                        case "color":
                            if (!validateHex(value)) return await interaction.respond(message.translate("INVALID_HEX_COLOR"));
                            embeds.setColor(value);
                            break;
                        case "fieldname":
                            field.name = value;
                            break;
                        case "fieldvalue":
                            field.value = value;
                            break;
                        case "fieldinline":
                            field.inline = value.toLowerCase() === "yes";
                            break;
                    }
                }
            }
        }
    }

    if (field.name) embeds.addField(field.name, field.value, field.inline);

    await embed.edit({
        content: editedContent || embed.content,
        embeds,
        // @ts-ignore this should work
        components: embed.components,
    });

    return await interaction.respond(message.translate("EMBED_EDITED"));
}
