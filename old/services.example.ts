import { fromFileUrl } from "./deps.ts";

export const services = {
  reddit: {
    directoryPath: `${fromFileUrl(Deno.mainModule.substring(0, Deno.mainModule.lastIndexOf("/")))}/db/`,
  },
  twitch: {
    directoryPath: `${fromFileUrl(Deno.mainModule.substring(0, Deno.mainModule.lastIndexOf("/")))}/db/`,
    // Your Twitch Client ID here. (https://dev.twitch.tv/docs/v5#getting-a-client-id)
    clientID: "",
    // Your Twitch Client Secret here. (You can get it in your Dashboard https://dev.twitch.tv/console/apps)
    clientSecret: "",
  },
  twitter: {
    directoryPath: `${fromFileUrl(Deno.mainModule.substring(0, Deno.mainModule.lastIndexOf("/")))}/db/`,
  },
};
