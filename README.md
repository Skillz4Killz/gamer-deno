# Gamer Bot Built With Discordeno

[Discord Server](https://discord.gg/J4NqJ72)

## Pre-requisites

- Deno

## Run

`deno run --allow-net --allow-write --allow-read --allow-plugin --quiet --unstable mod.ts`

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


## Needs Testing

**Other Features**

- [ ] mail logs
- [ ] mail ratings
- [ ] mail support channel
- [ ] Survey/Applications

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

**ADMINS**

- prefix
- mirrors
- mirrors create #channel
- mirrors create guildID channelID
- mirrors delete #channel
- mirrors edit #channel images on/off
- mirrors edit #channel anonymous on/off
- mirrors edit #channel delete on/off
- settings mails setup
- settings mails enable
- settings mails disable
- settings mails roles roleID roleID roleID
- settings tenor on/off
- mail my new mail here
- mail close reason here


**VIP ONLY**

- roles unique
- roles unique create roleSetName roleid roleid roleid
- roles unique delete roleSetName
- roles unique add roleSetName roleid
- roles unique remove roleSetName roleid
- roles default
- roles default create roleSetName roleid roleid roleid
- roles default delete roleSetName
- roles default add roleSetName roleid
- roles default remove roleSetName roleid
- roles required
- roles required create roleSetName roleid roleid roleid
- roles required delete roleSetName
- roles required add roleSetName roleid
- roles required remove roleSetName roleid
- autoembed
- label create name categoryID
- label set name
- label delete name
- settings mails setup GUILDID
- settings mails autoresponse The new response here
- settings mails questions add
- settings mails questions remove
- mail silent reason here for logs

## TODO

### Wolf

- [ ] ban
- [ ] kick
- [ ] modlog
- [ ] move
- [ ] mute
- [ ] nick
- [ ] note
- [ ] purge
- [ ] reason
- [ ] removemodlog
- [ ] unban
- [ ] unmute
- [ ] warn

### Dys

- [ ] analyze
- [ ] analyzechannel
- [ ] bots
- [ ] export
- [ ] listallroles
- [ ] memberrole
- [ ] members
- [ ] resetanalyze
- [ ] rolefromall
- [ ] roletoall
- [ ] spy
- [ ] vipregister
-
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
- [ ] upvote
- [ ] verify
- [ ] update

- [ ] embed
- [ ] embededit
- [ ] embedset
- [ ] embedshow

- [ ] emojis
- [ ] emojicreate
- [ ] emojidelete
- [ ] emojiinfo

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

- [ ] bugs
- [ ] idea
- [ ] fb idea
- [ ] db bugs

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

- [ ] public
- [ ] role
- [ ] roleinfo
- [ ] rolemessagecreate
- [ ] rolemessagedelete
- [ ] rolemessages

- [ ] afk
- [ ] disable
- [ ] enable
- [ ] reset
- [ ] setcapital
- [ ] setcapture
- [ ] setevents
- [ ] setfeedback
- [ ] sethibye
- [ ] setlogs
- [ ] setmail
- [ ] setmodlogs
- [ ] setmute
- [ ] setname
- [ ] setpermission
- [ ] setprofanity
- [ ] setstaff
- [ ] settags
- [ ] setverify
- [ ] setwhitelisted
- [ ] setxp
- [ ] viewprofanity

- [ ] shortcutcreate
- [ ] shortcutdelete
- [ ] shortcuts

- [ ] tagcreate
- [ ] tagdelete
- [ ] taginstall
- [ ] tagpublic
- [ ] tags
- [ ] tagshow
- [ ] taguninstall

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

- [ ] Bang (meeting new people globally) need a good name
- [ ] Add Reactions by command
- [ ] Custom Backgrounds
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

## Schema Scripts For the Upcoming Change

1. Support channels using topics
2. Labels authorID => userID
3. Emojiis authorID => userID
4. Users currency => coins

## Database Cleaner

- Clean mirrors for deleted channels
