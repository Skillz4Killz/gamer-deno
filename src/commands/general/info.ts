import { avatarUrl, calculatePermissions } from "@discordeno/bot";
import Embeds from "../../base/Embeds.js";
import { GamerMessage } from "../../base/GamerMessage.js";
import { Command } from "../../base/typings.js";
import { Gamer } from "../../bot.js";
import { humanizeMilliseconds } from "../../utils/helpers.js";
import { snowflakeToTimestamp } from "../../utils/snowflakes.js";

export const info: Command = {
    name: "info",
    aliases: ["information"],
    arguments: [
        {
            name: "user",
            required: false,
            type: "user",
            missing() {},
        },
    ],
    async execute(message, args: { user?: GamerMessage["author"] }) {
        const targetUser = args.user ?? message.author;

        const url = message.isOnDiscord
            ? avatarUrl(targetUser.id, targetUser.discriminator, {
                  avatar: targetUser.avatar,
                  size: 2048,
              })
            : targetUser.avatar!;

        const embeds = new Embeds().setAuthor(message.tag, message.avatarURL).setThumbnail(url);

        const member =
            message.isFromVIP && message.guildId && message.isDiscordMessage(message.raw)
                ? await Gamer.discord.helpers.getMember(message.guildId, message.author.id)
                : undefined;

        const nickname =
            member?.nick ??
            (message.isDiscordMessage(message.raw)
                ? message.raw.member?.nick
                : message.isDiscordInteraction(message.raw)
                ? message.raw.member?.nick
                : message.raw.member?.nickname);

        if (nickname) embeds.addField(message.translate("INFO_NICKNAME"), nickname, true);
        embeds.addField(message.translate("INFO_USER_ID"), targetUser.id, true);

        embeds.addBlankField();

        const createdAt = message.isDiscordMessage(message.raw)
            ? new Date(snowflakeToTimestamp(message.author.id))
            : message.isDiscordInteraction(message.raw)
            ? new Date(snowflakeToTimestamp(message.author.id))
            : message.raw.author?.createdAt;

        if (createdAt)
            embeds.addField(
                message.translate("INFO_CREATED_ON"),
                [createdAt.toISOString().substring(0, 10), humanizeMilliseconds(Date.now() - createdAt.valueOf())].join("\n"),
                true,
            );

        const joinedAt = member?.joinedAt
            ? new Date(member.joinedAt)
            : message.isDiscordMessage(message.raw)
            ? message.raw.member?.joinedAt
                ? new Date(message.raw.member.joinedAt)
                : undefined
            : message.isDiscordInteraction(message.raw)
            ? message.raw.member?.joinedAt
                ? new Date(message.raw.member.joinedAt)
                : undefined
            : message.raw.member?.joinedAt;

        if (joinedAt)
            embeds.addField(
                message.translate("INFO_JOINED_ON"),
                [joinedAt.toISOString().substring(0, 10), humanizeMilliseconds(Date.now() - joinedAt.valueOf())].join("\n"),
                true,
            );

        const permissions =
            member?.permissions ??
            (message.isDiscordMessage(message.raw)
                ? message.raw.member?.permissions
                : message.isDiscordInteraction(message.raw)
                ? message.raw.member?.permissions
                : undefined);

        console.log(permissions);

        if (permissions) embeds.addField(message.translate("INFO_PERMISSIONS"), calculatePermissions(BigInt(permissions.bitfield)).join(", "));

        const roles = message.isDiscordMessage(message.raw)
            ? message.raw.member?.roles.map((role) => `<@&${role}>`)
            : message.isDiscordInteraction(message.raw)
            ? message.raw.member?.roles.map((role) => `<@&${role}>`)
            : message.raw.member?.roleIds;

        if (roles) embeds.addField(message.translate("INFO_ROLES"), roles.join(", "));

        return await message.reply({ content: "", embeds });
    },
};

export default info;
