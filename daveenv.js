const fs = require('fs')
const chalk = require('chalk')
const os = require('os')
if (fs.existsSync('.env')) require('dotenv').config({ path: __dirname+'/.env' })

// Runtime calculation function
function runtime(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
}

// RAM calculation function
function ram() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    return `${(usedMem / 1024 / 1024 / 1024).toFixed(2)}GB / ${(totalMem / 1024 / 1024 / 1024).toFixed(2)}GB`;
}

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
global.botversion = "3.0.0"
global.typebot = "Plugin"
global.session = "davsession"
global.connect = true
global.statusview = process.env.AUTO_STATUS || true
global.antilinkgc = process.env.ANTILINK_GROUP || true
global.autoTyping = process.env.AUTO_TYPE || false
global.autoRecord = process.env.AUTO_RECORD || false
global.autoai = process.env.AUTO_AI || false
global.autoreact = process.env.AUTO_REACT || false
global.thumb = "https://files.catbox.moe/4ryp6k.jpg"
global.wagc = "https://chat.whatsapp.com/LfTFxkUQ1H7Eg2D0vR3n6g?mode=ac_t"
global.caption = "dave media"
//━━━━━━━━━━━━━━━━━━━━━━━━//

const appname = process.env.APP_NAME || '';
const herokuapi = process.env.HEROKU_API;
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
// Mode Settings
global.mode = {
    private: false,
    public: true,
    recording: false,
    typing: false,
    autoreact: false,
    autoai: false
}
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Export the functions for use in menu
global.runtime = runtime;
global.ram = ram;
//━━━━━━━━━━━━━━━━━━━━━━━━//
// File Update
let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update ${__filename}`))
    delete require.cache[file]
    require(file)
})