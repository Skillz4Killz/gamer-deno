import {
  createSlashCommand,
  executeSlashCommand,
  startBot,
} from "https://raw.githubusercontent.com/discordeno/discordeno/master/mod.ts";

startBot({
  token: "Nzg1MTM3Mjg5MDcyMDgyOTY1.X8zeFA.9Xt2TXmKshIxxbEqtR0VKqNuYcU",
  intents: ["GUILDS", "GUILD_MESSAGES"],
  eventHandlers: {
    async ready() {
      console.log("Successfully connected to gateway");
      console.log(
        await createSlashCommand({
          name: "ping",
          description: "Testing testing...",
          guildID: "800080308921696296",
          options: [
            {
              type: 3,
              name: "test",
              description: "Ehhhh",
            },
          ],
        })
      );
    },
    messageCreate(message) {
      if (message.content === "!ping") {
        message.reply("Pong using Discordeno!");
      }
      console.log("ms", message);
    },
    async interactionCreate(data) {
      console.log("slash", data);
      await executeSlashCommand(data.id, data.token, {
        type: 4,
        data: {
          content: "HI",
        },
      });
    },
  },
});
