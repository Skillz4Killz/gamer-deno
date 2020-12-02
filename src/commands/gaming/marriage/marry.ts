import {
  addReactions,
  botCache,
  chooseRandom,
  deleteMessageByID,
  rawAvatarURL,
} from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { Embed } from "../../../utils/Embed.ts";
import { createCommand, sendResponse } from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";
import { parsePrefix } from "../../../monitors/commandHandler.ts";
import { TenorGif } from "../../fun/fungifs.ts";

createCommand({
  name: "marry",
  aliases: ["propose"],
  arguments: [
    { name: "member", type: "member" },
  ] as const,
  execute: async function (message, args) {
    if (args.member.id === message.author.id) {
      sendResponse(
        message,
        translate(message.guildID, "strings:MARRY_NOT_SELF"),
      );
      return botCache.helpers.reactError(message);
    }

    if (args.member.bot) {
      sendResponse(
        message,
        translate(message.guildID, "strings:MARRY_NOT_BOT"),
      );
      return botCache.helpers.reactError(message);
    }

    const marriage = await db.marriages.get(message.author.id);
    if (marriage) {
      sendResponse(
        message,
        translate(message.guildID, "strings:MARRY_YOU_ARE_MARRIED"),
      );
      return botCache.helpers.reactError(message);
    }

    // Marriages where someone else iniated it to this user.
    const relevantMarriages = await db.marriages.findMany(
      (value) => value.spouseID === message.author.id,
      true,
    );

    // If any other marriage with this user has been accepted cancel out.
    for (const relevantMarriage of relevantMarriages) {
      if (relevantMarriage.accepted) {
        return botCache.helpers.reactError(message);
      }
      // If the current user is the spouse of another user propsing. Then this user has accepted the marriage
      if (relevantMarriage.id === args.member.id) {
        sendResponse(
          message,
          [
            translate(
              message.guildID,
              "strings:MARRY_MARRIED_IN_THOUGHT_1",
              { spouse: args.member.tag, mention: `<@!${message.author.id}>` },
            ),
            "",
            translate(message.guildID, "strings:MARRY_MARRIED_IN_THOUGHT_2"),
          ].join("\n"),
        );

        // Update marriages
        db.marriages.update(message.author.id, {
          spouseID: args.member.id,
          accepted: true,
          step: relevantMarriage.step,
          lifeStep: relevantMarriage.lifeStep,
          love: relevantMarriage.love,
        });

        db.marriages.update(relevantMarriage.id, { accepted: true });

        return botCache.helpers.reactSuccess(message);
      }
    }

    // Since the user is not in a marriage we can begin a marriage simulation for them
    const propose = await sendResponse(
      message,
      [
        translate(
          message.guildID,
          "strings:MARRY_PROPOSE_1",
          { coins: botCache.constants.emojis.coin },
        ),
        "",
        ...[2, 3, 4, 5].map((num) =>
          translate(
            message.guildID,
            `strings:MARRY_PROPOSE_${num}`,
            { coins: botCache.constants.emojis.coin },
          )
        ),
      ].join("\n"),
    );

    db.marriages.update(message.author.id, {
      spouseID: args.member.id,
      accepted: false,
      step: 0,
      lifeStep: 0,
      love: 0,
    });

    const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣"];
    await addReactions(message.channelID, propose.id, emojis);
    const response = await botCache.helpers.needReaction(
      message.author.id,
      propose.id,
    );
    if (!response || !emojis.includes(response)) {
      deleteMessageByID(message.channelID, propose.id).catch(() => undefined);
      return botCache.helpers.reactError(message);
    }

    const search = response === "1️⃣"
      ? "love letter"
      : response === "2️⃣"
      ? "romantic picnic"
      : response === "3️⃣"
      ? "romantic dinner"
      : "wedding proposal";

    const embed = new Embed()
      .setAuthor(
        translate(
          message.guildID,
          "strings:MARRY_PROPOSAL",
          { user: message.author.username, spouse: args.member.tag },
        ),
        rawAvatarURL(
          message.author.id,
          message.author.discriminator,
          message.author.avatar,
        ),
      )
      .setDescription(
        translate(message.guildID, "strings:MARRY_HOW_TO_ACCEPT", {
          user: `<@!${message.author.id}>`,
          prefix: parsePrefix(message.guildID),
        }),
      );

    // Get a random gif regarding the option the user chose
    if (!botCache.tenorDisabledGuildIDs.has(message.guildID)) {
      const data: TenorGif | undefined = await fetch(
        `https://api.tenor.com/v1/search?q=${search}&key=LIVDSRZULELA&limit=50`,
      )
        .then((res) => res.json())
        .catch(() => undefined);
      if (data?.results?.length) {
        const randomResult = chooseRandom(data.results);
        const [media] = randomResult.media;

        if (media) embed.setImage(media.gif.url);
        embed.setFooter(`Via Tenor`, args.member.avatarURL);
      }
    }

    // Send a message so the spouse is able to learn how to accept the marriage
    sendResponse(message, {
      content: `<@!${args.member.id}>`,
      embed,
    });

    // Embed that tells the user they can still continue the marriage simulation
    const thoughtOnlyEmbed = botCache.helpers.authorEmbed(message)
      .setDescription(
        [
          translate(message.guildID, "strings:MARRY_THOUGHT_ONLY_1"),
          "",
          translate(message.guildID, "strings:MARRY_THOUGHT_ONLY_2"),
        ].join("\n"),
      )
      .setImage("https://i.imgur.com/WwBfZfa.jpg");

    sendResponse(message, { embed: thoughtOnlyEmbed });
    sendResponse(
      message,
      translate(
        message.guildID,
        "strings:MARRY_TIME_TO_SHOP",
        { prefix: parsePrefix(message.guildID) },
      ),
    );
  },
});
