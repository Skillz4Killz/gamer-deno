import { Gamer } from "./bot.js";
import { startup } from "./startup.js";

// TODO: eslint - Setup same way as dd eslint
startup();

process.on("unhandledRejection", (reason, promise) => {
    console.log(reason);
    if (typeof reason === "string") {
        return Gamer.loggers.discord.error(reason, promise);
    }

    Gamer.loggers.discord.error(JSON.stringify(reason, undefined, 2));
});
