import { Gamer } from "../bot.js";
import { user } from "./user.js";
import { string } from "./string.js";

export function loadArguments() {
    Gamer.arguments.set(user.name, user);
    Gamer.arguments.set(string.name, string);
}
