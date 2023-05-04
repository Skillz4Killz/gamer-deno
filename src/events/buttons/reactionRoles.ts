import { ButtonStyles, Interaction, InteractionResponseTypes, MessageComponentTypes, TextStyles, logger } from "@discordeno/bot";
import { Components } from "../../base/Components.js";
import Embeds from "../../base/Embeds.js";
import { translate } from "../../base/languages/translate.js";
import { Gamer } from "../../bot.js";
import { configs } from "../../configs.js";
import { prisma } from "../../prisma/client.js";
import { COLOR_WHEEL_DATA, PRONOUN_DATA } from "../../utils/constants.js";

export default async function reactionRoles(interaction: Interaction) {
    if (!interaction.guildId || !interaction.member) return;
    if (!interaction.data?.customId) return;

    const [type, id] = interaction.data.customId.split("-");
    if (!id) return;

    if (interaction.data.customId?.startsWith("reactionRole-")) {
        logger.info(`[Reaction Role] The reaction role button was clicked in Guild: ${interaction.guildId} by ${interaction.user.id}.`);

        if (interaction.member.roles.includes(BigInt(id))) {
            await Gamer.discord.helpers.removeRole(
                interaction.guildId,
                interaction.user.id,
                id,
                translate(interaction.guildId, "REACTION_ROLE_TAKEN"),
            );
            return await interaction.respond(translate(interaction.guildId, "REACTION_ROLE_TAKEN"), { private: true });
        }

        await Gamer.discord.helpers.addRole(interaction.guildId, interaction.user.id, id, translate(interaction.guildId, "REACTION_ROLE_GRANTED"));
        return await interaction.respond(translate(interaction.guildId, "REACTION_ROLE_ADDED"), { private: true });
    }

    if (type === "reactionRoleRemove") {
        // ONLY ADMINS CAN USE THIS
        if (!interaction.member.permissions?.has("ADMINISTRATOR")) {
            return await interaction.respond(translate(interaction.guildId, "USER_NOT_ADMIN"), { private: true });
        }

        return await interaction.respond(
            {
                type: InteractionResponseTypes.Modal,
                data: {
                    title: translate(interaction.guildId, "ROLES_REACTIONS_CREATE_REMOVE"),
                    customId: `reactionRoleRemoved-${interaction.channelId}-${id}`,
                    components: [
                        {
                            type: 1,
                            components: [
                                {
                                    type: MessageComponentTypes.InputText,
                                    customId: "modalemoji",
                                    label: translate(interaction.guildId, "ROLES_REACTIONS_MODAL_TITLE_EMOJI"),
                                    style: TextStyles.Short,
                                    minLength: 1,
                                    maxLength: 100,
                                    placeholder: translate(interaction.guildId, "ROLES_REACTIONS_MODAL_TITLE_EMOJI_PLACEHOLDER"),
                                    required: true,
                                },
                            ],
                        },
                    ],
                },
            },
            { private: false },
        );
    }

    // USER WANTS TO ADD A BUTTON
    if (type === "reactionRoleAdd") {
        // ONLY ADMINS CAN USE THIS
        if (!interaction.member.permissions?.has("ADMINISTRATOR")) {
            return await interaction.respond(translate(interaction.guildId, "USER_NOT_ADMIN"), { private: true });
        }

        return await interaction.respond(
            {
                type: InteractionResponseTypes.Modal,
                data: {
                    title: translate(interaction.guildId, "ROLES_REACTIONS_CREATE_ADD"),
                    customId: `reactionRoleEdited-${interaction.channelId}-${id}`,
                    components: [
                        {
                            type: 1,
                            components: [
                                {
                                    type: MessageComponentTypes.InputText,
                                    customId: "modalemoji",
                                    label: translate(interaction.guildId, "ROLES_REACTIONS_MODAL_TITLE_EMOJI"),
                                    style: TextStyles.Short,
                                    minLength: 1,
                                    maxLength: 100,
                                    placeholder: translate(interaction.guildId, "ROLES_REACTIONS_MODAL_TITLE_EMOJI_PLACEHOLDER"),
                                    required: true,
                                },
                            ],
                        },
                        {
                            type: 1,
                            components: [
                                {
                                    type: MessageComponentTypes.InputText,
                                    customId: "modalcolor",
                                    label: translate(interaction.guildId, "ROLES_REACTIONS_MODAL_TITLE_COLOR"),
                                    style: TextStyles.Short,
                                    minLength: 3,
                                    maxLength: 5,
                                    placeholder: translate(interaction.guildId, "ROLES_REACTIONS_MODAL_TITLE_COLOR_PLACEHOLDER"),
                                    required: true,
                                },
                            ],
                        },
                        {
                            type: 1,
                            components: [
                                {
                                    type: MessageComponentTypes.InputText,
                                    customId: "modalrole",
                                    label: translate(interaction.guildId, "ROLES_REACTIONS_MODAL_TITLE_ROLE"),
                                    style: TextStyles.Short,
                                    maxLength: 30,
                                    placeholder: translate(interaction.guildId, "ROLES_REACTIONS_MODAL_TITLE_ROLE_PLACEHOLDER"),
                                    required: true,
                                },
                            ],
                        },
                        {
                            type: 1,
                            components: [
                                {
                                    type: MessageComponentTypes.InputText,
                                    customId: "modallabel",
                                    label: translate(interaction.guildId, "ROLES_REACTIONS_MODAL_TITLE_LABEL"),
                                    style: TextStyles.Short,
                                    maxLength: 80,
                                    placeholder: translate(interaction.guildId, "ROLES_REACTIONS_MODAL_TITLE_LABEL_PLACEHOLDER"),
                                    required: false,
                                },
                            ],
                        },
                    ],
                },
            },
            { private: false },
        );
    }

    // THE USER WANTS TO EDIT THE TEXT MESSAGE
    if (type === "reactionRoleEdit") {
        // ONLY ADMINS CAN USE THIS
        if (!interaction.member.permissions?.has("ADMINISTRATOR")) {
            return await interaction.respond(translate(interaction.guildId, "USER_NOT_ADMIN"), { private: true });
        }

        // return await Gamer.discord.helpers.sendInteractionResponse(interaction.id, interaction.token, {
        //     type: InteractionResponseTypes.Modal,
        //     data: {

        //     }
        // })
        return await interaction.respond(
            {
                type: InteractionResponseTypes.Modal,
                data: {
                    title: translate(interaction.guildId, "ROLES_REACTIONS_CREATE_EDIT"),
                    customId: `reactionRoleTextEdited-${interaction.channelId}-${id}`,
                    components: [
                        {
                            type: 1,
                            components: [
                                {
                                    type: MessageComponentTypes.InputText,
                                    customId: "modaltext",
                                    label: translate(interaction.guildId, "ROLES_REACTIONS_MODAL_TITLE_TEXT"),
                                    style: TextStyles.Short,
                                    minLength: 1,
                                    placeholder: translate(interaction.guildId, "ROLES_REACTIONS_MODAL_TITLE_TEXT_PLACEHOLDER"),
                                    required: true,
                                },
                            ],
                        },
                    ],
                },
            },
            { private: false },
        );
    }

    // USER FINALIZED THE RR
    if (interaction.data.customId === "reactionRoleSave") {
        // ONLY ADMINS CAN USE THIS
        if (!interaction.member.permissions?.has("ADMINISTRATOR")) {
            return await interaction.respond(translate(interaction.guildId, "USER_NOT_ADMIN"), { private: true });
        }

        if (!interaction.message) return;

        await interaction.respond(translate(interaction.guildId, "REACTION_ROLE_SAVED"), { private: true }).catch(() => null);
        return await Gamer.discord.helpers.deleteMessage(interaction.message.channelId, interaction.message.id).catch(() => null);
    }

    // COLOR WHEEL CONFIRMED
    if (interaction.data.customId === "reactionRoleColorsConfirm") {
        if (!interaction.channelId || !interaction.message) return;

        await interaction.respond("REACTION_ROLE_COLOR_LOADING", { private: true });
        // DELETE THE MESSAGE WITH THE CONFIRM BUTTON TO PREVENT DUPLICATE CONFIRMS
        await Gamer.discord.helpers.deleteMessage(interaction.channelId, interaction.message!.id);

        const guild = await Gamer.discord.helpers.getGuild(interaction.guildId);
        if (!guild) return interaction.respond("REACTION_ROLE_COLOR_GUILD_UNKNOWN", { private: true });

        if (guild.roles.size + 20 > 250) {
            return interaction.respond("REACTION_ROLE_COLOR_MAX_ROLES", { private: true });
        }

        // DELETE ANY OLD ROLE SET
        await prisma.uniqueRolesets.delete({ where: { guildId_name: { guildId: interaction.guildId.toString(), name: "colors" } } });

        const roles = await Promise.all(
            COLOR_WHEEL_DATA.map((data) =>
                Gamer.discord.helpers.createRole(interaction.guildId!, {
                    name: data.name,
                    color: parseInt(data.hex.replace("#", ""), 16),
                }),
            ),
        );

        // Send a message
        const embeds = new Embeds()
            .setAuthor(translate(interaction.guildId, "REACTION_ROLE_COLORS_COLOR_WHEEL"), "https://i.imgur.com/wIrhA5A.jpg")
            .setDescription(translate(interaction.guildId, "REACTION_ROLE_COLORS_PICK_COLOR"))
            .addField(
                translate(interaction.guildId, "REACTION_ROLE_COLORS_DONT_FORGET"),
                translate(interaction.guildId, "REACTION_ROLE_COLORS_ONLY_ONE"),
            )
            .setColor("RANDOM");

        const components = new Components();
        for (const [index, data] of COLOR_WHEEL_DATA.entries()) {
            components.addButton(data.name, "Primary", `reactionRole-${roles[index]?.id}`, { emoji: data.emoji });
        }

        // Create a roleset
        await prisma.uniqueRolesets.create({
            data: { guildId: interaction.guildId.toString(), name: "colors", roleIds: roles.map((r) => r.id.toString()) },
        });

        return await interaction.respond(
            {
                type: InteractionResponseTypes.ChannelMessageWithSource,
                data: {
                    embeds,
                    components,
                },
            },
            { private: false },
        );
    }

    // PRONOUNS CONFIRMED
    if (interaction.data.customId === "reactionRolePronounsConfirm") {
        if (!interaction.channelId || !interaction.message) return;

        await interaction.respond("REACTION_ROLE_COLOR_LOADING", { private: true });
        // DELETE THE MESSAGE WITH THE CONFIRM BUTTON TO PREVENT DUPLICATE CONFIRMS
        await Gamer.discord.helpers.deleteMessage(interaction.channelId, interaction.message!.id);

        const guild = await Gamer.discord.helpers.getGuild(interaction.guildId);
        if (!guild) return interaction.respond("REACTION_ROLE_COLOR_GUILD_UNKNOWN", { private: true });

        if (guild.roles.size + 6 > 250) {
            return interaction.respond("REACTION_ROLE_COLOR_MAX_ROLES", { private: true });
        }

        const roles = await Promise.all(
            PRONOUN_DATA.map((name) =>
                Gamer.discord.helpers.createRole(interaction.guildId!, {
                    name: `Pronoun: ${name}`,
                }),
            ),
        );

        // Send a message
        const embeds = new Embeds()
            .setAuthor(translate(interaction.guildId, "REACTION_ROLE_PRONOUN_SELECTOR"), "https://i.imgur.com/wIrhA5A.jpg")
            .setColor("RANDOM");

        const components = new Components();
        for (const [index, name] of PRONOUN_DATA.entries()) {
            components.addButton(name, "Primary", `reactionRole-${roles[index]?.id}`);
        }

        components.addButton(translate(interaction.guildId, "INVITE_NEED_SUPPORT"), ButtonStyles.Link, configs.platforms.discord.supportServerInvite);

        return await interaction.respond(
            {
                type: InteractionResponseTypes.ChannelMessageWithSource,
                data: {
                    embeds,
                    components,
                },
            },
            { private: false },
        );
    }
}
