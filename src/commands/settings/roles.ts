import { ButtonStyles } from "@discordeno/bot";
import GamerChannel from "../../base/GamerChannel.js";
import GamerRole from "../../base/GamerRole.js";
import { Command, PermissionLevels } from "../../base/typings.js";
import { prisma } from "../../prisma/client.js";

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
            role: GamerRole;
            role2: GamerRole;
        };
        remove?: {
            role: GamerRole;
            role2: GamerRole;
        };
        list?: {};
    };
}
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
                            name: "ROLES_GROUPED_ADD_ROLE_NAME",
                            type: "role",
                        },
                        {
                            required: true,
                            name: "ROLES_GROUPED_ADD_ROLE_2_NAME",
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
                            name: "ROLES_GROUPED_REMOVE_ROLE_NAME",
                            type: "role",
                        },
                        {
                            required: true,
                            name: "ROLES_GROUPED_REMOVE_ROLE_2_NAME",
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
                            name: "ROLES_REQUIRED_DELETE_ROLE_NAME",
                            type: "role",
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
                            name: "ROLES_DEFAULT_ADD_ROLE_NAME",
                            type: "role",
                        },
                        {
                            required: true,
                            name: "ROLES_DEFAULT_ADD_ROLE_2_NAME",
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
                            name: "ROLES_DEFAULT_REMOVE_ROLE_NAME",
                            type: "role",
                        },
                        {
                            required: true,
                            name: "ROLES_DEFAULT_REMOVE_ROLE_2_NAME",
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

            if (args.grouped.delete) {
                await prisma.groupedRoleSets.delete({
                    where: { mainRoleId: args.grouped.delete.role.id.toString() },
                });

                return await message.reply(message.translate("ROLES_GROUPED_DELETE_SUCCESS"));
            }

            if (args.grouped.add) {
                const set = await db.roleSets.grouped.get({ roleId: args.grouped.add.role.id });
                if (!set) {
                    return await message.reply(message.translate("ROLES_GROUPED_NOT_FOUND"));
                }

                if (set.roleIds.includes(args.grouped.add.role2.id)) return await message.reply(message.translate("ROLES_GROUPED_ADD_SUCCESS"));

                await db.roleSets.grouped.update({
                    roleId: set.roleId,
                    roleIds: [...set.roleIds, args.grouped.add.role2.id],
                });

                return await message.reply(message.translate("ROLES_GROUPED_ADD_SUCCESS"));
            }

            if (args.grouped.remove) {
                const set = await db.roleSets.grouped.get({ roleId: args.grouped.remove.role.id });
                if (!set) {
                    return await message.reply(message.translate("ROLES_GROUPED_NOT_FOUND"));
                }

                if (!set.roleIds.includes(args.grouped.remove.role2.id))
                    return await message.reply(message.translate("ROLES_GROUPED_REMOVE_SUCCESS"));

                await db.roleSets.grouped.update({
                    roleId: set.roleId,
                    roleIds: set.roleIds.filter((id) => id !== args.grouped?.remove?.role.id),
                });

                return await message.reply(message.translate("ROLES_GROUPED_REMOVE_SUCCESS"));
            }

            if (args.grouped.list) {
                const sets = await db.roleSets.grouped.getAll({ guildId: message.guildId });
                if (!sets) return await message.reply(message.translate("ROLES_GROUPED_LIST_NONE"));

                const embeds = new Embeds(bot).setTitle(translate(bot, message.guildId, "ROLES_GROUPED_LIST_TITLE")).setColor("RANDOM");

                let counter = 1;
                for (const set of sets) {
                    const roles = set.roleIds.map((id) => `• <@&${id}>`);
                    roles.unshift(`➡️ <@&${set.roleId}>`);

                    embeds.addField(`#${counter}`, roles.join("\n"), true);
                    counter++;
                }
                return await replyToInteraction(bot, interaction, {
                    embeds,
                });
            }
        }

        if (args.required) {
            if (args.required.create) {
                await db.roleSets.required.new({
                    roleId: args.required.create.role.id,
                    guildId: message.guildId,
                    roleIds: [args.required.create.role2.id],
                });

                return await message.reply(message.translate("ROLES_REQUIRED_CREATE_SUCCESS"));
            }

            if (args.required.delete) {
                await db.roleSets.required.delete({
                    roleId: args.required.delete.role.id,
                });

                return await message.reply(message.translate("ROLES_REQUIRED_DELETE_SUCCESS"));
            }

            if (args.required.add) {
                const set = await db.roleSets.required.get({ roleId: args.required.add.role.id });
                if (!set) {
                    return await message.reply(message.translate("ROLES_REQUIRED_NOT_FOUND"));
                }

                if (set.roleIds.includes(args.required.add.role2.id)) return await message.reply(message.translate("ROLES_REQUIRED_ADD_SUCCESS"));

                await db.roleSets.required.update({
                    roleId: set.roleId,
                    roleIds: [...set.roleIds, args.required.add.role2.id],
                });

                return await message.reply(message.translate("ROLES_REQUIRED_ADD_SUCCESS"));
            }

            if (args.required.remove) {
                const set = await db.roleSets.required.get({ roleId: args.required.remove.role.id });
                if (!set) {
                    return await message.reply(message.translate("ROLES_REQUIRED_NOT_FOUND"));
                }

                if (!set.roleIds.includes(args.required.remove.role2.id))
                    return await message.reply(message.translate("ROLES_REQUIRED_REMOVE_SUCCESS"));

                await db.roleSets.required.update({
                    roleId: set.roleId,
                    roleIds: set.roleIds.filter((id) => id !== args.required?.remove?.role.id),
                });

                return await message.reply(message.translate("ROLES_REQUIRED_REMOVE_SUCCESS"));
            }

            if (args.required.list) {
                const sets = await db.roleSets.required.getAll({ guildId: message.guildId });
                if (!sets) return await message.reply(message.translate("ROLES_REQUIRED_LIST_NONE"));

                const embeds = new Embeds(bot).setTitle(translate(bot, message.guildId, "ROLES_REQUIRED_LIST_TITLE")).setColor("RANDOM");

                let counter = 1;
                for (const set of sets) {
                    const roles = set.roleIds.map((id) => `• <@&${id}>`);
                    roles.unshift(`➡️ <@&${set.roleId}>`);

                    embeds.addField(`#${counter}`, roles.join("\n"), true);
                    counter++;
                }
                return await replyToInteraction(bot, interaction, {
                    embeds,
                });
            }
        }

        if (args.default) {
            if (args.default.create) {
                await db.roleSets.default.new({
                    roleId: args.default.create.role.id,
                    guildId: message.guildId,
                    roleIds: [args.default.create.role2.id],
                });

                return await message.reply(message.translate("ROLES_DEFAULT_CREATE_SUCCESS"));
            }

            if (args.default.delete) {
                await db.roleSets.default.delete({
                    roleId: args.default.delete.role.id,
                });

                return await message.reply(message.translate("ROLES_DEFAULT_DELETE_SUCCESS"));
            }

            if (args.default.add) {
                const set = await db.roleSets.default.get({ roleId: args.default.add.role.id });
                if (!set) {
                    return await message.reply(message.translate("ROLES_DEFAULT_NOT_FOUND"));
                }

                if (set.roleIds.includes(args.default.add.role2.id)) return await message.reply(message.translate("ROLES_DEFAULT_ADD_SUCCESS"));

                await db.roleSets.default.update({
                    roleId: set.roleId,
                    roleIds: [...set.roleIds, args.default.add.role2.id],
                });

                return await message.reply(message.translate("ROLES_DEFAULT_ADD_SUCCESS"));
            }

            if (args.default.remove) {
                const set = await db.roleSets.default.get({ roleId: args.default.remove.role.id });
                if (!set) {
                    return await message.reply(message.translate("ROLES_DEFAULT_NOT_FOUND"));
                }

                if (!set.roleIds.includes(args.default.remove.role2.id))
                    return await message.reply(message.translate("ROLES_DEFAULT_REMOVE_SUCCESS"));

                await db.roleSets.default.update({
                    roleId: set.roleId,
                    roleIds: set.roleIds.filter((id) => id !== args.default?.remove?.role.id),
                });

                return await message.reply(message.translate("ROLES_DEFAULT_REMOVE_SUCCESS"));
            }

            if (args.default.list) {
                const sets = await db.roleSets.default.getAll({ guildId: message.guildId });
                if (!sets) return await message.reply(message.translate("ROLES_DEFAULT_LIST_NONE"));

                const embeds = new Embeds(bot).setTitle(translate(bot, message.guildId, "ROLES_DEFAULT_LIST_TITLE")).setColor("RANDOM");

                let counter = 1;
                for (const set of sets) {
                    const roles = set.roleIds.map((id) => `• <@&${id}>`);
                    roles.unshift(`➡️ <@&${set.roleId}>`);

                    embeds.addField(`#${counter}`, roles.join("\n"), true);
                    counter++;
                }
                return await replyToInteraction(bot, interaction, {
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

                await replyToInteraction(bot, interaction, {
                    content: translate(bot, message.guildId, "ROLES_REACTIONS_CREATE_PLACEHOLDER"),
                    components,
                });
                const message = await bot.helpers.getOriginalInteractionResponse(message.token);
                if (!message) return await privateReplyToInteraction(bot, interaction, "SEND_MESSAGE_ERROR");

                const editComponents = new Components()
                    .addButton(translate(bot, message.guildId, "ROLES_REACTIONS_CREATE_ADD"), ButtonStyles.Primary, `reactionRoleAdd-${message.id}`, {
                        emoji: "➕",
                    })
                    .addButton(
                        translate(bot, message.guildId, "ROLES_REACTIONS_CREATE_REMOVE"),
                        ButtonStyles.Primary,
                        `reactionRoleRemove-${message.id}`,
                        {
                            emoji: "➖",
                        },
                    )
                    .addButton(
                        translate(bot, message.guildId, "ROLES_REACTIONS_CREATE_EDIT"),
                        ButtonStyles.Primary,
                        `reactionRoleEdit-${message.id}`,
                        {
                            emoji: "🖊️",
                        },
                    )
                    .addButton(translate(bot, message.guildId, "ROLES_REACTIONS_CREATE_SAVE"), ButtonStyles.Success, `reactionRoleSave`, {
                        emoji: "✅",
                    })
                    .addButton(
                        translate(bot, message.guildId, "INVITE_NEED_SUPPORT"),
                        ButtonStyles.Link,
                        `https://discord.gg/${BOT_SERVER_INVITE_CODE}`,
                    );

                return await replyToInteraction(bot, interaction, {
                    content: translate(bot, message.guildId, "ROLES_REACTIONS_CREATE_PLACEHOLDER_EDIT"),
                    components: editComponents,
                });
            }

            if (args.reactions.add || args.reactions.remove) {
                // ONLY ADMINS CAN USE THIS
                if (!message.member.permissions || !validatePermissions(message.member.permissions, ["ADMINISTRATOR"])) {
                    return await privateReplyToInteraction(bot, interaction, translate(bot, message.guildId, "USER_NOT_ADMIN"));
                }

                const messageId = args.reactions.add?.message || args.reactions.remove!.message;
                const channelId = args.reactions.add?.channel.id || args.reactions.remove!.channel.id;

                if (!validateSnowflake(messageId)) {
                    return await privateReplyToInteraction(bot, interaction, "ROLES_REACTIONS_ADD_INVALID_MESSAGE");
                }

                const message = await bot.helpers.getMessage(channelId, bot.transformers.snowflake(messageId));
                if (!message) return await privateReplyToInteraction(bot, interaction, "ROLES_REACTIONS_ADD_MESSAGE_UNKNOWN");

                if (message.authorId !== bot.id) return await privateReplyToInteraction(bot, interaction, "ROLES_REACTIONS_ADD_MESSAGE_USER");

                if (args.reactions.remove) {
                    return await replyToInteraction(bot, interaction, {
                        type: InteractionResponseTypes.Modal,
                        title: translate(bot, message.guildId, "ROLES_REACTIONS_CREATE_REMOVE"),
                        customId: `reactionRoleRemoved-${channelId}-${messageId}`,
                        components: [
                            {
                                type: 1,
                                components: [
                                    {
                                        type: MessageComponentTypes.InputText,
                                        customId: "modalemoji",
                                        label: translate(bot, message.guildId, "ROLES_REACTIONS_MODAL_TITLE_EMOJI"),
                                        //   style: TextStyles.Short,
                                        style: 1,
                                        minLength: 1,
                                        maxLength: 30,
                                        placeholder: translate(bot, message.guildId, "ROLES_REACTIONS_MODAL_TITLE_EMOJI_PLACEHOLDER"),
                                        required: true,
                                    },
                                ],
                            },
                        ],
                    });
                } else {
                    return await replyToInteraction(bot, interaction, {
                        type: InteractionResponseTypes.Modal,
                        title: translate(bot, message.guildId, "ROLES_REACTIONS_CREATE_ADD"),
                        customId: `reactionRoleEdited-${channelId}-${messageId}`,
                        components: [
                            {
                                type: 1,
                                components: [
                                    {
                                        type: MessageComponentTypes.InputText,
                                        customId: "modalemoji",
                                        label: translate(bot, message.guildId, "ROLES_REACTIONS_MODAL_TITLE_EMOJI"),
                                        //   style: TextStyles.Short,
                                        style: 1,
                                        minLength: 1,
                                        maxLength: 30,
                                        placeholder: translate(bot, message.guildId, "ROLES_REACTIONS_MODAL_TITLE_EMOJI_PLACEHOLDER"),
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
                                        label: translate(bot, message.guildId, "ROLES_REACTIONS_MODAL_TITLE_COLOR"),
                                        //   style: TextStyles.Short,
                                        style: 1,
                                        minLength: 3,
                                        maxLength: 5,
                                        placeholder: translate(bot, message.guildId, "ROLES_REACTIONS_MODAL_TITLE_COLOR_PLACEHOLDER"),
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
                                        label: translate(bot, message.guildId, "ROLES_REACTIONS_MODAL_TITLE_ROLE"),
                                        //   style: TextStyles.Short,
                                        style: 1,
                                        maxLength: 30,
                                        placeholder: translate(bot, message.guildId, "ROLES_REACTIONS_MODAL_TITLE_ROLE_PLACEHOLDER"),
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
                                        label: translate(bot, message.guildId, "ROLES_REACTIONS_MODAL_TITLE_LABEL"),
                                        //   style: TextStyles.Short,
                                        style: 1,
                                        maxLength: 80,
                                        placeholder: translate(bot, message.guildId, "ROLES_REACTIONS_MODAL_TITLE_LABEL_PLACEHOLDER"),
                                        required: false,
                                    },
                                ],
                            },
                        ],
                    });
                }
            }

            if (args.reactions.colors) {
                // ASK TO CONFIRM CREATION
                return await privateReplyToInteraction(bot, interaction, {
                    content: translate(bot, message.guildId, "ROLES_REACTIONS_COLORS_CONFIRM"),
                    components: new Components().addButton(translate(bot, message.guildId, "CONFIRM"), "Success", "reactionRoleColorsConfirm", {
                        emoji: emojis.success,
                    }),
                });
            }

            if (args.reactions.pronouns) {
                // ASK TO CONFIRM CREATION
                return await privateReplyToInteraction(bot, interaction, {
                    content: translate(bot, message.guildId, "ROLES_REACTIONS_PRONOUNS_CONFIRM"),
                    components: new Components().addButton(translate(bot, message.guildId, "CONFIRM"), "Success", "reactionRolePronounsConfirm", {
                        emoji: emojis.success,
                    }),
                });
            }
        }

        return await replyToInteraction(bot, interaction, "tada u broke the bot");
    },
};

export default roles;

//     execute: async function (bot, interaction, args) {
//     },
//   })

//   export default command
