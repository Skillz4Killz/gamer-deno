// DEV PURPOSES ONLY
import { botCache } from "../../../mod.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { modlogsDatabase } from "../../database/schemas/modlogs.ts";
import { Embed } from "../../utils/Embed.ts";
import { usersDatabase } from "../../database/schemas/users.ts";
import { countingDatabase } from "../../database/schemas/counting.ts";

botCache.commands.set(`ddb`, {
  name: `ddb`,
  permissionLevels: [PermissionLevels.BOT_OWNER],
  execute: async function (message, args, guild) {
    usersDatabase.insertOne({
      userID: "77953962329767936",
      guildIDs: [],
      backgroundID: 0,
      theme: "",
      afkEnabled: false,
      afkMessage: false,
      isVIP: false,
      vipGuildIDs: [],
      boosts: [],
      xp: 0,
      coins: 10000000,
    });
    usersDatabase.insertOne({
      userID: "270273690074087427",
      guildIDs: [],
      backgroundID: 0,
      theme: "",
      afkEnabled: false,
      afkMessage: false,
      isVIP: false,
      vipGuildIDs: [],
      boosts: [],
      xp: 0,
      coins: 10000000,
    });
    usersDatabase.insertOne({
      userID: "275258547749650433",
      guildIDs: [],
      backgroundID: 0,
      theme: "",
      afkEnabled: false,
      afkMessage: false,
      isVIP: false,
      vipGuildIDs: [],
      boosts: [],
      xp: 0,
      coins: 10000000,
    });
  },
});
