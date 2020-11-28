import { botCache } from "../../../../deps.ts";

const epicUpgradeLevels = [
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

const IDR_STRINGS = {
  HEY_THERE: "Hey there! :wave: It's me Edylc 🕵️ again.",
  CONGRATS: "Congrats 🎉, you just took your next step! ㊙️",
  LONG_LIVE: "***GET RICH OR GO HOME***",
  UPGRADING_FRIENDS:
    "Keep on making more friends with `idle upgrade` until you reach the next epic upgrade for friends 👪.",
  UPGRADING_SERVERS:
    "Keep on making more servers with `idle upgrade servers` until you reach the next epic upgrade for servers 👪.",
  UPGRADING_CHANNELS:
    "Keep on making more channels with `idle upgrade channels` until you reach the next epic upgrade for channels 👪.",
  UPGRADING_ROLES:
    "Keep on making more roles with `idle upgrade roles` until you reach the next epic upgrade for roles 👪.",
  UPGRADING_PERMS:
    "Keep on making more perms with `idle upgrade perms` until you reach the next epic upgrade for perms 👪.",
  UPGRADING_MESSAGES:
    "Keep on making more messages with `idle upgrade messages` until you reach the next epic upgrade for messages 👪.",
  UPGRADING_INVITES:
    "Keep on making more invites with `idle upgrade invites` until you reach the next epic upgrade for invites 👪.",
  UPGRADING_BOTS:
    "Keep on making more bots with `idle upgrade bots` until you reach the next epic upgrade for bots 👪.",
  UPGRADING_HYPESQUADS:
    "Keep on making more hypesquads with `idle upgrade hypesquads` until you reach the next epic upgrade for hypesquads 👪.",
  UPGRADING_NITRO:
    "Keep on making more nitro with `idle upgrade nitro` until you reach the next epic upgrade for nitro 👪.",
};

function epicUpgradeResponse(type?: string, note?: string) {
  const response = [IDR_STRINGS.HEY_THERE, "", IDR_STRINGS.CONGRATS, ""];
  if (note) response.push(note, "");
  response.push(
    type || IDR_STRINGS.UPGRADING_FRIENDS,
    "",
    IDR_STRINGS.LONG_LIVE,
  );
  return response.join("\n");
}

botCache.constants.idle = {
  boostEmoji: "💵",
  items: [
    "friends",
    "servers",
    "channels",
    "roles",
    "perms",
    "messages",
    "invites",
    "bots",
    "hypesquads",
    "nitro",
  ],
  constants: {
    friends: {
      baseCost: 5,
      baseProfit: 1,
      upgrades: new Map([
        [
          1,
          {
            title: "🙅 The friends who will never accept your friend request.",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `To make new friends you can either click on the user and add them as a friend. You can also use the Friends tab to search for new users by their username#0000 tag info.`",
              "",
              IDR_STRINGS.UPGRADING_FRIENDS,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme: "https://i.imgur.com/UFMQUt6.png",
          },
        ],
        [
          25,
          {
            title: "🧑‍🤝‍🧑 Your friends have now accepted your friend requests.",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `A group channel can only hold a maximum of 10 users.`",
              "",
              "Now that we have a lot more friends, you should unlock your first Discord server ⚙️. Only a ~~city~~ server can hold us now! To unlock your first, you will need to use `idle upgrade servers`.",
              "",
              IDR_STRINGS.UPGRADING_FRIENDS,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme: "https://i.imgur.com/w4KNM37.png",
          },
        ],
        [
          50,
          {
            title: "🗨️ Your friends now actually respond to your messages.",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `A username must be between 2 and 32 characters in length.`",
              "",
              "🤔 Wow! Even more friends! Amazing! Did you know you could change your username? My name is Edylc because I am Clyde in disguise. I am a bot created by Discord and named Clyde. Did you know that? The Discord logo is actually named Clyde.",
              "",
              IDR_STRINGS.UPGRADING_FRIENDS,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme: "https://i.imgur.com/oROSWDq.png",
          },
        ],
        [
          75,
          {
            title:
              "📞 You can finally hear your friends robotic voice through voice calls!",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `Discord was almost called Bonfire. It was meant to be nice and cozy.`",
              "",
              IDR_STRINGS.UPGRADING_FRIENDS,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme: "https://media.giphy.com/media/1rHx0xjZnBFa8/giphy.gif",
          },
        ],
        [
          100,
          {
            title:
              "📷 Your friends have bought cameras so now you can video call!",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `Discord was almost called Wyvern.`",
              "",
              IDR_STRINGS.UPGRADING_FRIENDS,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme: "https://media.giphy.com/media/eGmervd1fME3TmHY06/giphy.gif",
          },
        ],
        [
          150,
          {
            title:
              "❌ You can now block friends that send you 15 direct messages with 1 word each at 3AM.",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `Discord started as a game company making a mobile game called Fates Forever.`",
              "",
              IDR_STRINGS.UPGRADING_FRIENDS,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme: "https://media.giphy.com/media/29IalLLWizqz8SViU1/giphy.gif",
          },
        ],
        [
          200,
          {
            title:
              "👪 Friends have invited you to be a part of a Group Channel. You are no longer a loner!",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `Discord’s official birthday is May 13, 2015.`",
              "",
              IDR_STRINGS.UPGRADING_FRIENDS,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme: "https://media.giphy.com/media/l0HlPiHF9ui1FoQ48/giphy.gif",
          },
        ],
        [
          300,
          {
            title:
              "👑 You have now become the owner of your very own group channel. Heavy is the head that wears the crown.",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `Wumpus, the mascot, was originally created as a character with no friends :(.`",
              "",
              IDR_STRINGS.UPGRADING_FRIENDS,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme: "https://media.giphy.com/media/Pcj3Zovdd6Afe/giphy.gif",
          },
        ],
        [
          400,
          {
            title:
              "🔇 Some friends just never stop talking. Mute is now available for private messages.",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `In Discord's early days, light theme was the only theme. Scary times.`",
              "",
              IDR_STRINGS.UPGRADING_FRIENDS,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme: "https://media.giphy.com/media/3orif7aLUehOfdmlXy/giphy.gif",
          },
        ],
        [
          500,
          {
            title:
              "⛓️ You can now link your social accounts. Let your friends learn even more of your private lives.",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `In the ancient days, Discord started as a browser-only app.`",
              "",
              IDR_STRINGS.UPGRADING_FRIENDS,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme: "https://media.giphy.com/media/WQlCc9lPd0ffkaH8NB/giphy.gif",
          },
        ],
        [
          600,
          {
            title:
              "🔗 Friends of friends are the best of friends. Mutual Friends has been unlocked!",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `The character on Discord's 404 page is a robot hamster named Nelly.`",
              "",
              IDR_STRINGS.UPGRADING_FRIENDS,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme: "https://media.giphy.com/media/QC1TssrPbkD2menNfz/giphy.gif",
          },
        ],
        [
          700,
          {
            title:
              "🎮 Rich Presence is here! Let your friends know what games you are playing!",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `You can play Discord's version of the Snake game on Discords 404 page by pressing a ~secret~ button.`",
              "",
              IDR_STRINGS.UPGRADING_FRIENDS,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme: "https://media.giphy.com/media/tolFEWW90XwoE/giphy.gif",
          },
        ],
        [
          800,
          {
            title:
              "📛 Badges on your friends can tell you which of them are rich!",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `There's a very small—and we mean small—chance you can get a secret ringtone when calling someone. Good luck!.`",
              "",
              IDR_STRINGS.UPGRADING_FRIENDS,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme: "https://media.giphy.com/media/Ii7pTFaYe9syY/giphy.gif",
          },
        ],
        [
          900,
          {
            title:
              "📱 Keep an eye on when your friends are on Mobile or a computer.",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `Discord's old Partner mascot was an elf named Springle. He recently retired.`",
              "",
              IDR_STRINGS.UPGRADING_FRIENDS,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme: "https://media.giphy.com/media/144w9oUIZfoxZC/giphy.gif",
          },
        ],
        [
          1000,
          {
            title: "🟢 You can now keep an eye on when your friends are online!",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `CTRL + K or Command + K to open the quick switcher. Once the menu is open, you can type @ to find a user, # to find a channel, * to find a server or ! to find a voice channel.`",
              "",
              IDR_STRINGS.UPGRADING_FRIENDS,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme: "https://media.giphy.com/media/YTDZakyAorkLDYqN0q/giphy.gif",
          },
        ],
        [
          1250,
          {
            title:
              "🕵️ Lurkers are everywhere. Become a lurker by going invisible.",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `In case there is some odd bug on your screen you can always, CTRL + R or Command + R to restart the Discord client.`",
              "",
              IDR_STRINGS.UPGRADING_FRIENDS,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme: "https://media.giphy.com/media/WS6ACu6QroN7mZxASM/giphy.gif",
          },
        ],
        [
          1500,
          {
            title:
              "🗒️ Keep private notes about your friends to let you know who you secretly hate.",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `You can add notes to each user when you click on them. But you are only allowed 500 user notes in total.`",
              "",
              IDR_STRINGS.UPGRADING_FRIENDS,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme: "https://media.giphy.com/media/3pTtbLJ7Jd0YM/giphy.gif",
          },
        ],
        [
          2000,
          {
            title: "🎁 Your friends are now sending you free Nitro gifts.",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `You are only allowed a maximum of 1000 relationships. Relationships include friends, blocked users, friend requests, and pending friend requests.`",
              "",
              IDR_STRINGS.UPGRADING_FRIENDS,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme:
              "https://pics.me.me/thumb_hey-mom-can-have-10-dollars-for-discord-nitro-ok-38857952.png",
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
            title: "🙍 The servers where your the only person in there.",
            response: epicUpgradeResponse(
              IDR_STRINGS.UPGRADING_SERVERS,
              "🖊️ **Note:** `A user can only be in a maximum of 100 servers at any time.`",
            ),
            meme: "https://media.giphy.com/media/zk0zTXQY5ukCs/giphy.gif",
          },
        ],
        [
          25,
          {
            title: "☠️ Yay, we have people in the server. Still a dead server!",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `By default, a server can only have a maximum of 250,000 members. You can contact Discord to have this limit raised like 500,000 or more.`",
              "",
              "Your server is coming alone well! Time to start making some channels! To unlock your first, you will need to use `idle upgrade channels`.",
              "",
              IDR_STRINGS.UPGRADING_SERVERS,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme: "https://media.giphy.com/media/3orieTkrWcfZhc3WV2/giphy.gif",
          },
        ],
        [
          50,
          {
            title: "㊙️ Your privacy is at risk! Selfbots are here!",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `By default, Discord only allows 25,000 members to be online at any given time. You can contact Discord to have this raised to 75,000 or more.`",
              "",
              IDR_STRINGS.UPGRADING_SERVERS,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme: "https://media.giphy.com/media/Yo7apLkyBbKlGaV6ZF/giphy.gif",
          },
        ],
        [
          75,
          {
            title:
              "<a:furious:669930973215064065> Everyone has an anime avatar. Abandon ship!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_SERVERS),
            meme: "https://i.imgur.com/XQoCURf.png",
          },
        ],
        [
          100,
          {
            title: "🤖 There are more bots then users in this server...",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `A server can only have a maximum of 500 channels.`",
              "",
              IDR_STRINGS.UPGRADING_SERVERS,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme: "https://media.giphy.com/media/JrtrM1bvV6psk/giphy.gif",
          },
        ],
        [
          150,
          {
            title: "🤔 This server looks strangely promising.",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `Member nicknames must be between 1-32 characters.`",
              "",
              IDR_STRINGS.UPGRADING_SERVERS,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme: "https://media.giphy.com/media/rrDuikSJh7Xi0/giphy.gif",
          },
        ],
        [
          200,
          {
            title: "🗨️ People are now actively talking in your server!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_SERVERS),
            meme: "https://media.giphy.com/media/26u4hHj87jMePiO3u/giphy.gif",
          },
        ],
        [
          300,
          {
            title: "🕵️ You have mastered the Audit Logs! Spy on your users!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_SERVERS),
            meme: "https://media.giphy.com/media/RMNPs5TfCMDFS/giphy.gif",
          },
        ],
        [
          400,
          {
            title: "🎁 Giveaways are happening on your servers!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_SERVERS),
            meme: "https://www.memecreator.org/static/images/memes/4606440.jpg",
          },
        ],
        [
          500,
          {
            title:
              "⚙️ You can now control all the settings on your server like a true owner!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_SERVERS),
            meme: "https://media.giphy.com/media/10vA3MTGTKeb16/giphy.gif",
          },
        ],
        [
          600,
          {
            title: "👆🏼 Your server is now boosted.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_SERVERS),
            meme: "https://media.giphy.com/media/14vFOciTnQjnl6/giphy.gif",
          },
        ],
        [
          700,
          {
            title: "📹 Animated server icons are making servers look alive!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_SERVERS),
            meme: "https://media.giphy.com/media/cniCpOSDrSF6nE0vGx/giphy.gif",
          },
        ],
        [
          800,
          {
            title: "🖼️ Custom server invite background.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_SERVERS),
            meme: "https://media.giphy.com/media/cJAmlBX0MwYFqWhvl7/giphy.gif",
          },
        ],
        [
          900,
          {
            title: "🖇️ Vanity invite URL is available.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_SERVERS),
            meme: "https://media.giphy.com/media/l3q2SDNVcOVUkl2FO/giphy.gif",
          },
        ],
        [
          1000,
          {
            title: "🔴 Who cares about offline members? They are now hidden.",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `Once you reach 1000 members, the offline member list will be hidden on your server.`",
              "",
              IDR_STRINGS.UPGRADING_SERVERS,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme: "https://media.giphy.com/media/ZY7yUQc1pcI5a/giphy.gif",
          },
        ],
        [
          1250,
          {
            title: "💃🏼 Your servers have that sexy Verified mark.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_SERVERS),
            meme: "",
          },
        ],
        [
          1500,
          {
            title: "💏 Your servers are now partnered with Discord.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_SERVERS),
            meme: "https://media.giphy.com/media/kkYbDLFmNvO4E/giphy.gif",
          },
        ],
        [
          2000,
          {
            title: "✅ Your servers are now shown in the servery discovery.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_SERVERS),
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
            title: "👁️ Staring at an empty #general channel forlornly",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `A category channel can not have more than 50 channels in it.`",
              "",
              IDR_STRINGS.UPGRADING_CHANNELS,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme: "https://media.giphy.com/media/SHwadBpiZDrC0GoGen/giphy.gif",
          },
        ],
        [
          25,
          {
            title: "🧁 Someone talked in your #general channel. Party",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `The channel topic can not be more than 1024 characters.`",
              "",
              "Your server is coming alone well! Time to start making some roles! To unlock your first, you will need to use `idle upgrade roles`.",
              "",
              IDR_STRINGS.UPGRADING_CHANNELS,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme: "https://media.giphy.com/media/DowKEtWnLZcru/giphy.gif",
          },
        ],
        [
          50,
          {
            title:
              "🍿 Enough people are talking in #general that you ALMOST had to scroll when you got back from your snack",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `You can only have a maximum of 50 pins in a channel.`",
              "",
              IDR_STRINGS.UPGRADING_CHANNELS,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme: "https://media.giphy.com/media/10tFdsx3e3TLGw/giphy.gif",
          },
        ],
        [
          75,
          {
            title:
              "🚓 Someone broke the rules but you don't have a #rules channel yet so you couldn't ban them. Better make one! ",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_CHANNELS),
            meme: "https://media.giphy.com/media/QmETVm2HiXIeqxpnpO/giphy.gif",
          },
        ],
        [
          100,
          {
            title:
              "👮‍♀️ Your invite link pointed to your #NSFW channel and now you're in discord jail",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_CHANNELS),
            meme: "https://media.giphy.com/media/3ohzdOf5NqP404fi5W/giphy.gif",
          },
        ],
        [
          150,
          {
            title:
              "🚌 People are leaving your server because they feel there aren't channels to split up conversations.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_CHANNELS),
            meme: "https://media.giphy.com/media/ro9NLUOiIMAJa/giphy.gif",
          },
        ],
        [
          200,
          {
            title:
              "🇺🇸 You made a #politics channel and have learned what a mistake that was.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_CHANNELS),
            meme: "https://media.giphy.com/media/i2AG4hyTP4WRi/giphy.gif",
          },
        ],
        [
          300,
          {
            title:
              "💬 People are talking in your #general channel now, but it's mostly in a language you don't recognize",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_CHANNELS),
            meme: "https://media.giphy.com/media/KEPQfFa3CtzCE/giphy.gif",
          },
        ],
        [
          400,
          {
            title:
              "🕹️ Enough people on your server want to play a game together that you make a channel for them to organize",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_CHANNELS),
            meme: "",
          },
        ],
        [
          500,
          {
            title:
              "🤖 The bot you brought in is clogging up your chat channels with bot spam. Make a #bot channel!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_CHANNELS),
            meme: "https://media.giphy.com/media/lwdzpYxsi4iJi/giphy.gif",
          },
        ],
        [
          600,
          {
            title:
              "😶 Tired of discussing bans in your server's general channels prior to actually carrying them out, you make an #admin channel",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_CHANNELS),
            meme: "",
          },
        ],
        [
          700,
          {
            title:
              "<:pirateflag:564111649930215435> Oh no! With no #verify channel your server has easily been raided!  Thankfully your admin team manages to ban them as they show up",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_CHANNELS),
            meme: "https://media.giphy.com/media/3oEjI1erPMTMBFmNHi/giphy.gif",
          },
        ],
        [
          800,
          {
            title:
              "🐱 There is now a channel to post your cats and dogs in. Every server worth its salt must have this channel. It is science.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_CHANNELS),
            meme: "https://media.giphy.com/media/l41YnSDHZiUpTK5gI/giphy.gif",
          },
        ],
        [
          900,
          {
            title:
              "📺 Your server has grown so big you start your own Discord Live streaming. You make an #episode channel to post updates",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_CHANNELS),
            meme: "https://media.giphy.com/media/l46C4wJmWbMPK52pi/giphy.gif",
          },
        ],
        [
          1000,
          {
            title:
              "🔢 You have too many channels! You start to categorize them by type.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_CHANNELS),
            meme: "https://media.giphy.com/media/PjTSEQy85NKOlZ7b19/giphy.gif",
          },
        ],
        [
          1250,
          {
            title:
              "📣 Your server has grown so big they let you have an announcement channel",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_CHANNELS),
            meme: "https://media.giphy.com/media/3o6ZteOz7Uz6bE4l6U/giphy.gif",
          },
        ],
        [
          1500,
          {
            title:
              "🌋 Your voice chat channels are constantly full of people talking! Life is good",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_CHANNELS),
            meme: "https://media.giphy.com/media/h4a9QBNclmw2oQo5bQ/giphy.gif",
          },
        ],
        [
          2000,
          {
            title:
              "🏖️ You've earned so much money on your YouTube channel that you set yourself away in your #afk channel and take a well deserved vacation.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_CHANNELS),
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
            title: "You have only 1 role on your server. The everyone role.",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** The everyone role is very unique. It is one of the few places that it's ID is not unique. The role ID is the same as the server ID. Also it is a role that can not be deleted or removed from anyone.",
              "",
              IDR_STRINGS.UPGRADING_ROLES,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme:
              "https://media.discordapp.net/attachments/743178139840282695/769974493543268402/15bd3963-9e3a-454d-ac39-caf6a6f8828c.gif",
          },
        ],
        [
          25,
          {
            title:
              "You have discovered the power of creation! You can now create roles!",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `A server can only have a max of 250 roles.`",
              "",
              "Your server is coming alone well! Time to start making some perms! To unlock your first, you will need to use `idle upgrade perms`.",
              "",
              IDR_STRINGS.UPGRADING_ROLES,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme:
              "https://media.discordapp.net/attachments/743178139840282695/769976275409829888/tenor_2.gif",
          },
        ],
        [
          50,
          {
            title: "The servers roles are all called new role.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_ROLES),
            meme: "https://media.giphy.com/media/yyvSeRGVj4C64/giphy.gif",
          },
        ],
        [
          75,
          {
            title:
              "Oh no! Everyone can mention all your roles! Quick, disable role mentioning!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_ROLES),
            meme: "https://media.giphy.com/media/fSYYG9MSibrmPSuIJ0/giphy.gif",
          },
        ],
        [
          100,
          {
            title: "All your roles now have unique names.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_ROLES),
            meme: "https://media.giphy.com/media/dtCCnQflezjzEmnMK1/giphy.gif",
          },
        ],
        [
          150,
          {
            title:
              "OOooooOOO pretty colors! Your roles are now magically colored! Time to find a color picker!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_ROLES),
            meme: "https://media.giphy.com/media/kolvlRnXh8Jj2/giphy.gif",
          },
        ],
        [
          200,
          {
            title:
              "Roles are separated showing who the bosses are on the right sidebar!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_ROLES),
            meme: "https://media.giphy.com/media/pVsn5LJEgMKxa/giphy.gif",
          },
        ],
        [
          300,
          {
            title:
              "Integration roles are here! They can't really be given to anyone so BORING!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_ROLES),
            meme: "https://media.giphy.com/media/PR6NHmlwqjY6cElZoy/giphy.gif",
          },
        ],
        [
          400,
          {
            title:
              "You learned how to assign roles and became Oprah! You get a role! You get a role! Everyone gets a role!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_ROLES),
            meme: "https://media.giphy.com/media/xT0BKqB8KIOuqJemVW/giphy.gif",
          },
        ],
        [
          500,
          {
            title: "You now have a Nitro Booster role!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_ROLES),
            meme: "https://media.giphy.com/media/l0HUbtILos6CdAtxu/giphy.gif",
          },
        ],
        [
          600,
          {
            title:
              "Moderators are urgently needed! Quick time to make a trusted moderator role!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_ROLES),
            meme: "https://media.giphy.com/media/xT0BKo02mjcHeQt7eE/giphy.gif",
          },
        ],
        [
          700,
          {
            title:
              "We need admins! This is an opportunity to create a Admin role!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_ROLES),
            meme: "https://media.giphy.com/media/3o7OsPLf0GDtxIaoDu/giphy.gif",
          },
        ],
        [
          800,
          {
            title: "Roles have been created that are organizing roles.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_ROLES),
            meme: "https://media.giphy.com/media/1403NM07JJ5FiU/giphy.gif",
          },
        ],
        [
          900,
          {
            title:
              "Too many people have the same role! Time to make a role for yourself!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_ROLES),
            meme: "https://media.giphy.com/media/d8SEquJZTr4JOhpYJO/giphy.gif",
          },
        ],
        [
          1000,
          {
            title: "",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_ROLES),
            meme: "",
          },
        ],
        [
          1250,
          {
            title: "The mute role is available! Mute!!!!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_ROLES),
            meme: "https://media.giphy.com/media/tdkx9be2XuHAs/giphy.gif",
          },
        ],
        [
          1500,
          {
            title:
              "Your members can now pick their roles to select their desired color!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_ROLES),
            meme: "https://media.giphy.com/media/iNxi3TWwhwYehzY9IM/giphy.gif",
          },
        ],
        [
          2000,
          {
            title: "Your server is so amazing with fantastic roles! It's HOT!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_ROLES),
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
            title: "Your loved ones are all missing perms!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_PERMS),
            meme: "https://media.giphy.com/media/ToMjGpxvUfCMc87QboQ/giphy.gif",
          },
        ],
        [
          25,
          {
            title: "You have learned how to manage permissions!",
            response: epicUpgradeResponse(
              IDR_STRINGS.UPGRADING_PERMS,
              "Your server is coming alone well! Time to start making some messages! To unlock your first, you will need to use `idle upgrade messages`.",
            ),
            meme: "https://media.giphy.com/media/fGX4fTkX3ob6On5Do4/giphy.gif",
          },
        ],
        [
          50,
          {
            title: "Some people still can't see anything.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_PERMS),
            meme: "https://media.giphy.com/media/l0HU20BZ6LbSEITza/giphy.gif",
          },
        ],
        [
          75,
          {
            title:
              "Your permissions are badly done. People have begun to abuse them. You have failed!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_PERMS),
            meme: "https://media.giphy.com/media/3ohhwwpMswCHpgD9eg/giphy.gif",
          },
        ],
        [
          100,
          {
            title:
              "You have managed to control permissions. You can now lock users in the basement.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_PERMS),
            meme: "https://media.giphy.com/media/aHFyaeZ1FLjYDfGE9C/giphy.gif",
          },
        ],
        [
          150,
          {
            title:
              "The role permissions on your server are being overriden by your category perms causing users to lose access.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_PERMS),
            meme: "https://media.giphy.com/media/h36vh423PiV9K/giphy.gif",
          },
        ],
        [
          200,
          {
            title:
              "The category permissions on your server are being overriden by your channel perms causing users to lose access.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_PERMS),
            meme: "https://media.giphy.com/media/8HqjtoyKrnfJC/giphy.gif",
          },
        ],
        [
          300,
          {
            title:
              "Your role and member overwrites are still mixed up and causing permission errors.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_PERMS),
            meme: "https://media.giphy.com/media/oHxvbzgmkQa4DVwAu1/giphy.gif",
          },
        ],
        [
          400,
          {
            title:
              "Someone moved the roles around breaking role heirarchy affecting your bot's permission handling.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_PERMS),
            meme: "https://media.giphy.com/media/zPOErRpLtHWbm/giphy.gif",
          },
        ],
        [
          500,
          {
            title: "You are a permission managing genius!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_PERMS),
            meme: "https://media.giphy.com/media/3VCYo7JnaTrnW/giphy.gif",
          },
        ],
        [
          600,
          {
            title:
              "People tried to break your permissions, but they have utterly failed!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_PERMS),
            meme: "https://media.giphy.com/media/l2R09jc6eZIlfXKlW/giphy.gif",
          },
        ],
        [
          700,
          {
            title:
              "Discord has created a new permission that is enabled by default causing havoc on your server!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_PERMS),
            meme: "https://media.giphy.com/media/JEVYf4g2ePr6o/giphy.gif",
          },
        ],
        [
          800,
          {
            title:
              "People are complaining that the permissions are broken. Are they?",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_PERMS),
            meme: "https://media.giphy.com/media/ooHjwTt6rkk6I/giphy.gif",
          },
        ],
        [
          900,
          {
            title: "You have now learned how to make people unable to talk!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_PERMS),
            meme: "https://media.giphy.com/media/NshsZXMuzcahG/giphy.gif",
          },
        ],
        [
          1000,
          {
            title: "Everybody loves your permissions!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_PERMS),
            meme: "https://media.giphy.com/media/26BoD1FWyyL5vTkGI/giphy.gif",
          },
        ],
        [
          1250,
          {
            title:
              "Permissions are so good, people are paying you to do it for their servers!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_PERMS),
            meme: "https://media.giphy.com/media/1wX7vKP16Jafsl1FHv/giphy.gif",
          },
        ],
        [
          1500,
          {
            title: "Never before have permissions been so superbly managed!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_PERMS),
            meme: "https://media.giphy.com/media/YjJZKbm2kNN7i/giphy.gif",
          },
        ],
        [
          2000,
          {
            title:
              "Your are the overlord! Everyone wants you to bless them with permissions!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_PERMS),
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
            title:
              "Someone has sent the first message on your server. Who cares!",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `A normal text message can only have a maximum of 2000 characters.`",
              "",
              IDR_STRINGS.UPGRADING_MESSAGES,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme: "https://i.imgur.com/Xfhb7fW.png",
          },
        ],
        [
          25,
          {
            title: "You have to welcome people to your server!",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `A TTS message can only have a maximum of 200 characters.`",
              "",
              "Your server is coming alone well! Time to start making some invites! To unlock your first, you will need to use `idle upgrade invites`.",
              "",
              IDR_STRINGS.UPGRADING_MESSAGES,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme: "https://media.giphy.com/media/ggtpYV17RP9lTbc542/giphy.gif",
          },
        ],
        [
          50,
          {
            title:
              "You can now pin messages in the channel! But it's so overrated. No one reads them!",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `A channel can only have a max of 50 pinned messages.`",
              "",
              IDR_STRINGS.UPGRADING_MESSAGES,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme: "https://media.giphy.com/media/jS8JMqPBcdhMBv19Dk/giphy.gif",
          },
        ],
        [
          75,
          {
            title:
              "You have discovered the delete button! Delete the spam messages from users.",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `A reaction can only have a max of 20 reactions.`",
              "",
              IDR_STRINGS.UPGRADING_MESSAGES,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme: "https://media.giphy.com/media/BxdZc89h2hzUI/giphy.gif",
          },
        ],
        [
          100,
          {
            title:
              "Who are all these people sending random copy paste chain messages!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_MESSAGES),
            meme: "https://media.giphy.com/media/l0HlAIIwxcTSuibDi/giphy.gif",
          },
        ],
        [
          150,
          {
            title: "Hit that slowmode! Stop the spam!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_MESSAGES),
            meme: "https://media.giphy.com/media/bMdZu3fG2ZEBO/giphy.gif",
          },
        ],
        [
          200,
          {
            title:
              "People are raiding and uploading NSFW images on all your channels.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_MESSAGES),
            meme: "",
          },
        ],
        [
          300,
          {
            title:
              "GHOST PINGS! People are pinging and deleting so no one knows who!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_MESSAGES),
            meme: "https://media.giphy.com/media/l41lRvFQYdlfvDTLG/giphy.gif",
          },
        ],
        [
          400,
          {
            title: "You accidentally @ everyone!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_MESSAGES),
            meme: "https://media.giphy.com/media/3o85xnoIXebk3xYx4Q/giphy.gif",
          },
        ],
        [
          500,
          {
            title:
              "You have discovered the power of editing! You can now edit your messages!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_MESSAGES),
            meme: "",
          },
        ],
        [
          600,
          {
            title: "Using markdown, your messages have become so pretty!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_MESSAGES),
            meme: "https://media.giphy.com/media/29eY8PfqCFeI8/giphy.gif",
          },
        ],
        [
          700,
          {
            title:
              "Your cat has walked all over your keyboard last night sending odd messages. People think you are wasted!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_MESSAGES),
            meme: "https://media.giphy.com/media/c59PyeQsl15pm/giphy.gif",
          },
        ],
        [
          800,
          {
            title:
              "You type up a massive paragraph only and tried to add a tenor gif and your entire paragraph was deleted!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_MESSAGES),
            meme: "https://media.giphy.com/media/hDA1XT2nVxxZOO8Bok/giphy.gif",
          },
        ],
        [
          900,
          {
            title: "When you type a message, everyone watches in so much hype!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_MESSAGES),
            meme: "https://media.giphy.com/media/o3dmaqvQzV1st84T0w/giphy.gif",
          },
        ],
        [
          1000,
          {
            title:
              "Everyone is having an amazing time conversing in your server.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_MESSAGES),
            meme: "https://media.giphy.com/media/Ov3oRf9GFX0w8/giphy.gif",
          },
        ],
        [
          1250,
          {
            title:
              "Your server is cleaning out spam messages without you doing anything.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_MESSAGES),
            meme: "https://media.giphy.com/media/l41lRvFQYdlfvDTLG/giphy.gif",
          },
        ],
        [
          1500,
          {
            title: "Your announcements are breathtaking",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_MESSAGES),
            meme: "https://media.giphy.com/media/a8ABKvNLyyJXi/giphy.gif",
          },
        ],
        [
          2000,
          {
            title:
              "Your messages are amazing! People are getting obsessed with you.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_MESSAGES),
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
            title:
              "Your channels are all preventing invites from being created.",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `You can only have a maximum of 1000 invites in a server.`",
              "",
              IDR_STRINGS.UPGRADING_INVITES,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme: "https://media.giphy.com/media/xUA7bcGjn8AmzrKMww/giphy.gif",
          },
        ],
        [
          25,
          {
            title: "Invites are being shared.",
            response: epicUpgradeResponse(
              IDR_STRINGS.UPGRADING_INVITES,
              "Your server is coming alone well! Time to start making some bots! To unlock your first, you will need to use `idle upgrade bots`.",
            ),
            meme: "https://media.giphy.com/media/qvmLA65T7syPK/giphy.gif",
          },
        ],
        [
          50,
          {
            title: "Permanant invited have been leaked!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_INVITES),
            meme: "https://media.giphy.com/media/FPshSgzXzl7kA/giphy.gif",
          },
        ],
        [
          75,
          {
            title:
              "Raiders have joined using your invites. Teach them whose house this is!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_INVITES),
            meme: "https://media.giphy.com/media/Ny4Ian52lZDz2/giphy.gif",
          },
        ],
        [
          100,
          {
            title: "Random people are joining to make fun of you!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_INVITES),
            meme: "https://media.giphy.com/media/tncKmuhljYOlO/giphy.gif",
          },
        ],
        [
          150,
          {
            title:
              "You now have invites to voice channels which let users join directly to the voice channel.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_INVITES),
            meme: "https://media.giphy.com/media/40dEau6bZRO3S/giphy.gif",
          },
        ],
        [
          200,
          {
            title: "You can now invite your friends privately!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_INVITES),
            meme: "https://media.giphy.com/media/6HPC8uaT195TO/giphy.gif",
          },
        ],
        [
          300,
          {
            title: "Your invite links can now expire after a set of time.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_INVITES),
            meme: "https://media.giphy.com/media/l41m5YJ56zcextOSY/giphy.gif",
          },
        ],
        [
          400,
          {
            title:
              "Invite links now have a max amount of uses before they no longer work.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_INVITES),
            meme: "https://media.giphy.com/media/xT9KVpj9nOTlV1fIxq/giphy.gif",
          },
        ],
        [
          500,
          {
            title:
              "You can now invite people over temporarily so they get removed after they go offline.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_INVITES),
            meme: "https://media.giphy.com/media/THg3sfQzDJ94e1d86Q/giphy.gif",
          },
        ],
        [
          600,
          {
            title:
              "Your server invites are getting around. You are growing automatically now.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_INVITES),
            meme: "https://media.giphy.com/media/cl90q5wYv8lsQ/giphy.gif",
          },
        ],
        [
          700,
          {
            title: "Your invite code is 2021!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_INVITES),
            meme: "https://media.giphy.com/media/L431UNLuEEKQYr4mmz/giphy.gif",
          },
        ],
        [
          800,
          {
            title: "Your friends are now inviting their friends!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_INVITES),
            meme: "https://media.giphy.com/media/f5kdqtO7DwooJwUbTq/giphy.gif",
          },
        ],
        [
          900,
          {
            title: "People are constantly joining your server!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_INVITES),
            meme: "https://media.giphy.com/media/PWZ5AWxUMaUxO/giphy.gif",
          },
        ],
        [
          1000,
          {
            title:
              "Popular YouTuber promoted your server invite. People are joining like a tsunami!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_INVITES),
            meme: "https://media.giphy.com/media/feS8TIJViDGKI/giphy.gif",
          },
        ],
        [
          1250,
          {
            title:
              "So many people have joined, you now need to contact Discord to allow more people!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_INVITES),
            meme: "https://media.giphy.com/media/Nre3KkDmRhQ1G/giphy.gif",
          },
        ],
        [
          1500,
          {
            title:
              "Your servers verification system is in place and properly handling the invites! Invites are free to be shared to the world!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_INVITES),
            meme: "https://media.giphy.com/media/KYElw07kzDspaBOwf9/giphy.gif",
          },
        ],
        [
          2000,
          {
            title:
              "Your Discord server now has a vanity invite url! discord.gg/probot",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_INVITES),
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
            title: "You have no bot's in your server!",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `The largest discord bot at the time of writing this is Rhytm with 8.2 million servers`",
              "",
              IDR_STRINGS.UPGRADING_BOTS,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme: "https://media.giphy.com/media/TOWtnRfxEixa0/giphy.gif",
          },
        ],
        [
          25,
          {
            title:
              "ProBot has joined your server! It instantly begins attacking the toxicity!",
            response: epicUpgradeResponse(
              IDR_STRINGS.UPGRADING_BOTS,
              "Your server is coming alone well! Time to join the hypesquad! To unlock your first, you will need to use `idle upgrade hypesquad`.",
            ),
            meme: "https://gfycat.com/grimyfilthyeelelephant",
          },
        ],
        [
          50,
          {
            title: "You now have your very own custom bot!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_BOTS),
            meme: "https://i.imgur.com/O0hH3n5.png",
          },
        ],
        [
          75,
          {
            title: "Bots are talking to bots! Botception!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_BOTS),
            meme: "https://i.imgur.com/v7ooBbp.png",
          },
        ],
        [
          100,
          {
            title: "Someone has stolen your idea and copied your bot!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_BOTS),
            meme: "https://i.imgur.com/xS4DcH3.png",
          },
        ],
        [
          150,
          {
            title: "Selfbots are joining your server and exposing your data!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_BOTS),
            meme: "https://media.giphy.com/media/a42Lx0aPS7Z3a/giphy.gif",
          },
        ],
        [
          200,
          {
            title: "Your bot went offline! Quick get it back up ;)",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_BOTS),
            meme: "https://media.giphy.com/media/UTRMPCnxwsZZ7VafB7/giphy.gif",
          },
        ],
        [
          300,
          {
            title: "Your bots finally have unlocked moderation powers!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_BOTS),
            meme: "https://media.giphy.com/media/HlcGS4xcqyzle/giphy.gif",
          },
        ],
        [
          400,
          {
            title: "Your bots were invited to a bot server farm!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_BOTS),
            meme: "https://media.giphy.com/media/UWQ7iLcwr6T611pjuR/giphy.gif",
          },
        ],
        [
          500,
          {
            title:
              "Some users are creating multiple accounts to spam your bot's currency commands!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_BOTS),
            meme: "https://gfycat.com/affectionateslipperyamberpenshell",
          },
        ],
        [
          600,
          {
            title:
              "Your bot's database has now exploded due to the spam of users!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_BOTS),
            meme: "https://gfycat.com/embarrassedeverykusimanse",
          },
        ],
        [
          700,
          {
            title:
              "Users are joining your support server asking how to do the simplest things.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_BOTS),
            meme: "https://gfycat.com/disgustingcostlyibis",
          },
        ],
        [
          800,
          {
            title: "ProBot has joined and is here to save the day!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_BOTS),
            meme: "https://gfycat.com/mammothfittingafricanaugurbuzzard",
          },
        ],
        [
          900,
          {
            title: "Your bot is now part of the big bots party inner circle!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_BOTS),
            meme: "https://gfycat.com/determinedflatgalago",
          },
        ],
        [
          1000,
          {
            title:
              "Your bot is so intelligent you begin to question, if you yourself are actually real.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_BOTS),
            meme: "https://gfycat.com/illfatedhandmadekoalabear",
          },
        ],
        [
          1250,
          {
            title:
              "AI is real! Your bot's are doing things without you need to code them.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_BOTS),
            meme: "https://i.imgur.com/f0I9j2Z.png",
          },
        ],
        [
          1500,
          {
            title:
              "The bots are running the entire server without you! They have taken control. Are you still necessary?",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_BOTS),
            meme: "https://media.giphy.com/media/7OkKFU3EGQJaw/giphy.gif",
          },
        ],
        [
          2000,
          {
            title:
              "You have discovered the only bot you need is ProBot! There is nothing like it! 10/10 ProBot!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_BOTS),
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
            title: "Your hypesquad is weak! No one cares!",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `There are currently over a million people in each hypesquad house at the time of writing this.`",
              "",
              IDR_STRINGS.UPGRADING_HYPESQUADS,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme: "https://media.giphy.com/media/xmt9HwR9oQzTy/giphy.gif",
          },
        ],
        [
          25,
          {
            title:
              "The hypesquad has joined your server and begun hyping! It's too loud!",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `Discord has around 250 employees at the time of writing this.`",
              "",
              "Your server is coming alone well! Time to get nitro! To unlock your first, you will need to use `idle upgrade nitro`.",
              "",
              IDR_STRINGS.UPGRADING_HYPESQUADS,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme: "https://media.giphy.com/media/w8ptJFCwIiimQ/giphy.gif",
          },
        ],
        [
          50,
          {
            title:
              "You have learned how to apply to become a hype squad member.",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `There are currently over a million people in each hypesquad house at the time of writing this.`",
              "",
              IDR_STRINGS.UPGRADING_HYPESQUADS,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme: "https://gfycat.com/grouchyapprehensivejerboa",
          },
        ],
        [
          75,
          {
            title:
              "You have unlocked the Bug Hunter badge by becoming a bug hunter!",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `There are currently 100 people with the green bug hunter badge at the time of writing this. They help find bugs for Discord.",
              "",
              IDR_STRINGS.UPGRADING_HYPESQUADS,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme: "https://gfycat.com/tastyglamorousgrub",
          },
        ],
        [
          100,
          {
            title: "You are now officially a hype squad member!",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `HypeSquad program has three houses you can be sorted in to by taking the in-app quiz: Bravery, Balance, and Brilliance.`",
              "",
              IDR_STRINGS.UPGRADING_HYPESQUADS,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme: "https://gfycat.com/tastyglamorousgrub",
          },
        ],
        [
          150,
          {
            title: "You now have an account in the Bravery hypesquad.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_HYPESQUADS),
            meme: "https://gfycat.com/disastrousconventionalballoonfish",
          },
        ],
        [
          200,
          {
            title: "You now have an account in the Balance hypesquad!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_HYPESQUADS),
            meme: "https://gfycat.com/backelegantachillestang",
          },
        ],
        [
          300,
          {
            title: "You now have an account in the Brilliance hypesquad!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_HYPESQUADS),
            meme: "https://gfycat.com/hoarseelasticbufeo",
          },
        ],
        [
          400,
          {
            title:
              "You've got swag! Discord is so impressed with your hype, they are sending you the goodies!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_HYPESQUADS),
            meme: "https://gfycat.com/capitalshamelessgull",
          },
        ],
        [
          500,
          {
            title:
              "You've been invited to the super secret HypeSquad Events Server.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_HYPESQUADS),
            meme: "https://gfycat.com/brightdifficultbabirusa",
          },
        ],
        [
          600,
          {
            title: "Discord has sent you a shirt for helping at their events!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_HYPESQUADS),
            meme: "https://gfycat.com/belovedidealisticbumblebee",
          },
        ],
        [
          700,
          {
            title:
              "Hosting your own events now! Wow! Discord has sent you a big box of goodies!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_HYPESQUADS),
            meme: "https://gfycat.com/coordinatedseverecornsnake",
          },
        ],
        [
          800,
          {
            title: "HypeSquad has helped share Discord to countless people.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_HYPESQUADS),
            meme: "https://gfycat.com/bountifulfinegraywolf",
          },
        ],
        [
          900,
          {
            title: "You now have the charm and prowess of a true Hype Squader!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_HYPESQUADS),
            meme: "https://gfycat.com/wealthycoarsebluefintuna",
          },
        ],
        [
          1000,
          {
            title: "Your so hype, you are now worthy!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_HYPESQUADS),
            meme:
              "https://gfycat.com/accomplishedparchedindianringneckparakeet",
          },
        ],
        [
          1250,
          {
            title: "",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `There are currently over 1500 verified servers at the time of writing this.`",
              "",
              IDR_STRINGS.UPGRADING_HYPESQUADS,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme: "",
          },
        ],
        [
          1500,
          {
            title: "",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `There are currently over 8500 partnered servers at the time of writing this.`",
              "",
              IDR_STRINGS.UPGRADING_HYPESQUADS,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme: "",
          },
        ],
        [
          2000,
          {
            title: "",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `There are currently 2100 HypeSquad events members at the time of writing this.`",
              "",
              IDR_STRINGS.UPGRADING_HYPESQUADS,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme: "",
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
            title: "You don't have any nitro!",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `We came up with the idea of Discord Nitro over morning breakfast potatoes.`",
              "",
              IDR_STRINGS.UPGRADING_NITRO,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
            meme: "https://gfycat.com/fastunrealisticbrocketdeer",
          },
        ],
        [
          25,
          {
            title: "None of your members will give you free nitro!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_NITRO),
            meme: "https://gfycat.com/assuredacrobaticachillestang",
          },
        ],
        [
          50,
          {
            title: "Someone stole the Nitro gift before you could accept it.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_NITRO),
            meme: "https://media.giphy.com/media/10H4by255F2UsU/giphy.gif",
          },
        ],
        [
          75,
          {
            title: "Someone has gifted you nitro!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_NITRO),
            meme: "https://gfycat.com/satisfiedmeaslyflickertailsquirrel",
          },
        ],
        [
          100,
          {
            title: "You got no boosts! Nitro Classic Lives!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_NITRO),
            meme: "https://gfycat.com/amusingweeklygilamonster",
          },
        ],
        [
          150,
          {
            title: "Use an animated avatar and claim a custom tag.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_NITRO),
            meme: "https://gfycat.com/difficultkeenhoatzin",
          },
        ],
        [
          200,
          {
            title: "Collect or make your own custom and animated emojis.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_NITRO),
            meme: "https://gfycat.com/admirableultimategonolek",
          },
        ],
        [
          300,
          {
            title: "Profile badge shows how long you've supported Discord.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_NITRO),
            meme: "https://gfycat.com/cluelesscandidamethystsunbird",
          },
        ],
        [
          400,
          {
            title: "100MB upload size for high-quality file sharing.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_NITRO),
            meme: "https://gfycat.com/cornyflimsyfieldmouse",
          },
        ],
        [
          500,
          {
            title: "Hi-res video, screenshare, and Go Live streaming.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_NITRO),
            meme: "https://gfycat.com/complicatedangryamericanriverotter",
          },
        ],
        [
          600,
          {
            title: "Get 2 Server Boosts and 30% off extra Boosts.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_NITRO),
            meme: "https://gfycat.com/blaringslimhake",
          },
        ],
        [
          700,
          {
            title: "Those without nitro can no longer harm you!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_NITRO),
            meme: "https://gfycat.com/poorunitedbighorn",
          },
        ],
        [
          800,
          {
            title: "When you see someone using default emojis.",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_NITRO),
            meme: "https://gfycat.com/rapidelementarychevrotain",
          },
        ],
        [
          900,
          {
            title: "Nitro is running out! Time to renew!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_NITRO),
            meme: "https://gfycat.com/likablethatblackrussianterrier",
          },
        ],
        [
          1000,
          {
            title: "Everyone without nitro can not stop following you!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_NITRO),
            meme: "https://gfycat.com/brightwaterykawala",
          },
        ],
        [
          1250,
          {
            title: "Do you want Nitro?",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_NITRO),
            meme: "https://gfycat.com/gloomypleasantcicada",
          },
        ],
        [
          1500,
          {
            title: "Share the nitro love by giving others nitro!",
            response: epicUpgradeResponse(IDR_STRINGS.UPGRADING_NITRO),
            meme: "https://gfycat.com/cleverclearcutflea",
          },
        ],
        [
          2000,
          {
            title: "Unlimited Nitro for everyone!",
            response: [
              IDR_STRINGS.HEY_THERE,
              "",
              IDR_STRINGS.CONGRATS,
              "",
              "🖊️ **Note:** `There is a super cool easter egg in Discord. Press the following keys in order. `CTRL + /` or `CMD + /`. This will open the menu. Then press `h` two times. Then press the right arrow key. Then press `n`. Then finally press `k`.",
              "",
              IDR_STRINGS.UPGRADING_NITRO,
              "",
              IDR_STRINGS.LONG_LIVE,
            ].join("\n"),
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
      const secondsAllowedOffline = (botCache.constants.milliseconds.HOUR *
        (botCache.vipUserIDs.has(profile.id) ? 8 : 2)) / 1000;
      const seconds = secondsSinceLastUpdate > secondsAllowedOffline
        ? secondsAllowedOffline
        : secondsSinceLastUpdate;

      return {
        currency: botCache.constants.idle.engine.calculateTotalProfit(profile) *
          BigInt(Math.floor(seconds)),
        lastUpdatedAt: now,
      };
    },
    calculateTotalProfit: function (profile) {
      let subtotal = BigInt(0);

      for (const item of botCache.constants.idle.items) {
        subtotal += botCache.constants.idle.engine.calculateProfit(
          profile[item],
          botCache.constants.idle.constants[item].baseProfit,
          profile.guildIDs.length,
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

      return BigInt(level) * BigInt(baseProfit) * BigInt(multiplier) *
        BigInt(prestige);
    },
    calculateUpgradeCost: function (baseCost, level) {
      return baseCost * Math.pow(1.07, level);
    },
    currentTitle: function (type, level) {
      let title = "";
      for (
        const [key, upgrade] of botCache.constants.idle.constants[type].upgrades
          .entries()
      ) {
        if (key < level) title = upgrade.title;
      }

      return title;
    },
    /** Takes the current user currency, the cost of the item, and how much currency the user is gaining per second and converts it to milliseconds until this item can be bought. */
    calculateMillisecondsTillBuyable: function (currency, cost, perSecond) {
      return (BigInt(cost) - BigInt(currency)) / BigInt(perSecond) *
        BigInt(1000);
    },
    isEpicUpgrade: function (level) {
      return epicUpgradeLevels.includes(level);
    },
  },
};
