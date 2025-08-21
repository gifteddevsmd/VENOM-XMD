const fs = require('fs')
const os = require('os')
const process = require('process')
const chalk = require('chalk')

// Format RAM bytes
function formatBytes(bytes) {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return '0 B'
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
}

// Get uptime
function getUptime() {
    let totalSeconds = process.uptime()
    const hours = Math.floor(totalSeconds / 3600)
    totalSeconds %= 3600
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = Math.floor(totalSeconds % 60)
    return `${hours}h ${minutes}m ${seconds}s`
}

// RAM usage
function getMemoryUsage() {
    const used = process.memoryUsage().heapUsed
    const total = os.totalmem()
    return `${formatBytes(used)} / ${formatBytes(total)}`
}

// Placeholder ping
function getPing() {
    return `${Math.floor(Math.random() * 50) + 30} ms`
}

// Menu function
function Menu() {
    return `
┏▣ ◈ *RACHEL-XMD MENU* ◈ ▣
┃ ✦ Owner   : ${global.ownername || 'Not Set'}
┃ ✦ Version : ${global.botversion || '1.0.0'}
┃ ✦ Mode    : ${global.typebot || 'Plugin'}
┃ ✦ Prefix  : ${global.xprefix || '.'}
┃ ✦ Uptime  : ${getUptime()}
┃ ✦ RAM     : ${getMemoryUsage()}
┃ ✦ Ping    : ${getPing()}
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


┏▣ ◈ *BUG CMD* ◈ ▣
┃ ➤ dave
┃ ➤ gcend
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
`
}

// Export at the bottom
module.exports = Menu

// Watch file for updates
let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update File 📁 : ${__filename}`))
    delete require.cache[file]
    require(file)
})