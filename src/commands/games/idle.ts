// import { ApplicationCommandOptionTypes } from 'discordeno'
// import { epicUpgradeResponse, EPIC_UPGRADE_LEVELS, IDLE_ITEMS, IDLE_ITEM_NAMES } from '../../../../../constants/idle.js'
// import { Milliseconds } from '../../../../../constants/milliseconds.js'
// import logger from '../../../../../utils/logger.js'
// import db from '../../../../database/index.js'
// import { translate, translationKeys } from '../../../../languages/translate.js'
// import { createCommand } from '../createCommand.js'
// import { Components } from '../utils/Components.js'
// import Embeds from '../utils/Embeds.js'
// import { getUserTag, humanizeMilliseconds, shortNumber, toTitleCase } from '../utils/helpers.js'
// import { privateReplyToInteraction, replyToInteraction } from '../utils/replies.js'

// const command = createCommand({
//   name: 'IDLE_NAME',
//   description: 'IDLE_DESCRIPTION',
//   acknowledge: true,
//   options: [
//     {
//       required: false,
//       name: 'IDLE_CREATE_NAME',
//       description: 'IDLE_CREATE_DESCRIPTION',
//       type: ApplicationCommandOptionTypes.SubCommand,
//     },
//     {
//       required: false,
//       name: 'IDLE_DELETE_NAME',
//       description: 'IDLE_DELETE_DESCRIPTION',
//       type: ApplicationCommandOptionTypes.SubCommand,
//     },
//     {
//       required: false,
//       name: 'IDLE_LEADERBOARD_NAME',
//       description: 'IDLE_LEADERBOARD_DESCRIPTION',
//       type: ApplicationCommandOptionTypes.SubCommand,
//     },
//     {
//       required: false,
//       name: 'IDLE_PROFILE_NAME',
//       description: 'IDLE_PROFILE_DESCRIPTION',
//       type: ApplicationCommandOptionTypes.SubCommand,
//       options: [
//         {
//           required: false,
//           name: 'IDLE_PROFILE_USER_NAME',
//           description: 'IDLE_PROFILE_USER_DESCRIPTION',
//           type: ApplicationCommandOptionTypes.User,
//         },
//       ],
//     },
//     {
//       name: 'IDLE_UPGRADE_NAME',
//       description: 'IDLE_UPGRADE_DESCRIPTION',
//       type: ApplicationCommandOptionTypes.SubCommand,
//       options: [
//         {
//           required: false,
//           name: 'IDLE_UPGRADE_ITEM_NAME',
//           description: 'IDLE_UPGRADE_ITEM_DESCRIPTION',
//           type: ApplicationCommandOptionTypes.String,
//           choices: [
//             { name: 'IDLE_FRIENDS', value: 'friends' },
//             { name: 'IDLE_SERVERS', value: 'servers' },
//             { name: 'IDLE_CHANNELS', value: 'channels' },
//             { name: 'IDLE_ROLES', value: 'roles' },
//             { name: 'IDLE_PERMS', value: 'perms' },
//             { name: 'IDLE_MESSAGES', value: 'messages' },
//             { name: 'IDLE_INVITES', value: 'invites' },
//             { name: 'IDLE_BOTS', value: 'bots' },
//             { name: 'IDLE_HYPESQUADS', value: 'hypesquads' },
//             { name: 'IDLE_NITRO', value: 'nitro' },
//           ] as const,
//         },
//         {
//           required: false,
//           name: 'IDLE_UPGRADE_AMOUNT_NAME',
//           description: 'IDLE_UPGRADE_AMOUNT_DESCRIPTION',
//           type: ApplicationCommandOptionTypes.Integer,
//         },
//         {
//           required: false,
//           name: 'IDLE_UPGRADE_MAX_NAME',
//           description: 'IDLE_UPGRADE_MAX_DESCRIPTION',
//           type: ApplicationCommandOptionTypes.Boolean,
//         },
//       ],
//     },
//   ] as const,
//   execute: async function (bot, interaction, args) {
//     if (args.create) {
//       const count = await db.idle.get(interaction.user.id)
//       if (count) {
//         return await privateReplyToInteraction(
//           bot,
//           interaction,
//           translate(bot, interaction.guildId!, 'IDLE_PROFILE_EXISTS', 'Discord'),
//         )
//       }

//       await db.idle.new({
//         userId: interaction.user.id,
//         lastUpdatedAt: Date.now(),
//         username: getUserTag(interaction.user),
//         currency: 10n,
//         guildIds: [interaction.guildId!],
//         isekaiGuildIds: [],
//         multiplier: '1',
//         profit: 0n,
//         friends: 0,
//         servers: 0,
//         channels: 0,
//         roles: 0,
//         perms: 0,
//         messages: 0,
//         invites: 0,
//         bots: 0,
//         hypesquads: 0,
//         nitro: 0,
//       })

//       const embeds = new Embeds(bot)
//         .setAuthor(getUserTag(interaction.user), interaction.user)
//         .setColor('random')
//         .setDescription(
//           [
//             translate(bot, interaction.guildId!, 'IDLE_CREATE_1'),
//             '',
//             translate(bot, interaction.guildId!, 'IDLE_CREATE_2'),
//             '',
//             translate(bot, interaction.guildId!, 'IDLE_CREATE_3'),
//             '',
//             translate(bot, interaction.guildId!, 'IDLE_CREATE_4'),
//             '',
//             translate(bot, interaction.guildId!, 'IDLE_GET_RICH'),
//           ].join('\n'),
//         )
//       const components = new Components().addButton(
//         toTitleCase(translate(bot, interaction.guildId!, 'IDLE_FRIENDS')),
//         'Primary',
//         'idlecreate',
//         { emoji: '👤' },
//       )

//       return await replyToInteraction(bot, interaction, { embeds, components })
//     }

//     if (args.delete) {
//       await db.idle.delete(interaction.user.id)
//       return await replyToInteraction(bot, interaction, translate(bot, interaction.guildId!, 'IDLE_DELETE_SUCCESS'))
//     }

//     if (args.leaderboard) {
//       const usersProfile = await db.idle.get(interaction.user.id)
//       if (!usersProfile)
//         return await privateReplyToInteraction(
//           bot,
//           interaction,
//           translate(bot, interaction.guildId!, 'IDLE_LEADERBOARD_NEED_PROFILE'),
//         )

//       const leaders = (await db.idle.leaders()) || []

//       const texts = [
//         `**${usersProfile.currency.toLocaleString('en-US')}** 💵 \`${shortNumber(usersProfile.profit)}/s\` 💵`,
//         '',
//       ]

//       for (const [index, profile] of leaders.entries()) {
//         texts.push(
//           `${index + 1}. ${profile.username.padEnd(20, ' ')} **${shortNumber(profile.currency)}**💵  \`${shortNumber(
//             profile.profit,
//           )}/s\` 💵`,
//         )
//       }

//       const embeds = new Embeds(bot)
//         .setAuthor(getUserTag(interaction.user), interaction.user)
//         .setDescription(texts.join('\n'))
//         .setColor('random')

//       return await replyToInteraction(bot, interaction, { embeds })
//     }

//     if (args.profile) {
//       const profile = await db.idle.get(args.profile.user?.user.id || interaction.user.id)
//       if (!profile)
//         return await privateReplyToInteraction(
//           bot,
//           interaction,
//           translate(bot, interaction.guildId!, 'IDLE_PROFILE_MISSING'),
//         )

//       const embeds = new Embeds(bot)
//         .setColor('random')
//         .setAuthor(getUserTag(args.profile.user?.user || interaction.user), args.profile.user?.user || interaction.user)
//         .setDescription(
//           [`**${profile.currency.toLocaleString('en-US')}** 💵`, shortNumber(profile.currency)].join('\n'),
//         )
//         .addField(
//           'Friends',
//           [
//             translate(bot, interaction.guildId!, 'CURRENT_LEVEL', profile.friends.toLocaleString('en-US')),
//             translate(
//               bot,
//               interaction.guildId!,
//               'CURRENT_MULTIPLIER',
//               idleCalculateMultiplier(profile.friends).toString(),
//             ),
//           ].join('\n'),
//           true,
//         )

//       const items = [
//         { item: profile.friends, next: 'Servers', upcoming: profile.servers },
//         { item: profile.servers, next: 'Channels', upcoming: profile.channels },
//         { item: profile.channels, next: 'Roles', upcoming: profile.roles },
//         { item: profile.roles, next: 'Perms', upcoming: profile.perms },
//         { item: profile.perms, next: 'Messages', upcoming: profile.messages },
//         { item: profile.messages, next: 'Invites', upcoming: profile.invites },
//         { item: profile.invites, next: 'Bots', upcoming: profile.bots },
//         { item: profile.bots, next: 'Hypesquads', upcoming: profile.hypesquads },
//         { item: profile.hypesquads, next: 'Nitro', upcoming: profile.nitro },
//       ]

//       for (const item of items) {
//         embeds.addField(
//           `${item.item >= 25 ? item.next : '🔒'}`,
//           [
//             `${translate(bot, interaction.guildId!, 'CURRENT_LEVEL', item.upcoming.toLocaleString('en-US'))}`,
//             item.item >= 25
//               ? `${translate(
//                   bot,
//                   interaction.guildId!,
//                   'CURRENT_MULTIPLIER',
//                   idleCalculateMultiplier(item.upcoming).toString(),
//                 )}`
//               : '',
//           ]
//             .join('\n')
//             .trim(),
//           true,
//         )
//       }

//       embeds
//         .addField('Gamer Server Multiplier', (profile.guildIds.length > 200 ? 200 : profile.guildIds.length).toString())
//         .addField(
//           'Isekai Server Multiplier',
//           (profile.isekaiGuildIds.length > 200 ? 200 : profile.isekaiGuildIds.length).toString(),
//         )

//       return await replyToInteraction(bot, interaction, { embeds })
//     }

//     if (args.upgrade) {
//       if (!interaction.guildId) return

//       const profile = await db.idle.get(interaction.user.id)
//       if (!profile) {
//         return await privateReplyToInteraction(bot, interaction, translate(bot, interaction.guildId!, 'IDLE_NEED_CASH'))
//       }

//       const vip = await db.vips.check({ userId: interaction.user.id, guildId: interaction.guildId })

//       if (!args.upgrade.item) args.upgrade.item = 'friends'
//       // If no multipler is provided use the
//       if (profile.multiplier === 'max') args.upgrade.max = true
//       if (!args.upgrade.amount) args.upgrade.amount = parseInt(profile.multiplier) || 1

//       // These checks prevent a user from upgrading things too quickly out of order
//       if (args.upgrade.item === 'servers' && profile.friends < 25) {
//         return await privateReplyToInteraction(
//           bot,
//           interaction,
//           translate(bot, interaction.guildId!, 'IDLE_UPGRADE_MISSING_REQUIRED_LEVELS'),
//         )
//       }

//       if (args.upgrade.item === 'channels' && profile.servers < 25) {
//         return await privateReplyToInteraction(
//           bot,
//           interaction,
//           translate(bot, interaction.guildId!, 'IDLE_UPGRADE_MISSING_REQUIRED_LEVELS'),
//         )
//       }

//       if (args.upgrade.item === 'roles' && profile.channels < 25) {
//         return await privateReplyToInteraction(
//           bot,
//           interaction,
//           translate(bot, interaction.guildId!, 'IDLE_UPGRADE_MISSING_REQUIRED_LEVELS'),
//         )
//       }

//       if (args.upgrade.item === 'perms' && profile.roles < 25) {
//         return await privateReplyToInteraction(
//           bot,
//           interaction,
//           translate(bot, interaction.guildId!, 'IDLE_UPGRADE_MISSING_REQUIRED_LEVELS'),
//         )
//       }

//       if (args.upgrade.item === 'messages' && profile.perms < 25) {
//         return await privateReplyToInteraction(
//           bot,
//           interaction,
//           translate(bot, interaction.guildId!, 'IDLE_UPGRADE_MISSING_REQUIRED_LEVELS'),
//         )
//       }

//       if (args.upgrade.item === 'invites' && profile.messages < 25) {
//         return await privateReplyToInteraction(
//           bot,
//           interaction,
//           translate(bot, interaction.guildId!, 'IDLE_UPGRADE_MISSING_REQUIRED_LEVELS'),
//         )
//       }

//       if (args.upgrade.item === 'bots' && profile.invites < 25) {
//         return await privateReplyToInteraction(
//           bot,
//           interaction,
//           translate(bot, interaction.guildId!, 'IDLE_UPGRADE_MISSING_REQUIRED_LEVELS'),
//         )
//       }

//       if (args.upgrade.item === 'hypesquads' && profile.bots < 25) {
//         return await privateReplyToInteraction(
//           bot,
//           interaction,
//           translate(bot, interaction.guildId!, 'IDLE_UPGRADE_MISSING_REQUIRED_LEVELS'),
//         )
//       }

//       if (args.upgrade.item === 'nitro' && profile.hypesquads < 25) {
//         return await privateReplyToInteraction(
//           bot,
//           interaction,
//           translate(bot, interaction.guildId!, 'IDLE_UPGRADE_MISSING_REQUIRED_LEVELS'),
//         )
//       }

//       // First we update this users currency since the last time they were active
//       const results = await idleProcess(profile)
//       profile.currency = profile.currency + results.currency
//       profile.lastUpdatedAt = Date.now()
//       if (!profile.guildIds.includes(interaction.guildId)) {
//         profile.guildIds.push(interaction.guildId)
//       }

//       let amount = args.upgrade.amount || 1
//       // Prevent abuse of someone causing millions of loops
//       if (amount > 10) amount = 10

//       let totalCost = 0n
//       let title = ''
//       let finalLevel = 0

//       const itemData = IDLE_ITEMS[args.upgrade.item as keyof typeof IDLE_ITEMS]
//       const itemName = args.upgrade.item as keyof typeof IDLE_ITEMS
//       const ITEM_NAME = itemName.toUpperCase()

//       const embeds = new Embeds(bot).setColor('random')

//       if (args.upgrade.max && vip) {
//         let count = 1

//         while (true) {
//           // Check the cost of this item
//           const cost = BigInt(Math.floor(idleCalculateUpgradeCost(itemData.baseCost, profile[itemName] + count)))
//           profile[itemName] = Number(profile[itemName]) + 1

//           const upgrade = itemData.upgrades.get(profile[itemName])
//           let response = ''

//           for (const lvl of EPIC_UPGRADE_LEVELS) {
//             // TRANSLATE THE TITLE
//             if (lvl < profile[itemName]) {
//               // @ts-ignore too many keys to not do dynamically
//               title = translate(bot, interaction.guildId!, `${ITEM_NAME}_${lvl}_TITLE`)
//             }

//             // TRANSLATE THE RESPONSE IF NONE EXISTS
//             if (!response && lvl === profile[itemName]) {
//               const key = `${ITEM_NAME}_${lvl}_NOTE` as translationKeys
//               const txt = translate(bot, interaction.guildId!, key) || key

//               response = epicUpgradeResponse(`UPGRADING_${ITEM_NAME}`, key === `${txt}` ? undefined : key)
//                 .split('\n')
//                 // @ts-ignore too many keys to not do dynamically
//                 .map((t) => (t ? translate(bot, interaction.guildId!, t) : ''))
//                 .join('\n')
//             }
//           }

//           // Check if the user can't afford this.
//           if (cost > profile.currency) {
//             const timeUntilCanAfford = Number(
//               idleCalculateMillisecondsTillBuyable(
//                 profile.currency,
//                 cost,
//                 idleCalculateTotalProfit(profile),
//               ).toString(),
//             )

//             if (!args.upgrade.max || count === 1) {
//               await privateReplyToInteraction(
//                 bot,
//                 interaction,
//                 translate(
//                   bot,
//                   interaction.guildId,
//                   'IDLE_MORE_CASH',
//                   shortNumber(cost),
//                   shortNumber(profile.currency),
//                   humanizeMilliseconds(timeUntilCanAfford),
//                 ),
//               ).catch(logger.error)
//             }

//             // User can't afford anymore so break the loop
//             break
//           }

//           finalLevel = profile[itemName] || 0
//           totalCost += cost
//           // The user can afford this so we need to make the purchase for the user
//           profile.currency = profile.currency - cost

//           // If this level has a story message response, we should send it now
//           if (response) {
//             embeds
//               .setAuthor(getUserTag(interaction.user), interaction.user)
//               .setDescription(response)
//               .setImage(upgrade?.meme!)

//             if (idleIsEpicUpgrade(finalLevel) && title) {
//               embeds.setFooter(title)
//             }

//             // await replyToInteraction(bot, interaction, { embeds })

//             // Break if theres a response to allow the user to read the story
//             break
//           }

//           count++
//         }
//       } else {
//         for (let i = 1; i <= amount; i++) {
//           // Check the cost of this item

//           const cost = BigInt(Math.floor(idleCalculateUpgradeCost(itemData.baseCost, profile[itemName] + i)))

//           profile[itemName] = Number(profile[itemName]) + 1

//           const upgrade = itemData.upgrades.get(profile[itemName])
//           let response = ''

//           for (const lvl of EPIC_UPGRADE_LEVELS) {
//             // TRANSLATE THE TITLE
//             if (lvl < profile[itemName]) {
//               // @ts-ignore too many keys to not do dynamically
//               title = translate(bot, interaction.guildId!, `${ITEM_NAME}_${lvl}_TITLE`)
//             }

//             // TRANSLATE THE RESPONSE IF NONE EXISTS
//             if (!response && lvl === profile[itemName]) {
//               const key = `${ITEM_NAME}_${lvl}_NOTE` as translationKeys
//               const txt = translate(bot, interaction.guildId!, key) || key
//               response = epicUpgradeResponse(`UPGRADING_${ITEM_NAME}`, key === `${txt}` ? undefined : key)
//                 .split('\n')
//                 // @ts-ignore too many keys to not do dynamically
//                 .map((t) => (t ? translate(bot, interaction.guildId!, t) : ''))
//                 .join('\n')
//             }
//           }

//           // Check if the user can't afford this.
//           if (cost > profile.currency) {
//             const timeUntilCanAfford = Number(
//               idleCalculateMillisecondsTillBuyable(
//                 profile.currency,
//                 cost,
//                 idleCalculateTotalProfit(profile),
//               ).toString(),
//             )

//             if (!args.upgrade.max && i === 1) {
//               await privateReplyToInteraction(
//                 bot,
//                 interaction,
//                 translate(
//                   bot,
//                   interaction.guildId,
//                   'IDLE_MORE_CASH',
//                   shortNumber(cost),
//                   shortNumber(profile.currency),
//                   humanizeMilliseconds(timeUntilCanAfford),
//                 ),
//               ).catch(logger.error)
//             }

//             // User can't afford anymore so break the loop
//             break
//           }

//           finalLevel = profile[itemName]
//           totalCost += cost
//           // The user can afford this so we need to make the purchase for the user
//           profile.currency = profile.currency - cost

//           // If this level has a story message response, we should send it now
//           if (response) {
//             embeds
//               .setAuthor(getUserTag(interaction.user), interaction.user)
//               .setDescription(response)
//               .setImage(upgrade?.meme!)

//             if (idleIsEpicUpgrade(finalLevel) && title) {
//               embeds.setFooter(title)
//             }

//             // await replyToInteraction(bot, interaction, { embeds })

//             // Break if a response too allow users to read the story
//             break
//           }
//         }
//       }

//       // If there was no level changes we quitely error out. The response will have been sent above
//       if (!finalLevel) return

//       // .idle max shows 1 less
//       if (args.upgrade.max && vip && !idleIsEpicUpgrade(finalLevel)) finalLevel++

//       // Update username for this user
//       profile.username = getUserTag(interaction.user)
//       // Update the profit for this user
//       profile.profit = idleCalculateTotalProfit(profile)
//       // this can't be updated
//       const { lastUpdatedAt, ...rest } = profile
//       // Now that all upgrades have completed, we can save the profile
//       await db.idle.update(rest)

//       if (embeds.length > 1) embeds.addEmbed().setColor('random')

//       embeds
//         .setAuthor(getUserTag(interaction.user), interaction.user)
//         .setDescription(
//           [
//             translate(
//               bot,
//               interaction.guildId!,
//               'IDLE_UPGRADED_1',
//               args.upgrade.item,
//               finalLevel,
//               shortNumber(totalCost),
//             ),
//             translate(bot, interaction.guildId!, 'IDLE_UPGRADED_2', shortNumber(profile.currency)),
//             translate(bot, interaction.guildId!, 'IDLE_UPGRADED_3', shortNumber(idleCalculateTotalProfit(profile))),
//           ].join('\n'),
//         )

//       if (title) embeds.setFooter(title)

//       const components = new Components()
//         .addButton(
//           toTitleCase(translate(bot, interaction.guildId!, 'IDLE_FRIENDS')),
//           args.upgrade.item === 'friends' ? 'Success' : 'Primary',
//           'idleupgrade-friends',
//           { emoji: '👤' },
//         )
//         .addButton(
//           toTitleCase(translate(bot, interaction.guildId!, 'IDLE_SERVERS')),
//           args.upgrade.item === 'servers' ? 'Success' : 'Primary',
//           'idleupgrade-servers',
//           { emoji: '⚙️' },
//         )
//         .addButton(
//           toTitleCase(translate(bot, interaction.guildId!, 'IDLE_CHANNELS')),
//           args.upgrade.item === 'channels' ? 'Success' : 'Primary',
//           'idleupgrade-channels',
//           { emoji: '#️⃣' },
//         )
//         .addButton(
//           toTitleCase(translate(bot, interaction.guildId!, 'IDLE_ROLES')),
//           args.upgrade.item === 'roles' ? 'Success' : 'Primary',
//           'idleupgrade-roles',
//           { emoji: '862115079762870303' },
//         )
//         .addButton(
//           toTitleCase(translate(bot, interaction.guildId!, 'IDLE_PERMS')),
//           args.upgrade.item === 'perms' ? 'Success' : 'Primary',
//           'idleupgrade-perms',
//           { emoji: '664865672559591439' },
//         )
//         .addButton(
//           toTitleCase(translate(bot, interaction.guildId!, 'IDLE_MESSAGES')),
//           args.upgrade.item === 'messages' ? 'Success' : 'Primary',
//           'idleupgrade-messages',
//           { emoji: '🗨️' },
//         )
//         .addButton(
//           toTitleCase(translate(bot, interaction.guildId!, 'IDLE_INVITES')),
//           args.upgrade.item === 'invites' ? 'Success' : 'Primary',
//           'idleupgrade-invites',
//           { emoji: '🔗' },
//         )
//         .addButton(
//           toTitleCase(translate(bot, interaction.guildId!, 'IDLE_BOTS')),
//           args.upgrade.item === 'bots' ? 'Success' : 'Primary',
//           'idleupgrade-bots',
//           { emoji: '817036872014233641' },
//         )
//         .addButton(
//           toTitleCase(translate(bot, interaction.guildId!, 'IDLE_HYPESQUADS')),
//           args.upgrade.item === 'hypesquads' ? 'Success' : 'Primary',
//           'idleupgrade-hypesquads',
//           { emoji: '823884549951193159' },
//         )
//         .addButton(
//           toTitleCase(translate(bot, interaction.guildId!, 'IDLE_NITRO')),
//           args.upgrade.item === 'nitro' ? 'Success' : 'Primary',
//           'idleupgrade-nitro',
//           { emoji: '854900463782199296' },
//         )
//         .addButton(toTitleCase(translate(bot, interaction.guildId!, 'IDLE_PROFILE_NAME')), 'Secondary', 'idleprofile', {
//           emoji: '🖼️',
//         })
//         .addButton(
//           toTitleCase(translate(bot, interaction.guildId!, 'IDLE_LEADERBOARD_NAME')),
//           'Secondary',
//           'idleleaderboard',
//           {
//             emoji: '📊',
//           },
//         )
//         .addButton(toTitleCase(translate(bot, interaction.guildId!, 'INVITE_NEED_SUPPORT')), 'Secondary', 'idlehelp', {
//           emoji: '❓',
//         })
//         // .addButton(
//         //   translate(bot, interaction.guildId!, 'IDLE_NITRO_DETAILS'),
//         //   'Link',
//         //   'https://discord.com/channels/223909216866402304/799352068850319410/799352144129687553',
//         //   { emoji: '699723824513548313' },
//         // )
//         .addActionRow()
//         .addButton('x1', 'Secondary', 'idlemultiplier-1', {
//           emoji: '1️⃣',
//         })
//         .addButton('x5', 'Secondary', 'idlemultiplier-5', {
//           emoji: '5️⃣',
//         })
//         .addButton('x10', 'Secondary', 'idlemultiplier-10', {
//           emoji: '🔟',
//         })
//         .addButton(translate(bot, interaction.guildId!, 'IDLE_MAX'), 'Secondary', 'idlemultiplier-max', {
//           emoji: '⭐',
//         })

//       return await replyToInteraction(bot, interaction, { embeds, components })
//     }
//   },
// })

// export default command

// /** This function will be processing the amount of currency users have everytime they use a command to view their currency i imagine */
// export async function idleProcess(profile) {
//   const vip = await db.vips.get(profile.userId)

//   const now = Date.now()
//   const secondsSinceLastUpdate = (now - profile.lastUpdatedAt) / 1000
//   const secondsAllowedOffline = (Milliseconds.Hour * (vip ? 8 : 2)) / 1000
//   const seconds = secondsSinceLastUpdate > secondsAllowedOffline ? secondsAllowedOffline : secondsSinceLastUpdate

//   return {
//     currency: idleCalculateTotalProfit(profile) * BigInt(Math.floor(seconds)),
//     lastUpdatedAt: now,
//   }
// }

// export function idleCalculateTotalProfit(profile) {
//   const multiplier =
//     (profile.guildIds.length > 200 ? 200 : profile.guildIds.length) +
//       (profile.isekaiGuildIds.length > 200 ? 200 : profile.isekaiGuildIds.length) || 1

//   return IDLE_ITEM_NAMES.reduce(
//     (a, b) => a + BigInt(idleCalculateProfit(profile[b], IDLE_ITEMS[b].baseProfit, multiplier)),
//     0n,
//   )
// }

// export function idleCalculateProfit(level: number, baseProfit = 1, prestige = 1) {
//   const multiplier = idleCalculateMultiplier(level)
//   return level * baseProfit * multiplier * prestige
// }

// export function idleCalculateMultiplier(level: number) {
//   let multiplier = 1
//   if (level >= 25) multiplier *= 2
//   if (level >= 50) multiplier *= 3
//   if (level >= 75) multiplier *= 4
//   if (level >= 100) multiplier *= 5
//   if (level >= 150) multiplier *= 4
//   if (level >= 200) multiplier *= 5
//   if (level >= 300) multiplier *= 6
//   if (level >= 400) multiplier *= 8
//   if (level >= 500) multiplier *= 10
//   if (level >= 600) multiplier *= 20
//   if (level >= 700) multiplier *= 30
//   if (level >= 800) multiplier *= 50
//   if (level >= 900) multiplier *= 200
//   if (level >= 1000) multiplier *= 300
//   if (level >= 1250) multiplier *= 1250
//   if (level >= 1500) multiplier *= 3800
//   if (level >= 2000) multiplier *= 150000

//   return multiplier
// }

// export function idleCalculateUpgradeCost(baseCost: number, level: number) {
//   return baseCost * Math.pow(1.07, level)
// }

/** Takes the current user currency, the cost of the item, and how much currency the user is gaining per second and converts it to milliseconds until this item can be bought. */
export function idleCalculateMillisecondsTillBuyable(currency: bigint, cost: bigint, perSecond: bigint) {
    return ((BigInt(cost) - BigInt(currency)) / BigInt(perSecond)) * BigInt(1000);
}

// export function idleIsEpicUpgrade(level: number) {
//   return EPIC_UPGRADE_LEVELS.includes(level)
// }
