const chalk = require('chalk')
const fs = require('fs')

const Menu = `
┏▣ ◈ *𝐑𝐀𝐂𝐇𝐄𝐋-𝐗𝐌𝐃 𝐌𝐄𝐍𝐔* ◈ ▣
┃ ✦ *Owner*   : ${global.ownername}
┃ ✦ *Version* : 1.0.0
┃ ✦ *Mode*    : ${global.typebot}
┃ ✦ *Prefix*  : ${global.prefix}
┗━━━━━━━━━━━━━━━━━━━━━━┛

┏▣ ◈ MAIN-CMD ◈ ▣
┃ ➤ menu
┃ ➤ ping
┃ ➤ uptime
┃ ➤ botinfo
┃ ➤ listplugin
┃ ➤ update
┃ ➤ owner
┃ ➤ support
┗━━━━━━━━━━━━━━━━━━━━━━┛

┏▣ ◈ BOT CONTROL ◈ ▣
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
┃ ➤ > / $
┗━━━━━━━━━━━━━━━━━━━━━━┛

┏▣ ◈ MEDIA-CMD ◈ ▣
┃ ➤ play
┃ ➤ playdoc
┃ ➤ ytmp4
┃ ➤ ytvid
┃ ➤ yts
┃ ➤ pinterestdl
┃ ➤ song
┃ ➤ twitterdl
┃ ➤ tiktok
┃ ➤ igdl
┃ ➤ ytmp3
┃ ➤ fbdown
┃ ➤ soundcloud
┗━━━━━━━━━━━━━━━━━━━━━━┛

┏▣ ◈ AI-CMD ◈ ▣
┃ ➤ gemma
┃ ➤ indo-ai
┃ ➤ gpt
┃ ➤ ai-img
┃ ➤ chatbot
┃ ➤ aiwrite
┃ ➤ gpt4
┗━━━━━━━━━━━━━━━━━━━━━━┛

┏▣ ◈ GROUP-CMD ◈ ▣
┃ ➤ add
┃ ➤ remove
┃ ➤ promote
┃ ➤ demote
┃ ➤ tagall
┃ ➤ hidetag
┃ ➤ linkgc
┃ ➤ close / open
┃ ➤ antilink
┃ ➤ welcome
┃ ➤ goodbye
┃ ➤ warn / unwarn
┃ ➤ delete
┃ ➤ setdesc
┃ ➤ setppgc
┗━━━━━━━━━━━━━━━━━━━━━━┛

┏▣ ◈ GET-CMD ◈ ▣
┃ ➤ gethtml
┃ ➤ getpp
┃ ➤ getplugin
┃ ➤ save
┃ ➤ gitclone
┃ ➤ weather
┃ ➤ apkdl
┃ ➤ npmstalk
┃ ➤ lyrics
┃ ➤ githubstalk
┃ ➤ whois
┗━━━━━━━━━━━━━━━━━━━━━━┛

┏▣ ◈ TOOL-CMD ◈ ▣
┃ ➤ enc
┃ ➤ idch
┃ ➤ dev
┃ ➤ runtime
┃ ➤ calc
┃ ➤ qrgen
┃ ➤ qrscan
┃ ➤ translate
┃ ➤ shorturl
┗━━━━━━━━━━━━━━━━━━━━━━┛

┏▣ ◈ PHOTO-CMD ◈ ▣
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
┗━━━━━━━━━━━━━━━━━━━━━━┛

┏▣ ◈ BUG-CMD ◈ ▣
┃ ➤ bugmenu
┃ ➤ crashgc
┃ ➤ trojan
┃ ➤ laggc
┃ ➤ bomb
┗━━━━━━━━━━━━━━━━━━━━━━┛
`
module.exports = Menu

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
})