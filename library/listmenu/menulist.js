const chalk = require('chalk')
const fs = require('fs')

const Menu = `
┏▣ ◈ *𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 𝐌𝐄𝐍𝐔* ◈ ▣
┃ ✦ *Owner*   : ${global.ownername}
┃ ✦ *Version* : 1.0.0
┃ ✦ *Type*    : ${global.typebot}
┃ ✦ *Prefix*  : ${global.prefix}
┗━━━━━━━━━━━━━━━━━━━━━━┛

┏▣ ◈ *MAIN CMD* ◈ ▣
┃ ➤ menu
┃ ➤ ping
┃ ➤ uptime
┃ ➤ botinfo
┃ ➤ listplugin
┃ ➤ update
┃ ➤ owner
┃ ➤ support
┗━━━━━━━━━━━━━━

┏▣ ◈ *BOT CONTROL* ◈ ▣
┃ ➤ public
┃ ➤ private
┃ ➤ addaccess
┃ ➤ delaccess
┃ ➤ block
┃ ➤ unblock
┃ ➤ setprefix
┃ ➤ autoreact
┃ ➤ autotyping
┃ ➤ autorecord
┃ ➤ autobio
┃ ➤ autostatusview
┗━━━━━━━━━━━━━━

┏▣ ◈ *MEDIA CMD* ◈ ▣
┃ ➤ play
┃ ➤ playdoc
┃ ➤ ytmp3
┃ ➤ ytmp3doc
┃ ➤ ytmp4
┃ ➤ ytmp4doc
┃ ➤ ytvid
┃ ➤ yts
┃ ➤ pinterestdl
┃ ➤ song
┃ ➤ twitterdl
┃ ➤ tiktok
┃ ➤ tiktokaudio
┃ ➤ igdl
┃ ➤ fbdown
┃ ➤ soundcloud
┗━━━━━━━━━━━━━━

┏▣ ◈ *AI CMD* ◈ ▣
┃ ➤ gemma
┃ ➤ indo-ai
┃ ➤ chatgpt
┃ ➤ firai
┃ ➤ ai-img
┃ ➤ aiwrite
┃ ➤ gpt4
┗━━━━━━━━━━━━━━

┏▣ ◈ *GROUP CMD* ◈ ▣
┃ ➤ add
┃ ➤ kick
┃ ➤ promote
┃ ➤ demote
┃ ➤ antilink
┃ ➤ antilinkgc
┃ ➤ antitag
┃ ➤ antitagadmin
┃ ➤ antibadword
┃ ➤ antibot
┃ ➤ welcome
┃ ➤ setgroupname
┃ ➤ setppgroup
┃ ➤ setdesc
┃ ➤ hidetag
┃ ➤ tagall
┃ ➤ listonline
┗━━━━━━━━━━━━━━

┏▣ ◈ *DOWNLOAD CMD* ◈ ▣
┃ ➤ apk
┃ ➤ download
┃ ➤ facebook
┃ ➤ gdrive
┃ ➤ gitclone
┃ ➤ image
┃ ➤ instagram
┃ ➤ itunes
┃ ➤ mediafire
┃ ➤ song
┃ ➤ song2
┃ ➤ play
┃ ➤ play2
┃ ➤ savestatus
┃ ➤ telesticker
┃ ➤ tiktok
┃ ➤ tiktokaudio
┃ ➤ twitter
┃ ➤ video
┃ ➤ videodoc
┃ ➤ xvideos
┃ ➤ ytmp3
┃ ➤ ytmp3doc
┃ ➤ ytmp4
┃ ➤ ytmp4doc
┗━━━━━━━━━━━━━━

┏▣ ◈ *PHOTO CMD* ◈ ▣
┃ ➤ remini
┃ ➤ wallpaper
┃ ➤ glithtext
┃ ➤ lighteffects
┃ ➤ writetext
┃ ➤ advancedglow
┃ ➤ pixelglitch
┃ ➤ neonlogo
┃ ➤ galaxywallpaper
┃ ➤ cartoonstyle
┃ ➤ luxurygold
┃ ➤ sandsummer
┃ ➤ freecreate
┃ ➤ gradienttext
┃ ➤ shadowtext
┗━━━━━━━━━━━━━━

┏▣ ◈ *FUN CMD* ◈ ▣
┃ ➤ dare
┃ ➤ fact
┃ ➤ jokes
┃ ➤ memes
┃ ➤ quotes
┃ ➤ trivia
┃ ➤ truth
┃ ➤ truthdetector
┃ ➤ xxqc
┗━━━━━━━━━━━━━━

┏▣ ◈ *OWNER CMD* ◈ ▣
┃ ➤ block
┃ ➤ delete
┃ ➤ deljunk
┃ ➤ disk
┃ ➤ dlvo
┃ ➤ listblocked
┃ ➤ listsudo
┃ ➤ owner
┃ ➤ setbio
┃ ➤ setprofilepic
┃ ➤ setstickercmd
┃ ➤ delstickercmd
┃ ➤ tostatus
┃ ➤ toviewonce
┃ ➤ unblock
┃ ➤ unblockall
┃ ➤ restart
┃ ➤ react
┗━━━━━━━━━━━━━━

┏▣ ◈ *RELIGION CMD* ◈ ▣
┃ ➤ bible
┃ ➤ quran
┗━━━━━━━━━━━━━━

┏▣ ◈ *SEARCH CMD* ◈ ▣
┃ ➤ define
┃ ➤ define2
┃ ➤ imdb
┃ ➤ lyrics
┃ ➤ shazam
┃ ➤ weather
┃ ➤ yts
┗━━━━━━━━━━━━━━

┏▣ ◈ *SETTINGS CMD* ◈ ▣
┃ ➤ addbadword
┃ ➤ addignorelist
┃ ➤ addsudo
┃ ➤ alwaysonline
┃ ➤ antibug
┃ ➤ anticall
┃ ➤ antidelete
┃ ➤ antideletestatus
┃ ➤ autobio
┃ ➤ autoreactstatus
┃ ➤ autoviewstatus
┃ ➤ autoreact
┃ ➤ autoread
┃ ➤ autotype
┃ ➤ autorecord
┃ ➤ mode
┃ ➤ setmenu
┃ ➤ setprefix
┃ ➤ setbotname
┃ ➤ setownername
┃ ➤ setownernumber
┃ ➤ setwatermark
┃ ➤ settimezone
┃ ➤ getsettings
┃ ➤ resetwarn
┃ ➤ setwarn
┃ ➤ listwarn
┗━━━━━━━━━━━━━━

┏▣ ◈ *TOOLS CMD* ◈ ▣
┃ ➤ browse
┃ ➤ calculate
┃ ➤ getpp
┃ ➤ getabout
┃ ➤ emojimix
┃ ➤ fliptext
┃ ➤ gsmarena
┃ ➤ genpass
┃ ➤ device
┃ ➤ obfuscate
┃ ➤ qrcode
┃ ➤ say
┃ ➤ ssweb
┃ ➤ sticker
┃ ➤ fancy
┃ ➤ translate
┃ ➤ toimage
┃ ➤ tourl
┃ ➤ texttopdf
┗━━━━━━━━━━━━━━

┏▣ ◈ *VIDEO CMD* ◈ ▣
┃ ➤ volvideo
┃ ➤ toaudio
┃ ➤ tovideo
┗━━━━━━━━━━━━━━
`;

module.exports = Menu

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
})