import { Gamer } from "../bot.js";
import { user } from "./user.js";

export function loadArguments() {
    Gamer.arguments.set(user.name, user);
}