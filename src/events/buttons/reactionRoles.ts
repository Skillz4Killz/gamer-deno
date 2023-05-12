import { Interaction } from "@discordeno/bot";
import { Components } from "../../base/Components.js";
import Embeds from "../../base/Embeds.js";
import { GamerMessage } from "../../base/GamerMessage.js";
import { Gamer } from "../../bot.js";
import { prisma } from "../../prisma/client.js";
import { COLOR_WHEEL_DATA } from "../../utils/constants.js";
import { validatePermissions } from "../../utils/platforms/permissions.js";

export default async function reactionRoles(interaction: Interaction) {
    if (!interaction.guildId || !interaction.member) return;
    if (!interaction.data?.customId) return;

    const message = new GamerMessage(interaction);

    if (interaction.data.customId?.startsWith("reactionRole-")) {
        Gamer.discord.logger.info(`[Reaction Role] The reaction role button was clicked in Guild: ${interaction.guildId} by ${interaction.user.id}.`);

        const roleId = Gamer.discord.transformers.snowflake(interaction.data.customId?.substring(interaction.data.customId.indexOf("-") + 1));
        if (interaction.member.roles.includes(roleId)) {
            await message.reply({ content: message.translate("REACTION_ROLE_REMOVED", roleId), flags: 64 }, { addReplay: false });
            return await Gamer.discord.rest.removeRole(interaction.guildId, interaction.user.id, roleId, message.translate("REACTION_ROLE_TAKEN"));
        }

        await message.reply({ content: message.translate("REACTION_ROLE_ADDED", roleId), flags: 64 }, { addReplay: false });
        return await Gamer.discord.rest.addRole(interaction.guildId, interaction.user.id, roleId, message.translate("REACTION_ROLE_GRANTED"));
    }

    const [type, id] = interaction.data.customId.split("-");

    if (type === "reactionRoleRemove") {
        // ONLY ADMINS CAN USE THIS
        if (
            !interaction.member.permissions ||
            !validatePermissions(interaction.member.permissions.bitfield, ["ADMINISTRATOR"], { platform: message.platform })
        ) {
            return await message.reply({ content: message.translate("USER_NOT_ADMIN"), flags: 64 }, { addReplay: false });
        }

        return await message.needResponse({
            title: message.translate("ROLES_REACTIONS_CREATE_REMOVE"),
            customId: `reactionRoleRemoved-${interaction.channelId}-${id}`,
            questions: [
                {
                    inputCustomId: "modalemoji",
                    label: message.translate("ROLES_REACTIONS_MODAL_TITLE_EMOJI"),
                    long: false,
                    minLength: 1,
                    maxLength: 100,
                    placeholder: message.translate("ROLES_REACTIONS_MODAL_TITLE_EMOJI_PLACEHOLDER"),
                },
            ],
        });
    }

    // USER WANTS TO ADD A BUTTON
    if (type === "reactionRoleAdd") {
        // ONLY ADMINS CAN USE THIS
        if (
            !interaction.member.permissions ||
            !validatePermissions(interaction.member.permissions.bitfield, ["ADMINISTRATOR"], { platform: message.platform })
        ) {
            return await message.reply({ content: message.translate("USER_NOT_ADMIN"), flags: 64 }, { addReplay: false });
        }

        return await message.needResponse({
            title: message.translate("ROLES_REACTIONS_CREATE_ADD"),
            customId: `reactionRoleEdited-${interaction.channelId}-${id}`,
            questions: [
                {
                    inputCustomId: "modalemoji",
                    label: message.translate("ROLES_REACTIONS_MODAL_TITLE_EMOJI"),
                    long: false,
                    minLength: 1,
                    maxLength: 100,
                    placeholder: message.translate("ROLES_REACTIONS_MODAL_TITLE_EMOJI_PLACEHOLDER"),
                },
                {
                    inputCustomId: "modalcolor",
                    label: message.translate("ROLES_REACTIONS_MODAL_TITLE_COLOR"),
                    long: false,
                    minLength: 3,
                    maxLength: 5,
                    placeholder: message.translate("ROLES_REACTIONS_MODAL_TITLE_COLOR_PLACEHOLDER"),
                },
                {
                    inputCustomId: "modalrole",
                    label: message.translate("ROLES_REACTIONS_MODAL_TITLE_ROLE"),
                    long: false,
                    minLength: 17,
                    maxLength: 30,
                    placeholder: message.translate("ROLES_REACTIONS_MODAL_TITLE_ROLE_PLACEHOLDER"),
                },
                {
                    inputCustomId: "modallabel",
                    label: message.translate("ROLES_REACTIONS_MODAL_TITLE_LABEL"),
                    long: false,
                    minLength: 1,
                    maxLength: 80,
                    placeholder: message.translate("ROLES_REACTIONS_MODAL_TITLE_LABEL_PLACEHOLDER"),
                },
            ],
        });
    }

    // THE USER WANTS TO EDIT THE TEXT MESSAGE
    if (type === "reactionRoleEdit") {
        // ONLY ADMINS CAN USE THIS
        if (
            !interaction.member.permissions ||
            !validatePermissions(interaction.member.permissions.bitfield, ["ADMINISTRATOR"], { platform: message.platform })
        ) {
            return await message.reply({ content: message.translate("USER_NOT_ADMIN"), flags: 64 }, { addReplay: false });
        }

        return await message.needResponse({
            title: message.translate("ROLES_REACTIONS_CREATE_EDIT"),
            customId: `reactionRoleTextEdited-${interaction.channelId}-${id}`,
            questions: [
                {
                    inputCustomId: "modaltext",
                    label: message.translate("ROLES_REACTIONS_MODAL_TITLE_TEXT"),
                    long: false,
                    minLength: 1,
                    maxLength: 2000,
                    placeholder: message.translate("ROLES_REACTIONS_MODAL_TITLE_TEXT_PLACEHOLDER"),
                },
            ],
        });
    }

    // USER FINALIZED THE RR
    if (interaction.data.customId === "reactionRoleSave") {
        // ONLY ADMINS CAN USE THIS
        if (
            !interaction.member.permissions ||
            !validatePermissions(interaction.member.permissions.bitfield, ["ADMINISTRATOR"], { platform: message.platform })
        ) {
            return await message.reply({ content: message.translate("USER_NOT_ADMIN"), flags: 64 }, { addReplay: false });
        }

        if (!interaction.message) return;

        await message.reply({ content: message.translate("REACTION_ROLE_SAVED"), flags: 64 }, { addReplay: false }).catch(() => null);
        return await Gamer.discord.rest.deleteMessage(interaction.message.channelId, interaction.message.id).catch(() => null);
    }

    // COLOR WHEEL CONFIRMED
    if (interaction.data.customId === "reactionRoleColorsConfirm") {
        if (!interaction.channelId || !interaction.message) return;

        await message.reply({ content: message.translate("REACTION_ROLE_COLOR_LOADING"), flags: 64 }, { addReplay: false });
        // DELETE THE MESSAGE WITH THE CONFIRM BUTTON TO PREVENT DUPLICATE CONFIRMS
        await Gamer.discord.rest.deleteMessage(interaction.channelId, interaction.message!.id);

        const guild = await Gamer.discord.rest.getGuild(interaction.guildId);
        if (!guild) return message.reply({ content: message.translate("REACTION_ROLE_COLOR_GUILD_UNKNOWN"), flags: 64 }, { addReplay: false });

        if (guild.roles.length + 20 > 250) {
            return message.reply({ content: message.translate("REACTION_ROLE_COLOR_MAX_ROLES"), flags: 64 }, { addReplay: false });
        }

        // DELETE ANY OLD ROLE SET
        await prisma.uniqueRolesets.delete({ where: { guildId_name: { guildId: interaction.guildId.toString(), name: "colors" } } }).then(console.log).catch(() => null);

        const roles = await Promise.all(
            COLOR_WHEEL_DATA.map((data) =>
                Gamer.discord.rest.createRole(interaction.guildId!, {
                    name: data.name,
                    color: parseInt(data.hex.replace("#", ""), 16),
                }),
            ),
        );

        // Send a message
        const embeds = new Embeds()
            .setAuthor(message.translate("REACTION_ROLE_COLORS_COLOR_WHEEL"), "https://i.imgur.com/wIrhA5A.jpg")
            .setDescription(message.translate("REACTION_ROLE_COLORS_PICK_COLOR"))
            .addField(message.translate("REACTION_ROLE_COLORS_DONT_FORGET"), message.translate("REACTION_ROLE_COLORS_ONLY_ONE"))
            .setColor("RANDOM");

        const components = new Components();
        for (const [index, data] of COLOR_WHEEL_DATA.entries()) {
            components.addButton(data.name, "Primary", `reactionRole-${roles[index]!.id}`, { emoji: data.emoji });
        }

        // Create a roleset
        await prisma.uniqueRolesets.create({
            data: {
                guildId: interaction.guildId.toString(),
                name: "colors",
                roleIds: roles.map((role) => role.id),
            },
        });

        return await message.reply({ embeds, components }, { addReplay: false });
    }
}
