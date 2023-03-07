import { avatarUrl } from "@discordeno/bot";
import Embeds from "../../base/Embeds.js";
import { GamerMessage } from "../../base/GamerMessage.js";
import { Command } from "../../base/typings.js";

export const avatar: Command = {
    name: "avatar",
    aliases: ["pfp"],
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

        const embeds = new Embeds()
            .setAuthor(message.tag, message.avatarURL)
            .setDescription(`[${message.translate("AVATAR_DOWNLOAD_LINK")}](${url})`)
            .setImage(url);

        return await message.reply({ content: "", embeds });
    },
};

export default avatar;
