const chalk = require('chalk')
const fs = require('fs')

const Menu = `
╔════════════════════════╗
║      RACHEL-𝐗𝐌𝐃       ║
╠════════════════════════╣
║ 👑 Owner   : ${global.ownername}
║ ⚡ Version : 1.6.0
║ 🤖 Type    : ${global.typebot}
╚════════════════════════╝

╔════════════════════════╗
║       🏠 MAIN-CMD      ║
╠════════════════════════╣
│ • menu
│ • ping
│ • ping2
│ • uptime
│ • s
│ • botinfo
│ • listplugin
│ • update
╚════════════════════════╝

╔════════════════════════╗
║      ⚙️ BOT CONTROL    ║
╠════════════════════════╣
│ • public
│ • private
│ • addaccess
│ • delaccess
│ • autoreact
│ • block
│ • autotyping
│ • autorecord
│ • autobio
│ • setprefix
│ • autostatusview
│ • > / $
╚════════════════════════╝

╔════════════════════════╗
║       🎵 MEDIA-CMD     ║
╠════════════════════════╣
│ • play
│ • playdoc
│ • ytmp4
│ • ytvid
│ • yts
│ • pinterestdl
│ • vv
│ • song
│ • twitterdl
│ • tt
│ • tiktok
│ • igdl
│ • ytmp3
╚════════════════════════╝

╔════════════════════════╗
║       💀 BUG-CMD       ║
╠════════════════════════╣
│ • trash
╚════════════════════════╝

╔════════════════════════╗
║       🤖 AI-CMD        ║
╠════════════════════════╣
│ • gemma
│ • indo-ai
╚════════════════════════╝

╔════════════════════════╗
║       🌐 GET-CMD       ║
╠════════════════════════╣
│ • gethtml
│ • getpp
│ • getplugin
│ • save
│ • gitclone
│ • weather
╚════════════════════════╝

╔════════════════════════╗
║      👥 GROUP-CMD      ║
╠════════════════════════╣
│ • add
│ • remove
│ • promote
│ • revoke
│ • approve
│ • reject
│ • antilinkgc
│ • antilink
│ • tagall
│ • hidetag
│ • close
│ • open
│ • kickall
│ • linkgc
│ • setppgc
│ • setdesc
│ • tagme
│ • warn
│ • unwarn
│ • welcome
│ • goodbye
╚════════════════════════╝

╔════════════════════════╗
║       ⚓ TOOL-CMD       ║
╠════════════════════════╣
│ • enc
│ • idch
│ • dev
╚════════════════════════╝

╔════════════════════════╗
║       🩸 PHOTO-CMD      ║
╠════════════════════════╣
│ • glithtext
│ • lighteffects
│ • writetext
│ • advancedglow
│ • typographytext
│ • pixelglitch
│ • neonglitch
│ • flagtext
│ • flag3dtext
│ • deletingtext
│ • blackpinkstyle
│ • glowingtex
│ • underwater
│ • logomaker
│ • cartoonstyle
│ • papercutstyle
│ • watercolortext
│ • effectclouds
│ • blackpinklogo
│ • gradienttext
│ • luxurygold
│ • sandsummer
│ • multicoloredneon
│ • galaxywallpaper
│ • 1917style
│ • galaxystyle
│ • royaltext
│ • freecreate
╚════════════════════════╝
`

module.exports = Menu

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
})