# Gamer Bot Built With Discordeno

[Discord Server](https://discord.gg/J4NqJ72)

## Pre-requisites

- Deno

## Run

`deno run --allow-net --allow-write --allow-read --quiet --unstable mod.ts`

## Completed

**General Stuff**

- [x] Slowmode feature
- [x] PM2 Flush

**Other Features**

- [x] Counting game (Missing leaderboards pending https://github.com/manyuanrong/deno_mongo/issues/111)

**DEVS ONLY**

- [x] botstats
- [x] reload
- [x] exec

**MEMBERS/PUBLIC**

- [x] avatar
- [x] avatar server
- [x] avatar @member
- [x] invite
- [x] ping
- [x] serverinfo
- [x] stats
- [x] advice
- [x] 8ball
- [x] language
- [x] language set spanish
- [x] role info bots

## Needs Testing

**Other Features**

- [ ] mail logs
- [ ] mail ratings
- [ ] mail support channel
- [ ] Survey/Applications
- [ ] Blacklist users/guilds

**Moderation**

- [ ] ban
- [ ] nick
- [ ] kick
- [ ] modlog
- [ ] note
- [ ] modlogclearuser
- [ ] modlogeditreason
- [ ] modlogremovecaseid
- [ ] unban
- [ ] warn
- [ ] mute
- [ ] purge
- [ ] unmute
- [ ] move channel @user @user
- [ ] move channel channel

**MEMBERS/PUBLIC**

- [ ] help
- [ ] nekos api
- [ ] baka
- [ ] bite
- [ ] compliment
- [ ] cuddle
- [ ] dance
- [ ] hug
- [ ] kanna
- [ ] kiss
- [ ] kitten
- [ ] lmao
- [ ] mavis
- [ ] nezuko
- [ ] pat
- [ ] poke
- [ ] pony
- [ ] puppy
- [ ] raphtalia
- [ ] supernatural
- [ ] slap
- [ ] tickle
- [ ] zerotwo
- [ ] remind
- [ ] remind create 1h test
- [ ] remind create 1h 2h test
- [ ] remind delete #
- [ ] emojis
- [ ] emojis create name emoji
- [ ] emojis delete name
- [ ] emojis info emoji
- [ ] idea
- [ ] idea but provide an image in the answers
- [ ] idea answer1 | answer 2 | answer 3 | etc...
- [ ] idea answer1 | answer 2 | answer 3 | etc... WITH IMAGE ATTACHMENT
- [ ] bugs
- [ ] bugs but provide an image in the answers
- [ ] bugs answer1 | answer 2 | answer 3 | etc...
- [ ] bugs answer1 | answer 2 | answer 3 | etc... WITH IMAGE ATTACHMENT
- [ ] role

**ADMINS**

- [ ] prefix
- [ ] mirrors
- [ ] mirrors create #channel
- [ ] mirrors create guildID channelID
- [ ] mirrors delete #channel
- [ ] mirrors edit #channel images on/off
- [ ] mirrors edit #channel anonymous on/off
- [ ] mirrors edit #channel show "Gamer Mirror" as "(Bot nickname) Mirror"
- [ ] mirrors edit #channel delete on/off
- [ ] settings mails setup
- [ ] settings mails enable
- [ ] settings mails disable
- [ ] settings mails roles roleID roleID roleID
- [ ] settings tenor on/off
- [ ] settings feedback approvalchannel
- [ ] settings feedback approvalchannel #channel
- [ ] settings feedback logchannel
- [ ] settings feedback logchannel #channel
- [ ] settings feedback rejectedchannel
- [ ] settings feedback rejectedchannel #channel
- [ ] settings feedback solvedchannel
- [ ] settings feedback solvedchannel #channel
- [ ] settings roles add role role role
- [ ] settings roles remove role role role
- [ ] settings staff
- [ ] settings staff admins
- [ ] settings staff admins role
- [ ] settings staff mods add role
- [ ] settings staff mods remove role
- [ ] settings mute setup
- [ ] settings mute disable
- [ ] settings automod capitals enable
- [ ] settings automod capitals disable
- [ ] settings automod capitals 75
- [ ] settings automod profanity
- [ ] settings automod profanity enable
- [ ] settings automod profanity disable
- [ ] settings automod profanity setup
- [ ] settings automod profanity soft add word1 word2 word3
- [ ] settings automod profanity soft remove word1 word2 word3
- [ ] settings automod profanity strict add word1 word2 word3
- [ ] settings automod profanity strict remove word1 word2 word3
- [ ] settings automod links enable
- [ ] settings automod links disable
- [ ] settings automod links channels #channel
- [ ] settings automod links roles @role
- [ ] settings automod links user @user
- [ ] settings automod links urls url
- [ ] settings automod links restricted url
- [ ] mail my new mail here
- [ ] mail close reason here
- [ ] embed {}
- [ ] embed edit [channel(VIP)] messageID {}
- [ ] embed show [channel(VIP)] messageID {}
- [ ] tags
- [ ] tags create tagname [basic | advanced | random] {} or strings
- [ ] tags delete tagname
- [ ] tags install serverID
- [ ] tags uninstall serverID
- [ ] tags public tagname tagname tagname
- [ ] tags show tagname

**VIP ONLY**

- [ ] bots
- [ ] listallroles
- [ ] roles unique
- [ ] roles unique create roleSetName roleid roleid roleid
- [ ] roles unique delete roleSetName
- [ ] roles unique add roleSetName roleid
- [ ] roles unique remove roleSetName roleid
- [ ] roles default
- [ ] roles default create roleSetName roleid roleid roleid
- [ ] roles default delete roleSetName
- [ ] roles default add roleSetName roleid
- [ ] roles default remove roleSetName roleid
- [ ] roles required
- [ ] roles required create roleSetName roleid roleid roleid
- [ ] roles required delete roleSetName
- [ ] roles required add roleSetName roleid
- [ ] roles required remove roleSetName roleid
- [ ] roles grouped
- [ ] roles grouped create roleSetName roleid roleid roleid
- [ ] roles grouped delete roleSetName
- [ ] roles grouped add roleSetName roleid
- [ ] roles grouped remove roleSetName roleid
- [ ] roles messages
- [ ] roles messages create add role channel text here
- [ ] roles messages create add role channel { embed here }
- [ ] roles messages create remove role channel text here
- [ ] roles messages create remove role channel { embed here }
- [ ] roles messages delete add role
- [ ] roles messages delete remove role
- [ ] roles members @role
- [ ] roles all add @role
- [ ] roles all remove @role
- [ ] autoembed
- [ ] label create name categoryID
- [ ] label set name
- [ ] label delete name
- [ ] settings mails setup GUILDID
- [ ] settings mails autoresponse The new response here
- [ ] settings mails questions add
- [ ] settings mails questions remove
- [ ] settings feedback approvalchannel CHANNELID (from another server)
- [ ] settings feedback logchannel CHANNELID (from another server)
- [ ] settings feedback rejectedchannel CHANNELID (from another server)
- [ ] settings feedback solvedchannel CHANNELID (from another server)
- [ ] settings feedback rejectedmessage Some text here
- [ ] settings feedback solvedmessage Some text here
- [ ] settings autoreact #channel emoji emoji
- [ ] settings tags mail tagName
- [ ] settings tags channel #channel
- [ ] mail silent reason here for logs
- [ ] settings automod profanity phrases add long phrase
- [ ] settings automod profanity phrases remove long phrase
- [ ] settings analytics channelID

## TODO

### Dys

- [ ] export
- [ ] spy
- [ ] vipregister
- [ ] reset vip settings on vip removal

### Aikage

### Ben

- [ ] coinflip
- [ ] divorce
- [ ] gif
- [ ] life
- [ ] marry
- [ ] shopwedding
- [ ] slots
- [ ] urban
- [ ] wisdom
- [ ] dice

### Skillz

- [ ] help all
- [x] userinfo TODO: ANALYTICS PART
- [ ] verify

- [ ] events
- [ ] eventadd
- [ ] eventadvertise
- [ ] eventcreate
- [ ] eventdelete
- [ ] eventdeny
- [ ] eventedit
- [ ] eventjoin
- [ ] eventkick
- [ ] eventleave
- [ ] eventshow

- [ ] capture
- [ ] YuGiOh API (card game like PokeCord used to be)
- [ ] Our existing card system

- [ ] idrcreate
- [ ] idrupgrade
- [ ] idrdelete

- [ ] Background
- [ ] balance
- [ ] boostme
- [ ] daily
- [ ] leaderboard
- [ ] levelrole
- [ ] pay
- [ ] profile
- [ ] topcoins
- [ ] xp
- [ ] xpreset
- [ ] xpresetvoice

- [ ] networkcreate
- [ ] networkfollow

- [ ] afk
- [ ] disable
- [ ] enable
- [ ] reset
- [ ] setcapture
- [ ] setevents
- [ ] sethibye
- [ ] setlogs
- [ ] setmodlogs
- [ ] setpermission
- [ ] setverify
- [ ] setxp

- [ ] shortcutcreate
- [ ] shortcutdelete
- [ ] shortcuts

- [ ] giveaway
- [ ] giveawaycreate
- [ ] giveawaydelete
- [ ] imgur
- [ ] pollcreate
- [ ] pollend
- [ ] pollvote
- [ ] quote
- [ ] setup

- [ ] manga
- [ ] youtube
- [ ] reddit
- [ ] twitch (idk if we should keep this tbh.)

- [ ] Bang (meeting new people globally) need a good name.
- [ ] Add Reactions by command.
- [ ] Custom Backgrounds.
- [ ] Change bot logo once a week.
- [ ] Report feature to contact devs.
- [ ] Moderation network.
- [ ] Global Bans for raids/spam bots.
- [ ] Auto-mod/filter Playing Status and custom statuses for ENTERPRISE!
- [ ] Server Backups (revert to prior backup)
- [ ] Invite tracking
- [ ] Server stats on channels names
- [ ] Voice channel manager(create when user joins)
- [ ] x days since counter
- [ ] Database Cleaner.
- [ ] Starboard
- [ ] Temp roles feature
- [ ] On member join, re-assign all roles when they left example muted
- [ ] Custom Server Currency
- [ ] Lock emojis behind a role
- [ ] Auto-role security warning

### Alexx

- [ ] reactionroleadd
- [ ] reactionrolecreate
- [ ] reactionroledelete
- [ ] reactionroleremove
- [ ] reactionroles
- [ ] take
- [ ] give

**GAMING API STATS STUFF**

- [ ] Clash of Clans

## Final Review

- [ ] Review all schema files and create a migration script
- [ ] Setup Feature
- [ ] Bot lists
- [ ] Review each commands bot channel perms.
