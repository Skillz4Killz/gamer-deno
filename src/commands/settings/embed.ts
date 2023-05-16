import { Components } from "../../base/Components.js";
import Embeds from "../../base/Embeds.js";
import GamerChannel from "../../base/GamerChannel.js";
import { Command, PermissionLevels } from "../../base/typings.js";
import { fetchMessage } from "../../utils/platforms/messages.js";
import { validateSnowflake } from "../../utils/snowflakes.js";

const command: Command = {
    name: "embed",
    aliases: [],
    requiredPermissionLevel: PermissionLevels.Admin,
    arguments: [
        {
            required: false,
            name: "create",
            type: "subcommand",
            arguments: [
                {
                    required: true,
                    name: "code",
                    type: "string",
                },
            ],
        },
        {
            required: false,
            name: "show",
            type: "subcommand",
            arguments: [
                {
                    required: true,
                    name: "channel",
                    type: "channel",
                },
                {
                    required: true,
                    name: "message",
                    type: "string",
                },
            ],
        },
        {
            required: false,
            name: "edit",
            type: "subcommand",
            arguments: [
                {
                    required: true,
                    name: "channel",
                    type: "channel",
                },
                {
                    required: true,
                    name: "message",
                    type: "string",
                },
            ],
        },
    ],
    execute: async function (message, args: SettingsEmbedArgs) {
        if (!message.guildId || !message.channelId) return;

        const embeds = new Embeds();

        if (args.create) {
            try {
                const json = JSON.parse(args.create.code);
                embeds.setFromJson(json);

                const components = new Components()
                    .addButton(message.translate("EMBED_SENT_BY", message.tag), "Secondary", "buttonSentBy", {
                        disabled: true,
                    })
                    .addButton(message.translate("EMBED_BUTTON_SET_AUTHOR"), "Primary", "embedButton-Author")
                    .addButton(message.translate("EMBED_BUTTON_SET_TITLE"), "Primary", "embedButton-Title")
                    .addButton(message.translate("EMBED_BUTTON_SET_URL"), "Primary", "embedButton-URL")
                    .addButton(message.translate("EMBED_BUTTON_SET_THUMBNAIL"), "Primary", "embedButton-Thumbnail")
                    .addButton(message.translate("EMBED_BUTTON_SET_DESCRIPTION"), "Primary", "embedButton-Description")
                    .addButton(message.translate("EMBED_BUTTON_SET_IMAGE"), "Primary", "embedButton-Image")
                    .addButton(message.translate("EMBED_BUTTON_SET_COLOR"), "Primary", "embedButton-Color")
                    .addButton(message.translate("EMBED_BUTTON_SET_FIELD"), "Primary", "embedButton-Field")
                    .addButton(message.translate("EMBED_BUTTON_SET_FOOTER"), "Primary", "embedButton-Footer")
                    .addButton(message.translate("EMBED_BUTTON_SET_CONTENT"), "Primary", "embedButton-Content")
                    .addButton(message.translate("EMBED_SAVE"), "Success", "embedButton-Save", {
                        emoji: "✅",
                    });
                return await message.reply({ content: json.plainText, embeds, components });
            } catch (error) {
                console.log(error);
                return await message.reply(message.translate("INVALID_EMBED_JSON_CODE"), { addReplay: false, private: true });
            }
        }

        if (args.edit) {
            try {
                if (!validateSnowflake(args.edit.message))
                    return await message.reply(message.translate("ROLES_REACTIONS_ADD_INVALID_MESSAGE"), { addReplay: false, private: true });

                const msg = await fetchMessage(args.edit.channel.id, args.edit.message, { platform: message.platform });
                if (!msg) return await message.reply(message.translate("ROLES_REACTIONS_ADD_MESSAGE_UNKNOWN"), { addReplay: false, private: true });
                if (!msg.isFromMe)
                    return await message.reply(message.translate("ROLES_REACTIONS_ADD_MESSAGE_USER"), { addReplay: false, private: true });

                embeds.setFromEmbed(msg.embeds[0]!);

                const components = new Components()
                    .addButton(message.translate("EMBED_SENT_BY", message.tag), "Secondary", "buttonSentBy", {
                        disabled: true,
                    })
                    .addButton(message.translate("EMBED_BUTTON_SET_AUTHOR"), "Primary", "embedButton-Author")
                    .addButton(message.translate("EMBED_BUTTON_SET_TITLE"), "Primary", "embedButton-Title")
                    .addButton(message.translate("EMBED_BUTTON_SET_URL"), "Primary", "embedButton-URL")
                    .addButton(message.translate("EMBED_BUTTON_SET_THUMBNAIL"), "Primary", "embedButton-Thumbnail")
                    .addButton(message.translate("EMBED_BUTTON_SET_DESCRIPTION"), "Primary", "embedButton-Description")
                    .addButton(message.translate("EMBED_BUTTON_SET_IMAGE"), "Primary", "embedButton-Image")
                    .addButton(message.translate("EMBED_BUTTON_SET_COLOR"), "Primary", "embedButton-Color")
                    .addButton(message.translate("EMBED_BUTTON_SET_FIELD"), "Primary", "embedButton-Field")
                    .addButton(message.translate("EMBED_BUTTON_SET_FOOTER"), "Primary", "embedButton-Footer")
                    .addButton(message.translate("EMBED_BUTTON_SET_CONTENT"), "Primary", "embedButton-Content")
                    .addButton(message.translate("EMBED_SAVE"), "Success", "embedButton-Save", {
                        emoji: "✅",
                    });
                await msg.edit({
                    content: msg.content,
                    embeds,
                    components,
                });

                return await message.reply(message.translate("EMBED_EDIT_STARTED"), { addReplay: false, private: true });
            } catch (error) {
                console.log(error);
                return await message.reply(message.translate("INVALID_EMBED_JSON_CODE"), { addReplay: false, private: true });
            }
        }

        if (args.show) {
            if (!validateSnowflake(args.show.message))
                return await message.reply(message.translate("ROLES_REACTIONS_ADD_INVALID_MESSAGE"), { addReplay: false, private: true });

            const msg = await fetchMessage(args.show.channel.id, args.show.message, { platform: message.platform });
            if (!msg) return await message.reply(message.translate("ROLES_REACTIONS_ADD_MESSAGE_UNKNOWN"), { addReplay: false, private: true });
            if (!msg.embeds.length) return await message.reply(message.translate("EMBED_SHOW_NO_EMBEDS"), { addReplay: false, private: true });

            const embeds = new Embeds().setFromEmbed(msg.embeds[0]!);
            return await message.reply(
                {
                    embeds: new Embeds().setColor("RANDOM").setDescription(["```json", JSON.stringify(embeds.showEmbedCode()), "```"].join("\n")),
                    components: new Components().addButton(message.translate("EMBED_SENT_BY", message.tag), "Secondary", "buttonSentBy", {
                        disabled: true,
                    }),
                },
                { addReplay: false },
            );
        }

        return await message.reply("tada u broke the bot");
    },
};

export default command;

interface SettingsEmbedArgs {
    create?: {
        code: string;
    };
    show?: {
        channel: GamerChannel;
        message: string;
    };
    edit?: {
        channel: GamerChannel;
        message: string;
    };
}
