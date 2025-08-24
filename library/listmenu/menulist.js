const chalk = require('chalk')
const fs = require('fs')

const Menu = (pushname, runtime, ram) => `
▣ ◈ *𝐕𝐄𝐍𝐎𝐌-𝐗𝐌𝐃 MENU* ◈ ▣
┃ ✦ Owner    : *${global.ownername}*
┃ ✦ Bot Name : *${global.botname}*
┃ ✦ Name     : *${pushname}*
┃ ✦ Version  : *1.0.0 / 3.0.0*
┃ ✦ BotType  : *${global.typebot}*
┃ ✦ Prefix   : *${global.xprefix || '.'}*
┃ ✦ Runtime  : *${global.runtime(process.uptime())}*
┃ ✦ RAM      : *${global.ram()}*
┃ ✦ Total Features : 141
┗━━━━━━━━━━━━━━━━━━━━━
╭──• ❰ *Mode* ❱
║➤ ${global.xprefix}private
║➤ ${global.xprefix}public
║➤ ${global.xprefix}recording
║➤ ${global.xprefix}typing
║➤ ${global.xprefix}autoreact
║➤ ${global.xprefix}autoai
╰⟢
╭──• ❰ *Owner Menu* ❱
║➤ ${global.xprefix}autoread
║➤ ${global.xprefix}autobio
║➤ ${global.xprefix}autotype
║➤ ${global.xprefix}unavailable
║➤ ${global.xprefix}autorecord
║➤ ${global.xprefix}autorecordtype
║➤ ${global.xprefix}autoswview
║➤ ${global.xprefix}setautoblock
║➤ ${global.xprefix}setantiforeign
║➤ ${global.xprefix}autoblock
║➤ ${global.xprefix}onlygc
║➤ ${global.xprefix}onlypc
║➤ ${global.xprefix}anticall
║➤ ${global.xprefix}self
║➤ ${global.xprefix}public
║➤ ${global.xprefix}join
║➤ ${global.xprefix}poll
║➤ ${global.xprefix}bc
║➤ ${global.xprefix}bcgroup
║➤ ${global.xprefix}setmenu
║➤ ${global.xprefix}setimgmenu
║➤ ${global.xprefix}setvidmenu
║➤ ${global.xprefix}setgifmenu
║➤ ${global.xprefix}setreply
║➤ ${global.xprefix}setprefix
║➤ ${global.xprefix}addlimit
║➤ ${global.xprefix}dellimit
║➤ ${global.xprefix}resethit
║➤ ${global.xprefix}resetuser
║➤ ${global.xprefix}creategc
║➤ ${global.xprefix}setexif
║➤ ${global.xprefix}userjid
║➤ ${global.xprefix}setbotbio
║➤ ${global.xprefix}delppbot
║➤ ${global.xprefix}trackip
║➤ ${global.xprefix}setppbot
║➤ ${global.xprefix}addprem
║➤ ${global.xprefix}delprem
║➤ ${global.xprefix}addowner
║➤ ${global.xprefix}delowner
║➤ ${global.xprefix}block
║➤ ${global.xprefix}unblock
║➤ ${global.xprefix}leavegc
║➤ ${global.xprefix}getbio
║➤ ${global.xprefix}getpp
║➤ ${global.xprefix}getplugin
║➤ ${global.xprefix}storytext
║➤ ${global.xprefix}storyaudio
║➤ ${global.xprefix}storyimage
║➤ ${global.xprefix}storyvideo
║➤ ${global.xprefix}reactch
║➤ ${global.xprefix}createch
║➤ ${global.xprefix}clear
╰⟢

╭──• ❰ *General* ❱
║➤ ${global.xprefix}ping
║➤ ${global.xprefix}repo
║➤ ${global.xprefix}bot
║➤ ${global.xprefix}autostatusview
║➤ ${global.xprefix}uptime
║➤ ${global.xprefix}delete
║➤ ${global.xprefix}listplugin
║➤ ${global.xprefix}cc
║➤ ${global.xprefix}ckalender
║➤ ${global.xprefix}fixtures
║➤ ${global.xprefix}news
║➤ ${global.xprefix}vcf
║➤ ${global.xprefix}save
║➤ ${global.xprefix}say
╰⟢
╭──• ❰ *Bug & War* ❱
║➤ ${global.xprefix}dave 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║➤ ${global.xprefix}pmbug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║➤ ${global.xprefix}delaybug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║➤ ${global.xprefix}docubug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║➤ ${global.xprefix}unlimitedbug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║➤ ${global.xprefix}bombug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
╰⟢
╭──• ❰ *Download* ❱
║➤ ${global.xprefix}song
║➤ ${global.xprefix}play
║➤ ${global.xprefix}play2
║➤ ${global.xprefix}tiktok
║➤ ${global.xprefix}vv
║➤ ${global.xprefix}vv2
║➤ ${global.xprefix}anime
║➤ ${global.xprefix}detiknews
║➤ ${global.xprefix}apk
║➤ ${global.xprefix}apk2
║➤ ${global.xprefix}fb
║➤ ${global.xprefix}igdl
║➤ ${global.xprefix}igdl2
║➤ ${global.xprefix}lyrics
║➤ ${global.xprefix}spotifydown
║➤ ${global.xprefix}spotifysearch
║➤ ${global.xprefix}ytmp3
║➤ ${global.xprefix}ytmp4
║➤ ${global.xprefix}mediafire
║➤ ${global.xprefix}playtiktok
║➤ ${global.xprefix}play3
║➤ ${global.xprefix}song2
╰⟢
╭──• ❰ *Group* ❱
║➤ ${global.xprefix}remove
║➤ ${global.xprefix}tagall
║➤ ${global.xprefix}hidetag
║➤ ${global.xprefix}promote
║➤ ${global.xprefix}demote
║➤ ${global.xprefix}kickall
║➤ ${global.xprefix}kill
║➤ ${global.xprefix}invite
║➤ ${global.xprefix}add
║➤ ${global.xprefix}open
║➤ ${global.xprefix}close
║➤ ${global.xprefix}antilinkgc
║➤ ${global.xprefix}antilink
║➤ ${global.xprefix}getidgc
║➤ ${global.xprefix}ceklinkgc
║➤ ${global.xprefix}gcinfo
║➤ ${global.xprefix}poll
║➤ ${global.xprefix}setppgc
║➤ ${global.xprefix}listonline
║➤ ${global.xprefix}resetlink
║➤ ${global.xprefix}pin
║➤ ${global.xprefix}setnamegc
║➤ ${global.xprefix}request-join
║➤ ${global.xprefix}approve
║➤ ${global.xprefix}reject
║➤ ${global.xprefix}left
╰⟢
╭──• ❰ *Converter* ❱
║➤ ${global.xprefix}s
║➤ ${global.xprefix}take
║➤ ${global.xprefix}brat
║➤ ${global.xprefix}emojimix
║➤ ${global.xprefix}notes
║➤ ${global.xprefix}photo
║➤ ${global.xprefix}tovideo
║➤ ${global.xprefix}toaudio
║➤ ${global.xprefix}tovn
║➤ ${global.xprefix}translate
║➤ ${global.xprefix}flux
║➤ ${global.xprefix}deepimage
║➤ ${global.xprefix}tourl
║➤ ${global.xprefix}logo
║➤ ${global.xprefix}tts
║➤ ${global.xprefix}ghiblistyle
╰⟢
╭──• ❰ *Search / AI* ❱
║➤ ${global.xprefix}ai
║➤ ${global.xprefix}ai2
║➤ ${global.xprefix}country
║➤ ${global.xprefix}quiz
║➤ ${global.xprefix}gpt
║➤ ${global.xprefix}gpt2
║➤ ${global.xprefix}gpt3
║➤ ${global.xprefix}gemma
║➤ ${global.xprefix}yts
║➤ ${global.xprefix}pinterest
║➤ ${global.xprefix}igstory
║➤ ${global.xprefix}ytstalk
║➤ ${global.xprefix}ffstalk
║➤ ${global.xprefix}telestalk
║➤ ${global.xprefix}meme
║➤ ${global.xprefix}channelinfo
║➤ ${global.xprefix}cekkodam
║➤ ${global.xprefix}define
║➤ ${global.xprefix}sfile
║➤ ${global.xprefix}myip
║➤ ${global.xprefix}trackip
║➤ ${global.xprefix}xvideos
║➤ ${global.xprefix}yiffersearch
╰⟢
╭──• ❰ *Maths* ❱
║➤ ${global.xprefix}calculator
╰⟢
╭──• ❰ *Creator* ❱
║➤ ${global.xprefix}Quran
║➤ ${global.xprefix}Bible
╰⟢
╭──• ❰ *Developer* ❱
║➤ ${global.xprefix}githubstalk
║➤ ${global.xprefix}gitclone
║➤ ${global.xprefix}getfile
║➤ ${global.xprefix}scweb
║➤ ${global.xprefix}getvars
║➤ ${global.xprefix}setvar
║➤ ${global.xprefix}update
╰⟢
╭──• ❰ *Email* ❱
║➤ ${global.xprefix}sendemail
║➤ ${global.xprefix}tempmail
╰⟢

> *VENOM-XMD*
> *ENJOY* 💠
`;

module.exports = Menu

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update ${__filename}`))
    delete require.cache[file]
    require(file)
})
// 𝐕𝐄𝐍𝐎𝐌-𝐗𝐌𝐃 //