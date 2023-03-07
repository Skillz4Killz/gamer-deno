import { ButtonStyles, InteractionResponseTypes, MessageComponentTypes } from "@discordeno/bot";
import { Components } from "../../base/Components.js";
import Embeds from "../../base/Embeds.js";
import GamerChannel from "../../base/GamerChannel.js";
import GamerRole from "../../base/GamerRole.js";
import { Command, PermissionLevels } from "../../base/typings.js";
import { Gamer } from "../../bot.js";
import { configs } from "../../configs.js";
import { prisma } from "../../prisma/client.js";
import emojis from "../../utils/emojis.js";
import { fetchMessage } from "../../utils/platforms/messages.js";
import { validateSnowflake } from "../../utils/snowflakes.js";

export const roles: Command = {
    name: "roles",
    aliases: [],
    // TODO: Implement vip system
    vipOnly: true,
    requiredPermissionLevel: PermissionLevels.Admin,
    arguments: [
        {
            required: false,
            name: "ROLES_MESSAGES_NAME",
            type: "subcommand",
            arguments: [
                {
                    required: false,
                    name: "ROLES_MESSAGES_CREATE_NAME",
                    type: "subcommand",
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_MESSAGES_CREATE_TYPE_NAME",
                            type: "boolean",
                        },
                        {
                            required: true,
                            name: "ROLES_MESSAGES_CREATE_ROLE_NAME",
                            type: "role",
                        },
                        {
                            required: true,
                            name: "ROLES_MESSAGES_CREATE_CHANNEL_NAME",
                            type: "channel",
                        },
                        {
                            required: true,
                            name: "ROLES_MESSAGES_CREATE_CONTENT_NAME",
                            type: "string",
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_MESSAGES_DELETE_NAME",
                    type: "subcommand",
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_MESSAGES_DELETE_ROLE_NAME",
                            type: "role",
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_MESSAGES_LIST_NAME",
                    type: "subcommand",
                },
            ],
        },

        {
            required: false,
            name: "ROLES_UNIQUE_NAME",
            type: "subcommand",
            arguments: [
                {
                    required: false,
                    name: "ROLES_UNIQUE_CREATE_NAME",
                    type: "subcommand",
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_UNIQUE_CREATE_CUSTOM_NAME",
                            type: "string",
                        },
                        {
                            required: true,
                            name: "ROLES_UNIQUE_CREATE_ROLE_NAME",
                            type: "role",
                        },
                        {
                            required: true,
                            name: "ROLES_UNIQUE_CREATE_ROLE_2_NAME",
                            type: "role",
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_UNIQUE_DELETE_NAME",
                    type: "subcommand",
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_UNIQUE_DELETE_CUSTOM_NAME",
                            type: "string",
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_UNIQUE_ADD_NAME",
                    type: "subcommand",
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_UNIQUE_ADD_CUSTOM_NAME",
                            type: "string",
                        },
                        {
                            required: true,
                            name: "ROLES_UNIQUE_ADD_ROLE_NAME",
                            type: "role",
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_UNIQUE_REMOVE_NAME",
                    type: "subcommand",
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_UNIQUE_REMOVE_CUSTOM_NAME",
                            type: "string",
                        },
                        {
                            required: true,
                            name: "ROLES_UNIQUE_REMOVE_ROLE_NAME",
                            type: "role",
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_UNIQUE_LIST_NAME",
                    type: "subcommand",
                },
            ],
        },

        {
            required: false,
            name: "ROLES_GROUPED_NAME",
            type: "subcommand",
            arguments: [
                {
                    required: false,
                    name: "ROLES_GROUPED_CREATE_NAME",
                    type: "subcommand",
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_GROUPED_CREATE_ROLE_NAME",
                            type: "role",
                        },
                        {
                            required: true,
                            name: "ROLES_GROUPED_CREATE_ROLE_2_NAME",
                            type: "role",
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_GROUPED_DELETE_NAME",
                    type: "subcommand",
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_GROUPED_DELETE_ROLE_NAME",
                            type: "role",
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_GROUPED_ADD_NAME",
                    type: "subcommand",
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_GROUPED_ADD_NAME_NAME",
                            type: "string",
                        },
                        {
                            required: true,
                            name: "ROLES_GROUPED_ADD_ROLE_NAME",
                            type: "role",
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_GROUPED_REMOVE_NAME",
                    type: "subcommand",
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_GROUPED_ADD_NAME_NAME",
                            type: "string",
                        },
                        {
                            required: true,
                            name: "ROLES_GROUPED_REMOVE_ROLE_NAME",
                            type: "role",
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_GROUPED_LIST_NAME",
                    type: "subcommand",
                },
            ],
        },

        {
            required: false,
            name: "ROLES_REQUIRED_NAME",
            type: "subcommand",
            arguments: [
                {
                    required: false,
                    name: "ROLES_REQUIRED_CREATE_NAME",
                    type: "subcommand",
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_REQUIRED_CREATE_NAME_NAME",
                            type: "string",
                        },
                        {
                            required: true,
                            name: "ROLES_REQUIRED_CREATE_ROLE_NAME",
                            type: "role",
                        },
                        {
                            required: true,
                            name: "ROLES_REQUIRED_CREATE_ROLE_2_NAME",
                            type: "role",
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_REQUIRED_DELETE_NAME",
                    type: "subcommand",
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_REQUIRED_DELETE_NAME",
                            type: "string",
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_REQUIRED_ADD_NAME",
                    type: "subcommand",
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_REQUIRED_ADD_NAME_NAME",
                            type: "string",
                        },
                        {
                            required: true,
                            name: "ROLES_REQUIRED_ADD_ROLE_NAME",
                            type: "role",
                        },
                        {
                            required: true,
                            name: "ROLES_REQUIRED_ADD_ROLE_2_NAME",
                            type: "role",
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_REQUIRED_REMOVE_NAME",
                    type: "subcommand",
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_REQUIRED_REMOVE_NAME_NAME",
                            type: "string",
                        },
                        {
                            required: true,
                            name: "ROLES_REQUIRED_REMOVE_ROLE_NAME",
                            type: "role",
                        },
                        {
                            required: true,
                            name: "ROLES_REQUIRED_REMOVE_ROLE_2_NAME",
                            type: "role",
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_REQUIRED_LIST_NAME",
                    type: "subcommand",
                },
            ],
        },

        {
            required: false,
            name: "ROLES_DEFAULT_NAME",
            type: "subcommand",
            arguments: [
                {
                    required: false,
                    name: "ROLES_DEFAULT_CREATE_NAME",
                    type: "subcommand",
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_DEFAULT_CREATE_NAME_NAME",
                            type: "string",
                        },
                        {
                            required: true,
                            name: "ROLES_DEFAULT_CREATE_ROLE_NAME",
                            type: "role",
                        },
                        {
                            required: true,
                            name: "ROLES_DEFAULT_CREATE_ROLE_2_NAME",
                            type: "role",
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_DEFAULT_DELETE_NAME",
                    type: "subcommand",
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_DEFAULT_DELETE_ROLE_NAME",
                            type: "role",
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_DEFAULT_ADD_NAME",
                    type: "subcommand",
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_DEFAULT_CREATE_NAME_NAME",
                            type: "string",
                        },
                        {
                            required: true,
                            name: "ROLES_DEFAULT_ADD_ROLE_NAME",
                            type: "role",
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_DEFAULT_REMOVE_NAME",
                    type: "subcommand",
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_DEFAULT_CREATE_NAME_NAME",
                            type: "string",
                        },
                        {
                            required: true,
                            name: "ROLES_DEFAULT_REMOVE_ROLE_NAME",
                            type: "role",
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_DEFAULT_LIST_NAME",
                    type: "subcommand",
                },
            ],
        },

        {
            required: false,
            name: "ROLES_REACTIONS_NAME",
            type: "subcommand",
            arguments: [
                {
                    required: false,
                    name: "ROLES_REACTIONS_CREATE_NAME",
                    type: "subcommand",
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_REACTIONS_CREATE_EMOJI_NAME",
                            type: "string",
                        },

                        {
                            required: true,
                            name: "ROLES_REACTIONS_CREATE_COLOR_NAME",
                            type: "number",
                            literals: [
                                { name: "ROLES_REACTIONS_CREATE_COLOR_BLUE", value: ButtonStyles.Primary },
                                { name: "ROLES_REACTIONS_CREATE_COLOR_GREY", value: ButtonStyles.Secondary },
                                { name: "ROLES_REACTIONS_CREATE_COLOR_GREEN", value: ButtonStyles.Success },
                                { name: "ROLES_REACTIONS_CREATE_COLOR_RED", value: ButtonStyles.Danger },
                            ],
                        },
                        {
                            required: true,
                            name: "ROLES_REACTIONS_CREATE_ROLE_NAME",
                            type: "role",
                        },
                        {
                            required: false,
                            name: "ROLES_REACTIONS_CREATE_LABEL_NAME",
                            type: "string",
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_REACTIONS_ADD_NAME",
                    type: "subcommand",
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_REACTIONS_CREATE_CHANNEL_NAME",
                            type: "channel",
                        },
                        {
                            required: true,
                            name: "ROLES_REACTIONS_CREATE_MESSAGE_NAME",
                            type: "string",
                        },
                        {
                            required: true,
                            name: "ROLES_REACTIONS_CREATE_EMOJI_NAME",
                            type: "string",
                        },

                        {
                            required: true,
                            name: "ROLES_REACTIONS_CREATE_COLOR_NAME",
                            type: "number",
                            literals: [
                                { name: "ROLES_REACTIONS_CREATE_COLOR_BLUE", value: ButtonStyles.Primary },
                                { name: "ROLES_REACTIONS_CREATE_COLOR_GREY", value: ButtonStyles.Secondary },
                                { name: "ROLES_REACTIONS_CREATE_COLOR_GREEN", value: ButtonStyles.Success },
                                { name: "ROLES_REACTIONS_CREATE_COLOR_RED", value: ButtonStyles.Danger },
                            ],
                        },
                        {
                            required: true,
                            name: "ROLES_REACTIONS_CREATE_ROLE_NAME",
                            type: "role",
                        },
                        {
                            required: false,
                            name: "ROLES_REACTIONS_CREATE_LABEL_NAME",
                            type: "string",
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_REACTIONS_REMOVE_NAME",
                    type: "subcommand",
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_REACTIONS_CREATE_CHANNEL_NAME",
                            type: "channel",
                        },
                        {
                            required: true,
                            name: "ROLES_REACTIONS_CREATE_MESSAGE_NAME",
                            type: "string",
                        },
                        {
                            required: true,
                            name: "ROLES_REACTIONS_CREATE_EMOJI_NAME",
                            type: "string",
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_REACTIONS_COLORS_NAME",
                    type: "subcommand",
                },
                {
                    required: false,
                    name: "ROLES_REACTIONS_PRONOUNS_NAME",
                    type: "subcommand",
                },
            ],
        },
    ],
    async execute(message, args: SettingsRoleArgs) {
        if (!message.guildId) return;

        if (args.messages) {
            if (args.messages?.create) {
                await prisma.roleMessages.upsert({
                    where: { roleId_roleAdded: { roleId: args.messages.create.role.id.toString(), roleAdded: args.messages.create.new } },
                    update: {
                        channelId: args.messages.create.channel.id,
                        [args.messages.create.new ? "roleAddedText" : "roleRemovedText"]: args.messages.create.content,
                    },
                    create: {
                        roleId: args.messages.create.role.id.toString(),
                        channelId: args.messages.create.channel.id,
                        guildId: message.guildId,
                        roleAdded: true,
                        roleAddedText: args.messages.create.new ? args.messages.create.content : "",
                        roleRemovedText: args.messages.create.new ? "" : args.messages.create.content,
                    },
                });

                return await message.reply(message.translate("ROLES_MESSAGES_CREATE_SUCCESS"));
            }

            if (args.messages?.delete) {
                await prisma.roleMessages.deleteMany({ where: { roleId: args.messages.delete.role.id.toString() } });
                return await message.reply(message.translate("ROLES_MESSAGES_DELETE_SUCCESS"));
            }

            // if (args.messages.list) {
            //   const messages = await db.roleMessages.getAll({ guildId: message.guildId })
            //   if (!messages) return await message.reply(message.translate("ROLES_MESSAGES_LIST_NONE"))
            // }
        }

        if (args.unique) {
            if (args.unique.create) {
                const roleIds = new Set([args.unique.create.role.id.toString(), args.unique.create.role2.id.toString()]);

                await prisma.uniqueRolesets.create({
                    data: {
                        guildId: message.guildId,
                        name: args.unique.create.name,
                        roleIds: [...roleIds.values()],
                    },
                });

                return await message.reply(message.translate("ROLES_UNIQUE_CREATE_SUCCESS"));
            }

            if (args.unique.delete) {
                await prisma.uniqueRolesets.delete({
                    where: { guildId_name: { guildId: message.guildId, name: args.unique.delete.name } },
                });

                return await message.reply(message.translate("ROLES_UNIQUE_DELETE_SUCCESS"));
            }

            if (args.unique.add) {
                const set = await prisma.uniqueRolesets.findUnique({
                    where: { guildId_name: { guildId: message.guildId, name: args.unique.add.name } },
                });
                if (!set) {
                    return await message.reply(message.translate("ROLES_UNIQUE_NOT_FOUND"));
                }

                if (set.roleIds.includes(args.unique.add.role.id.toString()))
                    return await message.reply(message.translate("ROLES_UNIQUE_ADD_SUCCESS"));

                await prisma.uniqueRolesets.update({
                    where: { guildId_name: { guildId: message.guildId, name: args.unique.add.name } },
                    data: { roleIds: [...set.roleIds, args.unique.add.role.id.toString()] },
                });

                return await message.reply(message.translate("ROLES_UNIQUE_ADD_SUCCESS"));
            }

            if (args.unique.remove) {
                const set = await prisma.uniqueRolesets.findUnique({
                    where: { guildId_name: { guildId: message.guildId, name: args.unique.remove.name } },
                });
                if (!set) {
                    return await message.reply(message.translate("ROLES_UNIQUE_NOT_FOUND"));
                }

                if (!set.roleIds.includes(args.unique.remove.role.id.toString()))
                    return await message.reply(message.translate("ROLES_UNIQUE_REMOVE_SUCCESS"));

                await prisma.uniqueRolesets.update({
                    where: { guildId_name: { guildId: message.guildId, name: args.unique.remove.name } },
                    data: { roleIds: set.roleIds.filter((id) => id !== args.unique?.remove?.role.id.toString()) },
                });

                return await message.reply(message.translate("ROLES_UNIQUE_REMOVE_SUCCESS"));
            }

            if (args.unique.list) {
                const sets = await prisma.uniqueRolesets.findMany({ where: { guildId: message.guildId } });
                if (!sets) return await message.reply(message.translate("ROLES_UNIQUE_LIST_NONE"));

                const embeds = new Embeds().setTitle(message.translate("ROLES_UNIQUE_LIST_TITLE")).setColor("RANDOM");

                for (const set of sets) embeds.addField(set.name, set.roleIds.map((id) => `• <@&${id}>`).join("\n"), true);
                return await message.reply({
                    content: "",
                    embeds,
                });
            }
        }

        if (args.grouped) {
            if (args.grouped.create) {
                await prisma.groupedRoleSets.create({
                    data: {
                        mainRoleId: args.grouped.create.role.id.toString(),
                        roleIds: [args.grouped.create.role2.id.toString()],
                        guildId: message.guildId,
                        name: args.grouped.create.role.name,
                    },
                });

                return await message.reply(message.translate("ROLES_GROUPED_CREATE_SUCCESS"));
            }

            if (args.grouped.add) {
                const set = await prisma.groupedRoleSets.findUnique({
                    where: { guildId_name: { guildId: message.guildId, name: args.grouped.add.name } },
                });
                if (!set) {
                    return await message.reply(message.translate("ROLES_GROUPED_NOT_FOUND"));
                }

                if (set.roleIds.includes(args.grouped.add.role.id.toString()))
                    return await message.reply(message.translate("ROLES_GROUPED_ADD_SUCCESS"));

                await prisma.groupedRoleSets.update({
                    where: { id: set.id },
                    data: { roleIds: [...set.roleIds, args.grouped.add.role.id.toString()] },
                });

                return await message.reply(message.translate("ROLES_GROUPED_ADD_SUCCESS"));
            }

            if (args.grouped.remove) {
                const set = await prisma.groupedRoleSets.findUnique({
                    where: { guildId_name: { guildId: message.guildId, name: args.grouped.remove.name } },
                });
                if (!set) {
                    return await message.reply(message.translate("ROLES_GROUPED_NOT_FOUND"));
                }

                if (!set.roleIds.includes(args.grouped.remove.role.id.toString()))
                    return await message.reply(message.translate("ROLES_GROUPED_REMOVE_SUCCESS"));

                await prisma.groupedRoleSets.update({
                    where: { id: set.id },
                    data: { roleIds: set.roleIds.filter((id) => id !== args.grouped?.remove?.role.id) },
                });

                return await message.reply(message.translate("ROLES_GROUPED_REMOVE_SUCCESS"));
            }

            if (args.grouped.list) {
                const sets = await prisma.groupedRoleSets.findMany({ where: { guildId: message.guildId } });
                if (!sets) return await message.reply(message.translate("ROLES_GROUPED_LIST_NONE"));

                const embeds = new Embeds().setTitle(message.translate("ROLES_GROUPED_LIST_TITLE")).setColor("RANDOM");

                let counter = 1;
                for (const set of sets) {
                    const roles = set.roleIds.map((id) => `• <@&${id}>`);
                    roles.unshift(`➡️ <@&${set.mainRoleId}>`);

                    embeds.addField(`#${counter}`, roles.join("\n"), true);
                    counter++;
                }
                return await message.reply({
                    content: "",
                    embeds,
                });
            }
        }

        if (args.required) {
            if (args.required.create) {
                await prisma.requiredRoleSets.create({
                    data: {
                        guildId: message.guildId,
                        name: args.required.create.name,
                        requiredRoleId: args.required.create.role.id.toString(),
                        roleIds: [args.required.create.role2.id.toString()],
                    },
                });

                return await message.reply(message.translate("ROLES_REQUIRED_CREATE_SUCCESS"));
            }

            if (args.required.delete) {
                await prisma.requiredRoleSets.delete({ where: { guildId_name: { guildId: message.guildId, name: args.required.delete.name } } });
                return await message.reply(message.translate("ROLES_REQUIRED_DELETE_SUCCESS"));
            }

            if (args.required.add) {
                const set = await prisma.requiredRoleSets.findUnique({
                    where: { guildId_name: { guildId: message.guildId, name: args.required.add.name } },
                });
                if (!set) {
                    return await message.reply(message.translate("ROLES_REQUIRED_NOT_FOUND"));
                }

                if (set.roleIds.includes(args.required.add.role.id.toString()))
                    return await message.reply(message.translate("ROLES_REQUIRED_ADD_SUCCESS"));

                await prisma.requiredRoleSets.update({
                    where: { guildId_name: { guildId: message.guildId, name: args.required.add.name } },
                    data: { roleIds: [...set.roleIds, args.required.add.role.id.toString()] },
                });

                return await message.reply(message.translate("ROLES_REQUIRED_ADD_SUCCESS"));
            }

            if (args.required.remove) {
                const set = await prisma.requiredRoleSets.findUnique({
                    where: { guildId_name: { guildId: message.guildId, name: args.required.remove.name } },
                });
                if (!set) {
                    return await message.reply(message.translate("ROLES_REQUIRED_NOT_FOUND"));
                }

                if (!set.roleIds.includes(args.required.remove.role.id.toString()))
                    return await message.reply(message.translate("ROLES_REQUIRED_REMOVE_SUCCESS"));

                await prisma.requiredRoleSets.update({
                    where: { guildId_name: { guildId: message.guildId, name: args.required.remove.name } },
                    data: { roleIds: set.roleIds.filter((id) => id !== args.required?.remove?.role.id.toString()) },
                });

                return await message.reply(message.translate("ROLES_REQUIRED_REMOVE_SUCCESS"));
            }

            if (args.required.list) {
                const sets = await prisma.requiredRoleSets.findMany({ where: { guildId: message.guildId } });
                if (!sets) return await message.reply(message.translate("ROLES_REQUIRED_LIST_NONE"));

                const embeds = new Embeds().setTitle(message.translate("ROLES_REQUIRED_LIST_TITLE")).setColor("RANDOM");

                let counter = 1;
                for (const set of sets) {
                    const roles = set.roleIds.map((id) => `• <@&${id}>`);
                    roles.unshift(`➡️ <@&${set.requiredRoleId}>`);

                    embeds.addField(`#${counter}`, roles.join("\n"), true);
                    counter++;
                }
                return await message.reply({ content: "", embeds });
            }
        }

        if (args.default) {
            if (args.default.create) {
                await prisma.defaultRoleSets.create({
                    data: {
                        defaultRoleId: args.default.create.role.id.toString(),
                        guildId: message.guildId,
                        roleIds: [args.default.create.role2.id.toString()],
                        name: args.default.create.name,
                    },
                });

                return await message.reply(message.translate("ROLES_DEFAULT_CREATE_SUCCESS"));
            }

            if (args.default.delete) {
                await prisma.defaultRoleSets.delete({ where: { guildId_name: { guildId: message.guildId, name: args.default.delete.name } } });

                return await message.reply(message.translate("ROLES_DEFAULT_DELETE_SUCCESS"));
            }

            if (args.default.add) {
                const set = await prisma.defaultRoleSets.findUnique({
                    where: { guildId_name: { guildId: message.guildId, name: args.default.add.name } },
                });
                if (!set) {
                    return await message.reply(message.translate("ROLES_DEFAULT_NOT_FOUND"));
                }

                if (set.roleIds.includes(args.default.add.role.id.toString()))
                    return await message.reply(message.translate("ROLES_DEFAULT_ADD_SUCCESS"));

                await prisma.defaultRoleSets.update({
                    where: { guildId_name: { guildId: message.guildId, name: args.default.add.name } },
                    data: { roleIds: [...set.roleIds, args.default.add.role.id.toString()] },
                });

                return await message.reply(message.translate("ROLES_DEFAULT_ADD_SUCCESS"));
            }

            if (args.default.remove) {
                const set = await prisma.defaultRoleSets.findUnique({
                    where: { guildId_name: { guildId: message.guildId, name: args.default.remove.name } },
                });
                if (!set) {
                    return await message.reply(message.translate("ROLES_DEFAULT_NOT_FOUND"));
                }

                if (!set.roleIds.includes(args.default.remove.role.id.toString()))
                    return await message.reply(message.translate("ROLES_DEFAULT_REMOVE_SUCCESS"));

                await prisma.defaultRoleSets.update({
                    where: { guildId_name: { guildId: message.guildId, name: args.default.remove.name } },
                    data: { roleIds: set.roleIds.filter((id) => id !== args.default?.remove?.role.id.toString()) },
                });

                return await message.reply(message.translate("ROLES_DEFAULT_REMOVE_SUCCESS"));
            }

            if (args.default.list) {
                const sets = await prisma.defaultRoleSets.findMany({ where: { guildId: message.guildId } });
                if (!sets) return await message.reply(message.translate("ROLES_DEFAULT_LIST_NONE"));

                const embeds = new Embeds().setTitle(message.translate("ROLES_DEFAULT_LIST_TITLE")).setColor("RANDOM");

                let counter = 1;
                for (const set of sets) {
                    const roles = set.roleIds.map((id) => `• <@&${id}>`);
                    roles.unshift(`➡️ <@&${set.defaultRoleId}>`);

                    embeds.addField(`#${counter}`, roles.join("\n"), true);
                    counter++;
                }
                return await message.reply({
                    content: "",
                    embeds,
                });
            }
        }

        if (args.reactions) {
            if (args.reactions.create) {
                const components = new Components().addButton(
                    args.reactions.create.label ?? "",
                    args.reactions.create.color,
                    `reactionRole-${args.reactions.create.role.id}`,
                    {
                        emoji: args.reactions.create.emoji,
                    },
                );

                await message.reply({
                    content: message.translate("ROLES_REACTIONS_CREATE_PLACEHOLDER"),
                    embeds: [],
                    components,
                });

                const editComponents = new Components()
                    .addButton(message.translate("ROLES_REACTIONS_CREATE_ADD"), ButtonStyles.Primary, `reactionRoleAdd-${message.id}`, {
                        emoji: "➕",
                    })
                    .addButton(message.translate("ROLES_REACTIONS_CREATE_REMOVE"), ButtonStyles.Primary, `reactionRoleRemove-${message.id}`, {
                        emoji: "➖",
                    })
                    .addButton(message.translate("ROLES_REACTIONS_CREATE_EDIT"), ButtonStyles.Primary, `reactionRoleEdit-${message.id}`, {
                        emoji: "🖊️",
                    })
                    .addButton(message.translate("ROLES_REACTIONS_CREATE_SAVE"), ButtonStyles.Success, `reactionRoleSave`, {
                        emoji: "✅",
                    })
                    .addButton(
                        message.translate("INVITE_NEED_SUPPORT"),
                        ButtonStyles.Link,
                        message.isOnDiscord ? configs.platforms.discord.supportServerInvite : configs.platforms.guilded.supportServerInvite,
                    );

                return await message.reply({
                    content: message.translate("ROLES_REACTIONS_CREATE_PLACEHOLDER_EDIT"),
                    embeds: [],
                    components: editComponents,
                });
            }

            if (args.reactions.add || args.reactions.remove) {
                const messageId = args.reactions.add?.message || args.reactions.remove!.message;
                const channelId = args.reactions.add?.channel.id || args.reactions.remove!.channel.id;

                if (message.isOnDiscord && !validateSnowflake(messageId)) {
                    return await message.reply("ROLES_REACTIONS_ADD_INVALID_MESSAGE");
                }

                const msg = await fetchMessage(channelId, messageId, { platform: message.platform });
                if (!msg) return await message.reply("ROLES_REACTIONS_ADD_MESSAGE_UNKNOWN");

                if (msg.author.id !== (message.isOnDiscord ? Gamer.discord.rest.applicationId.toString() : Gamer.guilded.user?.id))
                    return await message.reply("ROLES_REACTIONS_ADD_MESSAGE_USER");

                if (args.reactions.remove) {
                    return await message.needResponse({
                        modal: {
                            type: InteractionResponseTypes.Modal,
                            title: message.translate("ROLES_REACTIONS_CREATE_REMOVE"),
                            customId: `reactionRoleRemoved-${channelId}-${messageId}`,
                            components: [
                                {
                                    type: 1,
                                    components: [
                                        {
                                            type: MessageComponentTypes.InputText,
                                            customId: "modalemoji",
                                            label: message.translate("ROLES_REACTIONS_MODAL_TITLE_EMOJI"),
                                            //   style: TextStyles.Short,
                                            style: 1,
                                            minLength: 1,
                                            maxLength: 30,
                                            placeholder: message.translate("ROLES_REACTIONS_MODAL_TITLE_EMOJI_PLACEHOLDER"),
                                            required: true,
                                        },
                                    ],
                                },
                            ],
                        },
                    });
                } else {
                    return await message.needResponse({
                        modal: {
                            type: InteractionResponseTypes.Modal,
                            title: message.translate("ROLES_REACTIONS_CREATE_ADD"),
                            customId: `reactionRoleEdited-${channelId}-${messageId}`,
                            components: [
                                {
                                    type: 1,
                                    components: [
                                        {
                                            type: MessageComponentTypes.InputText,
                                            customId: "modalemoji",
                                            label: message.translate("ROLES_REACTIONS_MODAL_TITLE_EMOJI"),
                                            //   style: TextStyles.Short,
                                            style: 1,
                                            minLength: 1,
                                            maxLength: 30,
                                            placeholder: message.translate("ROLES_REACTIONS_MODAL_TITLE_EMOJI_PLACEHOLDER"),
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
                                            label: message.translate("ROLES_REACTIONS_MODAL_TITLE_COLOR"),
                                            //   style: TextStyles.Short,
                                            style: 1,
                                            minLength: 3,
                                            maxLength: 5,
                                            placeholder: message.translate("ROLES_REACTIONS_MODAL_TITLE_COLOR_PLACEHOLDER"),
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
                                            label: message.translate("ROLES_REACTIONS_MODAL_TITLE_ROLE"),
                                            //   style: TextStyles.Short,
                                            style: 1,
                                            maxLength: 30,
                                            placeholder: message.translate("ROLES_REACTIONS_MODAL_TITLE_ROLE_PLACEHOLDER"),
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
                                            label: message.translate("ROLES_REACTIONS_MODAL_TITLE_LABEL"),
                                            //   style: TextStyles.Short,
                                            style: 1,
                                            maxLength: 80,
                                            placeholder: message.translate("ROLES_REACTIONS_MODAL_TITLE_LABEL_PLACEHOLDER"),
                                            required: false,
                                        },
                                    ],
                                },
                            ],
                        },
                    });
                }
            }

            if (args.reactions.colors) {
                // ASK TO CONFIRM CREATION
                return await message.reply({
                    content: message.translate("ROLES_REACTIONS_COLORS_CONFIRM"),
                    embeds: [],
                    components: new Components().addButton(message.translate("CONFIRM"), "Success", "reactionRoleColorsConfirm", {
                        emoji: emojis.success,
                    }),
                });
            }

            if (args.reactions.pronouns) {
                // ASK TO CONFIRM CREATION
                return await message.reply({
                    content: message.translate("ROLES_REACTIONS_PRONOUNS_CONFIRM"),
                    embeds: [],
                    components: new Components().addButton(message.translate("CONFIRM"), "Success", "reactionRolePronounsConfirm", {
                        emoji: emojis.success,
                    }),
                });
            }
        }

        return await message.reply("tada u broke the bot");
    },
};

export default roles;

export interface SettingsRoleArgs {
    messages?: {
        create?: {
            role: GamerRole;
            channel: GamerChannel;
            new: boolean;
            content: string;
        };
        delete?: {
            role: GamerRole;
        };
        list?: {};
    };
    grouped?: {
        create?: {
            role: GamerRole;
            role2: GamerRole;
        };
        delete?: {
            role: GamerRole;
        };
        add?: {
            name: string;
            role: GamerRole;
        };
        remove?: {
            name: string;
            role: GamerRole;
        };
        list?: {};
    };
    required?: {
        create?: {
            name: string;
            role: GamerRole;
            role2: GamerRole;
        };
        delete?: {
            name: string;
        };
        add?: {
            name: string;
            role: GamerRole;
        };
        remove?: {
            name: string;
            role: GamerRole;
        };
        list?: {};
    };
    unique?: {
        create?: {
            name: string;
            role: GamerRole;
            role2: GamerRole;
        };
        delete?: {
            name: string;
        };
        add?: {
            name: string;
            role: GamerRole;
        };
        remove?: {
            name: string;
            role: GamerRole;
        };
        list?: {};
    };
    default?: {
        create?: {
            name: string;
            role: GamerRole;
            role2: GamerRole;
        };
        delete?: {
            name: string;
        };
        add?: {
            name: string;
            role: GamerRole;
        };
        remove?: {
            name: string;
            role: GamerRole;
        };
        list?: {};
    };
    reactions?: {
        create?: {
            label: string;
            color: "Primary" | "Secondary" | "Success" | "Danger";
            role: GamerRole;
            emoji: string;
        };
        add?: {
            message: string;
            channel: GamerChannel;
        };
        remove?: {
            message: string;
            channel: GamerChannel;
        };
        colors?: {};
        pronouns?: {};
    };
}
