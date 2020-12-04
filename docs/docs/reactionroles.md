---
title: Reaction Roles
date: 2020-11-27
---

# What are reaction roles used for?

Have you ever gone through the trouble of creating roles for users to assign themselves only for them to never to do so? Do your users play a new game where it’d be useful to know which server other gamers are playing on? Do you wish there were a visually attractive way to sign up for multiple roles that didn’t involve typing out a command several times?  Well then, have we got a command for you!

- ✅ Allow users to assign roles to themselves by tapping a reaction.
- ✅ Can create an alternate verification process
- ✅ Sign up for roles that can be used in conjunction with the Events feature
- ✅ Create teams, sort users by geographical location, favorite server, etc.

Reaction roles are a fun, easy and visual way for users to assign roles to themselves without having to go through the effort of having to type .give role.

## Reaction Roles, Associated Commands

||||
|--- |--- |--- |
|Command|Purpose|Alias|
|.emojis|Shows a list of all emoji added to your global database|.em|
|.emojicreate name emoji|Creates an emoji that you can use on any discord server!|.emc|
|.emojidelete name|Deletes an emoji from your global database|.emd|
|.reactionrolecreate msgID Name Emoji Role/RoleID/Role Name|Create a reaction role with the given emoji and role to add when a user clicks/taps|.rrc|
|.reactionroledelete name|Deletes the desired reaction role|.rrd|
|.reactionroleadd name emoji Role/RoleID/Role name|Adds the emoji to the reaction role and adds the role to be added when clicking said emoji.|.rra|
|.reactionroleremove name emoji|Removes the specified emoji from the reaction role||

> Items listed in bold/italic are variables.  Ie. **_name = _**what you wish to call the emoji.  You wouldn’t type **_name_**.  In addition, **_emoji_** refers to an emoji added to the global database, not server emoji.


## Getting Started with Reaction Roles

### Enabling Developer Mode

We need to enable developer mode so that we will be able to copy MessageIDs, which are necessary for building our reaction roles down the line.  In order to do this we first click on the user settings cog.  In the sidebar that now exists, we navigate to “Appearance”.  On the right side of the pane should now exist the “Developer Mode” toggle near the bottom of the screen (may need to scroll some).  Toggle this to on.  That’s it! Now we’re ready to get some IDs!


### Creating your Embed/Message

In order to use our newfound powers, we will have to create a message or an embed to use as our reaction role.  **Beware that whatever channel it is created in, it will have to stay there - you cannot call the reactionrole message later in a different channel.  **Once you have your channel and permissions created if necesary, go ahead and either type a message or create an embed using `.embed @user {object}.  `You can use User Variables (shown below) if you mention a user during embed creation.  Now, you COULD create the embed by hand but obviously it’s much simpler just to use the [nadeko embed builder!](https://embedbuilder.nadekobot.me/)

Once your embed or message is in place it’s time to add some emoji!

### MessageID and Adding Emoji

We now have our embed!  Go ahead and type .embed + paste your code from nadeko.  Using the three dot menu on desktop, or long pressing on mobile you can copy the message ID.  You will need this for your reaction role creation.

Now to add some emojis to your global database:  type .emojicreate name and the emoji you wish to add.  For example .emojicreate agree :whitecheckmark: would create an emoji in your database called agree that would look like whitecheckmark.  These emoji will come with you from server to server, so even if you don’t have discord nitro, you can use your emoji in different servers when you set up events.  Neat, huh?

### Adding Roles

The last part of this reaction role _mise en place_ is setting up the roles that you want to assign in your reaction role.  I won’t cover this as it’s assumed you know how to create a role and set permissions within discord.  Just a reminder section that you need to create these roles first as we’ll use them in the next section.


## Creating Your ReactionRole


### .reactionrolecreate / .rrc

To create your first reaction role you need all the pieces in place from the prior section.  You will need:

*   Emojis
*   Roles
*   MessageID

So now that we have all those, let’s begin.  In the channel with the message **.rrc will not work if you try to run it from outside the channel with the message you’re working with** type;

`.reactionrolecreate messageID NAME EMOJI ROLE`

Where

*   NAME is the title that you wish to assign to the reaction role (important for manipulation of the reactionrole later)
*   ROLE is the role that you wish a user to obtain when they click the reaction
*   EMOJI is the emoji that a user will click to obtain the role.  This will be the name in the global database you assigned in the earlier steps

When you’re done you should get a confirmation of success and you should now see your message has a reaction.  Go ahead and test it out!  If you only wish to add one reactionrole to your message you’re done!  If you wish to add additional reactions read on!


### .reactionroleadd / .rra

If you wish to add additional reactionroles type

`.reactionroleadd EMOJI ROLE ` with the emoji and role combination you wish to add. It’s that simple.  Repeat for any remaining roles you wish to assign.

> It's important to notice that while you must use reactionrolecreate in the channel with the messageID, you can use .reactionroleadd from any channel.  Due to the intricacies of coding that are beyond this humble guide-writer, it's not possible to have .reactionrolecreate run from different channels, but at least adding additional reactionroles doesn't have to mean endless botspam in your message channel.

### .reactionroledelete / .rrd vs. .reactionroleremove / .rrr

So you’re pretty much done!  You’ll notice however that there are two more .reactionrole commands we haven’t touched.  First, .reactionroleremove is for if, let’s say you’ve decided you no longer need to have a “north american” role assigned from your reactionrole.  You can type `.reactionroleremove NAME north american` to remove _one specific reaction role from a message._  If you decided to remove the entire reaction role for some reason, you can delete _the entire set of reactionroles_ by typing `.reactionroledelete NAME.`

## Reaction Role Cheat Sheet

1. Enable Developer mode
2. Create your embed/message
3. Add your Emoji
4. Create your roles
5. Copy your message ID
6. .reactionrolecreate NAME MessageID EMOJI ROLE

## Color Wheel

If you are looking to create a reaction role for colored roles, this is a built in feature of Gamer that you can do automatically. Just run the following command: `.reactionrolecreate setup`

## Unique Role Sets

Gamer also has an additional feature called Unique Role Sets which can be tied in with Reaction Roles. This can be used to remove other roles when a user is given a role.

Basically, when a user is granted a role, you can remove every role that is in a set with that role. Let's take an example, when you are playing a game with several regions you might have roles like this:

- NA
- EA
- EU
- SA
- SEA
- CN

You can use Unique Role Sets to make sure that a player never has more than 1 of these roles at any time. In regards to verification, we can do something like this where we create a roleset of the following roles:

- Verify
- Verified

Now whenever someone is given the Verified role by the reaction role, Gamer bot will remove the Verify role.
