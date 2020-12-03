import { botCache, Image } from "../../deps.ts";
import fonts from "../../fonts.ts";
import { db } from "../database/database.ts";
import { translate } from "../utils/i18next.ts";

// const prizeBoxBuffer = await Image.decode(await Deno.readFile(new URL("./../../assets/leaderboard/rectangle.png")))
const baseLBCanvas = Image.new(636, 358)
	  .composite(await Image.decode(
  await Deno.readFile(
    new URL("./../../assets/leaderboard/background.png", import.meta.url),
  ),
		), 0, 0)
	.drawBox(45, 235, 150, 30, parseInt("FFFFFFFF", 16))
	.composite(Image.renderText(fonts.SFTMedium, 18, "1", parseInt("46A3FFFF", 16)), 275, 140)
	.composite(Image.renderText(fonts.SFTMedium, 18, "2", parseInt("46A3FFFF", 16)), 275, 230)
	.composite(Image.renderText(fonts.SFTMedium, 18, "3", parseInt("46A3FFFF", 16)), 275, 320)
	.composite(await Image.decode(await Deno.readFile("./../../assets/leaderboard/MysteryChest_Rare.png")), 585, 140)
	.composite(await Image.decode(await Deno.readFile("./../../assets/leaderboard/MysteryChest_Rare.png")), 585, 230)
	.composite(await Image.decode(await Deno.readFile("./../../assets/leaderboard/MysteryChest_Rare.png")), 585, 320)


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
	const name = Image.renderText(
		fonts.SFTBold,
		26,
		username,
		parseInt(`FFFFFFFF`, 16),
	);

	const discrim = Image.renderText(
		fonts.SFTRegular,
		16,
		discriminator,
		parseInt(`FFFFFFFF`, 16),
	);

const rank = Image.renderText(
  fonts.SFTBold,
  24,
  translate(guildID, "strings:LEADERBOARD_RANK", { position: memberPosition }),
  parseInt(`FFFFFFFF`, 16),
);

	const xp = Image.renderText(
  fonts.SFTBold,
  18,
  translate(guildID, coins? "strings:LEADERBOARD_CURRENT_COINS" : "strings:LEADERBOARD_CURRENT_XP", { amount: botCache.helpers.cleanNumber(userXP) }),
  parseInt(`2C2C2CFF`, 16),
	);

	const ranktxt = Image.renderText(
  fonts.SFTBold,
  14,
    rankText,
  parseInt(`FFFFFFFF`, 16),
	);

	const typeText =Image.renderText(
  fonts.SFTHeavy,
  18,
  type,
  parseInt(`2C2C2CFF`, 16),
	);

	const lbname = Image.renderText(fonts.SFTBold, 16, translate(guildID, "strings:LEADERBOARD_NAME"), parseInt("#8b8b8bFF", 16))
	const lblvl = Image.renderText(fonts.SFTBold, 16, translate(guildID, "strings:LEADERBOARD_LEVEL"), parseInt("#8b8b8bFF", 16))
	const lbtype = Image.renderText(fonts.SFTBold, 16, translate(guildID, coins ? "strings:LEADERBOARD_COINS" : "strings:LEADERBOARD_EXP"), parseInt("#8b8b8bFF", 16))
	const lbprize = Image.renderText(fonts.SFTBold, 16, translate(guildID, "strings:LEADERBOARD_PRIZE"), parseInt("#8b8b8bFF", 16))

	let userY = 140;
	let position = 1;

	const canvas = baseLBCanvas.clone()
					.composite(
					(await Image.decode(avatarBuffer)).resize(50, 50).cropCircle(),
					120,
					80,
				)
					.composite(name, 120, 155)
					.composite(discrim, 120, 175)
			.composite(rank, 120, 220)
			.composite(xp, 120, 257)
		.composite(ranktxt, 120, 300)
		.composite(typeText, 275, 50)
      .composite(lbname, 370, 95)
      .composite(lblvl, 480, 95)
      .composite(lbtype, 540, 95)
      .composite(lbprize, 600, 95)



    for (const userData of topUsers) {
      try {
				const avatarBuffer = await fetch(userData.avatarUrl).then(res => res.arrayBuffer())
				canvas.composite(
					(await Image.decode(avatarBuffer)).resize(20, 20).cropCircle(),
					315,
					userY - 10,
				)
      } catch {}

			const currentLevel =
				botCache.constants.levels.find(level => level.xpNeeded > userData.currentXP) ||
				botCache.constants.levels.last();

			const currentName = Image.renderText(fonts.SFTMedium, 18, userData.username, parseInt("2c2c2cFF", 16));
			const currentDiscrim = Image.renderText(fonts.SFTRegular, 13, userData.discriminator, parseInt("2c2c2cFF", 16));
			const currentLvl = Image.renderText(fonts.SFTMedium, 18, currentLevel.id, parseInt("2c2c2cFF", 16));
			const currentXP = Image.renderText(fonts.SFTMedium, 18, userData.currentXP, parseInt("2c2c2cFF", 16));

			canvas.composite(currentName, 350, userY - 12)
				.composite(currentDiscrim, 350, userY + 8)
				.composite(currentLvl, 485, userY)
				.composite(currentXP, 540, userY);

      // Update for next loop
      position++
      userY += 90
    }

		return new Blob([await canvas.encode()], { type: "image/png" });
  }

botCache.helpers.makeLocalCanvas = async function (message, member) {
	const settings = await db.xp.get(`${message.guildID}-${member.id}`);
	if (!settings?.xp) {
		botCache.helpers.reactError(message);
		return;
	}

	const relevant = (await db.xp.findMany({ guildID: message.guildID }, true)).sort((a, b) => b.xp - a.xp);

	const index = relevant.findIndex(r => r.memberID === member.id);

    const nextUser = relevant[index - 1]
    const prevUser = relevant[index + 1]

    const rankText = nextUser
      ? `${botCache.helpers.cleanNumber(nextUser.xp - settings.xp)} EXP Behind`
      : prevUser
      ? `${botCache.helpers.cleanNumber(settings.xp - prevUser.xp)} EXP Ahead`
      : 'Unknown'

    const userAvatar = await fetch(member.avatarURL).then(res => res.arrayBuffer())
    const username = member.tag.substring(0, member.tag.lastIndexOf("#")).replace(
      /([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])/g,
      ``
    )

    const topUserData = []
		for (const userData of relevant) {
			// Run a loop for the top 3 users
			if (topUserData.length === 3) break;

			// Get the user
			const user = await botCache.helpers.fetchMember(message.guildID, userData.memberID);
      if (!user) continue

      topUserData.push({
        avatarUrl: user.avatarURL,
        currentXP: userData.xp,
        username: user.tag.substring(0, member.tag.lastIndexOf("#")),
        discriminator: user.tag.substring(member.tag.lastIndexOf("#"))
      })
    }

	return buildCanvas(
			message.guildID,
      translate(message.guildID, 'strings:LEADERBOARD_SERVER'),
      userAvatar,
      username,
      member.tag.substring(member.tag.lastIndexOf("#")),
      index + 1,
      settings.xp,
      rankText,
      topUserData,
    )
}


export interface TopUserLeaderboard {
  avatarUrl: string;
  currentXP: number;
  username: string;
  discriminator: string;
}
