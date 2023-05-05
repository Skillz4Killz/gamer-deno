import { ButtonStyles, Interaction, MessageComponentTypes } from "@discordeno/bot";
import { Components } from "../../base/Components.js";
import Embeds from "../../base/Embeds.js";
import { translate } from "../../base/languages/translate.js";
import { Gamer } from "../../bot.js";

export async function reactionRoleModals(interaction: Interaction) {
    console.log("modal 1");
    if (!interaction.guildId || !interaction.member) return;
    if (!interaction.data?.customId) return;
    console.log("modal 2");

    const [type] = interaction.data.customId.split("-");

    // EDITING THE TEXT MESSAGE
    if (type === "reactionRoleTextEdited") {
        // ONLY ADMINS CAN USE THIS
        if (!interaction.member.permissions || !interaction.member.permissions.has("ADMINISTRATOR")) {
            return await interaction.respond(translate(interaction.guildId, "USER_NOT_ADMIN"), { private: true });
        }
        console.log("modal 3");

        const args = interaction.data.customId.split("-");
        // REMOVES THE NON IDS
        args.shift();
        const [channelId, messageId] = args;
        if (!channelId || !messageId) return;

        console.log("modal 4", channelId, messageId);
        const message = await Gamer.discord.helpers.getMessage(channelId, messageId);
        console.log('message', message)
        if (!message) return await interaction.respond(translate(interaction.guildId, "ROLES_REACTIONS_MODAL_UNKNOWN_MESSAGE"), { private: false });

        console.log("modal 5");
        if (!message.components)
            return await interaction.respond(translate(interaction.guildId, "ROLES_REACTIONS_MODAL_MESSAGE_NO_BUTTONS"), { private: false });

        console.log("modal 6");
        let content = "No content provided.";
        for (const row of interaction.data.components || []) {
            for (const component of row.components || []) {
                // @ts-ignore TODO: fix when the transformer is fixed
                if (component.custom_id !== "modaltext") continue;
                // @ts-ignore TODO: fix when the transformer is fixed
                content = component.value;

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
                        return await interaction.respond(translate(interaction.guildId, "REACTION_ROLE_EDITED"), { private: false });
                    } catch (err) {
                        console.log("json error", err);
                        return await interaction.respond(translate(interaction.guildId, "INVALID_EMBED_JSON_CODE"), { private: false });
                    }
                }
            }
        }

        console.log("modal 7");
        await Gamer.discord.helpers.editMessage(channelId, messageId, {
            content,
            //   embeds: message.embeds,
            // @ts-ignore should work
            components: new Components(...message.components),
            allowedMentions: { parse: [] },
            //   attachments: message.attachments,
        });

        console.log("modal 8");
        return await interaction.respond(translate(interaction.guildId, "REACTION_ROLE_EDITED"), { private: false });
    }

    // ADDING NEW BUTTON
    if (interaction.data.customId.startsWith("reactionRoleEdited-")) {
        // ONLY ADMINS CAN USE THIS
        if (!interaction.member.permissions || !interaction.member.permissions.has("ADMINISTRATOR")) {
            return await interaction.respond(translate(interaction.guildId, "USER_NOT_ADMIN"), { private: true });
        }

        const args = interaction.data.customId.split("-");
        // REMOVES THE NON IDS
        args.shift();
        const [channelId, messageId] = args.map((id) => Gamer.discord.transformers.snowflake(id));
        if (!channelId || !messageId) return;

        const message = await Gamer.discord.helpers.getMessage(channelId, messageId);
        if (!message) return interaction.respond(translate(interaction.guildId, "ROLES_REACTIONS_MODAL_UNKNOWN_MESSAGE"), { private: false });
        if (!message.components)
            return interaction.respond(translate(interaction.guildId, "ROLES_REACTIONS_MODAL_MESSAGE_NO_BUTTONS"), { private: false });

        const options = {
            addRemove: "add",
            emoji: "",
            role: 0n,
            label: "",
            color: ButtonStyles.Primary,
        };

        for (const row of interaction.data.components || []) {
            if (!row.components) continue;

            for (const component of row.components) {
                if (component.type !== MessageComponentTypes.InputText) continue;

                // switch (component.customId) {
                // @ts-ignore TODO: fix when the transformer is fixed
                switch (component.custom_id) {
                    case "modalcolor":
                        // @ts-ignore TODO: fix when the transformer is fixed
                        if (component.value.toLowerCase() === "red") options.color = ButtonStyles.Danger;
                        // @ts-ignore TODO: fix when the transformer is fixed
                        if (component.value.toLowerCase() === "grey") options.color = ButtonStyles.Secondary;
                        // @ts-ignore TODO: fix when the transformer is fixed
                        if (component.value.toLowerCase() === "green") options.color = ButtonStyles.Success;
                        break;
                    case "modaladdremove":
                        // @ts-ignore TODO: fix when the transformer is fixed
                        if (component.value === "remove") options.addRemove = "remove";
                        break;
                    case "modalemoji":
                        // @ts-ignore TODO: fix when the transformer is fixed
                        // A snowflake id was provided
                        if (STRING_CONTAINS_SNOWFLAKE_REGEX.test(component.value)) {
                            // @ts-ignore TODO: fix when the transformer is fixed
                            options.emoji = component.value.match(STRING_CONTAINS_SNOWFLAKE_REGEX)![0];
                            break;
                        }

                        // @ts-ignore TODO: fix when the transformer is fixed
                        if (DEFAULT_EMOJIS.has(component.value)) {
                            // @ts-ignore TODO: fix when the transformer is fixed
                            options.emoji = component.value;
                            break;
                        }
                        return await interaction.respond(translate(interaction.guildId, "ROLES_REACTIONS_MODAL_INVALID_EMOJI"), { private: false });
                    case "modalrole":
                        // @ts-ignore TODO: fix when the transformer is fixed
                        if (!validateSnowflake(component.value))
                            return await interaction.respond(translate(interaction.guildId, "ROLES_REACTIONS_MODAL_INVALID_ROLE"), {
                                private: false,
                            });
                        // TODO: validate it is a valid role id
                        // TODO(cache): modal should validate the role (no bot role and booster role)

                        // @ts-ignore TODO: fix when the transformer is fixed
                        options.role = component.value;
                        break;
                    case "modallabel":
                        // @ts-ignore TODO: fix when the transformer is fixed
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
                        return await interaction.respond(translate(interaction.guildId, "ROLES_REACTIONS_MODAL_ROLE_USED"), { private: false });
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
            //   embeds: message.embeds,
            components,
            allowedMentions: { parse: [] },
            //   attachments: message.attachments,
        });

        return await interaction.respond(translate(interaction.guildId, "REACTION_ROLE_EDITED"), { private: true });
    }

    // REMOVING A BUTTON
    if (interaction.data.customId.startsWith("reactionRoleRemoved-")) {
        // ONLY ADMINS CAN USE THIS
        if (!interaction.member.permissions || !interaction.member.permissions.has("ADMINISTRATOR")) {
            return await interaction.respond(translate(interaction.guildId, "USER_NOT_ADMIN"), { private: true });
        }

        const args = interaction.data.customId.split("-");
        // REMOVES THE NON IDS
        args.shift();
        const [channelId, messageId] = args.map((id) => Gamer.discord.transformers.snowflake(id));
        if (!channelId || !messageId) return;

        const message = await Gamer.discord.helpers.getMessage(channelId, messageId);
        if (!message) return interaction.respond(translate(interaction.guildId, "ROLES_REACTIONS_MODAL_UNKNOWN_MESSAGE"), { private: false });
        if (!message.components)
            return interaction.respond(translate(interaction.guildId, "ROLES_REACTIONS_MODAL_MESSAGE_NO_BUTTONS"), { private: false });

        const options = {
            emoji: "",
        };

        for (const row of interaction.data.components || []) {
            if (!row.components) continue;

            for (const component of row.components) {
                if (component.type !== MessageComponentTypes.InputText) continue;

                // switch (component.customId) {
                // @ts-ignore TODO: fix when the transformer is fixed
                switch (component.custom_id) {
                    case "modalemoji":
                        // @ts-ignore TODO: fix when the transformer is fixed
                        // A snowflake id was provided
                        if (STRING_CONTAINS_SNOWFLAKE_REGEX.test(component.value)) {
                            // @ts-ignore TODO: fix when the transformer is fixed
                            options.emoji = component.value.match(STRING_CONTAINS_SNOWFLAKE_REGEX)![0];
                            break;
                        }

                        // @ts-ignore TODO: fix when the transformer is fixed
                        if (DEFAULT_EMOJIS.has(component.value)) {
                            // @ts-ignore TODO: fix when the transformer is fixed
                            options.emoji = component.value;
                            break;
                        }
                        return await interaction.respond(translate(interaction.guildId, "ROLES_REACTIONS_MODAL_INVALID_EMOJI"), { private: false });
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
            //   embeds: message.embeds,
            components,
            allowedMentions: { parse: [] },
            //   attachments: message.attachments,
        });

        return await interaction.respond(translate(interaction.guildId, "REACTION_ROLE_EDITED"), { private: true });
    }
}
