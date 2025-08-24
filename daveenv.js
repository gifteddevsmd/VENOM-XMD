const fs = require('fs')
const chalk = require('chalk')
if (fs.existsSync('.env')) require('dotenv').config({ path: __dirname+'/.env' })

// ==================== BOT INFO ==================== //
global.SESSION_ID = process.env.SESSION_ID || '.' 
global.botname      = process.env.BOT_NAME || 'VENOM-XMD'
global.ownername    = 'GIFTED DAVE'
global.error = ["6666",]
global.owner = ["254104260236",]
global.creator      = process.env.OWNER_NUMBER ? `${process.env.OWNER_NUMBER}@s.whatsapp.net` : '254104260236@s.whatsapp.net'
global.websitex     = "https://whatsapp.com/channel/0029VbApvFQ2Jl84lhONkc3k"
global.wagc         = "https://chat.whatsapp.com/LfTFxkUQ1H7Eg2D0vR3n6g?mode=ac_t"
global.socialm      = "IG: @gifted_dave"
global.location     = "Kenya"
global.themeemoji   = '🪀'
global.wm           = "VENOM-XMD"
global.botscript    = "https://whatsapp.com/channel/0029VbApvFQ2Jl84lhONkc3k"

// ==================== STICKER INFO ==================== //
global.caption = "Dave media"
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Sticker Marker
global.packname = process.env.PACK_NAME ||'RACHEL-XMD'
global.packname = process.env.AUTHOR||'𝐏𝐀𝐂𝐊𝐒'
//━━━━━━━━━━━━━━━━━━━━━━━━//

// ==================== BOT SETTINGS ==================== //
global.xprefix      = process.env.PREFIX || '.'
global.premium      = ["254104260236"] // Premium User List
global.hituet       = 0

global.autoblocknumber = process.env.AUTOBLOCK_NUMBER || '263,234'
global.antiforeignnumber = process.env.ANTIFOREIGN_NUMBER || ''
global.welcome      = process.env.WELCOME || 'false'
global.anticall     = process.env.ANTI_CALL || 'false'
global.autoswview   = process.env.AUTOSW_VIEW || 'true'
global.adminevent   = true
global.groupevent   = true
global.antidelete = process.env.ANTI_DELETE || true

// ==================== MESSAGES ==================== //
global.mess = {
    success: '✅ Done.',
    admin: '🚨 Admin only.',
    premium: '🆘must be a premium user.',
    botAdmin: '🤖 Make me admin first.',
    owner: '👑 Owner only.',
    OnlyGrup: '👥 Group only.',
    private: '📩 Private chat only.',
    wait: '⏳ Processing...',
    error: '⚠️ Error occurred.',
}

// ==================== THUMBNAIL ==================== //
global.thumb = "https://files.catbox.moe/4ryp6k.jpg"

// ==================== AUTO FEATURES / TOGGLES ==================== //
global.botversion = "1.0.0"
global.typebot = "Plugin"
global.session = "davesession"
global.connect = true
global.statusview   = process.env.AUTO_STATUS === 'false' ? false : true
global.antilinkgc   = process.env.ANTILINK_GROUP === 'false' ? false : true
global.autoTyping   = process.env.AUTO_TYPE === 'true' ? true : false
global.autoRecord   = process.env.AUTO_RECORD === 'true' ? true : false
global.autoai       = process.env.AUTO_AI === 'true' ? true : false
global.autoreact    = process.env.AUTO_REACT === 'true' ? true : false

// ==================== WATCH CONFIG FILE ==================== //
let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update '${__filename}'`))
    delete require.cache[file]
    require(file)
})