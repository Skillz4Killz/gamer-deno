---
title: Verification System
date: 2020-11-27
---

## What is a Verification System?

Have you ever heard of servers being raided? Are user's alt accounts getting instant access to your server? It is time to set up some verification!

- ✅ Lock access to the server for all new users until verified.
- ✅ Captcha verification
- ✅ Simple reaction to unlock server or step by step walkthrough process.
- ✅ Enforce users reading and agreeing to your rules before they gain access to your server.
- ✅ Multiple customizable welcome messages
- ✅ Auto-Role system without breaking Verified Server Discord Guidelines

Gamer's Verification system was designed in a manner which allowed maximum customizability as every server is unique. This can lead to a little confusion because of how many settings/features are involved. Let's simply take it step by step and find out how easy it really is.

## Basic Verification Setup

The first thing to do is simply create the base of the verification system. To do this:

> It can help to grant Gamer the Administrator permission temporarily before using this command.

`.setverify setup`

![setupgif](https://i.imgur.com/Z1AXHTr.gif
)

### Understand What Was Done

Gamer has created an entire basic verification system for you that can be used for any general purpose server. There were a lot of things that this command does behind the scene so let's break it down.

- ✅ Created a category called Verification Zone, the name may be different if you use a different language.
  - ✅ Created a channel inside that category called, #verify-here. Once again the name of the channel will depend on your server's language.
  - ✅ Hide this category and all future channels in this category from everyone. But allow Gamer, bot admins, bot mods, and the Verify role to be able to view these channels.
- ✅ Created a Verify role on your server.
- ✅ Edited every "necessary" channels on your server to prevent viewing the channel if the user has the Verify role.
  - ✅ Whenever new channels are created, they will also be automatically updated to prevent new users from seeing them. A lot of bot's don't take this into consideration but Gamer does! We make sure that you don't need to be manually updating channels in the future.

> This is why we recommend giving Gamer Admin perms before using this command. You can remove it again once it is done. This allows Gamer to edit all channels.

- ✅ Setup a pretty basic embed message inside the #verify-here channel that will welcome users and then tell them to begin by typing .verify
- ✅ Setup a pretty custom first message response. This message is sent in the channel that is created whenever a user uses the .verify command.

### Understanding The User Perspective

When a user joins a server that has the verification system enabled, they are automatically given the @Verify role. Once they get this role, they are immediately locked from accessing anything outside of the Verification Category.

![verifynewbie](https://i.imgur.com/a/cXis9y6.png)

Here is an example of how a new member will see your server as they complete the verification process.

![unlockgif](https://i.imgur.com/Z1AXHTr.gif)

As you can see, new members get locked out of all the channels and have to proceed by verifying in order to gain access. However, there are time when you may want to allow new members to be able to view certain channels. For example, I want to make it so that when new members join they can see my #wall channel where I post updates/announcemnts and all sorts of information. You can also do this with other channels you feel are important for newcomers like a #rules channel for instance.

Simply edit the channels permission and remove the Verify role's overwrite.

![verifywall](https://i.imgur.com/a/7087TfJ.png)

🎉 Now they can see exactly what I wanted them to be able to see. This makes it so that when I make any @everyone announcement, even users that have not verified will also be notified. 💪

Now for the default system, the user can join and type `.verify` to begin the process. This will make a new channel with their name under the verification category and also delete all messages on that channel except the first message in that channel it finds. This will automatically keep the verify channel clean for you so when new users join they will see the instructions right away.

> The channels that the users created, will delete after 10 minutes of inactivity to help keep the server clean. They will need to restart the process by typing `.verify` again in the #verify-here channel.

## Customizing The Base

Let's suppose you wanted something different than the base Verification Messages. For example, you wanted a special unique embed as the welcome message to showcase your rules.

We start by using the `.embedset` command and build the embed the exact way we want.

![embedsetgit](https://i.imgur.com/pGbeNXd.gif)

Nice! We just finished creating a really cool rules embed. Now let's go ahead and edit the embed in the #verify-here channel.

1. In the same channel you did the `.embedset` command, find the embed you created and copy it's message ID.
2. Type `.embedshow messageID`. This will give you a code that you will copy paste in the final step.
3. Open the #verify-here channel
4. Type `.embededit` but don't press enter yet.
5. Copy the message ID of the embed in this channel we want to edit. Then paste the id so it looks something like `.embededit 739521626055507999`
6. Now you can copy the code from step 2 and paste it. It should look something like this:

![embededitgif](https://i.imgur.com/hf3IV5n.gif)

## Reaction Role Verification

This section is for when you don't really want a captcha verification system but just a sweet and simple reaction role verification system.

You could now convert this rule embed you created above into a reaction role. Read the [Reaction Role Guide](https://gamer.netlify.com/reaction-roles-feature).

You have two options with the reaction role.

1. When tapping the reaction it can remove the Verify role.
2. When tapping the reaction it can add the Verified role or whichever role you would like your members to get showing they have read the rules and other stuff.

If you choose option 2, Gamer also comes with a feature called Unique Role Sets. Basically, when a user is granted a role, you can remove every role that is in a set with that role. Let's take an example, when you are playing a game with several regions you might have roles like this:

- NA
- EA
- EU
- SA
- SEA
- CN

You can use Unique Role Sets to make sure that a player never has more than 1 of these roles at any time. In regards to verification, we can do something like this where we create a roleset of the following roles:

- Verify
- Verified

![rolesetcreategif](https://i.imgur.com/8E4PzVc.gif)

Now whenever someone is given the Verified role by the reaction role, Gamer bot will remove the Verify role.

![rolesetgif](https://i.imgur.com/dYn4Gjm.gif)