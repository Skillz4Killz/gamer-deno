// This command is intentionally done in an un-optimized way. This command is only to show you how to await a users response.
import { botCache } from "../../../mod.ts";
import type { avatarURL, sendMessage } from "../../../deps.ts";
import type { Embed } from "../../utils/Embed.ts";
import type { sendEmbed } from "../../utils/helpers.ts";

botCache.commands.set(`roles`, {
  name: `roles`,
  guildOnly: true,
  arguments: [
    { name: "subcommand", type: "subcommand", literals: ["unique"] },
  ],
  execute: async (message, _args, guild) => {
  },
});
