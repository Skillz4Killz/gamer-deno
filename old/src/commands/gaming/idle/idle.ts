import { createCommand } from "../../../utils/helpers.ts";

createCommand({
  name: "idle",
  execute: function (message) {
    return message.reply(`/idle`);
  },
});
