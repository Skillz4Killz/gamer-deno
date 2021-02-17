import { botCache, cache } from "../../../../deps.ts";

export const epicUpgradeLevels = [
  1,
  25,
  50,
  75,
  100,
  150,
  200,
  300,
  400,
  500,
  600,
  700,
  800,
  900,
  1000,
  1250,
  1500,
  2000,
];

export function epicUpgradeResponse(type?: string, note?: string) {
  const response = ["strings:HEY_THERE", "", "strings:CONGRATS", ""];
  if (note) response.push(note, "");
  response.push(type || "strings:UPGRADING_FRIENDS", "", "strings:LONG_LIVE");
  return response.join("\n");
}

botCache.constants.idle = {
  boostEmoji: "💵",
  items: ["friends", "servers", "channels", "roles", "perms", "messages", "invites", "bots", "hypesquads", "nitro"],
  constants: {
    friends: {
      baseCost: 5,
      baseProfit: 1,
      upgrades: new Map([
        [
          1,
          {
            meme: "https://i.imgur.com/UFMQUt6.png",
          },
        ],
        [
          25,
          {
            response: [
              "strings:HEY_THERE",
              "",
              "strings:CONGRATS",
              "",
              "strings:FRIENDS_25_NOTE",
              "",
              "strings:FRIENDS_25_NOTE_2",
              "",
              "strings:UPGRADING_FRIENDS",
              "",
              "strings:LONG_LIVE",
            ].join("\n"),
            meme: "https://i.imgur.com/w4KNM37.png",
          },
        ],
        [
          50,
          {
            title: "strings:FRIENDS_50_TITLE",
            response: [
              "strings:HEY_THERE",
              "",
              "strings:CONGRATS",
              "",
              "strings:FRIENDS_50_NOTE",
              "",
              "strings:FRIENDS_50_NOTE_2",
              "",
              "strings:UPGRADING_FRIENDS",
              "",
              "strings:LONG_LIVE",
            ].join("\n"),
            meme: "https://i.imgur.com/oROSWDq.png",
          },
        ],
        [
          75,
          {
            meme: "https://media.giphy.com/media/1rHx0xjZnBFa8/giphy.gif",
          },
        ],
        [
          100,
          {
            meme: "https://media.giphy.com/media/eGmervd1fME3TmHY06/giphy.gif",
          },
        ],
        [
          150,
          {
            meme: "https://media.giphy.com/media/29IalLLWizqz8SViU1/giphy.gif",
          },
        ],
        [
          200,
          {
            meme: "https://media.giphy.com/media/l0HlPiHF9ui1FoQ48/giphy.gif",
          },
        ],
        [
          300,
          {
            meme: "https://media.giphy.com/media/Pcj3Zovdd6Afe/giphy.gif",
          },
        ],
        [
          400,
          {
            meme: "https://media.giphy.com/media/3orif7aLUehOfdmlXy/giphy.gif",
          },
        ],
        [
          500,
          {
            meme: "https://media.giphy.com/media/WQlCc9lPd0ffkaH8NB/giphy.gif",
          },
        ],
        [
          600,
          {
            meme: "https://media.giphy.com/media/QC1TssrPbkD2menNfz/giphy.gif",
          },
        ],
        [
          700,
          {
            meme: "https://media.giphy.com/media/tolFEWW90XwoE/giphy.gif",
          },
        ],
        [
          800,
          {
            meme: "https://media.giphy.com/media/Ii7pTFaYe9syY/giphy.gif",
          },
        ],
        [
          900,
          {
            meme: "https://media.giphy.com/media/144w9oUIZfoxZC/giphy.gif",
          },
        ],
        [
          1000,
          {
            meme: "https://media.giphy.com/media/YTDZakyAorkLDYqN0q/giphy.gif",
          },
        ],
        [
          1250,
          {
            meme: "https://media.giphy.com/media/WS6ACu6QroN7mZxASM/giphy.gif",
          },
        ],
        [
          1500,
          {
            meme: "https://media.giphy.com/media/3pTtbLJ7Jd0YM/giphy.gif",
          },
        ],
        [
          2000,
          {
            meme: "https://pics.me.me/thumb_hey-mom-can-have-10-dollars-for-discord-nitro-ok-38857952.png",
          },
        ],
      ]),
    },
    servers: {
      baseCost: 60,
      baseProfit: 30,
      upgrades: new Map([
        [
          1,
          {
            meme: "https://media.giphy.com/media/zk0zTXQY5ukCs/giphy.gif",
          },
        ],
        [
          25,
          {
            response: [
              "strings:HEY_THERE",
              "",
              "strings:CONGRATS",
              "",
              "strings:SERVERS_25_NOTE",
              "",
              "strings:SERVERS_25_NOTE_2",
              "",
              "strings:UPGRADING_SERVERS",
              "",
              "strings:LONG_LIVE",
            ].join("\n"),
            meme: "https://media.giphy.com/media/3orieTkrWcfZhc3WV2/giphy.gif",
          },
        ],
        [
          50,
          {
            meme: "https://media.giphy.com/media/Yo7apLkyBbKlGaV6ZF/giphy.gif",
          },
        ],
        [
          75,
          {
            meme: "https://i.imgur.com/XQoCURf.png",
          },
        ],
        [
          100,
          {
            meme: "https://media.giphy.com/media/JrtrM1bvV6psk/giphy.gif",
          },
        ],
        [
          150,
          {
            meme: "https://media.giphy.com/media/rrDuikSJh7Xi0/giphy.gif",
          },
        ],
        [
          200,
          {
            meme: "https://media.giphy.com/media/26u4hHj87jMePiO3u/giphy.gif",
          },
        ],
        [
          300,
          {
            meme: "https://media.giphy.com/media/RMNPs5TfCMDFS/giphy.gif",
          },
        ],
        [
          400,
          {
            meme: "https://www.memecreator.org/static/images/memes/4606440.jpg",
          },
        ],
        [
          500,
          {
            meme: "https://media.giphy.com/media/10vA3MTGTKeb16/giphy.gif",
          },
        ],
        [
          600,
          {
            response: epicUpgradeResponse("strings:UPGRADING_SERVERS"),
            meme: "https://media.giphy.com/media/14vFOciTnQjnl6/giphy.gif",
          },
        ],
        [
          700,
          {
            meme: "https://media.giphy.com/media/cniCpOSDrSF6nE0vGx/giphy.gif",
          },
        ],
        [
          800,
          {
            meme: "https://media.giphy.com/media/cJAmlBX0MwYFqWhvl7/giphy.gif",
          },
        ],
        [
          900,
          {
            meme: "https://media.giphy.com/media/l3q2SDNVcOVUkl2FO/giphy.gif",
          },
        ],
        [
          1000,
          {
            meme: "https://media.giphy.com/media/ZY7yUQc1pcI5a/giphy.gif",
          },
        ],
        [
          1250,
          {
            meme: "https://media.giphy.com/media/ZY7yUQc1pcI5a/giphy.gif",
          },
        ],
        [
          1500,
          {
            meme: "https://media.giphy.com/media/kkYbDLFmNvO4E/giphy.gif",
          },
        ],
        [
          2000,
          {
            meme: "https://media.giphy.com/media/xT9IgwexMXUabGnwPu/giphy.gif",
          },
        ],
      ]),
    },
    channels: {
      baseCost: 720,
      baseProfit: 90,
      upgrades: new Map([
        [
          1,
          {
            meme: "https://media.giphy.com/media/SHwadBpiZDrC0GoGen/giphy.gif",
          },
        ],
        [
          25,
          {
            meme: "https://media.giphy.com/media/DowKEtWnLZcru/giphy.gif",
          },
        ],
        [
          50,
          {
            meme: "https://media.giphy.com/media/10tFdsx3e3TLGw/giphy.gif",
          },
        ],
        [
          75,
          {
            meme: "https://media.giphy.com/media/QmETVm2HiXIeqxpnpO/giphy.gif",
          },
        ],
        [
          100,
          {
            meme: "https://media.giphy.com/media/3ohzdOf5NqP404fi5W/giphy.gif",
          },
        ],
        [
          150,
          {
            meme: "https://media.giphy.com/media/ro9NLUOiIMAJa/giphy.gif",
          },
        ],
        [
          200,
          {
            meme: "https://media.giphy.com/media/i2AG4hyTP4WRi/giphy.gif",
          },
        ],
        [
          300,
          {
            meme: "https://media.giphy.com/media/KEPQfFa3CtzCE/giphy.gif",
          },
        ],
        [
          400,
          {
            meme: "https://media.giphy.com/media/KEPQfFa3CtzCE/giphy.gif",
          },
        ],
        [
          500,
          {
            meme: "https://media.giphy.com/media/lwdzpYxsi4iJi/giphy.gif",
          },
        ],
        [
          600,
          {
            meme: "https://media.giphy.com/media/3oEjI1erPMTMBFmNHi/giphy.gif",
          },
        ],
        [
          700,
          {
            meme: "https://media.giphy.com/media/3oEjI1erPMTMBFmNHi/giphy.gif",
          },
        ],
        [
          800,
          {
            meme: "https://media.giphy.com/media/l41YnSDHZiUpTK5gI/giphy.gif",
          },
        ],
        [
          900,
          {
            meme: "https://media.giphy.com/media/l46C4wJmWbMPK52pi/giphy.gif",
          },
        ],
        [
          1000,
          {
            meme: "https://media.giphy.com/media/PjTSEQy85NKOlZ7b19/giphy.gif",
          },
        ],
        [
          1250,
          {
            meme: "https://media.giphy.com/media/3o6ZteOz7Uz6bE4l6U/giphy.gif",
          },
        ],
        [
          1500,
          {
            meme: "https://media.giphy.com/media/h4a9QBNclmw2oQo5bQ/giphy.gif",
          },
        ],
        [
          2000,
          {
            meme: "https://media.giphy.com/media/3oKHWtXlzTHeuVewtq/giphy.gif",
          },
        ],
      ]),
    },
    roles: {
      baseCost: 8640,
      baseProfit: 360,
      upgrades: new Map([
        [
          1,
          {
            meme:
              "https://media.discordapp.net/attachments/743178139840282695/769974493543268402/15bd3963-9e3a-454d-ac39-caf6a6f8828c.gif",
          },
        ],
        [
          25,
          {
            meme: "https://media.discordapp.net/attachments/743178139840282695/769976275409829888/tenor_2.gif",
          },
        ],
        [
          50,
          {
            meme: "https://media.giphy.com/media/yyvSeRGVj4C64/giphy.gif",
          },
        ],
        [
          75,
          {
            meme: "https://media.giphy.com/media/fSYYG9MSibrmPSuIJ0/giphy.gif",
          },
        ],
        [
          100,
          {
            meme: "https://media.giphy.com/media/dtCCnQflezjzEmnMK1/giphy.gif",
          },
        ],
        [
          150,
          {
            meme: "https://media.giphy.com/media/kolvlRnXh8Jj2/giphy.gif",
          },
        ],
        [
          200,
          {
            meme: "https://media.giphy.com/media/pVsn5LJEgMKxa/giphy.gif",
          },
        ],
        [
          300,
          {
            meme: "https://media.giphy.com/media/PR6NHmlwqjY6cElZoy/giphy.gif",
          },
        ],
        [
          400,
          {
            meme: "https://media.giphy.com/media/xT0BKqB8KIOuqJemVW/giphy.gif",
          },
        ],
        [
          500,
          {
            meme: "https://media.giphy.com/media/l0HUbtILos6CdAtxu/giphy.gif",
          },
        ],
        [
          600,
          {
            meme: "https://media.giphy.com/media/xT0BKo02mjcHeQt7eE/giphy.gif",
          },
        ],
        [
          700,
          {
            meme: "https://media.giphy.com/media/3o7OsPLf0GDtxIaoDu/giphy.gif",
          },
        ],
        [
          800,
          {
            meme: "https://media.giphy.com/media/1403NM07JJ5FiU/giphy.gif",
          },
        ],
        [
          900,
          {
            meme: "https://media.giphy.com/media/d8SEquJZTr4JOhpYJO/giphy.gif",
          },
        ],
        [
          1000,
          {
            meme: "https://media.giphy.com/media/d8SEquJZTr4JOhpYJO/giphy.gif",
          },
        ],
        [
          1250,
          {
            meme: "https://media.giphy.com/media/tdkx9be2XuHAs/giphy.gif",
          },
        ],
        [
          1500,
          {
            meme: "https://media.giphy.com/media/iNxi3TWwhwYehzY9IM/giphy.gif",
          },
        ],
        [
          2000,
          {
            meme: "https://media.giphy.com/media/2yONfL3nfII1y/giphy.gif",
          },
        ],
      ]),
    },
    perms: {
      baseCost: 103680,
      baseProfit: 2880,
      upgrades: new Map([
        [
          1,
          {
            meme: "https://media.giphy.com/media/ToMjGpxvUfCMc87QboQ/giphy.gif",
          },
        ],
        [
          25,
          {
            meme: "https://media.giphy.com/media/fGX4fTkX3ob6On5Do4/giphy.gif",
          },
        ],
        [
          50,
          {
            meme: "https://media.giphy.com/media/l0HU20BZ6LbSEITza/giphy.gif",
          },
        ],
        [
          75,
          {
            meme: "https://media.giphy.com/media/3ohhwwpMswCHpgD9eg/giphy.gif",
          },
        ],
        [
          100,
          {
            meme: "https://media.giphy.com/media/aHFyaeZ1FLjYDfGE9C/giphy.gif",
          },
        ],
        [
          150,
          {
            meme: "https://media.giphy.com/media/h36vh423PiV9K/giphy.gif",
          },
        ],
        [
          200,
          {
            meme: "https://media.giphy.com/media/8HqjtoyKrnfJC/giphy.gif",
          },
        ],
        [
          300,
          {
            meme: "https://media.giphy.com/media/oHxvbzgmkQa4DVwAu1/giphy.gif",
          },
        ],
        [
          400,
          {
            meme: "https://media.giphy.com/media/zPOErRpLtHWbm/giphy.gif",
          },
        ],
        [
          500,
          {
            meme: "https://media.giphy.com/media/3VCYo7JnaTrnW/giphy.gif",
          },
        ],
        [
          600,
          {
            meme: "https://media.giphy.com/media/l2R09jc6eZIlfXKlW/giphy.gif",
          },
        ],
        [
          700,
          {
            meme: "https://media.giphy.com/media/JEVYf4g2ePr6o/giphy.gif",
          },
        ],
        [
          800,
          {
            meme: "https://media.giphy.com/media/ooHjwTt6rkk6I/giphy.gif",
          },
        ],
        [
          900,
          {
            meme: "https://media.giphy.com/media/NshsZXMuzcahG/giphy.gif",
          },
        ],
        [
          1000,
          {
            meme: "https://media.giphy.com/media/26BoD1FWyyL5vTkGI/giphy.gif",
          },
        ],
        [
          1250,
          {
            meme: "https://media.giphy.com/media/1wX7vKP16Jafsl1FHv/giphy.gif",
          },
        ],
        [
          1500,
          {
            meme: "https://media.giphy.com/media/YjJZKbm2kNN7i/giphy.gif",
          },
        ],
        [
          2000,
          {
            meme: "https://media.giphy.com/media/26AHOiDsOokbPSY80/giphy.gif",
          },
        ],
      ]),
    },
    messages: {
      baseCost: 1244160,
      baseProfit: 6480,
      upgrades: new Map([
        [
          1,
          {
            meme: "https://i.imgur.com/Xfhb7fW.png",
          },
        ],
        [
          25,
          {
            meme: "https://media.giphy.com/media/ggtpYV17RP9lTbc542/giphy.gif",
          },
        ],
        [
          50,
          {
            meme: "https://media.giphy.com/media/jS8JMqPBcdhMBv19Dk/giphy.gif",
          },
        ],
        [
          75,
          {
            meme: "https://media.giphy.com/media/BxdZc89h2hzUI/giphy.gif",
          },
        ],
        [
          100,
          {
            meme: "https://media.giphy.com/media/l0HlAIIwxcTSuibDi/giphy.gif",
          },
        ],
        [
          150,
          {
            meme: "https://media.giphy.com/media/bMdZu3fG2ZEBO/giphy.gif",
          },
        ],
        [
          200,
          {
            meme: "https://media.giphy.com/media/bMdZu3fG2ZEBO/giphy.gif",
          },
        ],
        [
          300,
          {
            meme: "https://media.giphy.com/media/l41lRvFQYdlfvDTLG/giphy.gif",
          },
        ],
        [
          400,
          {
            meme: "https://media.giphy.com/media/3o85xnoIXebk3xYx4Q/giphy.gif",
          },
        ],
        [
          500,
          {
            meme: "https://media.giphy.com/media/3o85xnoIXebk3xYx4Q/giphy.gif",
          },
        ],
        [
          600,
          {
            meme: "https://media.giphy.com/media/29eY8PfqCFeI8/giphy.gif",
          },
        ],
        [
          700,
          {
            meme: "https://media.giphy.com/media/c59PyeQsl15pm/giphy.gif",
          },
        ],
        [
          800,
          {
            meme: "https://media.giphy.com/media/hDA1XT2nVxxZOO8Bok/giphy.gif",
          },
        ],
        [
          900,
          {
            meme: "https://media.giphy.com/media/o3dmaqvQzV1st84T0w/giphy.gif",
          },
        ],
        [
          1000,
          {
            meme: "https://media.giphy.com/media/Ov3oRf9GFX0w8/giphy.gif",
          },
        ],
        [
          1250,
          {
            meme: "https://media.giphy.com/media/l41lRvFQYdlfvDTLG/giphy.gif",
          },
        ],
        [
          1500,
          {
            meme: "https://media.giphy.com/media/a8ABKvNLyyJXi/giphy.gif",
          },
        ],
        [
          2000,
          {
            meme: "https://media.giphy.com/media/3qdAIwAUQVbyw/giphy.gif",
          },
        ],
      ]),
    },
    invites: {
      baseCost: 14929920,
      baseProfit: 19437,
      upgrades: new Map([
        [
          1,
          {
            meme: "https://media.giphy.com/media/xUA7bcGjn8AmzrKMww/giphy.gif",
          },
        ],
        [
          25,
          {
            meme: "https://media.giphy.com/media/qvmLA65T7syPK/giphy.gif",
          },
        ],
        [
          50,
          {
            meme: "https://media.giphy.com/media/FPshSgzXzl7kA/giphy.gif",
          },
        ],
        [
          75,
          {
            meme: "https://media.giphy.com/media/Ny4Ian52lZDz2/giphy.gif",
          },
        ],
        [
          100,
          {
            meme: "https://media.giphy.com/media/tncKmuhljYOlO/giphy.gif",
          },
        ],
        [
          150,
          {
            meme: "https://media.giphy.com/media/40dEau6bZRO3S/giphy.gif",
          },
        ],
        [
          200,
          {
            meme: "https://media.giphy.com/media/6HPC8uaT195TO/giphy.gif",
          },
        ],
        [
          300,
          {
            meme: "https://media.giphy.com/media/l41m5YJ56zcextOSY/giphy.gif",
          },
        ],
        [
          400,
          {
            meme: "https://media.giphy.com/media/xT9KVpj9nOTlV1fIxq/giphy.gif",
          },
        ],
        [
          500,
          {
            meme: "https://media.giphy.com/media/THg3sfQzDJ94e1d86Q/giphy.gif",
          },
        ],
        [
          600,
          {
            meme: "https://media.giphy.com/media/cl90q5wYv8lsQ/giphy.gif",
          },
        ],
        [
          700,
          {
            meme: "https://media.giphy.com/media/L431UNLuEEKQYr4mmz/giphy.gif",
          },
        ],
        [
          800,
          {
            meme: "https://media.giphy.com/media/f5kdqtO7DwooJwUbTq/giphy.gif",
          },
        ],
        [
          900,
          {
            meme: "https://media.giphy.com/media/PWZ5AWxUMaUxO/giphy.gif",
          },
        ],
        [
          1000,
          {
            meme: "https://media.giphy.com/media/feS8TIJViDGKI/giphy.gif",
          },
        ],
        [
          1250,
          {
            meme: "https://media.giphy.com/media/Nre3KkDmRhQ1G/giphy.gif",
          },
        ],
        [
          1500,
          {
            meme: "https://media.giphy.com/media/KYElw07kzDspaBOwf9/giphy.gif",
          },
        ],
        [
          2000,
          {
            meme: "https://media.giphy.com/media/12NUbkX6p4xOO4/giphy.gif",
          },
        ],
      ]),
    },
    bots: {
      baseCost: 179159040,
      baseProfit: 58319,
      upgrades: new Map([
        [
          1,
          {
            meme: "https://media.giphy.com/media/TOWtnRfxEixa0/giphy.gif",
          },
        ],
        [
          25,
          {
            meme: "https://gfycat.com/grimyfilthyeelelephant",
          },
        ],
        [
          50,
          {
            meme: "https://i.imgur.com/O0hH3n5.png",
          },
        ],
        [
          75,
          {
            meme: "https://i.imgur.com/v7ooBbp.png",
          },
        ],
        [
          100,
          {
            meme: "https://i.imgur.com/xS4DcH3.png",
          },
        ],
        [
          150,
          {
            meme: "https://media.giphy.com/media/a42Lx0aPS7Z3a/giphy.gif",
          },
        ],
        [
          200,
          {
            meme: "https://media.giphy.com/media/UTRMPCnxwsZZ7VafB7/giphy.gif",
          },
        ],
        [
          300,
          {
            meme: "https://media.giphy.com/media/HlcGS4xcqyzle/giphy.gif",
          },
        ],
        [
          400,
          {
            meme: "https://media.giphy.com/media/UWQ7iLcwr6T611pjuR/giphy.gif",
          },
        ],
        [
          500,
          {
            meme: "https://gfycat.com/affectionateslipperyamberpenshell",
          },
        ],
        [
          600,
          {
            meme: "https://gfycat.com/embarrassedeverykusimanse",
          },
        ],
        [
          700,
          {
            meme: "https://gfycat.com/disgustingcostlyibis",
          },
        ],
        [
          800,
          {
            meme: "https://gfycat.com/mammothfittingafricanaugurbuzzard",
          },
        ],
        [
          900,
          {
            meme: "https://gfycat.com/determinedflatgalago",
          },
        ],
        [
          1000,
          {
            meme: "https://gfycat.com/illfatedhandmadekoalabear",
          },
        ],
        [
          1250,
          {
            meme: "https://i.imgur.com/f0I9j2Z.png",
          },
        ],
        [
          1500,
          {
            meme: "https://media.giphy.com/media/7OkKFU3EGQJaw/giphy.gif",
          },
        ],
        [
          2000,
          {
            meme: "https://www2.pictures.zimbio.com/mp/maa_WsF29bUx.gif",
          },
        ],
      ]),
    },
    hypesquads: {
      baseCost: 2149908480,
      baseProfit: 175490,
      upgrades: new Map([
        [
          1,
          {
            meme: "https://media.giphy.com/media/xmt9HwR9oQzTy/giphy.gif",
          },
        ],
        [
          25,
          {
            meme: "https://media.giphy.com/media/w8ptJFCwIiimQ/giphy.gif",
          },
        ],
        [
          50,
          {
            meme: "https://gfycat.com/grouchyapprehensivejerboa",
          },
        ],
        [
          75,
          {
            meme: "https://gfycat.com/tastyglamorousgrub",
          },
        ],
        [
          100,
          {
            meme: "https://gfycat.com/tastyglamorousgrub",
          },
        ],
        [
          150,
          {
            meme: "https://gfycat.com/disastrousconventionalballoonfish",
          },
        ],
        [
          200,
          {
            meme: "https://gfycat.com/backelegantachillestang",
          },
        ],
        [
          300,
          {
            meme: "https://gfycat.com/hoarseelasticbufeo",
          },
        ],
        [
          400,
          {
            meme: "https://gfycat.com/capitalshamelessgull",
          },
        ],
        [
          500,
          {
            meme: "https://gfycat.com/brightdifficultbabirusa",
          },
        ],
        [
          600,
          {
            meme: "https://gfycat.com/belovedidealisticbumblebee",
          },
        ],
        [
          700,
          {
            meme: "https://gfycat.com/coordinatedseverecornsnake",
          },
        ],
        [
          800,
          {
            meme: "https://gfycat.com/bountifulfinegraywolf",
          },
        ],
        [
          900,
          {
            meme: "https://gfycat.com/wealthycoarsebluefintuna",
          },
        ],
        [
          1000,
          {
            meme: "https://gfycat.com/accomplishedparchedindianringneckparakeet",
          },
        ],
        [
          1250,
          {
            meme: "https://gfycat.com/accomplishedparchedindianringneckparakeet",
          },
        ],
        [
          1500,
          {
            meme: "https://gfycat.com/accomplishedparchedindianringneckparakeet",
          },
        ],
        [
          2000,
          {
            meme: "https://gfycat.com/accomplishedparchedindianringneckparakeet",
          },
        ],
      ]),
    },
    nitro: {
      baseCost: 25798901760,
      baseProfit: 1610667,
      upgrades: new Map([
        [
          1,
          {
            meme: "https://gfycat.com/fastunrealisticbrocketdeer",
          },
        ],
        [
          25,
          {
            meme: "https://gfycat.com/assuredacrobaticachillestang",
          },
        ],
        [
          50,
          {
            meme: "https://media.giphy.com/media/10H4by255F2UsU/giphy.gif",
          },
        ],
        [
          75,
          {
            meme: "https://gfycat.com/satisfiedmeaslyflickertailsquirrel",
          },
        ],
        [
          100,
          {
            meme: "https://gfycat.com/amusingweeklygilamonster",
          },
        ],
        [
          150,
          {
            meme: "https://gfycat.com/difficultkeenhoatzin",
          },
        ],
        [
          200,
          {
            meme: "https://gfycat.com/admirableultimategonolek",
          },
        ],
        [
          300,
          {
            meme: "https://gfycat.com/cluelesscandidamethystsunbird",
          },
        ],
        [
          400,
          {
            meme: "https://gfycat.com/cornyflimsyfieldmouse",
          },
        ],
        [
          500,
          {
            meme: "https://gfycat.com/complicatedangryamericanriverotter",
          },
        ],
        [
          600,
          {
            meme: "https://gfycat.com/blaringslimhake",
          },
        ],
        [
          700,
          {
            meme: "https://gfycat.com/poorunitedbighorn",
          },
        ],
        [
          800,
          {
            meme: "https://gfycat.com/rapidelementarychevrotain",
          },
        ],
        [
          900,
          {
            meme: "https://gfycat.com/likablethatblackrussianterrier",
          },
        ],
        [
          1000,
          {
            meme: "https://gfycat.com/brightwaterykawala",
          },
        ],
        [
          1250,
          {
            meme: "https://gfycat.com/gloomypleasantcicada",
          },
        ],
        [
          1500,
          {
            meme: "https://gfycat.com/cleverclearcutflea",
          },
        ],
        [
          2000,
          {
            meme: "https://gfycat.com/pointedchubbychrysalis",
          },
        ],
      ]),
    },
  },
  engine: {
    /** This function will be processing the amount of currency users have everytime they use a command to view their currency i imagine */
    process: function (profile) {
      const now = Date.now();
      const secondsSinceLastUpdate = (now - profile.lastUpdatedAt) / 1000;
      const secondsAllowedOffline =
        (botCache.constants.milliseconds.HOUR * (botCache.vipUserIDs.has(profile.id) ? 8 : 2)) / 1000;
      const seconds = secondsSinceLastUpdate > secondsAllowedOffline ? secondsAllowedOffline : secondsSinceLastUpdate;

      return {
        currency: botCache.constants.idle.engine.calculateTotalProfit(profile) * BigInt(Math.floor(seconds)),
        lastUpdatedAt: now,
      };
    },
    calculateTotalProfit: function (profile) {
      let subtotal = BigInt(0);

      // shared servers with isekai
      const member = cache.members.get(profile.id);
      const isekai = cache.members.get("719912970829955094");
      const sharedGuilds = member?.guilds.filter((g, key) => Boolean(isekai?.guilds.has(key)));

      for (const item of botCache.constants.idle.items) {
        subtotal += botCache.constants.idle.engine.calculateProfit(
          profile[item],
          botCache.constants.idle.constants[item].baseProfit,
          profile.guildIDs.length + (sharedGuilds?.size || 0)
        );
      }

      return subtotal;
    },
    calculateProfit: function (level, baseProfit = 1, prestige = 1) {
      let multiplier = BigInt(1);
      if (level >= BigInt(25)) multiplier *= BigInt(2);
      if (level >= BigInt(50)) multiplier *= BigInt(3);
      if (level >= BigInt(75)) multiplier *= BigInt(4);
      if (level >= BigInt(100)) multiplier *= BigInt(5);
      if (level >= BigInt(150)) multiplier *= BigInt(4);
      if (level >= BigInt(200)) multiplier *= BigInt(5);
      if (level >= BigInt(300)) multiplier *= BigInt(6);
      if (level >= BigInt(400)) multiplier *= BigInt(8);
      if (level >= BigInt(500)) multiplier *= BigInt(10);
      if (level >= BigInt(600)) multiplier *= BigInt(20);
      if (level >= BigInt(700)) multiplier *= BigInt(30);
      if (level >= BigInt(800)) multiplier *= BigInt(50);
      if (level >= BigInt(900)) multiplier *= BigInt(200);
      if (level >= BigInt(1000)) multiplier *= BigInt(300);
      if (level >= BigInt(1250)) multiplier *= BigInt(1250);
      if (level >= BigInt(1500)) multiplier *= BigInt(3800);
      if (level >= BigInt(2000)) multiplier *= BigInt(150000);

      return BigInt(level) * BigInt(baseProfit) * BigInt(multiplier) * BigInt(prestige);
    },
    calculateUpgradeCost: function (baseCost, level) {
      return baseCost * Math.pow(1.07, level);
    },
    /** Takes the current user currency, the cost of the item, and how much currency the user is gaining per second and converts it to milliseconds until this item can be bought. */
    calculateMillisecondsTillBuyable: function (currency, cost, perSecond) {
      return ((BigInt(cost) - BigInt(currency)) / BigInt(perSecond)) * BigInt(1000);
    },
    isEpicUpgrade: function (level) {
      return epicUpgradeLevels.includes(level);
    },
  },
};
