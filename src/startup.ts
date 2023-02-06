import { Gamer } from "./bot";
import { configs } from "./configs";

export async function startup() {
    // Load database values into cache

    if (configs.platforms.discord.token) {
        await Gamer.discord.start();
    }

    if (configs.platforms.guilded.token) {
        // TODO: guilded - once guilded api is lib fix this code
        // await Gamer.guilded.start()
    }

    // Start up all tasks
}
