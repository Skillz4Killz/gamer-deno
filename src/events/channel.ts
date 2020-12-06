import { getAuditLogs } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/next/src/handlers/guild.ts";
import { botCache, guildIconURL, cache } from "../../deps.ts";
import { db } from "../database/database.ts";
import { Embed } from "../utils/Embed.ts";
import { sendEmbed } from "../utils/helpers.ts";
import { translate } from "../utils/i18next.ts";

botCache.eventHandlers.channelCreate = async function (channel) {
    const logs = botCache.recentLogs.get(channel.guildID) || await db.serverlogs.get(channel.guildID);
    console.log(logs);
    
    // LOGS ARE DISABLED
    if (!logs?.channelCreateChannelID) return;

    const guild = cache.guilds.get(channel.guildID);
    const texts = [
        translate(channel.guildID, "strings:LOGS_CHANNEL_CREATED", { mention: `<#${channel.id}>`, name: channel.name }),
        translate(channel.guildID, "strings:CHANNEL_ID", { id: channel.id }),
        translate(channel.guildID, "strings:TOTAL_CHANNELS", { amount: botCache.helpers.cleanNumber(cache.channels.filter(c => c.guildID === channel.guildID).size) }),
        translate(channel.guildID, "strings:TYPE", { type: translate(channel.guildID, `strings:CHANNEL_TYPE_${channel.type}`) }), 
    ];

    const category = channel.parentID ? cache.channels.get(channel.parentID)?.name : ""
    if (category) texts.push(translate(channel.guildID, "strings:CATEGORY", { category }))

    if (channel.position) texts.push(translate(channel.guildID, "strings:LOGS_POSITION", { position: channel.position.toString() }))

    const embed = new Embed()
        .setDescription(texts.join('\n'))
        .setThumbnail(`https://i.imgur.com/Ya0SXdI.png`)
        .setTimestamp()
        .setFooter(channel.name || channel.id, guild ? guildIconURL(guild) : undefined);

    // NO VIP SO ONLY BASIC LOGS ARE SENT
    if (botCache.vipGuildIDs.has(channel.guildID)) return sendEmbed(logs?.channelCreateChannelID, embed);

    // VIP GET EXTRA FEATURES
    const auditlogs = await getAuditLogs(channel.guildID, {
        action_type: "CHANNEL_CREATE",
    }).catch(console.error);

    console.log(auditlogs);
    // const relevant = auditlogs.find(log => log.)
}