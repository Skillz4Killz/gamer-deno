import { Gamer } from "../bot.js";
import { strings } from "./...string.js";
import { number } from "./number.js";
import { string } from "./string.js";
import { subcommand } from "./subcommands.js";
import { user } from "./user.js";

export function loadArguments() {
    Gamer.arguments.set(user.name, user);
    Gamer.arguments.set(string.name, string);
    Gamer.arguments.set(number.name, number);
    Gamer.arguments.set(strings.name, strings);
    Gamer.arguments.set(subcommand.name, subcommand);
}
