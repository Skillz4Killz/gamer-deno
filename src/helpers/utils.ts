import { botCache } from "../../cache.ts";

botCache.helpers.chooseRandom = <T>(array: T[]) => {
  return array[Math.floor(Math.random() * array.length)]!;
};

botCache.helpers.toTitleCase = (text: string) => {
  return text.split(" ").map((word) =>
    word[0]
      ? `${word[0].toUpperCase()}${word.substring(1).toLowerCase()}`
      : word
  ).join(" ");
};
