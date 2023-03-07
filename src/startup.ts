import { LogLevels } from "@discordeno/bot";
import { loadArguments } from "./arguments/index.js";
import { Gamer } from "./bot.js";
import { loadCommands, makeInteractionCommands } from "./commands/index.js";
import { configs } from "./configs.js";
import { setEventsOnGuilded } from "./events/guilded.js";

export async function startup() {
    Gamer.loggers.discord.setLevel(LogLevels.Debug);
    Gamer.loggers.guilded.setLevel(LogLevels.Debug);
    // Loads all the commands into Gamer.commands
    loadCommands();
    // Loads all the arguments that commands will need.
    loadArguments();

    // TODO: prisma - Load database values into cache

    if (configs.platforms.discord.token) {
        if (configs.devServerId) {
            const interactionCommands = makeInteractionCommands(configs.devServerId);
            Gamer.loggers.discord.info(`[Startup] Updating interaction commands.`);
            console.log(configs.devServerId, JSON.stringify(interactionCommands));

            const xxx = await Gamer.discord.rest.upsertGuildApplicationCommands(configs.devServerId, interactionCommands).catch(console.error);
            console.log(xxx);
            Gamer.loggers.discord.info(`[Startup] Updated interaction commands.`);
        }

        Gamer.loggers.discord.info(`[Startup] Starting Discord bot.`);
        await Gamer.discord.start();
        Gamer.loggers.discord.info(`[Startup] Started Discord bot.`);
    }

    if (configs.platforms.guilded.token) {
        // Adds event listeners to guilded client
        setEventsOnGuilded();

        Gamer.loggers.guilded.info(`[Startup] Starting Guilded bot.`);
        Gamer.guilded.login();
        Gamer.loggers.guilded.info(`[Startup] Starting Guilded bot.`);
    }

    // Start up all tasks
}

// const cmds = [
//     {
//         name: "avatar",
//         description: "🖼️ Shows the avatar of a user or yourself.",
//         options: [{ name: "user", description: "Provide a @user to view their avatar.", type: 6, required: false }],
//         type: 1,
//         nsfw: false,
//     },
//     {
//         name: "info",
//         description: "ℹ️ Get info of a user or yourself",
//         options: [{ name: "user", description: "The user", type: 6, required: false }],
//         type: 1,
//         nsfw: false,
//     },
//     { name: "invite", description: "🔗 Invite the bot to your server or get help in the support server.", options: [], type: 1, nsfw: false },
//     { name: "ping", description: "🏓 Shows the response time for the bot.", options: [], type: 1, nsfw: false },
//     {
//         name: "random",
//         description: "🔢 Pick a random number, send a random advice or ask 8ball a random question.",
//         options: [
//             {
//                 name: "number",
//                 description: "🔢 Pick a random number",
//                 type: 1,
//                 options: [
//                     { name: "min", description: "🔢 The random number will be higher than this minimum.", type: 10, required: true },
//                     { name: "max", description: "🔢 The random number will be lower than this maximum.", type: 10, required: true },
//                 ],
//             },
//             {
//                 name: "8ball",
//                 description: "🔮 Get answers to your questions!",
//                 type: 1,
//                 options: [{ name: "question", description: "🔮 What question would you like to ask?", type: 3, required: true }],
//             },
//             { name: "advice", description: "🗨️ Receive random advice in the chat.", type: 1, options: [] },
//         ],
//         type: 1,
//         nsfw: false,
//     },
//     {
//         name: "gif",
//         description: "Send a random gif!",
//         options: [
//             {
//                 name: "name",
//                 description: "the gif name",
//                 type: 3,
//                 choices: [
//                     { name: "baka", value: "baka", type: 3, description: "baka" },
//                     { name: "compliment", value: "compliment", type: 3, description: "compliment" },
//                     { name: "raphtalia", value: "raphtalia", type: 3, description: "raphtalia" },
//                     { name: "mavis", value: "mavis", type: 3, description: "mavis" },
//                     { name: "cuddle", value: "cuddle", type: 3, description: "cuddle" },
//                     { name: "hug", value: "hug", type: 3, description: "hug" },
//                     { name: "kiss", value: "kiss", type: 3, description: "kiss" },
//                     { name: "pat", value: "pat", type: 3, description: "pat" },
//                     { name: "poke", value: "poke", type: 3, description: "poke" },
//                     { name: "pony", value: "pony", type: 3, description: "pony" },
//                     { name: "puppy", value: "puppy", type: 3, description: "puppy" },
//                     { name: "slap", value: "slap", type: 3, description: "slap" },
//                     { name: "tickle", value: "tickle", type: 3, description: "tickle" },
//                     { name: "bite", value: "bite", type: 3, description: "bite" },
//                     { name: "dance", value: "dance", type: 3, description: "dance" },
//                     { name: "lmao", value: "lmao", type: 3, description: "lmao" },
//                     { name: "cry", value: "cry", type: 3, description: "cry" },
//                     { name: "zerotwo", value: "zerotwo", type: 3, description: "zerotwo" },
//                     { name: "kanna", value: "kanna", type: 3, description: "kanna" },
//                     { name: "kitten", value: "kitten", type: 3, description: "kitten" },
//                     { name: "supernatural", value: "supernatural", type: 3, description: "supernatural" },
//                     { name: "nezuko", value: "nezuko", type: 3, description: "nezuko" },
//                 ],
//                 required: true,
//             },
//         ],
//         type: 1,
//         nsfw: false,
//     },
// ];
