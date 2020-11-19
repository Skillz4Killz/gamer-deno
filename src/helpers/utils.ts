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

botCache.helpers.chunkStrings = function (
  array: string[],
  size = 2000,
  separateLines = true,
) {
  const responses: string[] = [];
  let response = "";
  for (const text of array) {
    const nextText = response.length && separateLines ? `\n${text}` : text;
    if (response.length + nextText.length >= size) {
      responses.push(response);
      response = "";
    }
    response += nextText;
  }
  responses.push(response);
  return responses;
};
