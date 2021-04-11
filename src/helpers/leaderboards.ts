import { botCache, Image } from "../../deps.ts";
import fonts from "../../fonts.ts";
import { db } from "../database/database.ts";
import { translate } from "../utils/i18next.ts";

// const prizeBoxBuffer = await Image.decode(await Deno.readFile(new URL("./../../assets/leaderboard/rectangle.png")))
const baseLBCanvas = new Image(636, 358)
  .composite(
    await Image.decode(await Deno.readFile(new URL("./../../assets/leaderboard/background.png", import.meta.url))),
    0,
    0
  )
  .drawBox(45, 235, 150, 30, parseInt("FFFFFFFF", 16))
  .composite(Image.renderText(fonts.SFTMedium, 18, "1", parseInt("46A3FFFF", 16)), 275, 140)
  .composite(Image.renderText(fonts.SFTMedium, 18, "2", parseInt("46A3FFFF", 16)), 275, 230)
  .composite(Image.renderText(fonts.SFTMedium, 18, "3", parseInt("46A3FFFF", 16)), 275, 310)
  .composite(
    await Image.decode(
      await Deno.readFile(new URL("./../../assets/leaderboard/MysteryChest_Legendary.png", import.meta.url))
    ),
    565,
    120
  )
  .composite(
    await Image.decode(
      await Deno.readFile(new URL("./../../assets/leaderboard/MysteryChest_Epic.png", import.meta.url))
    ),
    565,
    210
  )
  .composite(
    await Image.decode(
      await Deno.readFile(new URL("./../../assets/leaderboard/MysteryChest_Rare.png", import.meta.url))
    ),
    565,
    290
  );

async function buildCanvas(
  guildID: string,
  type: string,
  avatarBuffer: ArrayBuffer,
  username: string,
  discriminator: string,
  memberPosition: number | string,
  userXP: number,
  rankText: string,
  topUsers: TopUserLeaderboard[],
  coins = false
) {
  const name = Image.renderText(fonts.SFTBold, 26, username, parseInt(`FFFFFFFF`, 16));

  const discrim = Image.renderText(fonts.SFTRegular, 16, discriminator, parseInt(`FFFFFFFF`, 16));

  const rank = Image.renderText(
    fonts.SFTBold,
    24,
    translate(guildID, "strings:LEADERBOARD_RANK", {
      position: memberPosition,
    }),
    parseInt(`FFFFFFFF`, 16)
  );

  const xp = Image.renderText(
    fonts.SFTBold,
    18,
    translate(guildID, coins ? "strings:LEADERBOARD_CURRENT_COINS" : "strings:LEADERBOARD_CURRENT_XP", {
      amount: userXP.toLocaleString("en-US"),
    }),
    parseInt(`2C2C2CFF`, 16)
  );

  const ranktxt = Image.renderText(fonts.SFTBold, 14, rankText, parseInt(`FFFFFFFF`, 16));

  const typeText = Image.renderText(fonts.SFTHeavy, 18, type, parseInt(`2C2C2CFF`, 16));

  const lbname = Image.renderText(
    fonts.SFTBold,
    16,
    translate(guildID, "strings:LEADERBOARD_NAME"),
    parseInt("#8b8b8bFF", 16)
  );
  const lblvl = Image.renderText(
    fonts.SFTBold,
    16,
    translate(guildID, "strings:LEADERBOARD_LEVEL"),
    parseInt("#8b8b8bFF", 16)
  );
  const lbtype = Image.renderText(
    fonts.SFTBold,
    16,
    translate(guildID, coins ? "strings:COINS" : "strings:LEADERBOARD_EXP"),
    parseInt("#8b8b8bFF", 16)
  );
  const lbprize = Image.renderText(
    fonts.SFTBold,
    16,
    translate(guildID, "strings:LEADERBOARD_PRIZE"),
    parseInt("#8b8b8bFF", 16)
  );

  let userY = 140;

  const canvas = baseLBCanvas
    .clone()
    .composite((await Image.decode(avatarBuffer)).cropCircle(), 50, 20)
    .composite(name, 45, 155)
    .composite(discrim, 75, 185)
    .composite(rank, 70, 205)
    .composite(xp, 70, 237)
    .composite(ranktxt, 60, 305)
    .composite(typeText, 275, 50)
    .composite(lbname, 370, 95)
    .composite(lblvl, 275, 95)
    .composite(lbtype, 300, 95)
    .composite(lbprize, 325, 95);

  for (const userData of topUsers) {
    try {
      const buffer = await fetch(userData.avatarUrl.replace(".gif", ".png").replace(".webp", ".png"))
        .then((res) => res.arrayBuffer())
        .then((res) => new Uint8Array(res))
        .catch(console.log);
      if (buffer) {
        canvas.composite((await Image.decode(buffer)).resize(45, 45).cropCircle(), 295, userY - 10);
      }
    } catch {}

    const currentLevel =
      botCache.constants.levels.find((level) => level.xpNeeded > userData.currentXP) ||
      botCache.constants.levels.last();

    const currentName = Image.renderText(fonts.SFTMedium, 18, userData.username, parseInt("2c2c2cFF", 16));
    const currentDiscrim = Image.renderText(
      fonts.SFTRegular,
      13,
      userData.discriminator || "####",
      parseInt("2c2c2cFF", 16)
    );
    const currentLvl = Image.renderText(fonts.SFTMedium, 18, currentLevel.id.toString(), parseInt("2c2c2cFF", 16));
    const currentXP = Image.renderText(fonts.SFTMedium, 18, userData.currentXP.toString(), parseInt("2c2c2cFF", 16));

    canvas
      .composite(currentName, 350, userY - 12)
      .composite(currentDiscrim, 350, userY + 8)
      .composite(currentLvl, 465, userY)
      .composite(currentXP, 500, userY);

    // Update for next loop
    userY += 85;
  }

  return new Blob([await canvas.encode()], { type: "image/png" });
}

botCache.helpers.makeLocalCanvas = async function (message, member) {
  const settings = await db.xp.get(`${message.guildID}-${member.id}`);
  if (!settings?.xp) {
    await botCache.helpers.reactError(message);
    return;
  }

  const relevant = (await db.xp.findMany({ guildID: message.guildID }, true)).sort((a, b) => b.xp - a.xp);
  const index = relevant.findIndex((r) => r.memberID === member.id);

  const nextUser = relevant[index - 1];
  const prevUser = relevant[index + 1];

  const rankText = nextUser
    ? `${(nextUser.xp - settings.xp).toLocaleString("en-US")} EXP Behind`
    : prevUser
    ? `${(settings.xp - prevUser.xp).toLocaleString("en-US")} EXP Ahead`
    : "Unknown";

  const userAvatar = await fetch(member.avatarURL.replace(".gif", ".png").replace(".webp", ".png"))
    .then((res) => res.arrayBuffer())
    .then((res) => new Uint8Array(res));

  const username = member.tag
    .substring(0, member.tag.lastIndexOf("#"))
    .replace(
      /([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])/g,
      ``
    );

  const topUserData = [];
  for (const userData of relevant) {
    // Run a loop for the top 3 users
    if (topUserData.length === 3) break;

    // Get the user
    const user = await botCache.helpers.fetchMember(message.guildID, userData.memberID);
    if (!user) continue;

    topUserData.push({
      avatarUrl: user.avatarURL,
      currentXP: userData.xp,
      username: user.tag.substring(0, member.tag.lastIndexOf("#")),
      discriminator: user.tag.substring(member.tag.lastIndexOf("#")),
    });
  }

  return buildCanvas(
    message.guildID,
    translate(message.guildID, "strings:LEADERBOARD_SERVER"),
    userAvatar,
    username,
    member.tag.substring(member.tag.lastIndexOf("#")),
    index + 1,
    settings.xp,
    rankText,
    topUserData
  );
};

botCache.helpers.makeVoiceCanvas = async function (message, member) {
  const settings = await db.xp.get(`${message.guildID}-${member.id}`);
  if (!settings?.voiceXP) {
    await botCache.helpers.reactError(message);
    return;
  }

  const relevant = (await db.xp.findMany({ guildID: message.guildID }, true)).sort((a, b) => b.voiceXP - a.voiceXP);
  const index = relevant.findIndex((r) => r.memberID === member.id);

  const nextUser = relevant[index - 1];
  const prevUser = relevant[index + 1];

  const rankText = nextUser
    ? `${(nextUser.voiceXP - settings.voiceXP).toLocaleString("en-US")} EXP Behind`
    : prevUser
    ? `${(settings.voiceXP - prevUser.voiceXP).toLocaleString("en-US")} EXP Ahead`
    : "Unknown";

  const userAvatar = await fetch(member.avatarURL.replace(".gif", ".png").replace(".webp", ".png"))
    .then((res) => res.arrayBuffer())
    .then((res) => new Uint8Array(res));

  const username = member.tag
    .substring(0, member.tag.lastIndexOf("#"))
    .replace(
      /([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])/g,
      ``
    );

  const topUserData = [];
  for (const userData of relevant) {
    // Run a loop for the top 3 users
    if (topUserData.length === 3) break;

    // Get the user
    const user = await botCache.helpers.fetchMember(message.guildID, userData.memberID);
    if (!user) continue;

    topUserData.push({
      avatarUrl: user.avatarURL,
      currentXP: userData.voiceXP,
      username: user.tag.substring(0, member.tag.lastIndexOf("#")),
      discriminator: user.tag.substring(member.tag.lastIndexOf("#")),
    });
  }

  return buildCanvas(
    message.guildID,
    translate(message.guildID, "strings:LEADERBOARD_VOICE"),
    userAvatar,
    username,
    member.tag.substring(member.tag.lastIndexOf("#")),
    index + 1,
    settings.voiceXP,
    rankText,
    topUserData
  );
};

botCache.helpers.makeGlobalCanvas = async function (message, member) {
  const settings = await db.users.get(member.id);
  if (!settings?.xp) {
    await botCache.helpers.reactError(message);
    return;
  }

  const relevant = (await db.users.findMany({}, true)).sort((a, b) => b.xp - a.xp);
  const index = relevant.findIndex((r) => r.id === member.id);

  const nextUser = relevant[index - 1];
  const prevUser = relevant[index + 1];

  const rankText = nextUser
    ? `${(nextUser.xp - settings.xp).toLocaleString("en-US")} EXP Behind`
    : prevUser
    ? `${(settings.xp - prevUser.xp).toLocaleString("en-US")} EXP Ahead`
    : "Unknown";

  const userAvatar = await fetch(member.avatarURL.replace(".gif", ".png").replace(".webp", ".png"))
    .then((res) => res.arrayBuffer())
    .then((res) => new Uint8Array(res));

  const username = member.tag
    .substring(0, member.tag.lastIndexOf("#"))
    .replace(
      /([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])/g,
      ``
    );

  const topUserData = [];
  for (const userData of relevant) {
    // Run a loop for the top 3 users
    if (topUserData.length === 3) break;

    // Get the user
    const user = await botCache.helpers.fetchMember(message.guildID, userData.id);
    if (!user) continue;

    topUserData.push({
      avatarUrl: user.avatarURL,
      currentXP: userData.xp,
      username: user.tag.substring(0, member.tag.lastIndexOf("#")),
      discriminator: user.tag.substring(member.tag.lastIndexOf("#")),
    });
  }

  return buildCanvas(
    message.guildID,
    translate(message.guildID, "strings:LEADERBOARD_GLOBAL"),
    userAvatar,
    username,
    member.tag.substring(member.tag.lastIndexOf("#")),
    index + 1,
    settings.xp,
    rankText,
    topUserData
  );
};

botCache.helpers.makeCoinsCanvas = async function (message, member) {
  const settings = await db.users.get(member.id);
  if (!settings?.coins) {
    await botCache.helpers.reactError(message);
    return;
  }

  const relevant = (await db.users.findMany({}, true)).sort((a, b) => b.coins - a.coins);
  const index = relevant.findIndex((r) => r.id === member.id);

  const nextUser = relevant[index - 1];
  const prevUser = relevant[index + 1];

  const rankText = nextUser
    ? `${(nextUser.coins - settings.coins).toLocaleString("en-US")} Coins Behind`
    : prevUser
    ? `${(settings.coins - prevUser.coins).toLocaleString("en-US")} Coins Ahead`
    : "Unknown";

  const userAvatar = await fetch(member.avatarURL.replace(".gif", ".png").replace(".webp", ".png"))
    .then((res) => res.arrayBuffer())
    .then((res) => new Uint8Array(res));

  const username = member.tag
    .substring(0, member.tag.lastIndexOf("#"))
    .replace(
      /([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])/g,
      ``
    );

  const topUserData = [];
  for (const userData of relevant) {
    // Run a loop for the top 3 users
    if (topUserData.length === 3) break;

    // Get the user
    const user = await botCache.helpers.fetchMember(message.guildID, userData.id);
    if (!user) continue;

    topUserData.push({
      avatarUrl: user.avatarURL,
      currentXP: userData.xp,
      username: user.tag.substring(0, member.tag.lastIndexOf("#")),
      discriminator: user.tag.substring(member.tag.lastIndexOf("#")),
    });
  }

  return buildCanvas(
    message.guildID,
    translate(message.guildID, "strings:LEADERBOARD_COINS"),
    userAvatar,
    username,
    member.tag.substring(member.tag.lastIndexOf("#")),
    index + 1,
    settings.coins,
    rankText,
    topUserData
  );
};

export interface TopUserLeaderboard {
  avatarUrl: string;
  currentXP: number;
  username: string;
  discriminator: string;
}
