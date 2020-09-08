import { botCache } from "../../mod.ts";

botCache.monitors.set("supportactivity", {
  name: "supportactivity",
  execute: async function (message) {
    if (message.guildID !== botCache.constants.botSupportServerID) return;
    if (botCache.activeMembersOnSupportServer.has(message.author.id)) return;

    botCache.activeMembersOnSupportServer.add(message.author.id);
  },
});
