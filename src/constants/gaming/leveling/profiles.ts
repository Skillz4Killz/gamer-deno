import { botCache, Image } from "../../../../deps.ts";

botCache.constants.backgrounds = [
  {
    id: 1,
    name: `Animecat`,
    blob: await Image.decode(
      await Deno.readFile(
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
      await Deno.readFile(
        new URL(
          "./../../../../assets/profile/Backgrounds/bf1pilot.jpg",
          import.meta.url,
        ),
      ),
    ),
    vipNeeded: false,
  },
  {
    id: 3,
    name: `unOrdinary`,
    blob: await Image.decode(
      await Deno.readFile(
        new URL(
          "./../../../../assets/profile/Backgrounds/unordinary.jpg",
          import.meta.url,
        ),
      ),
    ),
    vipNeeded: false,
  },
  {
    id: 4,
    name: `Free Fire 1`,
    blob: await Image.decode(
      await Deno.readFile(
        new URL(
          "./../../../../assets/profile/Backgrounds/freefire1.png",
          import.meta.url,
        ),
      ),
    ),
    vipNeeded: false,
  },
  {
    id: 5,
    name: `Free Fire 2`,
    blob: await Image.decode(
      await Deno.readFile(
        new URL(
          "./../../../../assets/profile/Backgrounds/freefire2.png",
          import.meta.url,
        ),
      ),
    ),
    vipNeeded: false,
  },
  {
    id: 6,
    name: `Free Fire 3`,
    blob: await Image.decode(
      await Deno.readFile(
        new URL(
          "./../../../../assets/profile/Backgrounds/freefire3.png",
          import.meta.url,
        ),
      ),
    ),
    vipNeeded: false,
  },
  {
    id: 7,
    name: `ATS - Submitted By BeardCaliper#1897`,
    blob: await Image.decode(
      await Deno.readFile(
        new URL(
          "./../../../../assets/profile/Backgrounds/ats.jpg",
          import.meta.url,
        ),
      ),
    ),
    vipNeeded: false,
  },
  {
    id: 8,
    name: `Dicey Cafe - Submitted By Derk#0127`,
    blob: await Image.decode(
      await Deno.readFile(
        new URL(
          "./../../../../assets/profile/Backgrounds/diceycafe.png",
          import.meta.url,
        ),
      ),
    ),
    vipNeeded: false,
  },
  {
    id: 9,
    name: `Control`,
    blob: await Image.decode(
      await Deno.readFile(
        new URL(
          "./../../../../assets/profile/Backgrounds/control.jpg",
          import.meta.url,
        ),
      ),
    ),
    vipNeeded: false,
  },
  {
    id: 10,
    name: `Ark Survival Evolved - Submitted By Aikage#4444`,
    blob: await Image.decode(
      await Deno.readFile(
        new URL(
          "./../../../../assets/profile/Backgrounds/ark.jpg",
          import.meta.url,
        ),
      ),
    ),
    vipNeeded: false,
  },
  {
    id: 11,
    name: `PlayerUnknown's Battlegrounds - Submitted By GeheimerWolf#8008`,
    blob: await Image.decode(
      await Deno.readFile(
        new URL(
          "./../../../../assets/profile/Backgrounds/pubg.png",
          import.meta.url,
        ),
      ),
    ),
    vipNeeded: false,
  },
  {
    id: 12,
    name: `Shop Titans`,
    blob: await Image.decode(
      await Deno.readFile(
        new URL(
          "./../../../../assets/profile/Backgrounds/shoptitans.jpg",
          import.meta.url,
        ),
      ),
    ),
    vipNeeded: false,
  },
  {
    id: 13,
    name: `Minecraft - Submitted By Aikage#4444`,
    blob: await Image.decode(
      await Deno.readFile(
        new URL(
          "./../../../../assets/profile/Backgrounds/minecraft.png",
          import.meta.url,
        ),
      ),
    ),
    vipNeeded: false,
  },
  {
    id: 14,
    name: `CodeVein - Submitted By Aikage#4444`,
    blob: await Image.decode(
      await Deno.readFile(
        new URL(
          "./../../../../assets/profile/Backgrounds/CodeVein.jpg",
          import.meta.url,
        ),
      ),
    ),
    vipNeeded: false,
  },
  {
    id: 15,
    name: `Final-Fantasy-VII - Submitted By Aikage#4444`,
    blob: await Image.decode(
      await Deno.readFile(
        new URL(
          "./../../../../assets/profile/Backgrounds/Final-Fantasy-VII.jpg",
          import.meta.url,
        ),
      ),
    ),
    vipNeeded: false,
  },
  {
    id: 16,
    name: `Something - Submitted By Aikage#4444`,
    blob: await Image.decode(
      await Deno.readFile(
        new URL(
          "./../../../../assets/profile/Backgrounds/something.png",
          import.meta.url,
        ),
      ),
    ),
    vipNeeded: false,
  },
  {
    id: 17,
    name: `Overwatch - Submitted By GeheimerWolf#8008`,
    blob: await Image.decode(
      await Deno.readFile(
        new URL(
          "./../../../../assets/profile/Backgrounds/Overwatch.png",
          import.meta.url,
        ),
      ),
    ),
    vipNeeded: false,
  },
  {
    id: 18,
    name: `ApexLegends`,
    blob: await Image.decode(
      await Deno.readFile(
        new URL(
          "./../../../../assets/profile/Backgrounds/apex.png",
          import.meta.url,
        ),
      ),
    ),
    vipNeeded: false,
  },
  {
    id: 19,
    name: `Wolf`,
    blob: await Image.decode(
      await Deno.readFile(
        new URL(
          "./../../../../assets/profile/Backgrounds/wolf.png",
          import.meta.url,
        ),
      ),
    ),
    vipNeeded: false,
  },
  {
    id: 20,
    name: `Fortnite`,
    blob: await Image.decode(
      await Deno.readFile(
        new URL(
          "./../../../../assets/profile/Backgrounds/fortnite.png",
          import.meta.url,
        ),
      ),
    ),
    vipNeeded: false,
  },
  {
    id: 21,
    name: `SadAnimeGirly - Submitted By GeheimerWolf#8008`,
    blob: await Image.decode(
      await Deno.readFile(
        new URL(
          "./../../../../assets/profile/Backgrounds/SadAnimeGirly.png",
          import.meta.url,
        ),
      ),
    ),
    vipNeeded: false,
  },
];
