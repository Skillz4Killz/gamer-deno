import { botCache } from "../../cache.ts";
import { translate } from "../utils/i18next.ts";

botCache.arguments.set("boolean", {
  name: "boolean",
  execute: function (_argument, parameters, message) {
    const [boolean] = parameters;

    if ([
      "true",
      "false",
      "on",
      "off",
      translate(message.guildID, "strings:TRUE"),
      translate(message.guildID, "strings:FALSE"),
      translate(message.guildID, "strings:ON"),
      translate(message.guildID, "strings:OFF"),
    ].includes(boolean)) return ["true", "on", translate(message.guildID, "strings:TRUE"), translate(message.guildID, "strings:ON")].includes(boolean);
  },
});
