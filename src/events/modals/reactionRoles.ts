import { ButtonStyles, Interaction, MessageComponentTypes } from "@discordeno/bot";
import { Components } from "../../base/Components.js";
import Embeds from "../../base/Embeds.js";
import { translate } from "../../base/languages/translate.js";
import { Gamer } from "../../bot.js";
import { STRING_CONTAINS_SNOWFLAKE_REGEX } from "../../utils/constants.js";
import { DEFAULT_EMOJIS } from "../../utils/emojis.js";
import { validateSnowflake } from "../../utils/snowflakes.js";

export async function reactionRoleModals(interaction: Interaction) {
    if (!interaction.guildId || !interaction.member) return;
    if (!interaction.data?.customId) return;

    const [type] = interaction.data.customId.split("-");

    // EDITING THE TEXT MESSAGE
    if (type === "reactionRoleTextEdited") {
        // ONLY ADMINS CAN USE THIS
        if (!interaction.member.permissions || !interaction.member.permissions.has("ADMINISTRATOR")) {
            return await interaction.respond(translate(interaction.guildId, "USER_NOT_ADMIN"), { isPrivate: true });
        }

        const args = interaction.data.customId.split("-");
        // REMOVES THE NON IDS
        args.shift();
        const [channelId, messageId] = args;
        if (!channelId || !messageId) return;

        // logger.setLevel(0)
        const message = await Gamer.discord.helpers.getMessage(channelId, messageId);
        if (!message) return await interaction.respond(translate(interaction.guildId, "ROLES_REACTIONS_MODAL_UNKNOWN_MESSAGE"), { isPrivate: false });

        if (!message.components)
            return await interaction.respond(translate(interaction.guildId, "ROLES_REACTIONS_MODAL_MESSAGE_NO_BUTTONS"), { isPrivate: false });

        let content = "No content provided.";
        for (const row of interaction.data.components || []) {
            for (const component of row.components || []) {
                if (component.customId !== "modaltext") continue;
                content = component.value!;

                if (content.startsWith("{") && content.endsWith("}")) {
                    try {
                        const json = JSON.parse(content);
                        const embeds = new Embeds().setFromJson(json);

                        await Gamer.discord.helpers.editMessage(channelId, messageId, {
                            content: json.content,
                            embeds,
                            // @ts-ignore should work
                            components: new Components(...message.components),
                            allowedMentions: { parse: [] },
                            //   attachments: message.attachments,
                        });
                        return await interaction.respond(translate(interaction.guildId, "REACTION_ROLE_EDITED"), { isPrivate: false });
                    } catch (err) {
                        console.log("json error", err);
                        return await interaction.respond(translate(interaction.guildId, "INVALID_EMBED_JSON_CODE"), { isPrivate: false });
                    }
                }
            }
        }

        await Gamer.discord.helpers.editMessage(channelId, messageId, {
            content,
            embeds: message.embeds?.map((e) => Gamer.discord.transformers.reverse.embed(Gamer.discord, e)),
            // @ts-ignore should work
            components: new Components(...message.components),
            allowedMentions: { parse: [] },
            //   attachments: message.attachments,
        });

        return await interaction.respond(translate(interaction.guildId, "REACTION_ROLE_EDITED"), { isPrivate: true });
    }

    // ADDING NEW BUTTON
    if (interaction.data.customId.startsWith("reactionRoleEdited-")) {
        // ONLY ADMINS CAN USE THIS
        if (!interaction.member.permissions || !interaction.member.permissions.has("ADMINISTRATOR")) {
            return await interaction.respond(translate(interaction.guildId, "USER_NOT_ADMIN"), { isPrivate: true });
        }

        const args = interaction.data.customId.split("-");
        // REMOVES THE NON IDS
        args.shift();
        const [channelId, messageId] = args.map((id) => Gamer.discord.transformers.snowflake(id));
        if (!channelId || !messageId) return;

        const message = await Gamer.discord.helpers.getMessage(channelId, messageId);
        if (!message) return interaction.respond(translate(interaction.guildId, "ROLES_REACTIONS_MODAL_UNKNOWN_MESSAGE"), { isPrivate: false });

        if (!message.components)
            return interaction.respond(translate(interaction.guildId, "ROLES_REACTIONS_MODAL_MESSAGE_NO_BUTTONS"), { isPrivate: false });

        const options = {
            addRemove: "add",
            emoji: "",
            role: "",
            label: "",
            color: ButtonStyles.Primary,
        };

        for (const row of interaction.data.components || []) {
            if (!row.components) continue;

            for (const component of row.components) {
                if (component.type !== MessageComponentTypes.InputText) continue;
                if (!component.value) continue;

                switch (component.customId) {
                    case "modalcolor":
                        if (component.value.toLowerCase() === "red") options.color = ButtonStyles.Danger;
                        if (component.value.toLowerCase() === "grey") options.color = ButtonStyles.Secondary;
                        if (component.value.toLowerCase() === "green") options.color = ButtonStyles.Success;
                        break;
                    case "modaladdremove":
                        if (component.value === "remove") options.addRemove = "remove";
                        break;
                    case "modalemoji":
                        // A snowflake id was provided
                        if (STRING_CONTAINS_SNOWFLAKE_REGEX.test(component.value)) {
                            options.emoji = component.value.match(STRING_CONTAINS_SNOWFLAKE_REGEX)![0];
                            break;
                        }

                        if (DEFAULT_EMOJIS.has(component.value)) {
                            options.emoji = component.value;
                            break;
                        }
                        return await interaction.respond(translate(interaction.guildId, "ROLES_REACTIONS_MODAL_INVALID_EMOJI"), { isPrivate: false });
                    case "modalrole":
                        if (!validateSnowflake(component.value))
                            return await interaction.respond(translate(interaction.guildId, "ROLES_REACTIONS_MODAL_INVALID_ROLE"), {
                                isPrivate: false,
                            });

                        // TODO: validations - role validations

                        options.role = component.value;
                        break;
                    case "modallabel":
                        options.label = component.value;
                        break;
                }
            }
        }

        // @ts-ignore
        const components = new Components(...message.components);

        if (options.addRemove === "add") {
            const customId = `reactionRole-${options.role}`;
            for (const row of components) {
                for (const component of row.components) {
                    if (component.customId === customId)
                        return await interaction.respond(translate(interaction.guildId, "ROLES_REACTIONS_MODAL_ROLE_USED"), { isPrivate: false });
                }
            }

            components
                // ADD NEW
                .addButton(options.label, options.color, `reactionRole-${options.role}`, { emoji: options.emoji });
        } else {
            for (const row of components) {
                for (const [index, subcomponent] of row.components.entries()) {
                    if (subcomponent.type === MessageComponentTypes.Button) {
                        if (!subcomponent.emoji) continue;

                        if ([subcomponent.emoji.id, subcomponent.emoji.name].includes(options.emoji)) {
                            row.components.splice(index, 1);
                        }
                    }
                }
            }
        }

        await Gamer.discord.helpers.editMessage(channelId, messageId, {
            content: message.content,
            embeds: message.embeds?.map((e) => Gamer.discord.transformers.reverse.embed(Gamer.discord, e)),
            components,
            // allowedMentions: { parse: [] },
            //   attachments: message.attachments,
        });

        return await interaction.respond(translate(interaction.guildId, "REACTION_ROLE_EDITED"), { isPrivate: true });
    }

    // REMOVING A BUTTON
    if (interaction.data.customId.startsWith("reactionRoleRemoved-")) {
        // ONLY ADMINS CAN USE THIS
        if (!interaction.member.permissions || !interaction.member.permissions.has("ADMINISTRATOR")) {
            return await interaction.respond(translate(interaction.guildId, "USER_NOT_ADMIN"), { isPrivate: true });
        }

        const args = interaction.data.customId.split("-");
        // REMOVES THE NON IDS
        args.shift();
        const [channelId, messageId] = args.map((id) => Gamer.discord.transformers.snowflake(id));
        if (!channelId || !messageId) return;

        const message = await Gamer.discord.helpers.getMessage(channelId, messageId);
        if (!message) return interaction.respond(translate(interaction.guildId, "ROLES_REACTIONS_MODAL_UNKNOWN_MESSAGE"), { isPrivate: false });
        if (!message.components)
            return interaction.respond(translate(interaction.guildId, "ROLES_REACTIONS_MODAL_MESSAGE_NO_BUTTONS"), { isPrivate: false });

        const options = {
            emoji: "",
        };

        for (const row of interaction.data.components || []) {
            if (!row.components) continue;

            for (const component of row.components) {
                if (component.type !== MessageComponentTypes.InputText) continue;
                if (!component.value) continue;

                switch (component.customId) {
                    case "modalemoji":
                        // A snowflake id was provided
                        if (STRING_CONTAINS_SNOWFLAKE_REGEX.test(component.value)) {
                            options.emoji = component.value.match(STRING_CONTAINS_SNOWFLAKE_REGEX)![0];
                            break;
                        }

                        if (DEFAULT_EMOJIS.has(component.value)) {
                            options.emoji = component.value;
                            break;
                        }
                        return await interaction.respond(translate(interaction.guildId, "ROLES_REACTIONS_MODAL_INVALID_EMOJI"), { isPrivate: false });
                }
            }
        }

        // @ts-ignore should work
        const components = new Components(...message.components);

        for (const row of components) {
            for (const [index, subcomponent] of row.components.entries()) {
                if (subcomponent.type === MessageComponentTypes.Button) {
                    if (!subcomponent.emoji) continue;

                    if ([subcomponent.emoji.id, subcomponent.emoji.name].includes(options.emoji)) {
                        row.components.splice(index, 1);
                    }
                }
            }
        }

        await Gamer.discord.helpers.editMessage(channelId, messageId, {
            content: message.content,
            embeds: message.embeds?.map((e) => Gamer.discord.transformers.reverse.embed(Gamer.discord, e)),
            components,
            //   attachments: message.attachments,
        });

        return await interaction.respond(translate(interaction.guildId, "REACTION_ROLE_EDITED"), { isPrivate: true });
    }
}
