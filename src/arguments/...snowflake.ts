import { botCache } from "../../cache.ts";

const SNOWFLAKE_REGEX = /[0-9]{17,19}/;

botCache.arguments.set("...snowflakes", {
  name: "...snowflakes",
  execute: function (argument, parameters) {
    return parameters.filter((text) => SNOWFLAKE_REGEX.test(text));
  },
});
