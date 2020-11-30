import { Command } from 'yuuko'
import GamerClient from '../../lib/structures/GamerClient'
import { GamerSubscriptionType } from '../../database/schemas/subscription'
import { needMessage, sendMessage } from '../../lib/utils/eris'
import { fetchLatestRedditPosts } from '../../lib/utils/reddit'
import { MessageEmbed } from 'helperis'
import constants from '../../constants'

export default new Command(`reddit`, async (message, args, context) => {
    if (!message.member) return

    const Gamer = context.client as GamerClient
    const guildSettings = await Gamer.database.models.guild.findOne({ guildID: message.member.guild.id })

    // If the user is not an admin/mod cancel out
    if (!Gamer.helpers.discord.isModOrAdmin(message, guildSettings)) return

    const helpCommand = Gamer.commandForName('help')
    const [type, ...fullUsername] = args
    if (!type) return helpCommand?.execute(message, [`reddit`], { ...context, commandName: 'help' })
    const username = fullUsername.join(' ')

    const language = Gamer.getLanguage(message.guildID)

    if (type && type.toLowerCase() === `list`) {
        const redditSubs = await Gamer.database.models.subscription.find({ type: GamerSubscriptionType.REDDIT })

        let response = ``
        for (const sub of redditSubs) {
            if (response.length === 2000) break
            const listener = sub.subs.find(s => s.guildID === message.guildID)
            if (!listener) continue

            const text = `${sub.username} <#${listener.channelID}>\n`
            if (response.length + text.length > 2000) break
            response += text
        }

        if (!response.length) return message.channel.createMessage(language(`utility/reddit:NONE`))
        return Gamer.helpers.discord.embedResponse(message, response)
    }

    if (!username) return helpCommand?.execute(message, [`reddit`], { ...context, commandName: 'help' })

    // Fetch this username from subscriptions specifically for reddit
    const userSubscription = await Gamer.database.models.subscription.findOne({
        username,
        type: GamerSubscriptionType.REDDIT
    })

    if (type.toLowerCase() === 'subscribe')
        message.channel.createMessage(language('utility/reddit:WANT_GAME', { mention: message.author.mention }))

    const gameMessage = type.toLowerCase() === 'subscribe' ? await needMessage(message) : undefined

    const subPayload = {
        game: gameMessage && gameMessage.content.toLowerCase() !== 'skip' ? gameMessage.content.toLowerCase() : undefined,
        guildID: message.member.guild.id,
        channelID: message.channel.id,
        text: '',
        latestLink: ''
    }

    switch (type.toLowerCase()) {
        case `subscribe`:
            const validReactions = [constants.emojis.voteup, constants.emojis.votedown]
                .map(reaction => Gamer.helpers.discord.convertEmoji(reaction, `reaction`)!)
                .filter(reaction => reaction)
            // If it does not exist create a new subscription for the user
            if (!userSubscription) {
                message.channel.createMessage(language('utility/reddit:CUSTOM_MESSAGE', { mention: message.author.mention }))
                const customMessage = await needMessage(message)
                subPayload.text = customMessage.content

                const posts = await fetchLatestRedditPosts(username)

                if (posts.length) {
                    message.channel.createMessage(`I have subscribed to this user, and now posting there most recent videos:`)
                    for (const post of posts.reverse()) {
                        if (!post.link) continue

                        subPayload.latestLink = post.link
                        // If there is a filter and the title does not have the filter
                        if (
                            subPayload.game &&
                            post.title &&
                            !post.title.toLowerCase().includes(subPayload.game) &&
                            !post.content.toLowerCase().includes(subPayload.game)
                        )
                            continue

                        const embed = new MessageEmbed()
                            .setTitle(post.title || 'Unknown Title', post.link)
                            .addField(language('utility/reddit:POST_AUTHOR'), post.author)
                            .setAuthor(language('utility/reddit:NEW_POST', { name: username }), 'https://i.imgur.com/6UiQy32.jpg')
                        if (post.imageURL) embed.setImage(post.imageURL)
                        else embed.setDescription(post.content)

                        if (post.date) embed.setTimestamp(Date.parse(post.date))

                        sendMessage(message.channel.id, { embed: embed.code }).then(
                            message => message && validReactions.forEach(reaction => message.addReaction(reaction))
                        )
                    }
                }

                const payload = {
                    username,
                    type: GamerSubscriptionType.REDDIT,
                    subs: [subPayload]
                }
                const subscription = new Gamer.database.models.subscription(payload)
                subscription.save()

                return message.channel.createMessage(
                    language(`utility/reddit:SUBSCRIBED`, { username, channel: message.channel.mention })
                )
            }
            // The user already has a subscription created for reddit we only need to add a sub to it
            const subscription = userSubscription.subs.find(sub => sub.channelID === message.channel.id)
            if (subscription) return message.channel.createMessage(language(`utility/reddit:ALREADY_SUBBED`, { username }))

            message.channel.createMessage(language('utility/reddit:CUSTOM_MESSAGE', { mention: message.author.mention }))
            const customMessage = await needMessage(message)
            subPayload.text = customMessage.content

            const posts = await fetchLatestRedditPosts(username)

            if (posts.length) {
                message.channel.createMessage(`I have subscribed to this user, and now posting their most recent videos:`)
                for (const post of posts.reverse()) {
                    if (!post.link) continue
                    subPayload.latestLink = post.link

                    // If there is a filter and the title does not have the filter
                    if (
                        subPayload.game &&
                        post.title &&
                        !post.title.toLowerCase().includes(subPayload.game) &&
                        !post.content.toLowerCase().includes(subPayload.game)
                    )
                        continue

                    const embed = new MessageEmbed()
                        .setTitle(post.title || 'Unknown Title', post.link)
                        .addField(language('utility/reddit:POST_AUTHOR'), post.author)
                        .setAuthor(language('utility/reddit:NEW_POST', { name: username }), 'https://i.imgur.com/6UiQy32.jpg')
                    if (post.imageURL) embed.setImage(post.imageURL)
                    else embed.setDescription(post.content)

                    if (post.date) embed.setTimestamp(Date.parse(post.date))

                    sendMessage(message.channel.id, { embed: embed.code }).then(
                        message => message && validReactions.forEach(reaction => message.addReaction(reaction))
                    )
                }
            }

            userSubscription.subs.push(subPayload)
            userSubscription.save()
            return message.channel.createMessage(
                language(`utility/reddit:SUBSCRIBED`, { username, channel: message.channel.mention })
            )
        case `unsubscribe`:
            // If the user tries to remove a sub but this username has no existing subscriptions
            if (!userSubscription)
                return message.channel.createMessage(language(`utility/reddit:NOT_SUBSCRIBED`, { username }))

            // If the username does have a subscription BUT he wasnt subscribed to get alerts in this channel
            const relevantSubscription = userSubscription.subs.find(sub => sub.channelID === message.channel.id)
            if (!relevantSubscription)
                return message.channel.createMessage(language(`utility/reddit:NOT_SUBBED`, { username }))

            userSubscription.subs = userSubscription.subs.filter(sub => sub.channelID !== message.channel.id)
            userSubscription.save()

            return message.channel.createMessage(language(`utility/reddit:UNSUBBED`, { username }))
    }

    return helpCommand?.execute(message, [`reddit`], { ...context, commandName: 'help' })
})
