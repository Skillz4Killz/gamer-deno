import { Gamer } from "../../bot.js";
import { random } from "../../utils/helpers.js";
import { TranslationKeys, TranslationKeysForArrays } from "./english.js";
import languages from "./index.js";

export function translate(guildId: string, key: TranslationKeys, ...args: any[]) {
    const value = languages[Gamer.vip.languages.get(guildId) ?? "english"][key];
    if (!value) {
        console.log('MISSING KEY', key);
        // TODO: errors - handle missing translation
        return key;
    }

    if (typeof value === "string") return value;

    if (Array.isArray(value)) return random(value);

    // @ts-expect-error dynamic loading for many functions
    const text = value(...args);

    if (Array.isArray(text)) return text.join("\n");

    return text;
}

export function translateArray(guildId: string, key: TranslationKeysForArrays, ...args: any[]) {
    const value = languages[Gamer.vip.languages.get(guildId) ?? "english"][key];
    if (!value) {
        // TODO: errors - handle missing translation
        return [key];
    }

    if (Array.isArray(value)) return value;

    // @ts-expect-error dynamic loading for many functions
    const text = value(...args);

    return Array.isArray(text) ? text : [];
}
