import { botCache } from "../../mod.ts";

botCache.helpers.chooseRandom = <T>(array: T[]) => {
  return array[Math.floor(Math.random() * array.length)]!;
};
