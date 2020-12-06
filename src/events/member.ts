import { Guild } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/next/src/structures/guild.ts";
import { botCache, Member } from "../../deps.ts";
import { db } from "../database/database.ts";
import { Embed } from "../utils/Embed.ts";
import { sendEmbed } from "../utils/helpers.ts";

botCache.eventHandlers.guildMemberAdd = function (guild, member) {
  // If VIP guild, increment analytics
  vipMemberAnalytics(guild.id, true);
  handleWelcomeMessage(guild, member);
};

botCache.eventHandlers.guildMemberRemove = function (guild, member) {
  // If VIP guild, increment analytics
  vipMemberAnalytics(guild.id, false);
};

function vipMemberAnalytics(id: string, joinEvent = true) {
  if (!botCache.vipGuildIDs.has(id)) return;

  if (joinEvent) {
    const current = botCache.analyticsMemberJoin.get(id);
    botCache.analyticsMemberJoin.set(id, (current || 0) + 1);
  } else {
    const current = botCache.analyticsMemberLeft.get(id);
    botCache.analyticsMemberLeft.set(id, (current || 0) + 1);
  }
}

async function handleWelcomeMessage(guild: Guild, member: Member) {
  const welcome = botCache.recentWelcomes.get(guild.id) ||
    await db.welcome.get(guild.id);
  if (!welcome?.channelID || !welcome.text) return;

  if (!botCache.recentWelcomes.has(guild.id)) {
    botCache.recentWelcomes.set(guild.id, welcome);
  }

  try {
    const transformed = await botCache.helpers.variables(
      welcome.text,
      member,
      guild,
      member,
    );
    const json = JSON.parse(transformed);
    const embed = new Embed(json);
    sendEmbed(welcome.channelID, embed, json.plaintext);
  } catch {
    console.error("Welcome message failed for ", guild.id, "for ", member.id);
  }
}
