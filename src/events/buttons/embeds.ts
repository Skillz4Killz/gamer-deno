import { Interaction, TextStyles } from "@discordeno/bot";
import { Components } from "../../base/Components.js";
import { embedLimits } from "../../base/Embeds.js";
import { GamerMessage } from "../../base/GamerMessage.js";
import { Gamer } from "../../bot.js";
import { configs } from "../../configs.js";

export async function embedsButtons(interaction: Interaction) {
    if (!interaction.guildId || !interaction.member || !interaction.message) return;
    if (!interaction.data?.customId) return;

    const message = new GamerMessage(interaction);

    const [type, subtype] = interaction.data.customId.split("-");
    if (type !== "embedButton") return;

    const embed = interaction.message.embeds?.[0];
    if (!embed) return await message.reply(message.translate("EMBED_BUTTON_MISSING_EMBED"), { private: true });

    // ONLY ADMINS CAN USE THIS
    if (!interaction.member.permissions?.has("ADMINISTRATOR")) {
        return await message.reply(message.translate("USER_NOT_ADMIN"), { private: true });
    }

    if (!subtype) return;

    if (subtype === "Save") {
        await Gamer.discord.helpers.editMessage(interaction.channelId!, interaction.message.id, {
            content: interaction.message.content,
            embeds: interaction.message.embeds?.map((e) => Gamer.discord.transformers.reverse.embed(Gamer.discord, e)),
            components: new Components().addButton(message.translate("EMBED_SENT_BY", message.tag), "Secondary", "buttonSentBy", { disabled: true }),
        });

        return await interaction.respond(message.translate("EMBED_SAVED"));
    }

    if (subtype === "Field") {
        const components = new Components()
            .addInputText(message.translate("EMBED_MODAL_FIELD_NAME_LABEL"), "fieldname", TextStyles.Short, {
                required: true,
                maxLength: embedLimits.fieldName,
                placeholder: message.translate(
                    "EMBED_MODAL_FIELD_NAME_LABEL_PLACEHOLDER",
                    message.isOnDiscord ? configs.platforms.discord.supportServerInvite : configs.platforms.guilded.supportServerInvite,
                ),
            })
            .addInputText(message.translate("EMBED_MODAL_FIELD_VALUE_LABEL"), "fieldvalue", TextStyles.Short, {
                placeholder: message.translate("EMBED_MODAL_FIELD_VALUE_LABEL_PLACEHOLDER"),
                required: true,
            })
            .addInputText(message.translate("EMBED_MODAL_FIELD_INLINE_LABEL"), "fieldinline", TextStyles.Short, {
                placeholder: message.translate("EMBED_MODAL_FIELD_INLINE_LABEL_PLACEHOLDER"),
                required: false,
            });
        return await interaction.respond({
            title: message.translate("EMBED_MODAL_FIELD_TITLE"),
            customId: `embedsField-${interaction.message.id}`,
            components,
        });
    }

    if (["Title", "Description", "URL", "Image", "Thumbnail", "Color", "Content"].includes(subtype)) {
        const lowerSubtype = subtype.toLowerCase();
        const limit = embedLimits[lowerSubtype as "title"];

        const components = new Components().addInputText(
            message.translate(`EMBED_MODAL_${subtype.toUpperCase()}_LABEL` as any),
            lowerSubtype,
            TextStyles.Short,
            {
                maxLength: limit < 4000 ? limit : 4000,
                placeholder: message.translate(`EMBED_MODAL_${subtype.toUpperCase()}_LABEL_PLACEHOLDER` as any),
                required: false,
                value: subtype === "Thumbnail" ? embed.thumbnail?.url : subtype === "Image" ? embed.image?.url : embed[lowerSubtype as "title"],
            },
        );
        return await interaction.respond({
            title: message.translate(`EMBED_MODAL_${subtype.toUpperCase()}_TITLE` as any),
            customId: `embeds${subtype}-${interaction.message.id}`,
            components,
        });
    }

    if (subtype === "Author") {
        const components = new Components()
            .addInputText(message.translate("EMBED_MODAL_AUTHOR_LABEL"), "authorname", TextStyles.Short, {
                maxLength: embedLimits.authorName,
                placeholder: message.translate("EMBED_MODAL_AUTHOR_LABEL_PLACEHOLDER"),
                value: embed.author?.name,
                required: true,
            })
            .addInputText(message.translate("EMBED_MODAL_ICON_URL_LABEL"), "authoricon", TextStyles.Short, {
                placeholder: message.translate("EMBED_MODAL_ICON_URL_LABEL_PLACEHOLDER"),
                value: embed.author?.iconUrl,
                required: false,
            })
            .addInputText(message.translate("EMBED_MODAL_URL_LABEL"), "authorurl", TextStyles.Short, {
                placeholder: message.translate("EMBED_MODAL_URL_LABEL_PLACEHOLDER"),
                value: embed.author?.url,
                required: false,
            });

        return await interaction.respond({
            title: message.translate("EMBED_MODAL_AUTHOR_TITLE"),
            customId: `embedsAuthor-${interaction.message.id}`,
            components,
        });
    }

    if (subtype === "Footer") {
        const components = new Components()
            .addInputText(message.translate("EMBED_MODAL_FOOTER_LABEL"), "footer", TextStyles.Short, {
                maxLength: embedLimits.footerText,
                placeholder: message.translate("EMBED_MODAL_FOOTER_LABEL_PLACEHOLDER"),
                value: embed.footer?.text,
                required: true,
            })
            .addInputText(message.translate("EMBED_MODAL_ICON_URL_LABEL"), "footericon", TextStyles.Short, {
                placeholder: message.translate("EMBED_MODAL_ICON_URL_LABEL_PLACEHOLDER"),
                value: embed.footer?.iconUrl,
                required: false,
            });
        return await interaction.respond({
            title: message.translate("EMBED_MODAL_FOOTER_TITLE"),
            customId: `embedsFooter-${interaction.message.id}`,
            components,
        });
    }
}
