import { botCache } from "../../../../../deps.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";

// const answerTypes = [
//   { type: `string`, value: `One word text.` },
//   { type: `...string`, value: `Multiple words text.` },
//   { type: `number`, value: `Number` },
//   { type: `member`, value: `@member or member ID.` },
//   { type: `members`, value: `Multiple members.` },
//   { type: `snowflake`, value: `User ID (does not have to be on the server).` },
//   { type: `...snowflakes`, value: `Multiple user IDs` },
//   { type: `multiple choice`, value: `Multiple Choice` },
// ];

// TODO: better error message

createSubcommand("surveys", {
  name: "edit",
  arguments: [{ name: "subcommand", type: "subcommand" }],
  execute: async function (message) {
    return botCache.helpers.reactError(message);
  },
});
