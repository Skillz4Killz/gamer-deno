import { createSubcommand } from "../../utils/helpers.ts";

createSubcommand("settings", {
  name: "marriage",
  vipServerOnly: true,
  arguments: [
    { name: "enabled", type: "boolean" },
  ],
  execute: function (message, args) {
    db.guilds.update(message.guildID, { hideMarriage: args.enabled });
    botCache.helpers.reactSuccess(message);
  },
});
