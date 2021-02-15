import { botCache, ChannelTypes, createGuildChannel, createGuildRole } from "../../../../../deps.ts";
import { db } from "../../../../database/database.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";
import { translate } from "../../../../utils/i18next.ts";

createSubcommand("settings-mails", {
  name: "setup",
  permissionLevels: [PermissionLevels.ADMIN],
  botServerPermissions: ["ADMINISTRATOR"],
  guildOnly: true,
  arguments: [{ name: "guild", type: "guild", required: false }] as const,
  execute: async (message, args, guild) => {
    if (!guild) return;

    // Need VIP for other guilds support.
    const isVIP = botCache.vipGuildIDs.has(message.guildID);
    if (args.guild && !isVIP) return botCache.helpers.reactError(message, true);

    const guildToUse = args.guild || guild;

    // Create the Mail Category
    const mailCategory = await createGuildChannel(
      guildToUse,
      translate(message.guildID, "strings:MAIL_CATEGORY_NAME"),
      { type: ChannelTypes.GUILD_CATEGORY }
    );

    const [logsChannel, ratingsChannel, alertRole] = await Promise.all([
      createGuildChannel(guildToUse, "mail-logs"),
      createGuildChannel(guildToUse, "ratings"),
      createGuildRole(guildToUse.id, { name: "mail-alert" }),
    ]);

    await db.guilds.update(message.guildID, {
      mailCategoryID: mailCategory.id,
      mailsLogChannelID: logsChannel.id,
      mailsRatingsChannelID: ratingsChannel.id,
      mailsEnabled: true,
      mailsRoleIDs: [alertRole.id],
      mailsGuildID: guildToUse.id,
      mailAutoResponse: isVIP ? translate(message.guildID, "strings:MAIL_DEFAULT_AUTO_RESPONSE") : "",
      mailQuestions: isVIP
        ? [
            {
              type: "message",
              name: "In-Game Name",
              subtype: "...string",
              text: "What is your in game name?",
            },
            {
              type: "message",
              name: "Player ID",
              subtype: "number",
              text: "What is your player ID?",
            },
            {
              type: "message",
              name: "Device",
              subtype: "...string",
              text: "What is the device that you play on?",
            },
            {
              type: "reaction",
              name: "Server",
              options: ["NA", "EU", "LATAM / SA", "SEA", "EA", "CN"],
              text: "What server is your account on?",
            },
            {
              type: "message",
              name: "Country",
              subtype: "...string",
              text: "Which country are you located in?",
            },
            {
              type: "message",
              name: "Message",
              subtype: "...string",
              text: "How can we help you?",
            },
          ]
        : [],
    });

    // Create a sample mail for the user
    // await botCache.commands.get("mail")?.execute?.(
    //   message,
    //   // @ts-ignore
    //   { content: translate(message.guildID, "strings:MAIL_EXAMPLE_MAIL") },
    //   guild,
    // );

    // During Full Setup command the message can be deleted.
    if (!message.content.startsWith("Setting up the mod mails")) {
      return botCache.helpers.reactSuccess(message);
    }
  },
});
