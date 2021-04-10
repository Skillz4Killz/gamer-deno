(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{509:function(e,o,t){"use strict";t.r(o);var a=t(4),s=Object(a.a)({},(function(){var e=this,o=e.$createElement,t=e._self._c||o;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("ol",[t("li",[t("code",[e._v(".avatar")]),e._v(" command now has a subcommand "),t("code",[e._v(".avatar server")]),e._v(" that will show you the servers avatar")]),e._v(" "),t("li",[t("code",[e._v(".server")]),e._v(" command no longer shows your servers settings for the bot, but instead more information about the server. For example, the emojis, the language etc")]),e._v(" "),t("li",[t("code",[e._v(".language")]),e._v(" command instead of "),t("code",[e._v(".setlanguage")]),e._v(" to check/view the language\n."),t("code",[e._v("language set spanish")]),e._v(" to change the language")]),e._v(" "),t("li",[t("strong",[e._v("Mirrors")]),e._v(" feature now provides an extra VIP option to filter only images")]),e._v(" "),t("li",[t("code",[e._v("prefix")]),e._v(" command instead of "),t("code",[e._v(".setprefix")]),e._v(" to check/view the prefix\n"),t("code",[e._v(".prefix set !")]),e._v(" to change the prefix")]),e._v(" "),t("li",[t("code",[e._v("rolesetcreate")]),e._v(" and related commands now are under "),t("code",[e._v(".roles unique create")])]),e._v(" "),t("li",[t("strong",[e._v("New Feature:")]),e._v(" "),t("code",[e._v("VIP ONLY")]),e._v(" Auto-embed messages in a channel")]),e._v(" "),t("li",[e._v("Remove various amounts of text/quotes from fun commands.")])]),e._v(" "),t("h2",{attrs:{id:"mod-mails"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#mod-mails"}},[e._v("#")]),e._v(" Mod Mails")]),e._v(" "),t("p",[e._v("The mod mail has been reworked and cleaned up. A couple cool aspects added in but an insane level of customizability provided for VIPs")]),e._v(" "),t("ol",[t("li",[e._v("To setup: "),t("code",[e._v(".settings mails setup")]),e._v("This will create a base for you to work with. Highly recommended\na. It will create a mail category inbox for you\nb. It will create a "),t("code",[e._v("mail-alert")]),e._v(" role for you that you can assign to mods who need to be pinged\nfeel free to delete and customize this role later\nc. creates a "),t("code",[e._v("mail-logs")]),e._v(" channel for logging/archiving all ur mail history since channels in mails are deleted\nd. creates a "),t("code",[e._v("ratings")]),e._v(" channel where users who give ur support a rating will be sent\nUseful for learning which users are satisfied and which were not and learn to improve ur support team for ur server to make all users happy and satisfied\nOther settings:\n"),t("code",[e._v(".settings mails roles roleID roleID roleID")]),e._v(" to select which roles to @ when a mail arrives\n"),t("code",[e._v(".settings mails enable")]),e._v(" "),t("code",[e._v(".settings mails disable")])])]),e._v(" "),t("p",[t("strong",[e._v("VIP ONLY")]),e._v(" "),t("code",[e._v(".settings mails autoresponse")]),e._v(" When users send a mail, you can create a autoresponse to send like Thank you for contacting us. This is an automated response. I have @ the team. They will respond as soon as possible. In the meantime, if you feel you need to send more information, feel free to use the mail command below to send more messages.")]),e._v(" "),t("p",[t("strong",[e._v("VIP ONLY:")]),e._v(" Mod mails now allow you to be able to create a Q&A session where you set certain questions that users need to respond to before they can send a mail. Only once the user has responded to them you will get a mail.\nWhen you do "),t("code",[e._v(".settings mails setup")]),e._v(" gamer creates some gaming based questions as a default for you. The questions are as follow")]),e._v(" "),t("ul",[t("li",[e._v("What is your in game name?")]),e._v(" "),t("li",[e._v("What is your player ID?")]),e._v(" "),t("li",[e._v("What is the device that you play on?")]),e._v(" "),t("li",[e._v("What server is your account on?")]),e._v(" "),t("li",[e._v("Which country are you located in?")]),e._v(" "),t("li",[e._v("How can we help you?")])]),e._v(" "),t("p",[e._v("In order to add or remove questions you will use the command as follow\n"),t("code",[e._v(".settings mails questions add")]),e._v(" "),t("code",[e._v(".settings mails questions remove")]),e._v("\nThis will begin a small Q&A session to help you add or remove the questions.\nFirst thing is whether you want the user to respond by typing a message or to answer your question based on a reaction. For example, some questions like What is your in game name? can be different for every user. For this you would want to use the message type. But for questions like, what server is your account on? You can limit it to specific options like NA, EU, SA, EA, etc... Then users will be able to select one of them by tapping a reaction. The second thing you will be asked it to provide the question. Then a "),t("code",[e._v("label")]),e._v(". This label is important as this is what you will use to remove a question. It will also be shown in your mails channels. For example, if the question is "),t("code",[e._v("What is your in-game name?")]),e._v(" You can create a label called "),t("code",[e._v("In-Game Name")]),e._v(" Then in your mail you will get a mail that uses that label.")]),e._v(" "),t("p",[t("img",{attrs:{src:"https://media.discordapp.net/attachments/746499440981966988/751204312520327288/unknown.png",alt:"label"}})]),e._v(" "),t("p",[e._v("Lastly, you must decide what type of response you want.Do you want a 1 word string, multiple words allowed, a number?")]),e._v(" "),t("p",[e._v("If you chose the "),t("code",[e._v("reaction")]),e._v(" option, you need to provide the question, label and the options\nWhen the bot asks you for the options they must be provided by splitting them with "),t("code",[e._v("|")]),e._v("\nFor example:\n"),t("code",[e._v("NA | EU | SA | SEA | EA | CN")])]),e._v(" "),t("p",[t("strong",[e._v("VIP FEATURE:")]),e._v(" Replying to mails anonymously. Sometimes you don't want to respond and give your name to a mail. Sometimes, you may wish to reply on the behalf of the entire team. To do this you can reply using")]),e._v(" "),t("p",[t("code",[e._v(".mail reply anonymous your response to the user here")])]),e._v(" "),t("p",[t("strong",[e._v("VIP FEATURE:")]),e._v(" On occassion, you may wish to silently close a mail without the user being alerted. To do this "),t("code",[e._v(".mail silent the reason to add to the logs")])]),e._v(" "),t("p",[t("strong",[e._v("VIP FEATURE:")]),e._v(" One of the coolest things about the new mod mails is it's ability to be handled on a separate server!!! If you want to do this, you can do "),t("code",[e._v(".settings mail setup OTHER_GUILD_ID")]),e._v(" For example, if you manage multiple servers and you want to keep the support team in one place now you can! This will also help keep your main server clean and allow your team to mute the main server but keep notifications on for the support server so they can be on alert for important things in order for your users to have the best quality support possible.")]),e._v(" "),t("h2",{attrs:{id:"how-high-can-you-go"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#how-high-can-you-go"}},[e._v("#")]),e._v(" How High Can You Go?")]),e._v(" "),t("p",[e._v("In this update, we are introducing a new game to the bot that you and your members can play! While testing it has shown to help increase server activity on our server quite a lot! It seems to motivate users who never really talk to talk in your server! 🎉")]),e._v(" "),t("p",[t("img",{attrs:{src:"https://i.imgur.com/4teBKkY.png",alt:"counting"}})]),e._v(" "),t("p",[e._v("As always, the first thing to take care of is setting it up.")]),e._v(" "),t("p",[t("code",[e._v("!counting setup")])]),e._v(" "),t("ol",[t("li",[e._v("Creates a category for the counting game.")]),e._v(" "),t("li",[e._v("Creates a "),t("code",[e._v("Count-Team-One")]),e._v(" role")]),e._v(" "),t("li",[e._v("Creates a "),t("code",[e._v("Count-Team-Two")]),e._v(" role")]),e._v(" "),t("li",[e._v("Creates a "),t("code",[e._v("Needs-Math-Tutoring")]),e._v(" role")]),e._v(" "),t("li",[e._v("Creates a "),t("code",[e._v("#counting-global")]),e._v(" channel")]),e._v(" "),t("li",[e._v("Creates a "),t("code",[e._v("#team-one")]),e._v(" channel")]),e._v(" "),t("li",[e._v("Creates a "),t("code",[e._v("#team-two")]),e._v(" channel")])]),e._v(" "),t("p",[t("code",[e._v("#counting-global")]),e._v(" is where your entire server will play as a clan against every other server! Clan wars are here hehe")]),e._v(" "),t("p",[e._v("The two roles were created so you can have your server members pick a team they would like to be on and compete against each other. For example, you could create a competition with a small prize and create some channels roles.")]),e._v(" "),t("p",[t("em",[e._v("Tip: You can create more roles and channels if you want more teams.")])]),e._v(" "),t("p",[t("em",[e._v("Note: Any channel you create for the counting game must have the following keyword in it's topic so gamer bot knows it is part of the counting game.")]),e._v(" "),t("code",[e._v("gamerCounting")])]),e._v(" "),t("p",[e._v("When a user makes a mistake they are automatically given the "),t("code",[e._v("Needs-Math-Tutoring")]),e._v(" role. You can choose to use this as a punishment if you wish. For example, you can lock out this role from participating in your server's counting game")]),e._v(" "),t("p",[t("em",[e._v("Tip: Use Role Messages to give these users an alert when they are granted this role. Role messages are a VIP only feature.")])]),e._v(" "),t("p",[e._v("The game is simple, you just count!\nEach user will leave a message in the channel counting upwards.")]),e._v(" "),t("p",[e._v("The first user types 1, then the next user types 2 etc...")]),e._v(" "),t("ul",[t("li",[e._v("Some countries use "),t("code",[e._v(",")]),e._v(" or "),t("code",[e._v(".")]),e._v(" to separate large numbers. Gamer does support these. So "),t("code",[e._v("1000000")]),e._v(" can be typed as "),t("code",[e._v("1,000,000")]),e._v(" or "),t("code",[e._v("1.000.000")]),e._v(" or if your one of those people that like to see the world upside down burning :pandaheadonfire: you can actually do "),t("code",[e._v("1.0,0.0,0.0,0")])]),e._v(" "),t("li",[t("strong",[e._v("VIP ONLY:")]),e._v(" Messages that are not valid numbers will be automatically deleted.")]),e._v(" "),t("li",[e._v("The game comes with many items that you can buy to buff your team. Use the "),t("code",[e._v("!shop counting")]),e._v(" to view all the items you can buy. For example, you can buy the Double Time buff item which will allow you to count by 2 for a while allowing you to rise much quicker. Very useful when you have a bunch of people online. But as this is a game that can be played against others, we also have "),t("code",[e._v("debuffs")]),e._v(". Enemies on other teams, can add debuffs to you. For example, they can active slowmode on your channel for an hour. Compete against each other to see who is the best in the world!")])]),e._v(" "),t("p",[t("em",[e._v("Tip: To buy an item use "),t("code",[e._v("!shop counting 1")]),e._v(" The number to use will be inside the [] when you view the shop. To buy a debuff against an enemy, you will do "),t("code",[e._v("!shop counting 1 channelID")]),e._v(" The channelID you use is the id where the enemy plays their game.")])]),e._v(" "),t("p",[t("strong",[e._v("Please be aware that buying a debuff will alert the target of your username, user id, channel name, channel id, server name and server id. This is done, to allow them to know who is attacking them. NEVER buy a debuff if you don't want to share this information with your enemy. VIP users can buy debuffs anonymously!")])]),e._v(" "),t("ul",[t("li",[e._v("Normally, users can not count in a row. If you counted, you must wait for another user to count.\n"),t("em",[e._v("Note: There is a item you can buy that allows your team to be able to count back to back for a while.")])]),e._v(" "),t("li",[e._v("If you mess up the count, the game will reset. Before it resets, it will give you 60 seconds to save yourself, by joining our support server and sending 1 message. If you are active once a day on our server you will be able to save your game when you mess up.")]),e._v(" "),t("li",[e._v("If you mess up, it will disable the game for 60 seconds.")])]),e._v(" "),t("p",[e._v("A list of current supported items: (More will be added in the future.)")]),e._v(" "),t("p",[t("img",{attrs:{src:"https://i.imgur.com/0KtSMAI.png",alt:"shpcount"}})]),e._v(" "),t("hr"),e._v(" "),t("h1",{attrs:{id:"role-sets-vip-only"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#role-sets-vip-only"}},[e._v("#")]),e._v(" Role Sets: VIP ONLY!")]),e._v(" "),t("p",[e._v("Until now, Gamer has had a feature called Unique Role Sets. It let you prevent users from having multiple roles at the same time from a group of roles. This is going into overdrive in this update. We now have 4 types of role sets.")]),e._v(" "),t("p",[t("code",[e._v("Unique Role Sets")]),e._v(": These role sets allow you to make sure a user can only have 1 role in this set of roles. If you have more than 1 role in this set, they will be removed so you can only keep 1.\n"),t("code",[e._v("Required Role Sets:")]),e._v(" These role sets allow you to set a required role in order to gain any role in this set. For example, if you have the NA, EU, SA roles but you want to make sure that users can not get any of these roles unless they also have the Verified role. This is what required role sets are for.\n"),t("code",[e._v("Grouped Role Sets:")]),e._v(" These role sets allow you to automatically give other roles when the user gains a role. For example, if the user is granted a Booster role on your server you might also want to add other roles like VIP.\n"),t("code",[e._v("Default Role Sets:")]),e._v(" These role sets allow you to make sure that the user always has some role from this set. For example, if you have a set of roles of NA, EU, SA you can set the default role to UNVERIFIED. This way if the user does not have any of the 3 roles, they are given the UNVERIFIED role.")]),e._v(" "),t("p",[t("code",[e._v("roles unique")]),e._v(" "),t("code",[e._v("roles unique create roleSetName roleid roleid roleid")]),e._v(" "),t("code",[e._v("roles unique delete roleSetName")]),e._v(" "),t("code",[e._v("roles unique add roleSetName roleid")]),e._v(" "),t("code",[e._v("roles unique remove roleSetName roleid")]),e._v(" "),t("code",[e._v("roles default")]),e._v(" "),t("code",[e._v("roles default create roleSetName roleid roleid roleid")]),e._v(" "),t("code",[e._v("roles default delete roleSetName")]),e._v(" "),t("code",[e._v("roles default add roleSetName roleid")]),e._v(" "),t("code",[e._v("roles default remove roleSetName roleid")]),e._v(" "),t("code",[e._v("roles required")]),e._v(" "),t("code",[e._v("roles required create roleSetName roleid roleid roleid")]),e._v(" "),t("code",[e._v("roles required delete roleSetName")]),e._v(" "),t("code",[e._v("roles required add roleSetName roleid")]),e._v(" "),t("code",[e._v("roles required remove roleSetName roleid")]),e._v(" "),t("code",[e._v("roles grouped")]),e._v(" "),t("code",[e._v("roles grouped create roleSetName roleid roleid roleid")]),e._v(" "),t("code",[e._v("roles grouped delete roleSetName")]),e._v(" "),t("code",[e._v("roles grouped add roleSetName roleid")]),e._v(" "),t("code",[e._v("roles grouped remove roleSetName roleid")])]),e._v(" "),t("h2",{attrs:{id:"feedback"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#feedback"}},[e._v("#")]),e._v(" Feedback")]),e._v(" "),t("p",[e._v("Overall, there is not much changes in feedback feature except some tweaks in performance. It should ideally be a little bit faster now.")]),e._v(" "),t("p",[e._v("The main things that changed with feedback is that VIPs server will be able to use a channel id from another server. For example, if you move all ur logs and mails and everything else to a private mod only server you can move these feedback logs and channels there as well in order to keep your main server clean and clear!")]),e._v(" "),t("p",[t("code",[e._v("!settings feedback approvalchannel CHANNELID")]),e._v(" "),t("strong",[e._v("VIP ONLY!")])]),e._v(" "),t("p",[t("code",[e._v("!settings feedback approvalchannel #channel")])]),e._v(" "),t("p",[e._v("You can replace approvalchannel with "),t("code",[e._v("logchannel")]),e._v(", "),t("code",[e._v("rejectedchannel")]),e._v(", "),t("code",[e._v("solvedchannel")])]),e._v(" "),t("p",[e._v("Also 2 other customization options are now locked to VIP only. "),t("code",[e._v("rejectedmessage")]),e._v(" and "),t("code",[e._v("solvedmessage")]),e._v(" are now "),t("strong",[e._v("VIP ONLY")])]),e._v(" "),t("p",[e._v("These features send dms to the user who sent feedback when you approve or deny a feedback. By default, this is not customizable but with VIP powers you can set your own messages.")]),e._v(" "),t("h2",{attrs:{id:"embed-feature"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#embed-feature"}},[e._v("#")]),e._v(" Embed Feature")]),e._v(" "),t("p",[e._v("Due to legal concerns and other bots getting banned off of Discord by users sending messages through the bot using commands like "),t("code",[e._v("!say")]),e._v(", we are limiting the embed features heavily!")]),e._v(" "),t("p",[e._v("Some malicious user decided to make bots post real user information using the say command and mass reported the bot. The Discord Terms & Service instantly banned all the bots and it took weeks to get it resolved. This is why the embed feauture is going to be heavily changing.")]),e._v(" "),t("ol",[t("li",[e._v("The embed feature will now always say who is sending the embed at the top. The plaintext will always start with who is sending it.")]),e._v(" "),t("li",[t("strong",[e._v("VIP ONLY:")]),e._v(" Since i don't expect any malicious admin/mod from a VIP server since I believe VIP will be going patreon, I have enabled the option by default for VIPs to not have to deal with this and you can keep the current embed functionality.")])]),e._v(" "),t("p",[e._v("However, please note if anyone abuses this I will remove this entirely! I know this feature is incredibly important for testing things like tags, and making rules channels. Please use wisely!")]),e._v(" "),t("h2",{attrs:{id:"auto-reaction-feature-vip-only"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#auto-reaction-feature-vip-only"}},[e._v("#")]),e._v(" Auto-Reaction Feature VIP ONLY")]),e._v(" "),t("p",[e._v("Auto-reactions is a feature that will automatically add reactions to messages sent in a certain channel.")]),e._v(" "),t("p",[t("code",[e._v("!settings autoreact #channel")]),e._v(" :g4m3rhug: :g4m3rangry:")]),e._v(" "),t("p",[e._v("You must also edit the channel topic to include "),t("code",[e._v("gamerAutoReact")])]),e._v(" "),t("p",[e._v("The command above would make it so those 2 emojis are added on all messages sent in this channel.")]),e._v(" "),t("p",[e._v("Note: I can add support for default emojis as you guys request them. They are a pain in the arse to support but since VIP would be patrons $$$ I want to allow you guys to have the ability to request i add them in manually for you. This way we can easily support the main ones VIPs need and not have to worry abou supporting thousands of default emojis.")]),e._v(" "),t("h2",{attrs:{id:"tags-feature"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#tags-feature"}},[e._v("#")]),e._v(" Tags Feature")]),e._v(" "),t("p",[e._v("Tags is mostly the same feature but 2 new additions have been added for VIP servers! These are "),t("strong",[e._v("VIP ONLY")])]),e._v(" "),t("ol",[t("li",[e._v("A new type of tag is now possible for VIP servers to create called random\nThis type of tag allows you to add multiple things to the database and have the bot send one at random\nFor example, you could use this to create a custom command for your needs if u wanted to provide a "),t("code",[e._v(".shutup")]),e._v(" command")])]),e._v(" "),t("p",[e._v("You could create a tag like this\n"),t("code",[e._v(".tags create .shutup random imageurl imageurl imageurl")]),e._v("\nReplace imageurl with valid imageurls and the bot will send one at random")]),e._v(" "),t("ol",{attrs:{start:"2"}},[t("li",[e._v("Tags on VIP servers will now auto-destruct after 5 minutes in order to clean out spam")])]),e._v(" "),t("h2",{attrs:{id:"todo-feature"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#todo-feature"}},[e._v("#")]),e._v(" TODO Feature")]),e._v(" "),t("p",[e._v("A new feature has been added to Gamer bot called To Do. Think of it like a To Do list tracker for your servers when you want to assign task to users to remind them o do them. To set it up it is as simple as "),t("code",[e._v(".todo setup")]),e._v(" "),t("strong",[e._v("VIP ONLY")]),e._v(" vips can provide a server id incase they want the todo list in another custom server in order to keep their main server clean. For example if the todo list is meant only for their staff "),t("code",[e._v(".todo setup SERVER_ID")]),e._v(" You will need ADMIN perms in both servers. Once setup is complete")]),e._v(" "),t("p",[t("img",{attrs:{src:"https://i.imgur.com/ykPAeT8.png",alt:"todo"}})]),e._v(" "),t("p",[e._v("Feel free to change the channel names as you like\nTo create a new task to do, use the following command")]),e._v(" "),t("p",[t("code",[e._v(".todo @user high 5 LabelName the task to complete")])]),e._v(" "),t("ul",[t("li",[e._v("@ user is the person who is assigned the task")]),e._v(" "),t("li",[e._v("The "),t("code",[e._v("high")]),e._v(" is the priority of this task so they know how urgent to do it")]),e._v(" "),t("li",[e._v("The "),t("code",[e._v("5")]),e._v(" points is something used for development purposes which indicates how hard something is to complete. You can use this for anything you like")])]),e._v(" "),t("p",[t("img",{attrs:{src:"https://i.imgur.com/1jGIL2g.png",alt:"todo2"}})]),e._v(" "),t("h2",{attrs:{id:"mute-enhancements"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#mute-enhancements"}},[e._v("#")]),e._v(" Mute Enhancements")]),e._v(" "),t("p",[e._v("Overall the mute feature will work the same but the "),t("strong",[e._v("VIP ONLY")]),e._v(" side gets a small boost!\nWhen you mute someone, currently the bot just gives them the muted role. The problem with this is that some other roles the user may have might give them express permission to chat which override the muted role despite any role heirarchy.")]),e._v(" "),t("p",[e._v("So, to solve this on VIP servers, we will also remove all other roles from the user and add them back when the user is unmuted. Basically, when you mute someone, they are truly and surely muted!")]),e._v(" "),t("p",[e._v("Another thing as a "),t("strong",[e._v("VIP ONLY")]),e._v(" option is you can set your own custom role as muted if you wanted. Currently the only way to get a mute role was to use the automated setup one. With the new vip option you can set any role as muted.")])])}),[],!1,null,null,null);o.default=s.exports}}]);