import { botCache } from "../../deps.ts";

const SNOWFLAKE_REGEX = /[0-9]{17,19}/;

botCache.arguments.set("snowflake", {
  name: "snowflake",
  execute: async function (argument, parameters) {
    let [text] = parameters;
    if (!text) return;
    // If its a nickname mention or role mention
    if (text.startsWith("<@!") || text.startsWith("<@&")) text = text.substring(3, text.length - 1);
    // If it's a user mention or channel mention
    if (text.startsWith("<@") || text.startsWith("<#")) text = text.substring(2, text.length - 1);

    if (text.length < 17 || text.length > 19) return;

    return SNOWFLAKE_REGEX.test(text) ? text : undefined;
  },
});
