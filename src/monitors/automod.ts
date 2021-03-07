import {
  bgBlue,
  bgYellow,
  black,
  botCache,
  botHasChannelPermissions,
  Collection,
  confusables,
  deleteMessageByID,
  Message,
} from "../../deps.ts";
import { db } from "../database/database.ts";
import { GuildSchema } from "../database/schemas.ts";
import { getTime, sendEmbed } from "../utils/helpers.ts";
import { translate } from "../utils/i18next.ts";

export const cachedSettingsAutomod = new Collection<string, GuildSchema>();

botCache.monitors.set("automod", {
  name: "automod",
  execute: async function (message) {
    if (message.author.bot) return;
    // Using mail feature and triggering automod will still show the message
    if (botCache.guildSupportChannelIDs.has(message.channelID)) return;

    let settings = cachedSettingsAutomod.get(message.guildID);
    if (!settings) {
      settings = await db.guilds.get(message.guildID);
      if (settings) cachedSettingsAutomod.set(message.guildID, settings);
    }

    // If they have default settings, then no automoderation features will be enabled
    if (!settings) return;

    if (settings.capitalPercentage === 100 && !settings.profanityEnabled && !settings.linksEnabled) {
      return;
    }

    // This if check allows admins to override and test their filter is working
    if (!message.content.startsWith("modbypass")) {
      if (!message.guild || !message.guildMember) return;

      if (await botCache.helpers.isModOrAdmin(message, settings)) {
        return;
      }
    }

    const embed = botCache.helpers.authorEmbed(message);
    const reasons: string[] = [];
    let content = `${message.content}`;

    const logEmbed = botCache.helpers
      .authorEmbed(message)
      .setTitle(translate(message.guildID, "strings:CAPITAL_SPAM"))
      .setThumbnail("https://i.imgur.com/E8IfeWc.png")
      .setDescription(message.content)
      .addField(translate(message.guildID, "strings:MESSAGE_ID"), message.id)
      .addField(translate(message.guildID, "strings:CHANNEL"), `<#${message.channelID}>`)
      .setFooter(translate(message.guildID, "strings:XP_LOST", { amount: 3 }))
      .setTimestamp(message.timestamp);

    const logs = botCache.recentLogs.has(message.guildID)
      ? botCache.recentLogs.get(message.guildID)
      : await db.serverlogs.get(message.guildID);
    botCache.recentLogs.set(message.guildID, logs);

    // Run the filter and get back either null or cleaned string
    const capitalSpamCleanup = capitalSpamFilter(content, settings.capitalPercentage);

    // If a cleaned string is returned set the content to the string
    if (capitalSpamCleanup) {
      botCache.stats.automod += 1;
      content = capitalSpamCleanup;

      // Remove 3 XP for using capital letters
      await botCache.helpers.removeXP(message.guildID, message.author.id, 3);

      // send to automod log
      if (logs?.automodChannelID) {
        await sendEmbed(logs.automodChannelID, logEmbed);
      }

      reasons.push(translate(message.guildID, `strings:AUTOMOD_CAPITALS`));
    }

    // Run the filter and get back either null or cleaned string
    const naughtyWordCleanup = naughtyWordFilter(
      content,
      settings.profanityEnabled,
      settings.profanityWords,
      settings.profanityStrictWords,
      botCache.vipGuildIDs.has(message.guildID) ? settings.profanityPhrases : []
    );
    if (naughtyWordCleanup) {
      const naughtyReason = translate(message.guildID, `strings:AUTOMOD_NAUGHTY`);
      for (const _word of naughtyWordCleanup.naughtyWords) {
        if (!reasons.includes(naughtyReason)) reasons.push(naughtyReason);
        botCache.stats.automod += 1;

        // Remove 5 XP per word used
        await botCache.helpers.removeXP(message.guildID, message.author.id, 5);
      }

      if (naughtyWordCleanup.naughtyWords.length) {
        logEmbed
          .setFooter(
            translate(message.guildID, "strings:XP_LOST", {
              amount: 5 * naughtyWordCleanup.naughtyWords.length,
            })
          )
          .setTitle(
            translate(message.guildID, "strings:PROFANITY", {
              words: naughtyWordCleanup.naughtyWords.join(", "),
            })
          );

        if (logs?.automodChannelID) {
          await sendEmbed(logs.automodChannelID, logEmbed);
        }
      }

      // If a cleaned string is returned set the content to the string
      content = naughtyWordCleanup.cleanString;
    }

    // Run the filter and get back either null or cleaned string
    const linkFilterCleanup = linkFilter(
      message,
      content,
      settings.linksEnabled,
      settings.linksChannelIDs,
      settings.linksUserIDs,
      settings.linksRoleIDs,
      settings.linksURLs,
      botCache.vipGuildIDs.has(message.guildID) ? settings.linksRestrictedURLs : []
    );
    // If a cleaned string is returned set the content to the string
    if (linkFilterCleanup) {
      content = linkFilterCleanup.content;

      for (const _url of linkFilterCleanup.filteredURLs) {
        botCache.stats.automod += 1;

        await botCache.helpers.removeXP(message.guildID, message.author.id, 5);
      }

      if (linkFilterCleanup.filteredURLs.length) {
        logEmbed
          .setFooter(
            translate(message.guildID, "strings:XP_LOST", {
              amount: 5 * linkFilterCleanup.filteredURLs.length,
            })
          )
          .setTitle(
            translate(message.guildID, "strings:LINK_POSTED", {
              links: linkFilterCleanup.filteredURLs.join(", "),
            })
          );

        // automod logs
        if (logs?.automodChannelID) {
          await sendEmbed(logs.automodChannelID, logEmbed);
        }
      }

      reasons.push(translate(message.guildID, `strings:AUTOMOD_URLS`));
    }

    if (content === message.content) return;
    console.log(
      `${bgBlue(`[${getTime()}]`)} => [MONITOR: ${bgYellow(black("automod"))}] Started in ${
        message.guild?.name || message.guildID
      } in ${message.channelID}.`
    );
    console.log(
      "Automod",
      message.guild?.name || message.guildID,
      message.member?.tag || message.author.id,
      message.channel?.name || message.channelID,
      content === message.content
    );
    // If the message can be deleted, delete it
    if (await botHasChannelPermissions(message.channelID, ["MANAGE_MESSAGES"])) {
      await deleteMessageByID(
        message.channelID,
        message.id,
        translate(message.guildID, "strings:AUTOMOD_DELETE_REASON")
      ).catch(console.log);
    }

    // Need send and embed perms to send the clean response
    const hasPerms = await botHasChannelPermissions(message.channelID, ["SEND_MESSAGES", "EMBED_LINKS"]);
    if (!hasPerms) return;

    embed.setDescription(content);

    if (reasons.length === 1) embed.setFooter(reasons[0]!);
    else embed.setFooter(translate(message.guildID, `strings:TOO_MUCH_WRONG`));
    // Send back the cleaned message with the author information
    await sendEmbed(message.channelID, embed);
    if (reasons.length > 1) {
      await message.alert(reasons.join("\n"), 5, translate(message.guildID, "strings:CLEAR_SPAM"));
    }
  },
});

function capitalSpamFilter(text: string, capitalPercentage = 100) {
  if (capitalPercentage === 100) return;

  let lowercaseCount = 0;
  let uppercaseCount = 0;
  let characterCount = 0;

  for (const letter of text) {
    for (const language of [botCache.constants.alphabet.english, botCache.constants.alphabet.russian]) {
      if (language.lowercase.includes(letter)) lowercaseCount++;
      else if (language.uppercase.includes(letter)) uppercaseCount++;
    }

    if (letter !== " ") characterCount++;
  }

  const letterCount = lowercaseCount + uppercaseCount;
  if (characterCount === 1 || (text.split(" ").length < 2 && letterCount <= 10)) {
    return;
  }

  const percentageOfCapitals = (uppercaseCount / characterCount) * 100;
  if (percentageOfCapitals < capitalPercentage) return;

  // If there was too many capitals then lower it
  return text.toLowerCase();
}

function naughtyWordFilter(
  content: string,
  enabled: boolean,
  words: string[],
  strictWords: string[],
  phrases: string[]
) {
  // If status is disabled or no words then cancel
  if (!enabled || (!words.length && !strictWords.length)) {
    return;
  }
  // Create an array of words from the message

  const naughtyWords: string[] = [];
  const cleanString: string[] = [];
  // Cleans up the string of non english characters and makes them into english characters so we can run checks on them
  let finalString = confusables.remove(content);

  // Replace all instance of a strict word
  for (const word of strictWords) {
    const cleanedWord = confusables.remove(word);

    if (!finalString.includes(cleanedWord)) continue;
    naughtyWords.push(word);
    // All the instances of this naughty word must be replaced with $. Need 2 $ because $ is a special character in regexes
    finalString = finalString.replace(new RegExp(cleanedWord, `gi`), `$$`.repeat(word.length));

    // Since the finalstring was first modified from confusables we need to bring back the original content version
    const finalStringArray = finalString.split(``);
    finalString = content
      .split(``)
      .map((letter, index) => (finalStringArray[index] === `$` ? `$` : letter))
      .join(``);
    // Check for any outliers for example a bad word split with a space
    const textArray = finalString.split(` `);

    const result = [];
    for (let i = 0; i < textArray.length; i++) {
      const first = textArray[i] || ``;
      const second = textArray[i + 1] || ``;

      if (first + second === cleanedWord) {
        result.push(`$`.repeat(first.length), `$`.repeat(second.length));
        i += 1;
      } else {
        result.push(first);
      }
    }

    if (finalString !== result.join(` `).trim()) finalString = result.join(` `);
  }

  // phrases VIP only
  for (const phrase of phrases) {
    finalString = finalString.replace(new RegExp(phrase, `gi`), `$$`.repeat(phrase.length));
  }

  // Since the finalstring was first modified from confusables we need to bring back the original content version
  finalString = content
    .split(``)
    .map((letter, index) => (finalString[index] === `$` ? `$` : letter))
    .join(``);

  // Soft profanity
  for (const word of finalString.split(` `)) {
    const cleanedWord = confusables.remove(word);

    if (words.includes(cleanedWord.toLowerCase())) {
      naughtyWords.push(word);
      cleanString.push(`$`.repeat(word.length));
    } else {
      cleanString.push(word);
    }
  }

  return { naughtyWords, cleanString: cleanString.join(` `) };
}

function linkFilter(
  message: Message,
  content: string,
  enabled: boolean,
  channelIDs: string[],
  userIDs: string[],
  roleIDs: string[],
  urls: string[],
  restrictedURLs: string[]
) {
  if (!enabled) return;

  // Check if this role/channel/user is whitelisted
  for (const channelID of channelIDs) {
    if (message.channelID === channelID) return;
  }
  for (const userID of userIDs) if (message.author.id === userID) return;
  for (const roleID of roleIDs) {
    if (message.guildMember?.roles.includes(roleID)) return;
  }

  const filteredURLs: string[] = [];
  for (const word of content.split(" ")) {
    // When all urls are allowed EXCEPT the restricted
    if (restrictedURLs.length) {
      for (const url of restrictedURLs) {
        if (!word.startsWith(url) && !word.startsWith(`<${url}`)) continue;
        content = content = content.replace(new RegExp(word, `gi`), `#`.repeat(word.length));
        filteredURLs.push(word);
      }
      // Skip the rest because all urls are allowed if this option is enabled
      continue;
    }

    let isURL = false;
    if (
      ["discord.gg/", "https://", "http://", "www."].some((txt) => word.startsWith(txt) || word.startsWith(`<${txt}`))
    ) {
      isURL = true;
    }

    if (isURL) {
      let allowedURL = false;
      for (const wURL of urls) {
        if (word.startsWith(wURL) || word.startsWith(`<${wURL}`)) {
          allowedURL = true;
        }
      }
      if (allowedURL) continue;

      filteredURLs.push(word);
      content = content.replace(new RegExp(word, `gi`), `#`.repeat(word.length));
    }
  }

  return { content, filteredURLs };
}
