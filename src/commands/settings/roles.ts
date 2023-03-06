import { ButtonStyles } from "@discordeno/bot";
import { Command } from "../../base/typings.js";

export const roles: Command = {
    name: "roles",
    aliases: [],
    // TODO: Implement vip system
    vipOnly: true,
    arguments: [
        {
            required: false,
            name: "ROLES_MESSAGES_NAME",
            type: 'subcommand',
            arguments: [
                {
                    required: false,
                    name: "ROLES_MESSAGES_CREATE_NAME",
                    type: 'subcommand',
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_MESSAGES_CREATE_TYPE_NAME",
                            type: 'boolean',
                        },
                        {
                            required: true,
                            name: "ROLES_MESSAGES_CREATE_ROLE_NAME",
                            type: 'role',
                        },
                        {
                            required: true,
                            name: "ROLES_MESSAGES_CREATE_CHANNEL_NAME",
                            type: 'channel',
                        },
                        {
                            required: true,
                            name: "ROLES_MESSAGES_CREATE_CONTENT_NAME",
                            type: 'string',
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_MESSAGES_DELETE_NAME",
                    type: 'subcommand',
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_MESSAGES_DELETE_ROLE_NAME",
                            type: 'role',
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_MESSAGES_LIST_NAME",
                    type: 'subcommand',
                },
            ],
        },

        {
            required: false,
            name: "ROLES_UNIQUE_NAME",
            type: 'subcommand',
            arguments: [
                {
                    required: false,
                    name: "ROLES_UNIQUE_CREATE_NAME",
                    type: 'subcommand',
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_UNIQUE_CREATE_CUSTOM_NAME",
                            type: 'string',
                        },
                        {
                            required: true,
                            name: "ROLES_UNIQUE_CREATE_ROLE_NAME",
                            type: 'role',
                        },
                        {
                            required: true,
                            name: "ROLES_UNIQUE_CREATE_ROLE_2_NAME",
                            type: 'role',
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_UNIQUE_DELETE_NAME",
                    type: 'subcommand',
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_UNIQUE_DELETE_CUSTOM_NAME",
                            type: 'string',
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_UNIQUE_ADD_NAME",
                    type: 'subcommand',
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_UNIQUE_ADD_CUSTOM_NAME",
                            type: 'string',
                        },
                        {
                            required: true,
                            name: "ROLES_UNIQUE_ADD_ROLE_NAME",
                            type: 'role',
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_UNIQUE_REMOVE_NAME",
                    type: 'subcommand',
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_UNIQUE_REMOVE_CUSTOM_NAME",
                            type: 'string',
                        },
                        {
                            required: true,
                            name: "ROLES_UNIQUE_REMOVE_ROLE_NAME",
                            type: 'role',
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_UNIQUE_LIST_NAME",
                    type: 'subcommand',
                },
            ],
        },

        {
            required: false,
            name: "ROLES_GROUPED_NAME",
            type: 'subcommand',
            arguments: [
                {
                    required: false,
                    name: "ROLES_GROUPED_CREATE_NAME",
                    type: 'subcommand',
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_GROUPED_CREATE_ROLE_NAME",
                            type: 'role',
                        },
                        {
                            required: true,
                            name: "ROLES_GROUPED_CREATE_ROLE_2_NAME",
                            type: 'role',
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_GROUPED_DELETE_NAME",
                    type: 'subcommand',
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_GROUPED_DELETE_ROLE_NAME",
                            type: 'role',
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_GROUPED_ADD_NAME",
                    type: 'subcommand',
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_GROUPED_ADD_ROLE_NAME",
                            type: 'role',
                        },
                        {
                            required: true,
                            name: "ROLES_GROUPED_ADD_ROLE_2_NAME",
                            type: 'role',
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_GROUPED_REMOVE_NAME",
                    type: 'subcommand',
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_GROUPED_REMOVE_ROLE_NAME",
                            type: 'role',
                        },
                        {
                            required: true,
                            name: "ROLES_GROUPED_REMOVE_ROLE_2_NAME",
                            type: 'role',
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_GROUPED_LIST_NAME",
                    type: 'subcommand',
                },
            ],
        },

        {
            required: false,
            name: "ROLES_REQUIRED_NAME",
            type: 'subcommand',
            arguments: [
                {
                    required: false,
                    name: "ROLES_REQUIRED_CREATE_NAME",
                    type: 'subcommand',
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_REQUIRED_CREATE_ROLE_NAME",
                            type: 'role',
                        },
                        {
                            required: true,
                            name: "ROLES_REQUIRED_CREATE_ROLE_2_NAME",
                            type: 'role',
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_REQUIRED_DELETE_NAME",
                    type: 'subcommand',
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_REQUIRED_DELETE_ROLE_NAME",
                            type: 'role',
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_REQUIRED_ADD_NAME",
                    type: 'subcommand',
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_REQUIRED_ADD_ROLE_NAME",
                            type: 'role',
                        },
                        {
                            required: true,
                            name: "ROLES_REQUIRED_ADD_ROLE_2_NAME",
                            type: 'role',
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_REQUIRED_REMOVE_NAME",
                    type: 'subcommand',
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_REQUIRED_REMOVE_ROLE_NAME",
                            type: 'role',
                        },
                        {
                            required: true,
                            name: "ROLES_REQUIRED_REMOVE_ROLE_2_NAME",
                            type: 'role',
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_REQUIRED_LIST_NAME",
                    type: 'subcommand',
                },
            ],
        },

        {
            required: false,
            name: "ROLES_DEFAULT_NAME",
            type: 'subcommand',
            arguments: [
                {
                    required: false,
                    name: "ROLES_DEFAULT_CREATE_NAME",
                    type: 'subcommand',
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_DEFAULT_CREATE_ROLE_NAME",
                            type: 'role',
                        },
                        {
                            required: true,
                            name: "ROLES_DEFAULT_CREATE_ROLE_2_NAME",
                            type: 'role',
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_DEFAULT_DELETE_NAME",
                    type: 'subcommand',
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_DEFAULT_DELETE_ROLE_NAME",
                            type: 'role',
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_DEFAULT_ADD_NAME",
                    type: 'subcommand',
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_DEFAULT_ADD_ROLE_NAME",
                            type: 'role',
                        },
                        {
                            required: true,
                            name: "ROLES_DEFAULT_ADD_ROLE_2_NAME",
                            type: 'role',
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_DEFAULT_REMOVE_NAME",
                    type: 'subcommand',
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_DEFAULT_REMOVE_ROLE_NAME",
                            type: 'role',
                        },
                        {
                            required: true,
                            name: "ROLES_DEFAULT_REMOVE_ROLE_2_NAME",
                            type: 'role',
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_DEFAULT_LIST_NAME",
                    type: 'subcommand',
                },
            ],
        },

        {
            required: false,
            name: "ROLES_REACTIONS_NAME",
            type: 'subcommand',
            arguments: [
                {
                    required: false,
                    name: "ROLES_REACTIONS_CREATE_NAME",
                    type: 'subcommand',
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_REACTIONS_CREATE_EMOJI_NAME",
                            type: 'string',
                        },

                        {
                            required: true,
                            name: "ROLES_REACTIONS_CREATE_COLOR_NAME",
                            type: 'number',
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
                            type: 'role',
                        },
                        {
                            required: false,
                            name: "ROLES_REACTIONS_CREATE_LABEL_NAME",
                            type: 'string',
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_REACTIONS_ADD_NAME",
                    type: 'subcommand',
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_REACTIONS_CREATE_CHANNEL_NAME",
                            type: 'channel',
                        },
                        {
                            required: true,
                            name: "ROLES_REACTIONS_CREATE_MESSAGE_NAME",
                            type: 'string',
                        },
                        {
                            required: true,
                            name: "ROLES_REACTIONS_CREATE_EMOJI_NAME",
                            type: 'string',
                        },

                        {
                            required: true,
                            name: "ROLES_REACTIONS_CREATE_COLOR_NAME",
                            type: 'number',
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
                            type: 'role',
                        },
                        {
                            required: false,
                            name: "ROLES_REACTIONS_CREATE_LABEL_NAME",
                            type: 'string',
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_REACTIONS_REMOVE_NAME",
                    type: 'subcommand',
                    arguments: [
                        {
                            required: true,
                            name: "ROLES_REACTIONS_CREATE_CHANNEL_NAME",
                            type: 'channel',
                        },
                        {
                            required: true,
                            name: "ROLES_REACTIONS_CREATE_MESSAGE_NAME",
                            type: 'string',
                        },
                        {
                            required: true,
                            name: "ROLES_REACTIONS_CREATE_EMOJI_NAME",
                            type: 'string',
                        },
                    ],
                },
                {
                    required: false,
                    name: "ROLES_REACTIONS_COLORS_NAME",
                    type: 'subcommand',
                },
                {
                    required: false,
                    name: "ROLES_REACTIONS_PRONOUNS_NAME",
                    type: 'subcommand',
                },
            ],
        },
    ],
    async execute(message, args: {}) {},
};

export default roles;

//     execute: async function (bot, interaction, args) {
//       if (!interaction.guildId || !interaction.member) return

//       // ONLY ADMINS CAN USE COMMAND
//       if (!interaction.member.permissions || !validatePermissions(interaction.member.permissions, ['ADMINISTRATOR'])) {
//         return await privateReplyToInteraction(bot, interaction, translate(bot, interaction.guildId, 'USER_NOT_ADMIN'))
//       }

//       if (args.messages) {
//         if (args.messages?.create) {
//           await db.roleMessages.upsert({
//             roleId: args.messages.create.role.id,
//             channelId: args.messages.create.channel.id,
//             guildId: interaction.guildId,
//             [args.messages.create.new ? 'added' : 'removed']: args.messages.create.content,
//           })

//           return await replyToInteraction(
//             bot,
//             interaction,
//             translate(bot, interaction.guildId!, 'ROLES_MESSAGES_CREATE_SUCCESS'),
//           )
//         }

//         if (args.messages?.delete) {
//           await db.roleMessages.delete(args.messages.delete.role.id)
//           return await replyToInteraction(
//             bot,
//             interaction,
//             translate(bot, interaction.guildId!, 'ROLES_MESSAGES_DELETE_SUCCESS'),
//           )
//         }

//         // if (args.messages.list) {
//         //   const messages = await db.roleMessages.getAll({ guildId: interaction.guildId })
//         //   if (!messages) return await privateReplyToInteraction(bot, interaction, "ROLES_MESSAGES_LIST_NONE")

//         // }
//       }

//       if (args.unique) {
//         if (args.unique.create) {
//           const roleIds = new Set([args.unique.create.role.id, args.unique.create.role2.id])

//           await db.roleSets.unique.new({
//             guildId: interaction.guildId,
//             name: args.unique.create.name,
//             roleIds: [...roleIds.values()],
//           })

//           return await replyToInteraction(
//             bot,
//             interaction,
//             translate(bot, interaction.guildId, 'ROLES_UNIQUE_CREATE_SUCCESS'),
//           )
//         }

//         if (args.unique.delete) {
//           await db.roleSets.unique.delete({
//             guildId: interaction.guildId,
//             name: args.unique.delete.name,
//           })

//           return await replyToInteraction(
//             bot,
//             interaction,
//             translate(bot, interaction.guildId, 'ROLES_UNIQUE_DELETE_SUCCESS'),
//           )
//         }

//         if (args.unique.add) {
//           const set = await db.roleSets.unique.get({ guildId: interaction.guildId, name: args.unique.add.name })
//           if (!set) {
//             return await replyToInteraction(
//               bot,
//               interaction,
//               translate(bot, interaction.guildId, 'ROLES_UNIQUE_NOT_FOUND'),
//             )
//           }

//           if (set.roleIds.includes(args.unique.add.role.id))
//             return await replyToInteraction(
//               bot,
//               interaction,
//               translate(bot, interaction.guildId, 'ROLES_UNIQUE_ADD_SUCCESS'),
//             )

//           await db.roleSets.unique.update({
//             guildId: interaction.guildId,
//             name: args.unique.add.name,
//             roleIds: [...set.roleIds, args.unique.add.role.id],
//           })

//           return await replyToInteraction(
//             bot,
//             interaction,
//             translate(bot, interaction.guildId, 'ROLES_UNIQUE_ADD_SUCCESS'),
//           )
//         }

//         if (args.unique.remove) {
//           const set = await db.roleSets.unique.get({ guildId: interaction.guildId, name: args.unique.remove.name })
//           if (!set) {
//             return await replyToInteraction(
//               bot,
//               interaction,
//               translate(bot, interaction.guildId, 'ROLES_UNIQUE_NOT_FOUND'),
//             )
//           }

//           if (!set.roleIds.includes(args.unique.remove.role.id))
//             return await replyToInteraction(
//               bot,
//               interaction,
//               translate(bot, interaction.guildId, 'ROLES_UNIQUE_REMOVE_SUCCESS'),
//             )

//           await db.roleSets.unique.update({
//             guildId: interaction.guildId,
//             name: args.unique.remove.name,
//             roleIds: set.roleIds.filter((id) => id !== args.unique?.remove?.role.id),
//           })

//           return await replyToInteraction(
//             bot,
//             interaction,
//             translate(bot, interaction.guildId, 'ROLES_UNIQUE_REMOVE_SUCCESS'),
//           )
//         }

//         if (args.unique.list) {
//           const sets = await db.roleSets.unique.getAll({ guildId: interaction.guildId })
//           if (!sets)
//             return await replyToInteraction(
//               bot,
//               interaction,
//               translate(bot, interaction.guildId, 'ROLES_UNIQUE_LIST_NONE'),
//             )

//           const embeds = new Embeds(bot)
//             .setTitle(translate(bot, interaction.guildId, 'ROLES_UNIQUE_LIST_TITLE'))
//             .setColor('RANDOM')

//           for (const set of sets) embeds.addField(set.name, set.roleIds.map((id) => `• <@&${id}>`).join('\n'), true)
//           return await replyToInteraction(bot, interaction, {
//             embeds,
//           })
//         }
//       }

//       if (args.grouped) {
//         if (args.grouped.create) {
//           await db.roleSets.grouped.new({
//             roleId: args.grouped.create.role.id,
//             guildId: interaction.guildId,
//             roleIds: [args.grouped.create.role2.id],
//           })

//           return await replyToInteraction(
//             bot,
//             interaction,
//             translate(bot, interaction.guildId, 'ROLES_GROUPED_CREATE_SUCCESS'),
//           )
//         }

//         if (args.grouped.delete) {
//           await db.roleSets.grouped.delete({
//             roleId: args.grouped.delete.role.id,
//           })

//           return await replyToInteraction(
//             bot,
//             interaction,
//             translate(bot, interaction.guildId, 'ROLES_GROUPED_DELETE_SUCCESS'),
//           )
//         }

//         if (args.grouped.add) {
//           const set = await db.roleSets.grouped.get({ roleId: args.grouped.add.role.id })
//           if (!set) {
//             return await replyToInteraction(
//               bot,
//               interaction,
//               translate(bot, interaction.guildId, 'ROLES_GROUPED_NOT_FOUND'),
//             )
//           }

//           if (set.roleIds.includes(args.grouped.add.role2.id))
//             return await replyToInteraction(
//               bot,
//               interaction,
//               translate(bot, interaction.guildId, 'ROLES_GROUPED_ADD_SUCCESS'),
//             )

//           await db.roleSets.grouped.update({
//             roleId: set.roleId,
//             roleIds: [...set.roleIds, args.grouped.add.role2.id],
//           })

//           return await replyToInteraction(
//             bot,
//             interaction,
//             translate(bot, interaction.guildId, 'ROLES_GROUPED_ADD_SUCCESS'),
//           )
//         }

//         if (args.grouped.remove) {
//           const set = await db.roleSets.grouped.get({ roleId: args.grouped.remove.role.id })
//           if (!set) {
//             return await replyToInteraction(
//               bot,
//               interaction,
//               translate(bot, interaction.guildId, 'ROLES_GROUPED_NOT_FOUND'),
//             )
//           }

//           if (!set.roleIds.includes(args.grouped.remove.role2.id))
//             return await replyToInteraction(
//               bot,
//               interaction,
//               translate(bot, interaction.guildId, 'ROLES_GROUPED_REMOVE_SUCCESS'),
//             )

//           await db.roleSets.grouped.update({
//             roleId: set.roleId,
//             roleIds: set.roleIds.filter((id) => id !== args.grouped?.remove?.role.id),
//           })

//           return await replyToInteraction(
//             bot,
//             interaction,
//             translate(bot, interaction.guildId, 'ROLES_GROUPED_REMOVE_SUCCESS'),
//           )
//         }

//         if (args.grouped.list) {
//           const sets = await db.roleSets.grouped.getAll({ guildId: interaction.guildId })
//           if (!sets)
//             return await replyToInteraction(
//               bot,
//               interaction,
//               translate(bot, interaction.guildId, 'ROLES_GROUPED_LIST_NONE'),
//             )

//           const embeds = new Embeds(bot)
//             .setTitle(translate(bot, interaction.guildId, 'ROLES_GROUPED_LIST_TITLE'))
//             .setColor('RANDOM')

//           let counter = 1
//           for (const set of sets) {
//             const roles = set.roleIds.map((id) => `• <@&${id}>`)
//             roles.unshift(`➡️ <@&${set.roleId}>`)

//             embeds.addField(`#${counter}`, roles.join('\n'), true)
//             counter++
//           }
//           return await replyToInteraction(bot, interaction, {
//             embeds,
//           })
//         }
//       }

//       if (args.required) {
//         if (args.required.create) {
//           await db.roleSets.required.new({
//             roleId: args.required.create.role.id,
//             guildId: interaction.guildId,
//             roleIds: [args.required.create.role2.id],
//           })

//           return await replyToInteraction(
//             bot,
//             interaction,
//             translate(bot, interaction.guildId, 'ROLES_REQUIRED_CREATE_SUCCESS'),
//           )
//         }

//         if (args.required.delete) {
//           await db.roleSets.required.delete({
//             roleId: args.required.delete.role.id,
//           })

//           return await replyToInteraction(
//             bot,
//             interaction,
//             translate(bot, interaction.guildId, 'ROLES_REQUIRED_DELETE_SUCCESS'),
//           )
//         }

//         if (args.required.add) {
//           const set = await db.roleSets.required.get({ roleId: args.required.add.role.id })
//           if (!set) {
//             return await replyToInteraction(
//               bot,
//               interaction,
//               translate(bot, interaction.guildId, 'ROLES_REQUIRED_NOT_FOUND'),
//             )
//           }

//           if (set.roleIds.includes(args.required.add.role2.id))
//             return await replyToInteraction(
//               bot,
//               interaction,
//               translate(bot, interaction.guildId, 'ROLES_REQUIRED_ADD_SUCCESS'),
//             )

//           await db.roleSets.required.update({
//             roleId: set.roleId,
//             roleIds: [...set.roleIds, args.required.add.role2.id],
//           })

//           return await replyToInteraction(
//             bot,
//             interaction,
//             translate(bot, interaction.guildId, 'ROLES_REQUIRED_ADD_SUCCESS'),
//           )
//         }

//         if (args.required.remove) {
//           const set = await db.roleSets.required.get({ roleId: args.required.remove.role.id })
//           if (!set) {
//             return await replyToInteraction(
//               bot,
//               interaction,
//               translate(bot, interaction.guildId, 'ROLES_REQUIRED_NOT_FOUND'),
//             )
//           }

//           if (!set.roleIds.includes(args.required.remove.role2.id))
//             return await replyToInteraction(
//               bot,
//               interaction,
//               translate(bot, interaction.guildId, 'ROLES_REQUIRED_REMOVE_SUCCESS'),
//             )

//           await db.roleSets.required.update({
//             roleId: set.roleId,
//             roleIds: set.roleIds.filter((id) => id !== args.required?.remove?.role.id),
//           })

//           return await replyToInteraction(
//             bot,
//             interaction,
//             translate(bot, interaction.guildId, 'ROLES_REQUIRED_REMOVE_SUCCESS'),
//           )
//         }

//         if (args.required.list) {
//           const sets = await db.roleSets.required.getAll({ guildId: interaction.guildId })
//           if (!sets)
//             return await replyToInteraction(
//               bot,
//               interaction,
//               translate(bot, interaction.guildId, 'ROLES_REQUIRED_LIST_NONE'),
//             )

//           const embeds = new Embeds(bot)
//             .setTitle(translate(bot, interaction.guildId, 'ROLES_REQUIRED_LIST_TITLE'))
//             .setColor('RANDOM')

//           let counter = 1
//           for (const set of sets) {
//             const roles = set.roleIds.map((id) => `• <@&${id}>`)
//             roles.unshift(`➡️ <@&${set.roleId}>`)

//             embeds.addField(`#${counter}`, roles.join('\n'), true)
//             counter++
//           }
//           return await replyToInteraction(bot, interaction, {
//             embeds,
//           })
//         }
//       }

//       if (args.default) {
//         if (args.default.create) {
//           await db.roleSets.default.new({
//             roleId: args.default.create.role.id,
//             guildId: interaction.guildId,
//             roleIds: [args.default.create.role2.id],
//           })

//           return await replyToInteraction(
//             bot,
//             interaction,
//             translate(bot, interaction.guildId, 'ROLES_DEFAULT_CREATE_SUCCESS'),
//           )
//         }

//         if (args.default.delete) {
//           await db.roleSets.default.delete({
//             roleId: args.default.delete.role.id,
//           })

//           return await replyToInteraction(
//             bot,
//             interaction,
//             translate(bot, interaction.guildId, 'ROLES_DEFAULT_DELETE_SUCCESS'),
//           )
//         }

//         if (args.default.add) {
//           const set = await db.roleSets.default.get({ roleId: args.default.add.role.id })
//           if (!set) {
//             return await replyToInteraction(
//               bot,
//               interaction,
//               translate(bot, interaction.guildId, 'ROLES_DEFAULT_NOT_FOUND'),
//             )
//           }

//           if (set.roleIds.includes(args.default.add.role2.id))
//             return await replyToInteraction(
//               bot,
//               interaction,
//               translate(bot, interaction.guildId, 'ROLES_DEFAULT_ADD_SUCCESS'),
//             )

//           await db.roleSets.default.update({
//             roleId: set.roleId,
//             roleIds: [...set.roleIds, args.default.add.role2.id],
//           })

//           return await replyToInteraction(
//             bot,
//             interaction,
//             translate(bot, interaction.guildId, 'ROLES_DEFAULT_ADD_SUCCESS'),
//           )
//         }

//         if (args.default.remove) {
//           const set = await db.roleSets.default.get({ roleId: args.default.remove.role.id })
//           if (!set) {
//             return await replyToInteraction(
//               bot,
//               interaction,
//               translate(bot, interaction.guildId, 'ROLES_DEFAULT_NOT_FOUND'),
//             )
//           }

//           if (!set.roleIds.includes(args.default.remove.role2.id))
//             return await replyToInteraction(
//               bot,
//               interaction,
//               translate(bot, interaction.guildId, 'ROLES_DEFAULT_REMOVE_SUCCESS'),
//             )

//           await db.roleSets.default.update({
//             roleId: set.roleId,
//             roleIds: set.roleIds.filter((id) => id !== args.default?.remove?.role.id),
//           })

//           return await replyToInteraction(
//             bot,
//             interaction,
//             translate(bot, interaction.guildId, 'ROLES_DEFAULT_REMOVE_SUCCESS'),
//           )
//         }

//         if (args.default.list) {
//           const sets = await db.roleSets.default.getAll({ guildId: interaction.guildId })
//           if (!sets)
//             return await replyToInteraction(
//               bot,
//               interaction,
//               translate(bot, interaction.guildId, 'ROLES_DEFAULT_LIST_NONE'),
//             )

//           const embeds = new Embeds(bot)
//             .setTitle(translate(bot, interaction.guildId, 'ROLES_DEFAULT_LIST_TITLE'))
//             .setColor('RANDOM')

//           let counter = 1
//           for (const set of sets) {
//             const roles = set.roleIds.map((id) => `• <@&${id}>`)
//             roles.unshift(`➡️ <@&${set.roleId}>`)

//             embeds.addField(`#${counter}`, roles.join('\n'), true)
//             counter++
//           }
//           return await replyToInteraction(bot, interaction, {
//             embeds,
//           })
//         }
//       }

//       if (args.reactions) {
//         if (args.reactions.create) {
//           const components = new Components().addButton(
//             args.reactions.create.label ?? '',
//             args.reactions.create.color,
//             `reactionRole-${args.reactions.create.role.id}`,
//             {
//               emoji: args.reactions.create.emoji,
//             },
//           )

//           await replyToInteraction(bot, interaction, {
//             content: translate(bot, interaction.guildId, 'ROLES_REACTIONS_CREATE_PLACEHOLDER'),
//             components,
//           })
//           const message = await bot.helpers.getOriginalInteractionResponse(interaction.token)
//           if (!message) return await privateReplyToInteraction(bot, interaction, 'SEND_MESSAGE_ERROR')

//           const editComponents = new Components()
//             .addButton(
//               translate(bot, interaction.guildId, 'ROLES_REACTIONS_CREATE_ADD'),
//               ButtonStyles.Primary,
//               `reactionRoleAdd-${message.id}`,
//               {
//                 emoji: '➕',
//               },
//             )
//             .addButton(
//               translate(bot, interaction.guildId, 'ROLES_REACTIONS_CREATE_REMOVE'),
//               ButtonStyles.Primary,
//               `reactionRoleRemove-${message.id}`,
//               {
//                 emoji: '➖',
//               },
//             )
//             .addButton(
//               translate(bot, interaction.guildId, 'ROLES_REACTIONS_CREATE_EDIT'),
//               ButtonStyles.Primary,
//               `reactionRoleEdit-${message.id}`,
//               {
//                 emoji: '🖊️',
//               },
//             )
//             .addButton(
//               translate(bot, interaction.guildId, 'ROLES_REACTIONS_CREATE_SAVE'),
//               ButtonStyles.Success,
//               `reactionRoleSave`,
//               {
//                 emoji: '✅',
//               },
//             )
//             .addButton(
//               translate(bot, interaction.guildId, 'INVITE_NEED_SUPPORT'),
//               ButtonStyles.Link,
//               `https://discord.gg/${BOT_SERVER_INVITE_CODE}`,
//             )

//           return await replyToInteraction(bot, interaction, {
//             content: translate(bot, interaction.guildId, 'ROLES_REACTIONS_CREATE_PLACEHOLDER_EDIT'),
//             components: editComponents,
//           })
//         }

//         if (args.reactions.add || args.reactions.remove) {
//           // ONLY ADMINS CAN USE THIS
//           if (
//             !interaction.member.permissions ||
//             !validatePermissions(interaction.member.permissions, ['ADMINISTRATOR'])
//           ) {
//             return await privateReplyToInteraction(
//               bot,
//               interaction,
//               translate(bot, interaction.guildId, 'USER_NOT_ADMIN'),
//             )
//           }

//           const messageId = args.reactions.add?.message || args.reactions.remove!.message
//           const channelId = args.reactions.add?.channel.id || args.reactions.remove!.channel.id

//           if (!validateSnowflake(messageId)) {
//             return await privateReplyToInteraction(bot, interaction, 'ROLES_REACTIONS_ADD_INVALID_MESSAGE')
//           }

//           const message = await bot.helpers.getMessage(channelId, bot.transformers.snowflake(messageId))
//           if (!message) return await privateReplyToInteraction(bot, interaction, 'ROLES_REACTIONS_ADD_MESSAGE_UNKNOWN')

//           if (message.authorId !== bot.id)
//             return await privateReplyToInteraction(bot, interaction, 'ROLES_REACTIONS_ADD_MESSAGE_USER')

//           if (args.reactions.remove) {
//             return await replyToInteraction(bot, interaction, {
//               type: InteractionResponseTypes.Modal,
//               title: translate(bot, interaction.guildId, 'ROLES_REACTIONS_CREATE_REMOVE'),
//               customId: `reactionRoleRemoved-${channelId}-${messageId}`,
//               components: [
//                 {
//                   type: 1,
//                   components: [
//                     {
//                       type: MessageComponentTypes.InputText,
//                       customId: 'modalemoji',
//                       label: translate(bot, interaction.guildId, 'ROLES_REACTIONS_MODAL_TITLE_EMOJI'),
//                       //   style: TextStyles.Short,
//                       style: 1,
//                       minLength: 1,
//                       maxLength: 30,
//                       placeholder: translate(bot, interaction.guildId, 'ROLES_REACTIONS_MODAL_TITLE_EMOJI_PLACEHOLDER'),
//                       required: true,
//                     },
//                   ],
//                 },
//               ],
//             })
//           } else {
//             return await replyToInteraction(bot, interaction, {
//               type: InteractionResponseTypes.Modal,
//               title: translate(bot, interaction.guildId, 'ROLES_REACTIONS_CREATE_ADD'),
//               customId: `reactionRoleEdited-${channelId}-${messageId}`,
//               components: [
//                 {
//                   type: 1,
//                   components: [
//                     {
//                       type: MessageComponentTypes.InputText,
//                       customId: 'modalemoji',
//                       label: translate(bot, interaction.guildId, 'ROLES_REACTIONS_MODAL_TITLE_EMOJI'),
//                       //   style: TextStyles.Short,
//                       style: 1,
//                       minLength: 1,
//                       maxLength: 30,
//                       placeholder: translate(bot, interaction.guildId, 'ROLES_REACTIONS_MODAL_TITLE_EMOJI_PLACEHOLDER'),
//                       required: true,
//                     },
//                   ],
//                 },
//                 {
//                   type: 1,
//                   components: [
//                     {
//                       type: MessageComponentTypes.InputText,
//                       customId: 'modalcolor',
//                       label: translate(bot, interaction.guildId, 'ROLES_REACTIONS_MODAL_TITLE_COLOR'),
//                       //   style: TextStyles.Short,
//                       style: 1,
//                       minLength: 3,
//                       maxLength: 5,
//                       placeholder: translate(bot, interaction.guildId, 'ROLES_REACTIONS_MODAL_TITLE_COLOR_PLACEHOLDER'),
//                       required: true,
//                     },
//                   ],
//                 },
//                 {
//                   type: 1,
//                   components: [
//                     {
//                       type: MessageComponentTypes.InputText,
//                       customId: 'modalrole',
//                       label: translate(bot, interaction.guildId, 'ROLES_REACTIONS_MODAL_TITLE_ROLE'),
//                       //   style: TextStyles.Short,
//                       style: 1,
//                       maxLength: 30,
//                       placeholder: translate(bot, interaction.guildId, 'ROLES_REACTIONS_MODAL_TITLE_ROLE_PLACEHOLDER'),
//                       required: true,
//                     },
//                   ],
//                 },
//                 {
//                   type: 1,
//                   components: [
//                     {
//                       type: MessageComponentTypes.InputText,
//                       customId: 'modallabel',
//                       label: translate(bot, interaction.guildId, 'ROLES_REACTIONS_MODAL_TITLE_LABEL'),
//                       //   style: TextStyles.Short,
//                       style: 1,
//                       maxLength: 80,
//                       placeholder: translate(bot, interaction.guildId, 'ROLES_REACTIONS_MODAL_TITLE_LABEL_PLACEHOLDER'),
//                       required: false,
//                     },
//                   ],
//                 },
//               ],
//             })
//           }
//         }

//         if (args.reactions.colors) {
//           // ASK TO CONFIRM CREATION
//           return await privateReplyToInteraction(bot, interaction, {
//             content: translate(bot, interaction.guildId, 'ROLES_REACTIONS_COLORS_CONFIRM'),
//             components: new Components().addButton(
//               translate(bot, interaction.guildId, 'CONFIRM'),
//               'Success',
//               'reactionRoleColorsConfirm',
//               { emoji: emojis.success },
//             ),
//           })
//         }

//         if (args.reactions.pronouns) {
//           // ASK TO CONFIRM CREATION
//           return await privateReplyToInteraction(bot, interaction, {
//             content: translate(bot, interaction.guildId, 'ROLES_REACTIONS_PRONOUNS_CONFIRM'),
//             components: new Components().addButton(
//               translate(bot, interaction.guildId, 'CONFIRM'),
//               'Success',
//               'reactionRolePronounsConfirm',
//               { emoji: emojis.success },
//             ),
//           })
//         }
//       }

//       return await replyToInteraction(bot, interaction, 'tada u broke the bot')
//     },
//   })

//   export default command
