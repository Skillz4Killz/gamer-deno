import { botCache } from "../../../../mod.ts";
import { surveysDatabase } from "../../../database/schemas/surveys.ts";
import { sendResponse } from "../../../utils/helpers.ts";

botCache.commands.set("feedback", {
  name: "feedback",
  aliases: ["fb"],
  arguments: [
    { name: "subcommand", type: "subcommand" },
  ],
  guildOnly: true,
  execute: async function (message, args, guild) {
  },
});
