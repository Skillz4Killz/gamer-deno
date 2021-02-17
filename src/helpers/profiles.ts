import { botCache, cache, chooseRandom, Image } from "../../deps.ts";
import fonts from "../../fonts.ts";
import { db } from "../database/database.ts";
import { translate } from "../utils/i18next.ts";

const profileBuffers = {
  blueCircle: await Image.decode(Deno.readFileSync(new URL("./../../assets/profile/blue_circle.png", import.meta.url))),
  whiteRectangle: await Image.decode(
    Deno.readFileSync(new URL("./../../assets/profile/left_rectangle_white.png", import.meta.url))
  ),
  botLogo: await Image.decode(Deno.readFileSync(new URL("./../../assets/profile/gamer.png", import.meta.url))),
};

botCache.helpers.makeProfileCanvas = async function makeCanvas(guildID, memberID, options) {
  const member = cache.members.get(memberID);
  if (!member) return;

  const [settings, xpSettings, userSettings, marriage] = await Promise.all([
    await db.guilds.get(guildID),
    await db.xp.get(`${guildID}-${memberID}`),
    await db.users.get(memberID),
    await db.marriages.get(memberID),
  ]);

  const spouse = cache.members.get(marriage?.spouseID!);
  // Select the background theme & id from their settings if no override options were provided
  const style = options?.style || (botCache.vipUserIDs.has(memberID) && userSettings?.theme) || "white";
  // Default to a random background
  const backgroundID = options?.backgroundID || userSettings?.backgroundID;

  // Get background data OR If the background is invalid then set it to default values
  let bg =
    botCache.constants.backgrounds.find((b) => b.id === backgroundID) || chooseRandom(botCache.constants.backgrounds);
  if (!bg) return;

  let bgURL = "";

  // VIP Guilds can prevent certain backgrounds
  if (botCache.vipGuildIDs.has(guildID)) {
    // VIP Users can override them still
    if (!botCache.vipUserIDs.has(memberID)) {
      if (settings?.allowedBackgroundURLs && !settings.allowedBackgroundURLs.includes(String(bg.id))) {
        // User selected an invalid background
        bgURL = chooseRandom(settings.allowedBackgroundURLs);
      }
    }
  }

  // SERVER XP DATA
  const serverLevelDetails = botCache.constants.levels.find((lev) => lev.xpNeeded > (xpSettings?.xp || 0));
  const globalLevelDetails = botCache.constants.levels.find((lev) => lev.xpNeeded > (userSettings?.xp || 0));
  const previousServerLevelDetails =
    botCache.constants.levels.find((lev) => lev.id === (serverLevelDetails?.id || 0) - 1) ||
    botCache.constants.levels.get(0);
  const previousGlobalLevelDetails =
    botCache.constants.levels.find((lev) => lev.id === (globalLevelDetails?.id || 0) - 1) ||
    botCache.constants.levels.get(0);
  if (!serverLevelDetails || !globalLevelDetails || !previousServerLevelDetails || !previousGlobalLevelDetails) {
    return;
  }

  const memberLevel = serverLevelDetails.id;
  const totalMemberXP = xpSettings?.xp || 0;
  const globalLevel = globalLevelDetails.id;
  const totalGlobalXP = userSettings?.xp || 0;

  // Since XP is stored as TOTAL and is not reset per level we need to make a cleaner version
  // Create the cleaner xp based on the level of the member
  let memberXP = totalMemberXP;
  if (memberLevel >= 1) {
    const previousLevel = botCache.constants.levels.find((lev) => lev.id === memberLevel - 1);
    if (!previousLevel) return;

    memberXP = totalMemberXP - previousLevel.xpNeeded;
  }

  // Create the cleaner xp based on the level of the user
  let globalXP = totalGlobalXP;
  if (globalLevel >= 1) {
    const previousLevel = botCache.constants.levels.find((lev) => lev.id === globalLevel - 1);
    if (!previousLevel) return;
    globalXP = totalGlobalXP - previousLevel.xpNeeded;
  }

  // Calculate Progress
  const xpBarWidth = 360;

  // Marriage calculations
  const loveCount = marriage?.love ? (marriage.love > 100 ? 100 : marriage.love) : 0;
  const mRatio = loveCount / 100;
  const mProgress = xpBarWidth * mRatio;

  const sRatio =
    memberXP / (serverLevelDetails.xpNeeded - previousServerLevelDetails.xpNeeded || serverLevelDetails.xpNeeded);
  const sProgress = xpBarWidth * sRatio;
  const gRatio =
    globalXP / (globalLevelDetails.xpNeeded - previousGlobalLevelDetails.xpNeeded || globalLevelDetails.xpNeeded);
  const gProgress = xpBarWidth * gRatio;

  // STYLES EVALUATION AND DATA
  const mode = botCache.constants.themes.get(style) || botCache.constants.themes.get("white")!;
  const canvas = new Image(852, 581);
  const badgeSpots = [70, 145, 220, 295, 370, 445];
  for (const spot of badgeSpots) {
    canvas.drawCircle(spot, 480, 27, parseInt(botCache.constants.themes.get("white")!.badgeFilling, 16));
  }

  // VIP USERS BACKGROUNDS
  if (botCache.vipUserIDs.has(memberID)) {
    // CUSTOM BACKGROUND
    const backgroundURL = userSettings?.backgroundURL;
    if (backgroundURL) {
      const buffer = await fetch(backgroundURL)
        .then((res) => res.arrayBuffer())
        .catch(console.log);
      // SET RIGHT IMAGE BACKGROUND
      if (buffer) {
        canvas.composite((await Image.decode(buffer)).resize(500, 481).roundCorners(25), 345, 50);
      } else {
        canvas.composite(bg.blob.resize(500, 481).roundCorners(25), 385, 50);
      }
      // SET LEFT BACKGROUND
      canvas.composite(mode.rectangle, 2, 50);
    } else {
      canvas.composite(bg.blob.resize(500, 481).roundCorners(25), 345, 50).composite(mode.rectangle, 2, 50);
    }
  } // SET LEFT COLOR BACKGROUND IF NOT DEFAULT WHITE
  else if (mode.id !== "white") {
    canvas.composite(bg.blob.resize(500, 481).roundCorners(25), 345, bg.vipNeeded ? 0 : 50);
    canvas.composite(mode.rectangle, 2, 50);
  } else {
    if (bgURL) {
      const buffer = await fetch(bgURL.replace(".gif", ".png").replace(".webp", ".png"))
        .then((res) => res.arrayBuffer())
        .then((res) => new Uint8Array(res))
        .catch(console.log);
      if (buffer) {
        canvas
          .composite((await Image.decode(buffer)).resize(500, 481).roundCorners(25).cropCircle(), 345, 0)
          .composite(mode.rectangle, 2, 50);
      }
    } else {
      canvas
        .composite(bg.blob.resize(500, 481).roundCorners(25), 345, bg.vipNeeded ? 0 : 50)
        .composite(mode.rectangle, 2, 50);
    }
  }

  // CUSTOM BADGES FOR VIPS
  const badges = botCache.vipUserIDs.has(memberID) ? userSettings?.badges || [] : [];
  if (badges.length) {
    for (let i = 0; i < 6; i++) {
      // A custom badge is availble
      const x = i === 0 ? 70 : i === 1 ? 145 : i === 2 ? 220 : i === 3 ? 295 : i === 4 ? 370 : 445;

      const badge = userSettings?.badges?.[i];
      if (!badge) {
        canvas.drawCircle(x, 480, 27, parseInt(botCache.constants.themes.get("white")!.badgeFilling, 16));
        continue;
      }

      const buffer = await fetch(badge)
        .then((res) => res.arrayBuffer())
        .catch(() => undefined);
      if (!buffer) {
        canvas.drawCircle(x, 480, 27, parseInt(botCache.constants.themes.get("white")!.badgeFilling, 16));
        continue;
      }

      canvas.composite((await Image.decode(buffer)).resize(55, 55).cropCircle(), x - 27, 450);
    }
  } // NO BADGES DRAW EMPTY CIRCLES TO HINT USERS AT BADGES
  else {
    const badgeSpots = [70, 145, 220, 295, 370, 445];
    for (const spot of badgeSpots) {
      canvas.drawCircle(spot, 480, 27, parseInt(botCache.constants.themes.get("white")!.badgeFilling, 16));
    }
  }

  // ADDS USER AVATAR
  const buffer = await fetch(member?.avatarURL.replace(".gif", ".png").replace(".webp", ".png"))
    .then((res) => res.arrayBuffer())
    .then((res) => new Uint8Array(res))
    .catch(console.log);
  if (buffer) {
    canvas
      .composite((await Image.decode(buffer)).resize(92, 92).cropCircle(), 35, 85)
      .composite(profileBuffers.blueCircle, 30, 80);
  }

  // user name and discrimininator
  const username = member.tag
    .substring(0, member.tag.lastIndexOf("#"))
    .replace(
      /([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])/g,
      ``
    );
  const spouseUsername = spouse?.tag.replace(
    /([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])/g,
    ``
  );

  // SET PROFILE USERNAME STUFF
  const name = Image.renderText(fonts.LatoBold, 26, username, parseInt(`${mode.username}`, 16));
  const discrim = Image.renderText(
    fonts.LatoBold,
    18,
    member.tag.substring(member.tag.lastIndexOf("#")),
    parseInt(`${mode.discriminator}`, 16)
  );
  const mlevel = Image.renderText(fonts.LatoHeavy, 30, memberLevel.toString(), parseInt(`${mode.xpbarText}`, 16));
  const glevel = Image.renderText(fonts.LatoHeavy, 30, globalLevel.toString(), parseInt(`${mode.xpbarText}`, 16));
  const mxp = Image.renderText(
    fonts.LatoBold,
    16,
    `${memberXP}/${serverLevelDetails.xpNeeded - previousServerLevelDetails?.xpNeeded || serverLevelDetails.xpNeeded}`,
    parseInt(`${sRatio > 0.6 ? mode.xpbarRatioUp : mode.xpbarRatioDown}`, 16)
  );
  const gxpd = Image.renderText(
    fonts.LatoBold,
    16,
    `${globalXP}/${globalLevelDetails.xpNeeded - previousGlobalLevelDetails?.xpNeeded}`,
    parseInt(`${sRatio > 0.6 ? mode.xpbarRatioUp : mode.xpbarRatioDown}`, 16)
  );

  const xpBackground = new Image(xpBarWidth, 30).fill(parseInt(mode.xpbarFilling, 16)).roundCorners(10);
  canvas
    // DRAW XP BARS.
    .composite(xpBackground, 45, 239)
    .composite(xpBackground, 45, 309)
    .drawBox(158, 135, 240, 2, parseInt(botCache.constants.themes.get("white")!.userdivider, 16));

  // DEFAULT STRINGS ARE PRE-CACHED if english and white color
  const xp = Image.renderText(
    fonts.LatoBold,
    20,
    translate(guildID, "strings:SERVER_XP"),
    parseInt(`${mode.xpbarText}`, 16)
  );
  const lvl = Image.renderText(
    fonts.LatoBold,
    20,
    translate(guildID, "strings:LEVEL"),
    parseInt(`${mode.xpbarText}`, 16)
  );
  const gxp = Image.renderText(
    fonts.LatoBold,
    20,
    translate(guildID, "strings:GLOBAL_XP"),
    parseInt(`${mode.xpbarText}`, 16)
  );

  canvas
    .composite(xp, 45, 205)
    .composite(lvl, 350, 215)
    .composite(gxp, 45, 280)
    .composite(lvl, 350, 280)
    .composite(profileBuffers.botLogo, 495, 410);

  const clanBox = new Image(250, 90).fill(parseInt(mode.clanRectFilling, 16)).roundCorners(10);
  canvas.composite(clanBox, 590, 425);

  if (botCache.vipUserIDs.has(memberID)) {
    // CUSTOM DESCRIPTION
    const desc = userSettings?.description
      ? Image.renderText(fonts.LatoBold, 14, userSettings.description, parseInt(mode.clanName, 16), 230)
      : undefined;

    if (desc) {
      canvas.composite(desc.crop(0, 0, desc.width, Math.min(85, desc.height)), 600, 423);
    }
  }

  // IF MEMBER IS VIP FULL OVERRIDE
  let showMarriage = true;

  // VIP GUILDS CAN HIDE MARRIAGE
  if (botCache.vipGuildIDs.has(guildID) && settings && !settings.showMarriage) {
    showMarriage = false;
  }
  // VIP USERS SHOULD BE FULL OVVERIDE
  if (botCache.vipUserIDs.has(memberID) && userSettings?.showMarriage) {
    showMarriage = true;
  }

  if (showMarriage) {
    const spouseTxt = Image.renderText(
      fonts.LatoBold,
      20,
      translate(guildID, spouse || loveCount ? "strings:MARRIED" : "strings:NOT_MARRIED", {
        username: spouseUsername || "",
      }),
      parseInt(`${mode.xpbarText}`, 16)
    );
    const llvl = Image.renderText(
      fonts.LatoBold,
      16,
      `${loveCount}%`,
      parseInt(`${sRatio > 0.6 ? mode.xpbarRatioUp : mode.xpbarRatioDown}`, 16)
    );

    // DRAW MARRIAGE BAR

    canvas.composite(xpBackground, 45, 389);

    // marriage love meter filling
    if (mProgress) {
      const xpbar = new Image(45 + mProgress, 30);
      const gradient = Image.gradient({
        0: parseInt("FF9A8BFF", 16),
        0.25: parseInt("FF8F88FF", 16),
        0.5: parseInt("FF8386FF", 16),
        0.75: parseInt("FF7786FF", 16),
      });
      xpbar.fill((x) => gradient(x / xpbar.width));

      canvas.composite(xpbar.roundCorners(10), 45, 389);
    }

    canvas.composite(llvl, 190, 393).composite(spouseTxt, 45, 365);
  }

  // // server xp bar filling
  // // The if checks solve a crucial bug in canvas DO NOT REMOVE.
  // // The global bar breaks and is always fill if u have server level 0 without the if checks
  if (sProgress) {
    const xpbar = new Image(45 + sProgress, 30);
    const gradient = Image.gradient({
      0: parseInt("5994F2FF", 16),
      0.25: parseInt("8BCCEFFF", 16),
      0.5: parseInt("9BDEEFFF", 16),
      0.75: parseInt("9BEFE7FF", 16),
    });
    xpbar.fill((x) => gradient(x / xpbar.width));

    canvas.composite(xpbar.roundCorners(10), 45, 239);
  }

  if (gProgress) {
    const xpbar = new Image(45 + gProgress, 30);
    const gradient = Image.gradient({
      0: parseInt("5994F2FF", 16),
      0.25: parseInt("8BCCEFFF", 16),
      0.5: parseInt("9BDEEFFF", 16),
      0.75: parseInt("9BEFE7FF", 16),
    });
    xpbar.fill((x) => gradient(x / xpbar.width));

    canvas.composite(xpbar.roundCorners(10), 45, 309);
  }

  canvas
    .composite(name, 160, 100)
    .composite(discrim, 160, 145)
    .composite(mlevel, 310, 205)
    .composite(glevel, 310, 270)
    .composite(mxp, 190, 245)
    .composite(gxpd, 190, 315);
  return new Blob([await canvas.encode()], { type: "image/png" });
};
