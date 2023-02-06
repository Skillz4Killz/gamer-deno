import { botCache, Collection, Image } from "../../../../deps.ts";

botCache.constants.themes = new Collection([
  [
    "white",
    {
      id: "white",
      rectangle: await Image.decode(
        Deno.readFileSync(new URL("./../../../../assets/profile/left_rectangle_white.png", import.meta.url))
      ),
      username: "000000FF",
      discriminator: "adadadFF",
      userdivider: "dadadaFF",
      xpbarText: "000000FF",
      xpbarRatioUp: "000000FF",
      xpbarRatioDown: "000000FF",
      badgeShadow: `rgba(161,161,161,1)`,
      badgeFilling: "e0e0e0FF",
      xpbarFilling: "e0e0e0FF",
      clanRectFilling: "363636B3",
      clanName: "8bccefFF",
      clanText: "fffFFFFF",
      clanURL: "fffFFFFF",
    },
  ],
  [
    "black",
    {
      id: "black",
      rectangle: await Image.decode(
        Deno.readFileSync(new URL("./../../../../assets/profile/left_rectangle_black.png", import.meta.url))
      ),
      username: "fffFFFFF",
      discriminator: "fffFFFFF",
      userdivider: "dadadaFF",
      xpbarText: "fffFFFFF",
      xpbarRatioUp: "000000FF",
      xpbarRatioDown: "000000FF",
      badgeShadow: `rgba(100,100,100,.7)`,
      badgeFilling: "5D5D5DFF",
      xpbarFilling: "5D5D5DFF",
      clanRectFilling: "363636B3",
      clanName: "8bccefFF",
      clanText: "fffFFFFF",
      clanURL: "fffFFFFF",
    },
  ],
  [
    "orange",
    {
      id: "orange",
      rectangle: await Image.decode(
        Deno.readFileSync(new URL("./../../../../assets/profile/left_rectangle_orange.png", import.meta.url))
      ),
      username: "000000FF",
      discriminator: "000000FF",
      userdivider: "dadadaFF",
      xpbarText: "000000FF",
      xpbarRatioUp: "000000FF",
      xpbarRatioDown: "000000FF",
      badgeShadow: `rgba(100,100,100,.7)`,
      badgeFilling: "5d5d5d",
      xpbarFilling: "5d5d5d",
      clanRectFilling: "36363680",
      clanName: "8bccefFF",
      clanText: "fffFFFFF",
      clanURL: "fffFFFFF",
    },
  ],
  [
    "red",
    {
      id: "red",
      rectangle: await Image.decode(
        Deno.readFileSync(new URL("./../../../../assets/profile/left_rectangle_red.png", import.meta.url))
      ),
      username: "fffFFFFF",
      discriminator: "fffFFFFF",
      userdivider: "dadadaFF",
      xpbarText: "fffFFFFF",
      xpbarRatioUp: "000000FF",
      xpbarRatioDown: "000000FF",
      badgeShadow: `rgba(100,100,100,.7)`,
      badgeFilling: "5d5d5d",
      xpbarFilling: "5d5d5d",
      clanRectFilling: "363636B3",
      clanName: "8bccefFF",
      clanText: "fffFFFFF",
      clanURL: "fffFFFFF",
    },
  ],
  [
    "green",
    {
      id: "green",
      rectangle: await Image.decode(
        Deno.readFileSync(new URL("./../../../../assets/profile/left_rectangle_green.png", import.meta.url))
      ),
      username: "fffFFFFF",
      discriminator: "fffFFFFF",
      userdivider: "dadadaFF",
      xpbarText: "fffFFFFF",
      xpbarRatioUp: "000000FF",
      xpbarRatioDown: "000000FF",
      badgeShadow: `rgba(100,100,100,.7)`,
      badgeFilling: "5D5D5DFF",
      xpbarFilling: "5D5D5DFF",
      clanRectFilling: "363636B3",
      clanName: "8bccefFF",
      clanText: "fffFFFFF",
      clanURL: "fffFFFFF",
    },
  ],
  [
    "purple",
    {
      id: "purple",
      rectangle: await Image.decode(
        Deno.readFileSync(new URL("./../../../../assets/profile/left_rectangle_purple.png", import.meta.url))
      ),
      username: "fffFFFFF",
      discriminator: "fffFFFFF",
      userdivider: "dadadaFF",
      xpbarText: "fffFFFFF",
      xpbarRatioUp: "000000FF",
      xpbarRatioDown: "000000FF",
      badgeShadow: `rgba(100,100,100,.7)`,
      badgeFilling: "5D5D5DFF",
      xpbarFilling: "5D5D5DFF",
      clanRectFilling: "363636B3",
      clanName: "8bccefFF",
      clanText: "fffFFFFF",
      clanURL: "fffFFFFF",
    },
  ],
  [
    "blue",
    {
      id: "blue",
      rectangle: await Image.decode(
        Deno.readFileSync(new URL("./../../../../assets/profile/left_rectangle_blue.png", import.meta.url))
      ),
      username: "fffFFFFF",
      discriminator: "fffFFFFF",
      userdivider: "dadadaFF",
      xpbarText: "fffFFFFF",
      xpbarRatioUp: "000000FF",
      xpbarRatioDown: "000000FF",
      badgeShadow: `rgba(100,100,100,.7)`,
      badgeFilling: "5D5D5DFF",
      xpbarFilling: "5D5D5DFF",
      clanRectFilling: "363636B3",
      clanName: "8bccefFF",
      clanText: "fffFFFFF",
      clanURL: "fffFFFFF",
    },
  ],
]);
