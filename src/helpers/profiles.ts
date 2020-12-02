import { botCache, cache, chooseRandom, Image } from "../../deps.ts";
import fonts from "../../fonts.ts";
import { db } from "../database/database.ts";
import { translate } from "../utils/i18next.ts";

const profileBuffers = {
  blueCircle: await Image.decode(
    Deno.readFileSync(
      new URL("./../../assets/profile/blue_circle.png", import.meta.url),
    ),
  ),
  whiteRectangle: await Image.decode(
    Deno.readFileSync(
      new URL("./../../assets/profile/blue_circle.png", import.meta.url),
    ),
  ),
  botLogo: await Image.decode(
    Deno.readFileSync(
      new URL("./../../assets/profile/gamer.png", import.meta.url),
    ),
  ),
};

const defaultProfile = Image.new(852, 581)
  .composite(profileBuffers.blueCircle, 40, 80)
  .composite(botCache.constants.themes.get("white")!.rectangle, 2, 50)
  .drawBox(
    158,
    135,
    240,
    2,
    botCache.constants.themes.get("white")!.userdivider,
  )
  .composite(profileBuffers.botLogo, 555, 480)
  .drawBox(
    590,
    435,
    200,
    90,
    botCache.constants.themes.get("white")!.clanRectFilling,
  )
  .drawCircle(
    70,
    480,
    27.5,
    botCache.constants.themes.get("white")!.badgeFilling,
  )
  .drawCircle(
    145,
    480,
    27.5,
    botCache.constants.themes.get("white")!.badgeFilling,
  )
  .drawCircle(
    220,
    480,
    27.5,
    botCache.constants.themes.get("white")!.badgeFilling,
  )
  .drawCircle(
    295,
    480,
    27.5,
    botCache.constants.themes.get("white")!.badgeFilling,
  )
  .drawCircle(
    370,
    480,
    27.5,
    botCache.constants.themes.get("white")!.badgeFilling,
  )
  .drawCircle(
    445,
    480,
    27.5,
    botCache.constants.themes.get("white")!.badgeFilling,
  );

const defaultVIPProfile = Image.new(952, 581)
  .composite(profileBuffers.blueCircle, 40, 80)
  .composite(botCache.constants.themes.get("white")!.rectangle, 2, 50)
  .drawBox(
    158,
    135,
    240,
    2,
    botCache.constants.themes.get("white")!.userdivider,
  )
  .composite(profileBuffers.botLogo, 555, 480)
  .drawBox(
    590,
    435,
    200,
    90,
    botCache.constants.themes.get("white")!.clanRectFilling,
  )
  .drawCircle(
    70,
    480,
    27.5,
    botCache.constants.themes.get("white")!.badgeFilling,
  )
  .drawCircle(
    145,
    480,
    27.5,
    botCache.constants.themes.get("white")!.badgeFilling,
  )
  .drawCircle(
    220,
    480,
    27.5,
    botCache.constants.themes.get("white")!.badgeFilling,
  )
  .drawCircle(
    295,
    480,
    27.5,
    botCache.constants.themes.get("white")!.badgeFilling,
  )
  .drawCircle(
    370,
    480,
    27.5,
    botCache.constants.themes.get("white")!.badgeFilling,
  )
  .drawCircle(
    445,
    480,
    27.5,
    botCache.constants.themes.get("white")!.badgeFilling,
  );

botCache.helpers.makeProfileCanvas = async function makeCanvas(
  guildID,
  memberID,
  options,
) {
  const member = cache.members.get(memberID);
  if (!member) return;

  const [settings, xpSettings, userSettings, marriage] = await Promise.all([
    db.guilds.get(guildID),
    db.xp.get(`${guildID}-${memberID}`),
    db.users.get(memberID),
    db.marriages.get(memberID),
  ]);

  const spouse = cache.members.get(marriage?.spouseID!);
  // Select the background theme & id from their settings if no override options were provided
  const style = (options?.style) || userSettings?.theme || "white";
  // Default to a random background
  const backgroundID = (options?.backgroundID) || userSettings?.backgroundID;

  // Get background data OR If the background is invalid then set it to default values
  let bg = botCache.constants.backgrounds.find((b) => b.id === backgroundID) ||
    chooseRandom(botCache.constants.backgrounds);
  if (!bg) return;

  // VIP Guilds can prevent certain backgrounds
  if (botCache.vipGuildIDs.has(guildID)) {
    // VIP Users can override them still
    if (!botCache.vipUserIDs.has(memberID)) {
      if (!settings?.allowedBackgroundURLs.includes(String(bg.id))) {
        // Use selected an invalid background
      }
    }
  }

  // SERVER XP DATA
  const serverLevelDetails = botCache.constants.levels.find((lev) =>
    lev.xpNeeded > (xpSettings?.xp || 0)
  );
  const globalLevelDetails = botCache.constants.levels.find((lev) =>
    lev.xpNeeded > (userSettings?.xp || 0)
  );
  const previousServerLevelDetails =
    botCache.constants.levels.find((lev) =>
      lev.id === (serverLevelDetails?.id || 0) - 1
    ) || botCache.constants.levels.get(0);
  const previousGlobalLevelDetails =
    botCache.constants.levels.find((lev) =>
      lev.id === (globalLevelDetails?.id || 0) - 1
    ) || botCache.constants.levels.get(0);
  if (
    !serverLevelDetails || !globalLevelDetails || !previousServerLevelDetails ||
    !previousGlobalLevelDetails
  ) {
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
    const previousLevel = botCache.constants.levels.find((lev) =>
      lev.id === memberLevel - 1
    );
    if (!previousLevel) return;

    memberXP = totalMemberXP - previousLevel.xpNeeded;
  }

  // Create the cleaner xp based on the level of the user
  let globalXP = totalGlobalXP;
  if (globalLevel >= 1) {
    const previousLevel = botCache.constants.levels.find((lev) =>
      lev.id === globalLevel - 1
    );
    if (!previousLevel) return;
    globalXP = totalGlobalXP - previousLevel.xpNeeded;
  }

  // Calculate Progress
  const xpBarWidth = 360;

  // Marriage calculations
  const loveCount = marriage?.love
    ? (marriage.love > 100 ? 100 : marriage.love)
    : 0;
  const mRatio = loveCount / 100;
  const mProgress = xpBarWidth * mRatio;

  const sRatio = memberXP /
    (serverLevelDetails.xpNeeded - previousServerLevelDetails.xpNeeded ||
      serverLevelDetails.xpNeeded);
  const sProgress = xpBarWidth * sRatio;
  const gRatio = globalXP /
    (globalLevelDetails.xpNeeded - previousGlobalLevelDetails.xpNeeded);
  const gProgress = xpBarWidth * gRatio;

  // STYLES EVALUATION AND DATA
  const mode = botCache.constants.themes.get(style) ||
    botCache.constants.themes.get("white")!;
  const canvas = bg.vipNeeded
    ? defaultProfile.clone()
    : defaultVIPProfile.clone();

  // VIP USERS GET TO HAVE CUSTOM BADGE AND BACKGROUNDS
  if (botCache.vipUserIDs.has(memberID)) {
    // CUSTOM DESCRIPTION
    const desc = userSettings?.description
      ? await Image.renderText(
        fonts.LatoBold,
        16,
        userSettings.description,
        parseInt(`${mode.clanName}FF`, 16),
      )
      : undefined;
    if (desc) canvas.composite(desc, 600, 463);

    // CUSTOM BACKGROUND
    const backgroundURL = userSettings?.backgroundURL;
    if (backgroundURL) {
      const buffer = await fetch(backgroundURL).then((res) => res.arrayBuffer())
        .catch(() => undefined);
      // SET RIGHT IMAGE BACKGROUND
      if (buffer) canvas.composite(await Image.decode(buffer), 345, 0);
      else canvas.composite(bg.blob, 345, bg.vipNeeded ? 0 : 50);
    }

    // CHECK CUSTOM BADGES
    for (let i = 0; i < 6; i++) {
      const badge = userSettings?.badges[i];
      if (!badge) continue;

      const buffer = await fetch(badge).then((res) => res.arrayBuffer()).catch(
        () => undefined,
      );
      if (!buffer) continue;

      // A custom badge is availble
      const x = i === 0
        ? 70
        : i === 1
        ? 145
        : i === 2
        ? 220
        : i === 3
        ? 295
        : i === 4
        ? 370
        : 445;
      canvas.composite((await Image.decode(buffer)).cropCircle(), x, 480);
    }
  } // SET LEFT COLOR BACKGROUND IF NOT DEFAULT WHITE
  else if (mode.id !== "white") {
    canvas.composite(mode.rectangle, 2, 50);
    canvas.composite(bg.blob, 345, bg.vipNeeded ? 0 : 50);
  } else {
    canvas.composite(bg.blob, 345, bg.vipNeeded ? 0 : 50);
  }

  const buffer = await fetch(member?.avatarURL).then((res) => res.arrayBuffer())
    .catch(() => undefined);
  if (buffer) {
    canvas.composite((await Image.decode(buffer)).cropCircle(), 89, 130);
  }

  // user name and discrimininator
  const username = member.tag.substring(0, member.tag.lastIndexOf("#") - 1)
    .replace(
      /([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])/g,
      ``,
    );
  if (spouse) {
    const spouseUsername = spouse.tag.replace(
      /([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])/g,
      ``,
    );
  }

  // SET PROFILE USERNAME STUFF
  const [name, discrim, mlevel, glevel, mxp, gxp] = await Promise.all([
    Image.renderText(
      fonts.LatoBold,
      26,
      username,
      parseInt(`${mode.username}FF`, 16),
    ),
    Image.renderText(
      fonts.LatoBold,
      18,
      member.tag.substring(member.tag.lastIndexOf("#")),
      parseInt(`${mode.discriminator}FF`, 16),
    ),
    Image.renderText(
      fonts.LatoHeavy,
      30,
      memberLevel,
      parseInt(`${mode.xpbarText}FF`, 16),
    ),
    Image.renderText(
      fonts.LatoHeavy,
      30,
      globalLevel,
      parseInt(`${mode.xpbarText}FF`, 16),
    ),
    Image.renderText(
      fonts.LatoBold,
      16,
      `${memberXP}/${serverLevelDetails.xpNeeded -
          previousServerLevelDetails?.xpNeeded || serverLevelDetails.xpNeeded}`,
      parseInt(
        `${sRatio > 0.6 ? mode.xpbarRatioUp : mode.xpbarRatioDown}FF`,
        16,
      ),
    ),
    Image.renderText(
      fonts.LatoBold,
      16,
      `${globalXP}/${globalLevelDetails.xpNeeded -
        previousGlobalLevelDetails?.xpNeeded}`,
      parseInt(
        `${sRatio > 0.6 ? mode.xpbarRatioUp : mode.xpbarRatioDown}FF`,
        16,
      ),
    ),
  ]);

  canvas.composite(name, 160, 120)
    .composite(discrim, 160, 165)
    .composite(mlevel, 310, 225)
    .composite(glevel, 310, 300)
    // DRAW XP BARS.
    .drawBox(45, 240, xpBarWidth, 30, mode.xpbarFilling)
    .drawBox(45, 310, xpBarWidth, 30, mode.xpbarFilling)
    .composite(mxp, 190, 260)
    .composite(mxp, 190, 330);

  // DEFAULT STRINGS ARE PRE-CACHED if english and white color
  if (botCache.guildLanguages.get(guildID) !== "en_US" || mode.id !== "white") {
    const [xp, lvl, gxp] = await Promise.all([
      Image.renderText(
        fonts.LatoBold,
        20,
        translate(guildID, "strings:SERVER_XP"),
        parseInt(`${mode.xpbarText}FF`, 16),
      ),
      Image.renderText(
        fonts.LatoBold,
        20,
        translate(guildID, "strings:LEVEL"),
        parseInt(`${mode.xpbarText}FF`, 16),
      ),
      Image.renderText(
        fonts.LatoBold,
        20,
        translate(guildID, "strings:GLOBAL_XP"),
        parseInt(`${mode.xpbarText}FF`, 16),
      ),
    ]);

    canvas.composite(xp, 45, 255)
      .composite(lvl, 350, 225)
      .composite(gxp, 45, 300)
      .composite(lvl, 350, 300);
  }

  // IF MEMBER IS VIP FULL OVERRIDE
  let showMarriage = true;
  // VIP GUILDS CAN HIDE MARRIAGE
  if (botCache.vipGuildIDs.has(guildID) && settings?.hideMarriage) {
    showMarriage = false;
  }
  // VIP USERS SHOULD BE FULL OVVERIDE
  if (
    botCache.vipUserIDs.has(memberID) && userSettings?.showMarriage
  ) {
    showMarriage = true;
  }

  if (showMarriage) {
    const [spouseTxt, llvl] = await Promise.all([
      Image.renderText(
        fonts.LatoBold,
        20,
        translate(
          guildID,
          spouse ? "strings:MARRIED" : "strings:NOT_MARRIED",
          { username: spouse?.tag },
        ),
        parseInt(`${mode.xpbarText}FF`, 16),
      ),
      Image.renderText(
        fonts.LatoBold,
        16,
        `${loveCount}%`,
        parseInt(
          `${sRatio > 0.6 ? mode.xpbarRatioUp : mode.xpbarRatioDown}FF`,
          16,
        ),
      ),
    ]);
    canvas.composite(spouseTxt, 45, 375)
      // DRAW MARRIAGE BAR
      .drawBox(45, 240, xpBarWidth, 30, mode.xpbarFilling)
      .composite(llvl, 190, 410);
  }

  // // server xp bar filling
  // // The if checks solve a crucial bug in canvas DO NOT REMOVE.
  // // The global bar breaks and is always fill if u have server level 0 without the if checks
  // if (sProgress) {
  //   canvas
  //     .setShadowColor(`rgba(155, 222, 239, .5)`)
  //     .setShadowBlur(7)
  //     .printLinearGradient(45, 240, 45 + sProgress, 285, [
  //       { position: 0, color: `#5994f2` },
  //       { position: 0.25, color: `#8bccef` },
  //       { position: 0.5, color: `#9bdeef` },
  //       { position: 0.75, color: `#9befe7` }
  //     ])
  //     .addBeveledRect(45, 240, sProgress, 30, 25)
  // }

  // // global xp bar filling
  // if (gProgress) {
  //   canvas
  //     .setShadowColor(`rgba(155, 222, 239, .5)`)
  //     .setShadowBlur(7)
  //     .printLinearGradient(45, 310, 45 + gProgress, 395, [
  //       { position: 0, color: `#5994f2` },
  //       { position: 0.25, color: `#8bccef` },
  //       { position: 0.5, color: `#9bdeef` },
  //       { position: 0.75, color: `#9befe7` }
  //     ])
  //     .addBeveledRect(45, 310, gProgress, 30, 25)
  // }

  // // marriage love meter filling
  // if (mProgress) {
  //   canvas
  //     .printLinearGradient(45, 390, 45 + mProgress, 395, [
  //       { position: 0, color: `#ff9a8b` },
  //       { position: 0.25, color: `#ff8f88` },
  //       { position: 0.5, color: `#ff8386` },
  //       { position: 0.75, color: `#ff7786` }
  //     ])
  //     .addBeveledRect(45, 390, mProgress, 30, 25)
  // }

  return new Blob([await canvas.encode()], { type: "image/png" });
};
