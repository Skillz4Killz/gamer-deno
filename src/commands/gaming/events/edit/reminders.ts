import { createSubcommand } from "../../../../utils/helpers.ts";

createSubcommand("events-edit", {
  name: "reminders",
  cooldown: {
    seconds: 30,
  },
  arguments: [
    { name: "subcommand", type: "subcommand" },
  ],
});
