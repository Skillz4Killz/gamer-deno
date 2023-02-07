import { Gamer } from "../../bot.js";
import { TranslationKeys } from "./english.js";
import languages from "./index.js";

export function translate(guildId: string, key: TranslationKeys, ...args: any[]) {
    const value = languages[Gamer.vip.languages.get(guildId) ?? "english"][key];
    if (!value) {
        // TODO: errors - handle missing translation
        return key;
    }

    if (typeof value === "string") return value;

    // @ts-expect-error dynamic loading for many functions
    const text = value(...args);
    
    if (Array.isArray(text)) return text.join("\n");

    return text;
}
