const fs = require('fs')
const chalk = require('chalk')
if (fs.existsSync('.env')) require('dotenv').config({ path: __dirname+'/.env' })


global.SESSION_ID = process.env.SESSION_ID || '' 
// Owner Setting
global.xprefix = process.env.BOT_PREFIX || '.'
global.owner = ["254104260236",]
global.error = ["6666",]
global.ownername = process.env.OWNER_NAME || 'dave'
global.antidelete = process.env.ANTI_DELETE || true
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Bot Setting
global.botname = "𝐕𝐄𝐍𝐎𝐌-𝐗𝐌𝐃"
global.botversion = "1.0.0" // Updated to match menu version
global.typebot = "Plugin"
global.session = "davsession"
global.connect = true
global.statusview = process.env.AUTO_STATUS || true
global.antilinkgc = process.env.ANTILINK_GROUP || true
global.autoTyping = process.env.AUTO_TYPE || false
global.autoRecord = process.env.AUTO_RECORD || false
global.autoai = process.env.AUTO_AI || false // Added for menu compatibility
global.autoreact = process.env.AUTO_REACT || false // Added for menu compatibility
global.thumb = "https://files.catbox.moe/4ryp6k.jpg"
global.wagc = "https://chat.whatsapp.com/LfTFxkUQ1H7Eg2D0vR3n6g?mode=ac_t"
global.caption = "dave media"
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Sticker Marker
global.packname = "VENOM-XMD"
global.author = "VENOM-XMD"
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Respon Message
global.mess = {
    success: '✅ Done.',
    admin: '🚨 Admin only.',
    premium: '🆘 Must be a premium user.',
    botAdmin: '🤖 Make me admin first.',
    owner: '👑 Owner only.',
    OnlyGrup: '👥 Group only.',
    private: '📩 Private chat only.',
    wait: '⏳ Processing...',
    error: '⚠️ Error occurred.',
}
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Mode Settings (for menu compatibility)
global.mode = {
    private: false,
    public: true,
    recording: false,
    typing: false,
    autoreact: false,
    autoai: false
}
//━━━━━━━━━━━━━━━━━━━━━━━━//
// File Update
let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update ${__filename}`))
    delete require.cache[file]
    require(file)
})