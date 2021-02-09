import { fromFileUrl } from "../../deps.ts";

export const configs = {
  database: {
    directoryPath: `${
      fromFileUrl(
        Deno.mainModule.substring(0, Deno.mainModule.lastIndexOf("/")),
      )
    }/db/`,
    // Your mongodb atlas connection url string here
    connectionURL: "",
    name: "dev",
  },
};
