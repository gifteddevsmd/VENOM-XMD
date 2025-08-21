require('./daveenv')
const makeWASocket = require("@whiskeysockets/baileys").default
const { color } = require('./library/lib/color')
const NodeCache = require("node-cache")
const readline = require("readline")
const pino = require('pino')
const { Boom } = require('@hapi/boom')
const { Low, JSONFile } = require('./library/lib/lowdb')
const yargs = require('yargs/yargs')
const fs = require('fs')
const chalk = require('chalk')
const path = require('path')
const axios = require('axios')
const _ = require('lodash')
const moment = require('moment-timezone')
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./library/lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetch, await, sleep, reSize } = require('./library/lib/function')
const { default: connConnect, getAggregateVotesInPollMessage, delay, PHONENUMBER_MCC, makeCacheableSignalKeyStore, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, proto } = require("@whiskeysockets/baileys")
const createToxxicStore = require('./library/database/basestore');
const store = createToxxicStore('./store', {
  logger: pino().child({ level: 'silent', stream: 'store' }) });

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.DATABASE = global.db
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) return new Promise((resolve) => setInterval(function () { (!global.db.READ ? (clearInterval(this), resolve(global.db.data == null ? global.loadDatabase() : global.db.data)) : null) }, 1 * 1000))
  if (global.db.data !== null) return
  global.db.READ = true
  await global.db.read()
  global.db.READ = false
  global.db.data = {
    users: {},
    database: {},
    chats: {},
    game: {},
    settings: {},
    ...(global.db.data || {})
  }
  global.db.chain = _.chain(global.db.data)
}
loadDatabase()

if (global.db) setInterval(async () => {
   if (global.db.data) await global.db.write()
}, 30 * 1000)

const settings = require('./daveenv')
let phoneNumber = "254104260236"
const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))
const sessionDir = path.join(__dirname, 'session');
const credsPath = path.join(sessionDir, 'creds.json');

async function downloadSessionData() {
  try {
    await fs.promises.mkdir(sessionDir, { recursive: true });

    if (!fs.existsSync(credsPath)) {
      if (!global.SESSION_ID) {
        return console.log(color(`Session id not found at SESSION_ID!\nCreds.json not found at session folder!\n\nWait to enter your number`, 'red'));
      }

      const base64Data = global.SESSION_ID.split("DAVE-XMD-WHATSAPP-BOT;;;=>")[1];
      const sessionData = Buffer.from(base64Data, 'base64');

      await fs.promises.writeFile(credsPath, sessionData);
      console.log(color(`Session successfully saved, please wait!!`, 'green'));
      await startdave();
    }
  } catch (error) {
    console.error('Error downloading session data:', error);
  }
}

async function startdave() {
  let { version, isLatest } = await fetchLatestBaileysVersion()
  const { state, saveCreds } = await useMultiFileAuthState(`./session`)
  const msgRetryCounterCache = new NodeCache()
  const dave = makeWASocket({
    version: [2, 3000, 1023223821],
    logger: pino({ level: 'silent' }),
    printQRInTerminal: !pairingCode,
    mobile: useMobile,
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
    },
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: true,
    getMessage: async (key) => {
      let jid = jidNormalizedUser(key.remoteJid)
      let msg = await store.loadMessage(jid, key.id)
      return msg?.message || ""
    },
    msgRetryCounterCache,
    defaultQueryTimeoutMs: undefined,
  })

  store.bind(dave.ev)

  if (pairingCode && !dave.authState.creds.registered) {
    if (useMobile) throw new Error('Cannot use pairing code with mobile api')

    let phoneNumber
    if (!!global.phoneNumber) {
      phoneNumber = global.phoneNumber
    } else {
      phoneNumber = await question(chalk.bgBlack(chalk.greenBright(`Please type your WhatsApp number 😍\nFormat: 2547XXXXX (without + or spaces) : `)))
    }

    phoneNumber = phoneNumber.replace(/[^0-9]/g, '')

    const pn = require('awesome-phonenumber');
    if (!pn('+' + phoneNumber).isValid()) {
      console.log(chalk.red('Invalid phone number. Please enter your full international number (e.g., 255792021944 for Tanzania, 254798570132 for Kenya, etc.) without + or spaces.'));
      process.exit(1);
    }

    setTimeout(async () => {
      try {
        let code = await dave.requestPairingCode(phoneNumber)
        code = code?.match(/.{1,4}/g)?.join("-") || code
        console.log(chalk.black(chalk.bgGreen(`Your Pairing Code : `)), chalk.black(chalk.white(code)))
        console.log(chalk.yellow(`\nPlease enter this code in your WhatsApp app:\n1. Open WhatsApp\n2. Go to Settings > Linked Devices\n3. Tap "Link a Device"\n4. Enter the code shown above`))
      } catch (error) {
        console.error('Error requesting pairing code:', error)
        console.log(chalk.red('Failed to get pairing code. Please check your phone number and try again.'))
      }
    }, 3000)
  }

  store?.bind(dave.ev)
  
  dave.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update
    try {
      if (connection === 'close') {
        let reason = new Boom(lastDisconnect?.error)?.output.statusCode
        if (reason === DisconnectReason.badSession) {
          console.log(`Bad Session File, Please Delete Session and Scan Again`);
          startdave()
        } else if (reason === DisconnectReason.connectionClosed) {
          console.log("Connection closed, reconnecting....");
          startdave();
        } else if (reason === DisconnectReason.connectionLost) {
          console.log("Connection Lost from Server, reconnecting...");
          startdave();
        } else if (reason === DisconnectReason.connectionReplaced) {
          console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First");
          startdave()
        } else if (reason === DisconnectReason.loggedOut) {
          console.log(`Device Logged Out, Please Delete Session and Scan Again.`);
          startdave();
        } else if (reason === DisconnectReason.restartRequired) {
          console.log("Restart Required, Restarting...");
          startdave();
        } else if (reason === DisconnectReason.timedOut) {
          console.log("Connection TimedOut, Reconnecting...");
          startdave();
        } else dave.end(`Unknown DisconnectReason: ${reason}|${connection}`)
      }
      if (update.connection == "connecting" || update.receivedPendingNotifications == "false") {
        console.log(color(`\nConnecting...`, 'white'))
      }
      if (update.connection == "open" || update.receivedPendingNotifications == "true") {
        console.log(color(` `, 'magenta'))
        console.log(color(`Connected to => ` + JSON.stringify(dave.user, null, 2), 'green'))
        await delay(1999)

        const botNumber = dave.user.id.split(':')[0] + '@s.whatsapp.net';
        await dave.sendMessage(botNumber, {
          text:
            `
╔══❐ *𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 CONNECTED* ❐══╗
║ ➤ *Bot:* 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃
║ ➤ *Time:* ${new Date().toLocaleString()}
║ ➤ *Status:* Online ✅
║ ➤ *User:* ${botNumber}
╚════════════════════════════╝`,
          contextInfo: {
            forwardingScore: 1,
            isForwarded: false,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363400480173280@newsletter',
              newsletterName: '𝐃𝐀𝐕𝐄-𝐌𝐃',
              serverMessageId: -1
            }
          }
        });
        console.log(color('>DAVE-MD is Connected< [ ! ]', 'red'))
      }

    } catch (err) {
      console.log('Error in Connection.update ' + err)
      startdave();
    }
  })

  dave.ev.on('creds.update', saveCreds)
  dave.ev.on("messages.upsert", () => { })

          




      //autostatus view
              dave.ev.on('messages.upsert', async chatUpdate => {
        	if (global.statusview){
        try {
            if (!chatUpdate.messages || chatUpdate.messages.length === 0) return;
            const mek = chatUpdate.messages[0];

            if (!mek.message) return;
            mek.message =
                Object.keys(mek.message)[0] === 'ephemeralMessage'
                    ? mek.message.ephemeralMessage.message
                    : mek.message;

            if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                let emoji = [ "💙","❤️", "🌚","😍", "😭" ];
                let sigma = emoji[Math.floor(Math.random() * emoji.length)];
                await dave.readMessages([mek.key]);
                dave.sendMessage(
                    'status@broadcast',
                    { react: { text: sigma, key: mek.key } },
                    { statusJidList: [mek.key.participant] },
                );
            }

        } catch (err) {
            console.error(err);
        }
      }
   }
 )  
    
dave.ev.on('group-participants.update', async (anu) => {
    const iswel = db.data.chats[anu.id]?.welcome || false
    const isLeft = db.data.chats[anu.id]?.goodbye || false

    let {
      welcome
    } = require('./library/lib/welcome')
    await welcome(iswel, isLeft, dave, anu)
  })
            
    dave.ev.on('messages.upsert', async chatUpdate => {
        //console.log(JSON.stringify(chatUpdate, undefined, 2))
        try {
            mek = chatUpdate.messages[0]
            if (!mek.message) return
            mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
            if (mek.key && mek.key.remoteJid === 'status@broadcast') return
            if (!dave.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
            if (mek.key.id.startsWith('Xeon') && mek.key.id.length === 16) return
            if (mek.key.id.startsWith('BAE5')) return
            m = smsg(dave, mek, store)
            require("./davehandler")(dave, m, chatUpdate, store)
        } catch (err) {
            console.log(err)
        }
    })

   
    dave.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }

    dave.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = dave.decodeJid(contact.id)
            if (store && store.contacts) store.contacts[id] = {
                id,
                name: contact.notify
            }
        }
    })

    dave.getName = (jid, withoutContact = false) => {
        id = dave.decodeJid(jid)
        withoutContact = dave.withoutContact || withoutContact
        let v
        if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
            v = store.contacts[id] || {}
            if (!(v.name || v.subject)) v = dave.groupMetadata(id) || {}
            resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
        })
        else v = id === '0@s.whatsapp.net' ? {
                id,
                name: 'WhatsApp'
            } : id === dave.decodeJid(dave.user.id) ?
            dave.user :
            (store.contacts[id] || {})
        return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    }

dave.sendContact = async (jid, kon, quoted = '', opts = {}) => {
	let list = []
	for (let i of kon) {
	    list.push({
	    	displayName: await dave.getName(i),
	    	vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await dave.getName(i)}\nFN:${await dave.getName(i)}\nitem1.TEL;waid=${i.split('@')[0]}:${i.split('@')[0]}\nitem1.X-ABLabel:Mobile\nEND:VCARD`
	    })
	}
	dave.sendMessage(jid, { contacts: { displayName: `${list.length} Contact`, contacts: list }, ...opts }, { quoted })
    }

    dave.public = true

    dave.serializeM = (m) => smsg(dave, m, store)

    dave.sendText = (jid, text, quoted = '', options) => dave.sendMessage(jid, {
        text: text,
        ...options
    }, {
        quoted,
        ...options
    })
    dave.sendImage = async (jid, path, caption = '', quoted = '', options) => {
        let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        return await dave.sendMessage(jid, {
            image: buffer,
            caption: caption,
            ...options
        }, {
            quoted
        })
    }
    dave.sendTextWithMentions = async (jid, text, quoted, options = {}) => dave.sendMessage(jid, {
        text: text,
        mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'),
        ...options
    }, {
        quoted
    })
    dave.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifImg(buff, options)
} else {
buffer = await imageToWebp(buff)
}
await dave.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
.then( response => {
fs.unlinkSync(buffer)
return response
})
}

dave.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifVid(buff, options)
} else {
buffer = await videoToWebp(buff)
}
await dave.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer
}
    dave.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
        let quoted = message.msg ? message.msg : message
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(quoted, messageType)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        let type = await FileType.fromBuffer(buffer)
        trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
        // save to file
        await fs.writeFileSync(trueFileName, buffer)
        return trueFileName
    }
const storeFile = "./library/database/store.json";
const maxMessageAge = 24 * 60 * 60; //24 hours

function loadStoredMessages() {
    if (fs.existsSync(storeFile)) {
        try {
            return JSON.parse(fs.readFileSync(storeFile));
        } catch (err) {
            console.error("⚠️ Error loading store.json:", err);
            return {};
        }
    }
    return {};
}

function saveStoredMessages(chatId, messageId, messageData) {
    let storedMessages = loadStoredMessages();

    if (!storedMessages[chatId]) storedMessages[chatId] = {};
    if (!storedMessages[chatId][messageId]) {
        storedMessages[chatId][messageId] = messageData;
        fs.writeFileSync(storeFile, JSON.stringify(storedMessages, null, 2));
    }
} 

function cleanupOldMessages() {
    let now = Math.floor(Date.now() / 1000);
    let storedMessages = {};

    if (fs.existsSync(storeFile)) {
        try {
            storedMessages = JSON.parse(fs.readFileSync(storeFile));
        } catch (err) {
            console.error("❌ Error reading store.json:", err);
            return;
        }
    }

    let totalMessages = 0, oldMessages = 0, keptMessages = 0;

    for (let chatId in storedMessages) {
        let messages = storedMessages[chatId];

        for (let messageId in messages) {
            let messageTimestamp = messages[messageId].timestamp;

            if (typeof messageTimestamp === "object" && messageTimestamp.low !== undefined) {
                messageTimestamp = messageTimestamp.low;
            }

            if (messageTimestamp > 1e12) {
                messageTimestamp = Math.floor(messageTimestamp / 1000);
            }

            totalMessages++;

            if (now - messageTimestamp > maxMessageAge) {
                delete storedMessages[chatId][messageId];
                oldMessages++;
            } else {
                keptMessages++;
            }
        }
        
        if (Object.keys(storedMessages[chatId]).length === 0) {
            delete storedMessages[chatId];
        }
    }

    fs.writeFileSync(storeFile, JSON.stringify(storedMessages, null, 2));

    console.log("[RACHEL-XMD] 🧹 Cleaning up:");
    console.log(`- Total messages processed: ${totalMessages}`);
    console.log(`- Old messages removed: ${oldMessages}`);
    console.log(`- Remaining messages: ${keptMessages}`);
}
dave.ev.on("messages.upsert", async (chatUpdate) => {
    for (const msg of chatUpdate.messages) {
        if (!msg.message) return;

        let chatId = msg.key.remoteJid;
        let messageId = msg.key.id;

        saveStoredMessages(chatId, messageId, msg);
    }
});
    dave.copyNForward = async (jid, message, forceForward = false, options = {}) => {
let vtype
if (options.readViewOnce) {
message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
vtype = Object.keys(message.message.viewOnceMessage.message)[0]
delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
delete message.message.viewOnceMessage.message[vtype].viewOnce
message.message = {
...message.message.viewOnceMessage.message
}
}
let mtype = Object.keys(message.message)[0]
let content = await generateForwardMessageContent(message, forceForward)
let ctype = Object.keys(content)[0]
let context = {}
if (mtype != "conversation") context = message.message[mtype].contextInfo
content[ctype].contextInfo = {
...context,
...content[ctype].contextInfo
}
const waMessage = await generateWAMessageFromContent(jid, content, options ? {
...content[ctype],
...options,
...(options.contextInfo ? {
contextInfo: {
...content[ctype].contextInfo,
...options.contextInfo
}
} : {})
} : {})
await dave.relayMessage(jid, waMessage.message, { messageId:  waMessage.key.id })
return waMessage
}
    
    dave.sendPoll = (jid, name = '', values = [], selectableCount = 1) => { return dave.sendMessage(jid, { poll: { name, values, selectableCount }}) }

dave.parseMention = (text = '') => {
return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
}
            
    dave.downloadMediaMessage = async (message) => {
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(message, messageType)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }

        return buffer
    }
    return dave
}  

async function tylor() {
  if (fs.existsSync(credsPath)) {
    console.log(color("Session file found, starting bot...", 'yellow'));
    await startdave();
  } else {
    const sessionDownloaded = await downloadSessionData();
    if (sessionDownloaded) {
      console.log("Session downloaded, starting bot.");
      await startdave();
    } else {
      if (!fs.existsSync(credsPath)) {
        if (!global.SESSION_ID) {
          console.log(color("Please wait for a few seconds to enter your number!", 'red'));
          await startdave();
        }
      }
    }
  }
}


tylor()

process.on('uncaughtException', function (err) {
let e = String(err)
if (e.includes("conflict")) return
if (e.includes("Socket connection timeout")) return
if (e.includes("not-authorized")) return
if (e.includes("already-exists")) return
if (e.includes("rate-overlimit")) return
if (e.includes("Connection Closed")) return
if (e.includes("Timed Out")) return
if (e.includes("Value not found")) return
console.log('Caught exception: ', err)
})
