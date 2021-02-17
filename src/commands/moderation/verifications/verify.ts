import {
  botCache,
  cache,
  calculatePermissions,
  createGuildChannel,
  deleteMessages,
  editChannel,
  getMessages,
  OverwriteType,
} from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { channelNameRegex } from "../../../helpers/mails.ts";
import { Embed } from "../../../utils/Embed.ts";
import { createCommand } from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";

createCommand({
  name: "verify",
  aliases: ["v"],
  guildOnly: true,
  arguments: [{ name: "subcommand", type: "subcommand", required: false }],
  execute: async function (message, _args, guild) {
    if (!guild) return;

    const settings = await db.guilds.get(message.guildID);
    if (!settings?.firstMessageJSON) {
      return botCache.helpers.reactError(message);
    }

    // Make a channels name from the users name and removes any invalid characters since discord doesnt support all characters in channel names.
    const channelName = `${message.author.username}#${message.author.discriminator}`
      .replace(channelNameRegex, ``)
      .toLowerCase();
    // Check if another channels with that name exists in the verify channels category
    const channelExists = cache.channels.find(
      (channel) =>
        channel.guildID === message.guildID &&
        channel.name === channelName.toLowerCase() &&
        channel.parentID === settings.verifyCategoryID
    );

    if (channelExists) {
      // If the channel exists send error
      if (channelExists.id === message.channelID) {
        return botCache.helpers.reactError(message);
      }

      // Send a message in the existing channel to let user know
      return channelExists.send(
        translate(message.guildID, `strings:VERIFY_USE_THIS`, {
          mention: `<@!${message.author.id}>`,
        })
      );
    }

    const category = cache.channels.get(settings.verifyCategoryID);
    if (!category) return botCache.helpers.reactError(message);

    if (cache.channels.filter((c) => c.parentID === category.id).size === 50) {
      return botCache.helpers.reactError(message);
    }

    const newChannel = await createGuildChannel(guild, channelName, {
      reason: translate(message.guildID, "strings:VERIFY_CHANNEL"),
      parent_id: category.id,
    });

    await db.guilds.update(message.guildID, {
      verifyChannelIDs: [...(settings.verifyChannelIDs || []), newChannel.id],
    });

    await editChannel(newChannel.id, {
      overwrites: [
        ...(newChannel.permissionOverwrites || []).map((o) => ({
          id: o.id,
          type: o.type,
          allow: calculatePermissions(BigInt(o.allow)),
          deny: calculatePermissions(BigInt(o.deny)),
        })),
        {
          id: message.author.id,
          allow: ["VIEW_CHANNEL"],
          deny: [],
          type: OverwriteType.MEMBER,
        },
      ],
    });

    const member = cache.members.get(message.author.id);
    if (!member) return;

    // Convert all the %variables%
    const transformed = await botCache.helpers.variables(settings.firstMessageJSON, member, guild, member);

    const embedCode = JSON.parse(transformed);
    // send a message to the new channel
    const embed = new Embed(embedCode);
    await newChannel.send({ embed, content: `<@!${message.author.id}>` }).catch(console.log);

    // Purge all messages in this channel
    const messages = await getMessages(message.channelID);
    if (!messages) return botCache.helpers.reactError(message);

    const sortedMessages = messages?.sort((a, b) => b.timestamp - a.timestamp).map((m) => m.id);
    // This would remove the oldest message(probably the first message in the channel)
    sortedMessages.pop();
    if (sortedMessages.length > 1) {
      await deleteMessages(message.channelID, sortedMessages).catch(console.log);
    } else await message.delete();
  },
});
