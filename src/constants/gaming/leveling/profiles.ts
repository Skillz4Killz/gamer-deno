import { botCache, Image } from "../../../../deps.ts";

botCache.constants.backgrounds = [
  {
    id: 1,
    name: `Animecat`,
    blob: await Image.decode(
      Deno.readFileSync(
        new URL(
          "./../../../../assets/profile/Backgrounds/animecat.png",
          import.meta.url,
        ),
      ),
    ),
    vipNeeded: false,
  },
  {
    id: 2,
    name: `BF1 Assault`,
    blob: await Image.decode(
      Deno.readFileSync(
        new URL("./../../../../assets/profile/Backgrounds/bf1pilot.jpg"),
      ),
    ),
    vipNeeded: false,
  },
  {
    id: 3,
    name: `unOrdinary`,
    blob: await Image.decode(
      Deno.readFileSync(
        new URL("./../../../../assets/profile/Backgrounds/unordinary.jpg"),
      ),
    ),
    vipNeeded: false,
  },
  {
    id: 4,
    name: `Free Fire 1`,
    blob: await Image.decode(
      Deno.readFileSync(
        new URL("./../../../../assets/profile/Backgrounds/freefire1.png"),
      ),
    ),
    vipNeeded: false,
  },
  {
    id: 5,
    name: `Free Fire 2`,
    blob: await Image.decode(
      Deno.readFileSync(
        new URL("./../../../../assets/profile/Backgrounds/freefire2.png"),
      ),
    ),
    vipNeeded: false,
  },
  {
    id: 6,
    name: `Free Fire 3`,
    blob: await Image.decode(
      Deno.readFileSync(
        new URL("./../../../../assets/profile/Backgrounds/freefire3.png"),
      ),
    ),
    vipNeeded: false,
  },
  {
    id: 7,
    name: `ATS - Submitted By BeardCaliper#1897`,
    blob: await Image.decode(
      Deno.readFileSync(new URL("./../../../../assets/profile/Backgrounds/ats.jpg")),
    ),
    vipNeeded: false,
  },
  {
    id: 8,
    name: `Dicey Cafe - Submitted By Derk#0127`,
    blob: await Image.decode(
      Deno.readFileSync(
        new URL("./../../../../assets/profile/Backgrounds/diceycafe.png"),
      ),
    ),
    vipNeeded: false,
  },
  {
    id: 9,
    name: `Control`,
    blob: await Image.decode(
      Deno.readFileSync(
        new URL("./../../../../assets/profile/Backgrounds/control.jpg"),
      ),
    ),
    vipNeeded: false,
  },
  {
    id: 10,
    name: `Ark Survival Evolved - Submitted By Aikage#4444`,
    blob: await Image.decode(
      Deno.readFileSync(new URL("./../../../../assets/profile/Backgrounds/ark.jpg")),
    ),
    vipNeeded: false,
  },
  {
    id: 11,
    name: `PlayerUnknown's Battlegrounds - Submitted By GeheimerWolf#8008`,
    blob: await Image.decode(
      Deno.readFileSync(
        new URL("./../../../../assets/profile/Backgrounds/pubg.png"),
      ),
    ),
    vipNeeded: false,
  },
  {
    id: 12,
    name: `Shop Titans`,
    blob: await Image.decode(
      Deno.readFileSync(
        new URL("./../../../../assets/profile/Backgrounds/shoptitans.jpg"),
      ),
    ),
    vipNeeded: false,
  },
  {
    id: 13,
    name: `Minecraft - Submitted By Aikage#4444`,
    blob: await Image.decode(
      Deno.readFileSync(
        new URL("./../../../../assets/profile/Backgrounds/minecraft.png"),
      ),
    ),
    vipNeeded: false,
  },
  {
    id: 14,
    name: `CodeVein - Submitted By Aikage#4444`,
    blob: await Image.decode(
      Deno.readFileSync(
        new URL("./../../../../assets/profile/Backgrounds/CodeVein.jpg"),
      ),
    ),
    vipNeeded: false,
  },
  {
    id: 15,
    name: `Final-Fantasy-VII - Submitted By Aikage#4444`,
    blob: await Image.decode(
      Deno.readFileSync(
        new URL("./../../../../assets/profile/Backgrounds/Final-Fantasy-VII.jpg"),
      ),
    ),
    vipNeeded: false,
  },
  {
    id: 16,
    name: `Something - Submitted By Aikage#4444`,
    blob: await Image.decode(
      Deno.readFileSync(
        new URL("./../../../../assets/profile/Backgrounds/something.png"),
      ),
    ),
    vipNeeded: false,
  },
  {
    id: 17,
    name: `Overwatch - Submitted By GeheimerWolf#8008`,
    blob: await Image.decode(
      Deno.readFileSync(
        new URL("./../../../../assets/profile/Backgrounds/Overwatch.png"),
      ),
    ),
    vipNeeded: false,
  },
  {
    id: 18,
    name: `ApexLegends`,
    blob: await Image.decode(
      Deno.readFileSync(
        new URL("./../../../../assets/profile/Backgrounds/apex.png"),
      ),
    ),
    vipNeeded: false,
  },
  {
    id: 19,
    name: `Wolf`,
    blob: await Image.decode(
      Deno.readFileSync(
        new URL("./../../../../assets/profile/Backgrounds/wolf.png"),
      ),
    ),
    vipNeeded: false,
  },
  {
    id: 20,
    name: `Fortnite`,
    blob: await Image.decode(
      Deno.readFileSync(
        new URL("./../../../../assets/profile/Backgrounds/fortnite.png"),
      ),
    ),
    vipNeeded: false,
  },
  {
    id: 21,
    name: `SadAnimeGirly - Submitted By GeheimerWolf#8008`,
    blob: await Image.decode(
      Deno.readFileSync(
        new URL("./../../../../assets/profile/Backgrounds/SadAnimeGirly.png"),
      ),
    ),
    vipNeeded: false,
  },
];
