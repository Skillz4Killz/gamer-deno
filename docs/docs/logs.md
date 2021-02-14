---
title: Server Logs!
date: 2021-01-15
---

## Do You Need Server Logs?

Server logs are one of the most advanced features on Discord. Sometimes Discord Audit Logs are just not enough! This is where Server Logs come in! With the extreme customizability and flexibility of Gamer bot, server logs goes to another level.

## Setup Logs

`.setup logs`

## Basic Logs

There are 3 types of basic logs that do not normally comply with other server log types. These are as follows:

- automod
- mod
- public

The `automod` channel is where all the auto-moderation actions are posted. For example, profanity, capitals, url filters and other automated actions will be logged here.

The `mod` channel is where all the manual moderation actions are posted. For example, warn, mute, ban, kick etc...

The `public` channel by default is created private but is meant for you to make public if you desire. The public channel is a way to let server members see the activity on your server. It helps have transparency with your members as well. The public logs can also be used to educate the members on what punishments are recieved for which actions. However, public logs do not show the moderator who took action to prevent any witch-hunting against mods. **PUBLIC LOGS ARE VIP ONLY!**

### Editing The Channels

`.settings logs automod` ~ Resets the logs channel.
`.settings logs automod #channel` ~ Set the logs channel.

You can replace `automod` with any of the names above to edit the other channels.

### Server Logs

Specific server logs are logs that occur whenever some action happens on your server.

- banadd
  - ba
- banremove
  - br
- rolecreate
  - rc
- roledelete
  - rd
- roleupdate
  - ru
- rolemembers
  - rm
  - **VIP ONLY!**
- memberadd
  - ma
- memberremove
  - mr
- membernick
  - mn
  - **VIP ONLY!**
- messagedelete
  - md
  - allows ignoring certain channels
  - allows ignoring certain roles
  - **VIP ONLY!**
- messageedit
  - me
  - allows ignoring certain channels
  - allows ignoring certain roles
  - **VIP ONLY!**
- emojicreate
  - ec
- emojidelete
  - ed
- channelcreate
  - cc
- channeldelete
  - cd
- channelupdate
  - cu
  - allows ignoring certain channels
- voicejoin
  - vj
  - allows ignoring certain channels
  - **VIP ONLY!**
- voiceleave
  - vl
  - allows ignoring certain channels
  - **VIP ONLY!**
- images
  - im
  - does NOT have public logs
  - allows ignoring certain channels
  - allows ignoring certain roles
  - **VIP ONLY!**

## Editing Server Logs

Remember you can use the names or aliases listed above to replace the `messagedelete` below.

- `.settings logs messagedelete on` ~ Turns on the logs and the channel the command is used in will be the log channel.
- `.settings logs messagedelete off` ~ Turns off the logs.
- `.settings logs messagedelete #channel` ~ Sets the logs to this channel.
- `.settings logs messagedelete ChannelID` ~ Sets the logs to a channel on a separate server. **VIP ONLY**
- `.settings logs messagedelete public on` ~ Turns on the public logs for this type of logs.
- `.settings logs messagedelete public off` ~ Turns off the public logs for this type of logs.
- `.settings logs messagedelete ignore #channel` ~ Sets a channel to be ignored for this type of logs.
- `.settings logs messagedelete ignore @role` ~ Sets a role to be ignored for this type of logs.
- `.settings logs messagedelete allow #channel` ~ Sets a channel to be allowed for this type of logs.
- `.settings logs messagedelete allow @role` ~ Sets a channel to be allowed for this type of logs.

## Cross Server Logs

One of the coolest **VIP ONLY** features for Gamer is the ability to set server logs in another server. Sometimes, it can get annoying and clutter up your main server. Gamer, allows you to set channels for logs in another server. The bot will then post all logs to the other server that you have chosen.

Simply replace #channel with a channel id from another server.

## NSFW Requirement

Server logs feature must be NSFW only channels.

The reasoning for this is that Discord requires bots to only post NSFW content in NSFW channels. Server logs are things that are out of our control. For example, posting the message that was deleted could have been a NSFW message. The image we log could be NSFW. The channel names, role names, user names all of it could be NSFW content that the bot is then made to send.

Why is this bad? Recently, Discord Trust & Safety began banning bots for being reported for a user tricking bots to post another users information. In essence, the bots were tricked to dox another user by just using the `!say` command. Then the user began to mass report these bots and got 5 different bots banned from Discord. Upon requesting an appeal from TnS, Discord continued to reject their appeals meaning the bots stayed banned. Luckily, 4/5 of these bots had a friend who owns one of the biggest bots on Discord. He proceeded to spend days diving deep into this and figuring out the details behind this situation. It took him having to personally contact the Discord developers to get the bots unbanned.

What does this mean? Can you really get a bot banned for having bots post NSFW messages in a non-NSFW channel? YES!

To avoid this, we require the use of NSFW channels for server logs.
