import {
  botCache,
  cache,
  delay,
  getAuditLogs,
  getInvites,
  Guild,
  Member,
  rawAvatarURL,
  UserPayload,
} from "../../deps.ts";
import { db } from "../database/database.ts";
import { Embed } from "../utils/Embed.ts";
import { humanizeMilliseconds, sendEmbed } from "../utils/helpers.ts";
import { translate } from "../utils/i18next.ts";

botCache.eventHandlers.memberAdd = function (guild, user, member) {
  // If VIP guild, increment analytics
  vipMemberAnalytics(guild.id, true);
  if (member) handleWelcomeMessage(guild, member);
  handleServerLogs(guild, user, "add");
};

botCache.eventHandlers.memberRemove = function (guild, user, member) {
  // If VIP guild, increment analytics
  vipMemberAnalytics(guild.id, false);
  handleServerLogs(guild, user, "remove");
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

async function handleServerLogs(
  guild: Guild,
  user: UserPayload,
  type: "add" | "remove",
  member?: Member,
) {
  // DISABLED LOGS
  const logs = botCache.recentLogs.has(guild.id)
    ? botCache.recentLogs.get(guild.id)
    : await db.serverlogs.get(guild.id);
  botCache.recentLogs.set(guild.id, logs);

  if (type === "add" && !logs?.memberAddChannelID) return;
  if (type == "remove" && !logs?.memberRemoveChannelID) return;
  if (!logs) return;

  const texts = [
    translate(
      guild.id,
      type === "add" ? "strings:MEMBER_JOINED" : "strings:MEMBER_REMOVED",
    ),
    translate(
      guild.id,
      "strings:MEMBER_NAME",
      { tag: `${user.username}#${user.discriminator}`, id: user.id },
    ),
    translate(
      guild.id,
      "strings:TOTAL_USERS",
      { amount: botCache.helpers.cleanNumber(guild.memberCount) },
    ),
    translate(
      guild.id,
      "strings:ACCOUNT_AGE",
      {
        age: humanizeMilliseconds(
          Date.now() - botCache.helpers.snowflakeToTimestamp(user.id),
        ),
      },
    ),
  ];

  const embed = new Embed()
    .setDescription(texts.join("\n"))
    .setFooter(
      `${user.username}#${user.discriminator}`,
      type === "add"
        ? `https://i.imgur.com/Ya0SXdI.png`
        : "https://i.imgur.com/iZPBVKB.png",
    )
    .setThumbnail(rawAvatarURL(user.id, user.discriminator, user.avatar))
    .setTimestamp();

  // NON-VIPS GET BASIC ONLY
  if (botCache.vipGuildIDs.has(guild.id)) {
    return sendEmbed(
      type === "add" ? logs.memberAddChannelID : logs.memberRemoveChannelID,
      embed,
    )?.catch(console.error);
  }

  // SEND PUBLIC
  if (type === "add" && logs?.memberAddPublic) {
    sendEmbed(
      type === "add" ? logs.memberAddChannelID : logs.memberRemoveChannelID,
      embed,
    )?.catch(console.error);
  }

  // REMOVE DOES NOT NEED INVITE CHECKING, BUT IT NEEDS KICK CHECKING
  if (type === "remove") {
    // WAIT FOR AUDIT LOGS TO BE UPDATED
    await delay(2000);

    const auditlogs = await getAuditLogs(
      guild.id,
      { action_type: "MEMBER_KICK" },
    );
    const relevant = auditlogs?.audit_log_entries.find((e) =>
      e.target_id === user.id
    );
    // NO KICK LOG WAS FOUND, USER PROBABLY LEFT ON THEIR OWN
    if (!relevant) {
      return sendEmbed(logs.memberRemoveChannelID, embed)?.catch(console.error);
    }
    // IN CASE THIS MEMBER WAS KICKED BEFORE
    if (
      Date.now() - botCache.helpers.snowflakeToTimestamp(relevant.id) > 5000
    ) {
      return sendEmbed(logs.memberRemoveChannelID, embed)?.catch(console.error);
    }

    // REMOVE THE LEFT ONE AND REPLACE WITH KICKED
    texts.shift();
    texts.unshift(translate(guild.id, "strings:MEMBER_KICKED"));
    if (relevant.reason) {
      texts.push(
        translate(guild.id, "strings:REASON", { reason: relevant.reason }),
      );
    }
    if (member) {
      texts.push(
        translate(
          guild.id,
          "strings:LOGS_ROLES",
          {
            roles: [...(member.guilds.get(guild.id)?.roles || []), guild.id]
              .map((id) => `<@&${id}>`).join(" "),
          },
        ),
      );
    }
    embed.setDescription(texts.join("\n"));
    return sendEmbed(logs.memberRemoveChannelID, embed)?.catch(console.error);
  }

  // GET INVITES
  const invites = await getInvites(guild.id);
  if (!invites) {
    return sendEmbed(
      type === "add" ? logs.memberAddChannelID : logs.memberRemoveChannelID,
      embed,
    )?.catch(console.error);
  }

  // FIND THE INVITE WHOSE USES WENT UP
  const invite = invites.find((i) => {
    const cachedInvite = botCache.invites.get(i.code);
    if (!cachedInvite) return false;
    if (i.uses === cachedInvite.uses) return false;
    return true;
  });

  // ADD ALL INVITES TO CACHE FOR NEXT TIME
  invites.forEach((i) => {
    botCache.invites.set(
      i.code,
      {
        code: i.code,
        guildID: i.guild.id,
        channelID: i.channel.id,
        memberID: i.inviter.id,
        uses: i.uses,
      },
    );
  });

  texts.push(
    translate(guild.id, "strings:INVITED_BY", {
      ag: invite
        ? `${invite.inviter.username}#${invite.inviter.discriminator}`
        : cache.members.get(guild.ownerID)?.tag ||
          translate(guild.id, "strings:UNKNOWN"),
      id: invite ? invite.inviter.id : guild.ownerID,
    }),
  );
  embed.setDescription(texts.join("\n"));
  return sendEmbed(
    type === "add" ? logs.memberAddChannelID : logs.memberRemoveChannelID,
    embed,
  )?.catch(console.error);
}
