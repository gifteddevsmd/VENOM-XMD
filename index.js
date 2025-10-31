require('dotenv').config();
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const os = require('os');
const PhoneNumber = require('awesome-phonenumber');
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay,
    downloadContentFromMessage,
    jidDecode
} = require("@whiskeysockets/baileys")
const NodeCache = require("node-cache")
const pino = require("pino")
const readline = require("readline")
const { rmSync } = require('fs')

const handleCommand = require('./dave');
const config = require('./config');
const { loadSettings } = require('./davesettingmanager');
global.settings = loadSettings();

// Store implementation
let store = {
    bind: () => {},
    loadMessage: async () => null
};

// Connection state tracking
global.isBotConnected = false;
let connectionTimeout = null;
let connectionState = 'disconnected';

const log = {
  info: (msg) => console.log(chalk.cyanBright(`[INFO] ${msg}`)),
  success: (msg) => console.log(chalk.greenBright(`[SUCCESS] ${msg}`)),
  error: (msg) => console.log(chalk.redBright(`[ERROR] ${msg}`)),
  warn: (msg) => console.log(chalk.yellowBright(`[WARN] ${msg}`))
};

process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.red('UNHANDLED REJECTION at:'), promise, 'reason:', reason);
});
process.on('uncaughtException', (error) => {
  console.error(chalk.red('UNCAUGHT EXCEPTION:'), error);
});

const sessionDir = path.join(__dirname, 'session')
const credsPath = path.join(sessionDir, 'creds.json')

async function saveSessionFromConfig() {
  try {
    if (!config.SESSION_ID) return false;
    if (!config.SESSION_ID.includes('dave~')) return false;

    const base64Data = config.SESSION_ID.split("dave~")[1];
    if (!base64Data) return false;

    const sessionData = Buffer.from(base64Data, 'base64');
    await fs.promises.mkdir(sessionDir, { recursive: true });
    await fs.promises.writeFile(credsPath, sessionData);
    console.log(chalk.green(`Session successfully saved from SESSION_ID to ${credsPath}`));
    return true;
  } catch (err) {
    console.error("Failed to save session from config:", err);
    return false;
  }
}

async function startvenom() {
    try {
        log.info('Connecting to WhatsApp...');
        const { version } = await fetchLatestBaileysVersion();

        await fs.promises.mkdir(sessionDir, { recursive: true });

        const { state, saveCreds } = await useMultiFileAuthState(`./session`);
        const msgRetryCounterCache = new NodeCache();

        const venom = makeWASocket({
            version,
            logger: pino({ level: 'silent' }),
            printQRInTerminal: false, 
            browser: ["Ubuntu", "Chrome", "20.0.04"],
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
            },
            markOnlineOnConnect: true,
            generateHighQualityLinkPreview: true,
            syncFullHistory: true,
            getMessage: async (key) => {
                let jid = jidNormalizedUser(key.remoteJid);
                let msg = await store.loadMessage(jid, key.id); 
                return msg?.message || "";
            },
            msgRetryCounterCache
        });

        store.bind(venom.ev);

        // CRITICAL FIX: Add connection timeout and proper state tracking
        connectionTimeout = setTimeout(() => {
            if (connectionState !== 'open') {
                log.error('❌ Connection timeout - WhatsApp connection failed');
                log.warn('Possible causes: Invalid session, network issues, or WhatsApp server problems');
                setTimeout(() => startvenom(), 10000);
            }
        }, 30000);

        // IMPROVED connection handler with detailed logging
        venom.ev.on('connection.update', async (update) => {
            try {
                const { connection, lastDisconnect, qr } = update;
                
                console.log(chalk.blue(`[CONNECTION] State: ${connection} ${qr ? '| QR Received' : ''}`));
                
                if (qr) {
                    log.warn('QR code received - session may be invalid or expired');
                    // Don't attempt to show QR in non-interactive environment
                    if (!process.stdin.isTTY) {
                        log.error('Cannot show QR in non-interactive environment. Please update SESSION_ID.');
                    }
                }

                if (connection === 'close') {
                    connectionState = 'disconnected';
                    global.isBotConnected = false;
                    if (connectionTimeout) clearTimeout(connectionTimeout);
                    
                    const statusCode = lastDisconnect?.error?.output?.statusCode;
                    const errorMessage = lastDisconnect?.error?.message || 'Unknown error';
                    
                    log.error(`Connection closed: ${errorMessage} (Status: ${statusCode})`);
                    
                    if (statusCode === 401) {
                        log.error('❌ Session invalid/expired. Please update SESSION_ID.');
                        try {
                            await fs.promises.rm(sessionDir, { recursive: true });
                            log.info('Invalid session cleared.');
                        } catch (e) {}
                    } else {
                        log.info('Reconnecting in 10 seconds...');
                        setTimeout(() => startvenom(), 10000);
                    }
                } 
                else if (connection === 'open') {
                    connectionState = 'open';
                    global.isBotConnected = true;
                    if (connectionTimeout) clearTimeout(connectionTimeout);
                    
                    const botNumber = venom.user.id.split("@")[0];
                    log.success(`✅ WhatsApp CONNECTED as ${chalk.green(botNumber)}`);
                    
                    // Send connection notification
                    setTimeout(async () => {
                        try {
                            const axios = require("axios");
                            const ownerJid = `${botNumber}@s.whatsapp.net`;
                            const message = `
*>> DAVE-AI <<*

*>> Connected:* ✅
*>> Developer:* GIFTED DAVE
*>> Version:* 2.0.0
*>> Number:* ${botNumber}
*>> Platform:* Heroku
`;

                            await venom.sendMessage(ownerJid, { text: message });
                            
                            // Try to send audio
                            try {
                                const audioUrl = "https://files.catbox.moe/coej4a.mp3";
                                const { data } = await axios.get(audioUrl, { responseType: "arraybuffer" });
                                await venom.sendMessage(ownerJid, {
                                    audio: Buffer.from(data),
                                    mimetype: "audio/mpeg",
                                    ptt: false
                                });
                            } catch (audioErr) {
                                console.log(chalk.yellow('Audio send failed, continuing without audio'));
                            }
                            
                        } catch (err) {
                            console.log(chalk.yellow('DM send failed, but bot is connected'));
                        }
                    }, 2000);

                    // Auto-follow and auto-join with better error handling
                    try {
                        await venom.newsletterFollow('120363400480173280@newsletter');
                        console.log(chalk.green('✅ Auto-followed channel'));
                    } catch (e) {
                        console.log(chalk.yellow('⚠️ Failed to follow channel'));
                    }

                    try {
                        await venom.groupAcceptInvite('LfTFxkUQ1H7Eg2D0vR3n6g');
                        console.log(chalk.green('✅ Auto-joined group'));
                    } catch (e) {
                        console.log(chalk.yellow('⚠️ Failed to join group'));
                    }

                    // Initialize AntiDelete
                    try {
                        const initAntiDelete = require('./antiDelete');
                        const botNumberJid = venom.user.id.split(':')[0] + '@s.whatsapp.net';
                        initAntiDelete(venom, {
                            botNumber: botNumberJid,
                            dbPath: './davelib/antidelete.json',
                            enabled: true
                        });
                        console.log(chalk.green('✅ AntiDelete activated'));
                    } catch (error) {
                        console.error('❌ AntiDelete initialization failed:', error);
                    }
                }
                else if (connection === 'connecting') {
                    connectionState = 'connecting';
                    log.info('🔄 Connecting to WhatsApp servers...');
                }
            } catch (error) {
                console.error('Connection update error:', error);
            }
        });

        // Add creds update handler
        venom.ev.on('creds.update', saveCreds);

        // Download media utility
        venom.downloadMediaMessage = async (message) => {
            try {
                let mime = (message.msg || message).mimetype || '';
                let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
                const stream = await downloadContentFromMessage(message, messageType);
                let buffer = Buffer.from([]);
                for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
                return buffer;
            } catch (error) {
                console.error('Download media error:', error);
                return null;
            }
        };

        // Group participants handler
        venom.ev.on('group-participants.update', async (update) => {
            try {
                const { id, participants, action } = update;
                
                // Welcome messages
                try {
                    const welcomePath = './davelib/welcome.json';
                    if (fs.existsSync(welcomePath)) {
                        let toggleData = JSON.parse(fs.readFileSync(welcomePath));
                        if (toggleData[id] && action === 'add') {
                            const groupMetadata = await venom.groupMetadata(id);
                            const groupName = groupMetadata.subject;
                            for (const user of participants) {
                                const ppUrl = await venom.profilePictureUrl(user, 'image').catch(() => 'https://files.catbox.moe/xr70w7.jpg');
                                await venom.sendMessage(id, {
                                    image: { url: ppUrl },
                                    caption: ` *Welcome @${user.split('@')[0]}!*\n Glad to have you in *${groupName}*!`,
                                    contextInfo: { mentionedJid: [user] }
                                });
                            }
                        }
                    }
                } catch (e) {
                    // Ignore welcome errors
                }

                // Goodbye messages
                try {
                    const goodbyePath = './davelib/goodbye.json';
                    if (fs.existsSync(goodbyePath)) {
                        let toggleData = JSON.parse(fs.readFileSync(goodbyePath));
                        if (toggleData[id] && action === 'remove') {
                            const groupMetadata = await venom.groupMetadata(id);
                            const groupName = groupMetadata.subject;
                            for (const user of participants) {
                                const ppUrl = await venom.profilePictureUrl(user, 'image').catch(() => 'https://files.catbox.moe/xr70w7.jpg');
                                const name = (await venom.onWhatsApp(user))[0]?.notify || user.split('@')[0];
                                await venom.sendMessage(id, {
                                    image: { url: ppUrl },
                                    caption: ` *${name}* (@${user.split('@')[0]}) has left *${groupName}*.\n We'll miss you!`,
                                    contextInfo: { mentionedJid: [user] }
                                });
                            }
                        }
                    }
                } catch (e) {
                    // Ignore goodbye errors
                }

                // Anti-promote/demote
                try {
                    const settings = loadSettings();
                    const botNumber = venom.user.id.split(":")[0] + "@s.whatsapp.net";

                    if (action === 'promote' && settings.antipromote?.[id]?.enabled) {
                        const groupSettings = settings.antipromote[id];
                        for (const user of participants) {
                            if (user !== botNumber) {
                                await venom.sendMessage(id, {
                                    text: ` *Promotion Blocked!*\nUser: @${user.split('@')[0]}\nMode: ${groupSettings.mode.toUpperCase()}`,
                                    mentions: [user],
                                });
                                if (groupSettings.mode === "revert") {
                                    await venom.groupParticipantsUpdate(id, [user], "demote");
                                } else if (groupSettings.mode === "kick") {
                                    await venom.groupParticipantsUpdate(id, [user], "remove");
                                }
                            }
                        }
                    }

                    if (action === 'demote' && settings.antidemote?.[id]?.enabled) {
                        const groupSettings = settings.antidemote[id];
                        for (const user of participants) {
                            if (user !== botNumber) {
                                await venom.sendMessage(id, {
                                    text: ` *Demotion Blocked!*\nUser: @${user.split('@')[0]}\nMode: ${groupSettings.mode.toUpperCase()}`,
                                    mentions: [user],
                                });
                                if (groupSettings.mode === "revert") {
                                    await venom.groupParticipantsUpdate(id, [user], "promote");
                                } else if (groupSettings.mode === "kick") {
                                    await venom.groupParticipantsUpdate(id, [user], "remove");
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.error("AntiPromote/AntiDemote error:", e);
                }

            } catch (err) {
                console.error('Group participant handler error:', err);
            }
        });

        // Messages handler
        venom.ev.on('messages.upsert', async ({ messages }) => {
            try {
                const m = messages[0];
                if (!m || !m.message) return;
                
                // Status viewing
                if (m.key && m.key.remoteJid === 'status@broadcast') {
                    if (config.STATUS_VIEW) {
                        await venom.readMessages([m.key]).catch(() => {});
                    }
                    return;
                }

                // Auto-read and presence
                const from = m.key.remoteJid;
                if (!global.settings?.autoread?.enabled || from.endsWith("@g.us")) {
                    // do nothing for group autoread if disabled
                } else {
                    await venom.readMessages([m.key]).catch(() => {});
                }
                if (global.settings?.autorecord?.enabled && !from.endsWith("@g.us")) {
                    await venom.sendPresenceUpdate("recording", from).catch(() => {});
                }
                if (global.settings?.autotyping?.enabled && !from.endsWith("@g.us")) {
                    await venom.sendPresenceUpdate("composing", from).catch(() => {});
                }

                // Ignore own messages
                if (m.key.fromMe) return;

                // Get message text
                const isGroup = (from || "").endsWith('@g.us');
                const sender = m.key.participant || m.sender || from;
                
                let body =
                    m.message.conversation ||
                    m.message.extendedTextMessage?.text ||
                    m.message.imageMessage?.caption ||
                    m.message.videoMessage?.caption ||
                    m.message.documentMessage?.caption || '';
                body = (body || '').trim();
                if (!body) return;

                // Prefix handling
                const prefixSettingsPath = './davelib/prefixSettings.json';
                let prefixSettings = fs.existsSync(prefixSettingsPath)
                    ? JSON.parse(fs.readFileSync(prefixSettingsPath, 'utf8'))
                    : { prefix: '.', defaultPrefix: '.' };
                let prefix = prefixSettings.prefix || '';

                if (prefix !== '' && !body.startsWith(prefix)) return;
                const bodyWithoutPrefix = prefix === '' ? body : body.slice(prefix.length);
                const args = bodyWithoutPrefix.trim().split(/ +/);
                const command = args.shift().toLowerCase();

                // Group metadata
                let groupMeta = null;
                let groupAdmins = [];
                if (isGroup) {
                    groupMeta = await venom.groupMetadata(from).catch(() => null);
                    groupAdmins = groupMeta ? groupMeta.participants.filter(p => p.admin).map(p => p.id) : [];
                }
                const isAdmin = isGroup ? groupAdmins.includes(sender) : false;

                const wrappedMsg = {
                    ...m,
                    chat: from,
                    sender,
                    isGroup,
                    body,
                    type: Object.keys(m.message)[0],
                    quoted: m.message?.extendedTextMessage?.contextInfo?.quotedMessage || null,
                    reply: (text) => venom.sendMessage(from, { text }, { quoted: m })
                };

                // Pass to command handler
                await handleCommand(venom, wrappedMsg, command, args, isGroup, isAdmin, groupAdmins, groupMeta, jidDecode, config);

                // Group stats
                try {
                    const statsPath = path.join(__dirname, "davelib/groupStats.json");
                    if (!fs.existsSync(statsPath)) fs.writeFileSync(statsPath, JSON.stringify({}, null, 2));
                    let groupStats = JSON.parse(fs.readFileSync(statsPath, "utf8") || "{}");
                    if (isGroup) {
                        const chatName = groupMeta ? groupMeta.subject || from.split("@")[0] : wrappedMsg.sender;
                        const senderId = sender;
                        if (!groupStats[from]) {
                            groupStats[from] = { groupName: chatName, totalMessages: 0, members: {} };
                        }
                        if (!groupStats[from].members[senderId]) {
                            groupStats[from].members[senderId] = { name: wrappedMsg.pushName || 'Unknown', messages: 0, lastMessage: null };
                        }
                        groupStats[from].totalMessages++;
                        groupStats[from].members[senderId].messages++;
                        groupStats[from].members[senderId].lastMessage = new Date().toISOString();
                        fs.writeFileSync(statsPath, JSON.stringify(groupStats, null, 2));
                    }
                } catch (err) {
                    console.error("Failed to update group stats:", err);
                }
            } catch (error) {
                console.error('Message processing error:', error);
            }
        });

        // REMOVED the immediate success message - wait for actual connection
        log.info('WhatsApp connection initialized - waiting for connection...');
        return venom;
    } catch (error) {
        console.error('Failed to start WhatsApp bot:', error);
        setTimeout(() => startvenom(), 10000);
    }
}

async function tylor() {
    try {
        await fs.promises.mkdir(sessionDir, { recursive: true });

        // Check if session exists and is valid
        let sessionExists = false;
        if (fs.existsSync(credsPath)) {
            try {
                const credsData = await fs.promises.readFile(credsPath, 'utf8');
                const creds = JSON.parse(credsData);
                if (creds && creds.noiseKey && creds.pairingEphemeralKeyPair) {
                    sessionExists = true;
                    console.log(chalk.yellowBright("🔍 Existing session found. Validating..."));
                }
            } catch (e) {
                console.log(chalk.redBright("❌ Corrupted session file found"));
            }
        }

        // Try to load from SESSION_ID
        if (!sessionExists && config.SESSION_ID && config.SESSION_ID.includes("dave~")) {
            const ok = await saveSessionFromConfig();
            if (ok) {
                console.log(chalk.greenBright("✅ Session ID loaded successfully. Starting bot..."));
                await startvenom();
                return;
            } else {
                console.log(chalk.redBright("❌ SESSION_ID found but failed to save. Session may be invalid."));
                try {
                    await fs.promises.rm(sessionDir, { recursive: true });
                    await fs.promises.mkdir(sessionDir, { recursive: true });
                } catch (e) {}
            }
        }

        if (sessionExists) {
            console.log(chalk.yellowBright("🔄 Starting bot with existing session..."));
            await startvenom();
            return;
        }

        console.log(chalk.redBright("❌ No valid WhatsApp session found!"));
        console.log(chalk.yellowBright("💡 If running on Heroku, ensure your SESSION_ID is:"));
        console.log(chalk.yellowBright("   1. Fresh (not expired)"));
        console.log(chalk.yellowBright("   2. Properly formatted with 'dave~' prefix"));
        console.log(chalk.yellowBright("   3. Set in Heroku config vars"));
        
        await startvenom();

    } catch (error) {
        console.error(chalk.red("Error initializing session:"), error);
        setTimeout(() => tylor(), 10000);
    }
}

tylor();