import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createSubcommand, sendEmbed } from "../../../utils/helpers.ts";

createSubcommand("idle", {
    name: "leaderboard",
    execute: function (message) {
        const profiles = (await db.idle.findMany({}, true).sort((a, b) => b.currency - a.currency));
        const users = await db.idle.get(message.author.id);

        const embed = botCache.helpers.authorEmbed(message)
            .setColor("random")
            .setDescription(...profiles.map(
                (usr, index) =>
                  `${index + 1}. ${(cache.members.get(usr.id)?.tag || usr.userID).padEnd(20, " ")} ${BigInt(usr.currency).toLocaleString()}`
              ),
              "-----------",
              `${msg.author.username.padEnd(20)} ${BigInt(users.currency).toLocaleString()}`,
            ].join("\n"))
            ;

            sendEmbed(message.channelID, embed);

    }
})