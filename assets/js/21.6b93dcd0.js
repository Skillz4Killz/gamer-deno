(window.webpackJsonp=window.webpackJsonp||[]).push([[21],{505:function(e,t,a){"use strict";a.r(t);var i=a(4),s=Object(i.a)({},(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("h2",{attrs:{id:"what-is-a-verification-system"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#what-is-a-verification-system"}},[e._v("#")]),e._v(" What is a Verification System?")]),e._v(" "),a("p",[e._v("Have you ever heard of servers being raided? Are user's alt accounts getting instant access to your server? It is time to set up some verification!")]),e._v(" "),a("ul",[a("li",[e._v("✅ Lock access to the server for all new users until verified.")]),e._v(" "),a("li",[e._v("✅ Captcha verification")]),e._v(" "),a("li",[e._v("✅ Simple reaction to unlock server or step by step walkthrough process.")]),e._v(" "),a("li",[e._v("✅ Enforce users reading and agreeing to your rules before they gain access to your server.")]),e._v(" "),a("li",[e._v("✅ Multiple customizable welcome messages")]),e._v(" "),a("li",[e._v("✅ Auto-Role system without breaking Verified Server Discord Guidelines")])]),e._v(" "),a("p",[e._v("Gamer's Verification system was designed in a manner which allowed maximum customizability as every server is unique. This can lead to a little confusion because of how many settings/features are involved. Let's simply take it step by step and find out how easy it really is.")]),e._v(" "),a("h2",{attrs:{id:"basic-verification-setup"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#basic-verification-setup"}},[e._v("#")]),e._v(" Basic Verification Setup")]),e._v(" "),a("p",[e._v("The first thing to do is simply create the base of the verification system. To do this:")]),e._v(" "),a("blockquote",[a("p",[e._v("It can help to grant Gamer the Administrator permission temporarily before using this command.")])]),e._v(" "),a("p",[a("code",[e._v(".setverify setup")])]),e._v(" "),a("p",[a("img",{attrs:{src:"https://i.imgur.com/Z1AXHTr.gif",alt:"setupgif"}})]),e._v(" "),a("h3",{attrs:{id:"understand-what-was-done"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#understand-what-was-done"}},[e._v("#")]),e._v(" Understand What Was Done")]),e._v(" "),a("p",[e._v("Gamer has created an entire basic verification system for you that can be used for any general purpose server. There were a lot of things that this command does behind the scene so let's break it down.")]),e._v(" "),a("ul",[a("li",[e._v("✅ Created a category called Verification Zone, the name may be different if you use a different language.\n"),a("ul",[a("li",[e._v("✅ Created a channel inside that category called, #verify-here. Once again the name of the channel will depend on your server's language.")]),e._v(" "),a("li",[e._v("✅ Hide this category and all future channels in this category from everyone. But allow Gamer, bot admins, bot mods, and the Verify role to be able to view these channels.")])])]),e._v(" "),a("li",[e._v("✅ Created a Verify role on your server.")]),e._v(" "),a("li",[e._v('✅ Edited every "necessary" channels on your server to prevent viewing the channel if the user has the Verify role.\n'),a("ul",[a("li",[e._v("✅ Whenever new channels are created, they will also be automatically updated to prevent new users from seeing them. A lot of bot's don't take this into consideration but Gamer does! We make sure that you don't need to be manually updating channels in the future.")])])])]),e._v(" "),a("blockquote",[a("p",[e._v("This is why we recommend giving Gamer Admin perms before using this command. You can remove it again once it is done. This allows Gamer to edit all channels.")])]),e._v(" "),a("ul",[a("li",[e._v("✅ Setup a pretty basic embed message inside the #verify-here channel that will welcome users and then tell them to begin by typing .verify")]),e._v(" "),a("li",[e._v("✅ Setup a pretty custom first message response. This message is sent in the channel that is created whenever a user uses the .verify command.")])]),e._v(" "),a("h3",{attrs:{id:"understanding-the-user-perspective"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#understanding-the-user-perspective"}},[e._v("#")]),e._v(" Understanding The User Perspective")]),e._v(" "),a("p",[e._v("When a user joins a server that has the verification system enabled, they are automatically given the @Verify role. Once they get this role, they are immediately locked from accessing anything outside of the Verification Category.")]),e._v(" "),a("p",[a("img",{attrs:{src:"https://i.imgur.com/a/cXis9y6.png",alt:"verifynewbie"}})]),e._v(" "),a("p",[e._v("Here is an example of how a new member will see your server as they complete the verification process.")]),e._v(" "),a("p",[a("img",{attrs:{src:"https://i.imgur.com/Z1AXHTr.gif",alt:"unlockgif"}})]),e._v(" "),a("p",[e._v("As you can see, new members get locked out of all the channels and have to proceed by verifying in order to gain access. However, there are time when you may want to allow new members to be able to view certain channels. For example, I want to make it so that when new members join they can see my #wall channel where I post updates/announcemnts and all sorts of information. You can also do this with other channels you feel are important for newcomers like a #rules channel for instance.")]),e._v(" "),a("p",[e._v("Simply edit the channels permission and remove the Verify role's overwrite.")]),e._v(" "),a("p",[a("img",{attrs:{src:"https://i.imgur.com/a/7087TfJ.png",alt:"verifywall"}})]),e._v(" "),a("p",[e._v("🎉 Now they can see exactly what I wanted them to be able to see. This makes it so that when I make any @everyone announcement, even users that have not verified will also be notified. 💪")]),e._v(" "),a("p",[e._v("Now for the default system, the user can join and type "),a("code",[e._v(".verify")]),e._v(" to begin the process. This will make a new channel with their name under the verification category and also delete all messages on that channel except the first message in that channel it finds. This will automatically keep the verify channel clean for you so when new users join they will see the instructions right away.")]),e._v(" "),a("blockquote",[a("p",[e._v("The channels that the users created, will delete after 10 minutes of inactivity to help keep the server clean. They will need to restart the process by typing "),a("code",[e._v(".verify")]),e._v(" again in the #verify-here channel.")])]),e._v(" "),a("h2",{attrs:{id:"customizing-the-base"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#customizing-the-base"}},[e._v("#")]),e._v(" Customizing The Base")]),e._v(" "),a("p",[e._v("Let's suppose you wanted something different than the base Verification Messages. For example, you wanted a special unique embed as the welcome message to showcase your rules.")]),e._v(" "),a("p",[e._v("We start by using the "),a("code",[e._v(".embedset")]),e._v(" command and build the embed the exact way we want.")]),e._v(" "),a("p",[a("img",{attrs:{src:"https://i.imgur.com/pGbeNXd.gif",alt:"embedsetgit"}})]),e._v(" "),a("p",[e._v("Nice! We just finished creating a really cool rules embed. Now let's go ahead and edit the embed in the #verify-here channel.")]),e._v(" "),a("ol",[a("li",[e._v("In the same channel you did the "),a("code",[e._v(".embedset")]),e._v(" command, find the embed you created and copy it's message ID.")]),e._v(" "),a("li",[e._v("Type "),a("code",[e._v(".embedshow messageID")]),e._v(". This will give you a code that you will copy paste in the final step.")]),e._v(" "),a("li",[e._v("Open the #verify-here channel")]),e._v(" "),a("li",[e._v("Type "),a("code",[e._v(".embededit")]),e._v(" but don't press enter yet.")]),e._v(" "),a("li",[e._v("Copy the message ID of the embed in this channel we want to edit. Then paste the id so it looks something like "),a("code",[e._v(".embededit 739521626055507999")])]),e._v(" "),a("li",[e._v("Now you can copy the code from step 2 and paste it. It should look something like this:")])]),e._v(" "),a("p",[a("img",{attrs:{src:"https://i.imgur.com/hf3IV5n.gif",alt:"embededitgif"}})]),e._v(" "),a("h2",{attrs:{id:"reaction-role-verification"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#reaction-role-verification"}},[e._v("#")]),e._v(" Reaction Role Verification")]),e._v(" "),a("p",[e._v("This section is for when you don't really want a captcha verification system but just a sweet and simple reaction role verification system.")]),e._v(" "),a("p",[e._v("You could now convert this rule embed you created above into a reaction role. Read the "),a("a",{attrs:{href:"https://gamer.netlify.com/reaction-roles-feature",target:"_blank",rel:"noopener noreferrer"}},[e._v("Reaction Role Guide"),a("OutboundLink")],1),e._v(".")]),e._v(" "),a("p",[e._v("You have two options with the reaction role.")]),e._v(" "),a("ol",[a("li",[e._v("When tapping the reaction it can remove the Verify role.")]),e._v(" "),a("li",[e._v("When tapping the reaction it can add the Verified role or whichever role you would like your members to get showing they have read the rules and other stuff.")])]),e._v(" "),a("p",[e._v("If you choose option 2, Gamer also comes with a feature called Unique Role Sets. Basically, when a user is granted a role, you can remove every role that is in a set with that role. Let's take an example, when you are playing a game with several regions you might have roles like this:")]),e._v(" "),a("ul",[a("li",[e._v("NA")]),e._v(" "),a("li",[e._v("EA")]),e._v(" "),a("li",[e._v("EU")]),e._v(" "),a("li",[e._v("SA")]),e._v(" "),a("li",[e._v("SEA")]),e._v(" "),a("li",[e._v("CN")])]),e._v(" "),a("p",[e._v("You can use Unique Role Sets to make sure that a player never has more than 1 of these roles at any time. In regards to verification, we can do something like this where we create a roleset of the following roles:")]),e._v(" "),a("ul",[a("li",[e._v("Verify")]),e._v(" "),a("li",[e._v("Verified")])]),e._v(" "),a("p",[a("img",{attrs:{src:"https://i.imgur.com/8E4PzVc.gif",alt:"rolesetcreategif"}})]),e._v(" "),a("p",[e._v("Now whenever someone is given the Verified role by the reaction role, Gamer bot will remove the Verify role.")]),e._v(" "),a("p",[a("img",{attrs:{src:"https://i.imgur.com/dYn4Gjm.gif",alt:"rolesetgif"}})])])}),[],!1,null,null,null);t.default=s.exports}}]);