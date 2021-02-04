---
title: Feedback Feature
date: 2020-11-27
---

# What is Feedback Feature useful for?

Aren't you tired of seeing users give feedback that is not useful like: "chat is
broken." Wouldn't you prefer detailed feedback?

- ✅ Get detailed bug reports and suggestions from users.
- ✅ Have users answer specific questions for each feedback sent.
- ✅ Ability to contact users for more information when needed.
- ✅ Users vote on feedback to help show which to prioritize.
- ✅ Easily export feedback to external dev tools like Google Spreadsheets.
- ✅ Detailed logs of all feedback.
- ✅ Users can easily submit feedback.
- ✅ Reward users for good feedback.

The feedback feature is the perfect feature when you want to collect suggestions
or bug reports from your users. One of the most crucial things for any gaming
server, is about collecting the best feedback that can be logged internally for
game developers. With this in mind, we created a flexible and customizable
feedback feature that provides the best experience for not just developers but
users as well for sending feedback.

Sound good to you? Well, let's set it up then!

# Setting Up The Feedback Feature

Let's go ahead and get started.

Go into your server settings and make sure that the Gamer role has
**Administrator** Permissions. If this is done, you can proceed:

> .setfeedback setup

- Creates channels for suggestions and bug reports.
- Enable all feedback settings with default settings.
- Sends an example of what each type of feedback looks like.

> After setup, you should remove the Administrator permissions.

Now, take a minute to try testing out how the feedback works.

- `.idea`
- `.bug`

`.idea` will begin the Q&A session with the bot asking you the questions to send
for the feedback. Once you answer all of them, a new feedback will be sent in
the idea channel.

`.bug` will begin a similar session but asking the questions for a bug report.
Once complete, it will send a new bug report in the bugs channel.

> If you know all the questions, you can split your answers with | and it will
> work as well. As an example: `.fb idea` I would suggest checking out the Gamer
> server and website to learn all my other features and everything you can
> unlock. | High

Cool right? Sweet, now that you have the hang of this, let's try and customize
this.

# Customizing The Questions

Every game has different needs and each feedback is extremely crucial to get the
right information from a user. In order to perfect that, we allowed users to
have the ability to customize the questions.

Now you can take a moment and pause here to come up with a list of questions you
wants users to answer. Once you are ready, you can proceed and see how we add
those questions.

For example, suppose you wanted to create the following questions for your bug
reports.

- What is the account name, IGN, that experienced the bug?
- What is the server where the bug occurred? NA, EU, SEA, EA, SA, CN
- What device did the bug happen on? Phone + Phone Model, iPhone X, Samsung
  Galaxy Note 8, etc.
- What's the OS version of your device? Example: iOS 12.1, Android 8.0,
  Windows 10.
- Describe the bug as well as you can.
- How consistently are you able to reproduce this bug by following all the steps
  to reproduce above? From 1-100%
- Include any other information you find useful here, such as uploading a
  screenshot of the bug.

Now let's type:
`.setfeedback bugs addquestion What is the account name, IGN, that experienced the bug?`

You can use `idea` instead of `bugs` for adding/removing questions related to
sending an idea.

Go ahead and repeat this command for each of the questions above. Once you are
done, it is time to remove the original 2 questions that the `.setup` command
created originally. To do that just type the following 2 commands:

```shell
.setfeedback bugs removequestion What is the issue you are having?
.setfeedback bugs removequestion Can you provide some links to screenshots please?
```

Tada! :tada: We now have a fully custom built feedback for bugs. Take some time
and customize the questions for the idea feedback type.

> The image attachment questions should always be reserved for the last
> question.

# Understanding The Reactions

The reactions that are added to feedback allow users and moderators to have
quick access to various parts of the feedback feature. Let's break it down:

## Voting Reactions

Any user can react with these and give XP to a user. You can also remove the
reaction and the XP is then removed. The XP is a perfect addition to the
feedback feature because it gives users an incentive to be send good feedback.
The amount of XP can be customized in detail. We will discuss this in the XP
section below.

👍 : Whenever anyone reacts to this, it will **give** the original sender XP.
Removing this reaction, **removes** that XP.

👎 : Whenever anyone reacts to this, it will **remove** the original sender's XP.
Removing this reaction, **gives** that XP back.

❓: This reaction has no effect but was added for users when they are not sure
whether to vote up or down.

## Mod Only Reactions

The functionality for these reactions will only work for Moderators or Admins.

📬 : When a moderator reacts to this, a new Mail will be opened on behalf of the
original sender. This is useful for easily contacting the sender when you need
more information regarding the feedback. ✅ : This reaction has 3 affects to it.
First, it will mark the feedback as solved and delete it from the channel.
Second, it will send a Direct Message to the original sender letting them know
it was solved. Third it grants them bonus XP as well. ❌ : This reaction has 3
affects to it as well. It marks the feedback as denied and deletes it from the
channel. Second, it will send a message to the user letting them know it was
denied. Third, it removes XP from the user.

# Feedback Logs

When a feedback is reacted to with the solved or denied reactions, it gets
removed. For this purpose, gamer also provides a log feature for the feedback.

> `.setfeedback solvedchannel #channel` ~ Sets the channel to send any feedback
> that was reacted with ✅.

> `.setfeedback rejectedchannel #channel` ~ Sets the channel to send any
> feedback that was reacted with ❌.

It is recommended to keep these channels private from public. Usually, they are
used for discussing feedback internally if needed.

# Exporting Feedback

Sometimes game developers have different internal tools that they use to track
and work with feedback. To make it easy to transfer the feedback from discord to
an external source we created the `.export` command.

This command converts feedback into a **CSV** file which can be easily uploaded
to a google spreadsheet or converted into anything you like.

To use this command, you find the message ID of the feedback you want to
**START** at. All feedback found after this feedback will be exported into a CSV
file. A maximum of 100 feedback can be exported at any time due to discord rate
limits.

# Further Customizations

There are a lot more ways you can customize the feedback module. To see all the
options you can type `.help setfeedback`.
