// fixed-index.js
const fs = require('fs');
const pino = require('pino');
const path = require('path');
const chalk = require('chalk');
const {
  default: makeWASocket,
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
  fetchLatestBaileysVersion,
  makeInMemoryStore,
  downloadContentFromMessage,
  jidDecode
} = require('@whiskeysockets/baileys');

const handleCommand = require('./dave');
const config = require('./config');
const { loadSettings } = require('./davesettingmanager');
global.settings = loadSettings();

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

const sessionDir = path.join(__dirname, 'session');
const credsPath = path.join(sessionDir, 'creds.json');

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
    // ensure session dir exists
    await fs.promises.mkdir(sessionDir, { recursive: true });

    const store = makeInMemoryStore({ logger: pino().child({ level: 'silent' }) });
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const { version } = await fetchLatestBaileysVersion();

    const venom = makeWASocket({
      version,
      keepAliveIntervalMs: 10000,
      printQRInTerminal: false,
      logger: pino({ level: 'silent' }),
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(
          state.keys,
          pino({ level: 'silent' }).child({ level: 'silent' })
        )
      },
      browser: ["Ubuntu", "Chrome", "20.0.00"],
      syncFullHistory: true
    });

    venom.ev.on('creds.update', saveCreds);
    store.bind(venom.ev);

    // If not registered and no SESSION_ID, *don't* block on readline in non-interactive envs
    if (!venom.authState.creds.registered && (!config.SESSION_ID || config.SESSION_ID === "")) {
      if (process.stdin.isTTY) {
        // interactive environment: ask for number and pair
        try {
          const readline = require('readline');
          const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
          const phoneNumber = await new Promise(resolve => {
            rl.question(chalk.yellowBright("[ = ] Enter the WhatsApp number you want to use as a bot (with country code):\n"), ans => {
              rl.close();
              resolve(ans.trim());
            });
          });
          const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
          console.clear();
          const pairCode = await venom.requestPairingCode(cleanNumber);
          log.info(`Enter this code on your phone to pair: ${chalk.green(pairCode)}`);
          log.info("Wait a few seconds and approve the pairing on your phone...");
        } catch (err) {
          console.error("Pairing prompt failed:", err);
        }
      } else {
        // non-interactive host (Heroku): inform user to set SESSION_ID env var
        console.error(chalk.redBright("No session found and no interactive terminal available. Set config.SESSION_ID in your environment to pair automatically."));
      }
    }

    // utility: download media to buffer
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

    // ONE-TIME event handlers (moved outside per-message processing)
    venom.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
      try {
        if (connection === 'close') {
          const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== 401;
          log.error('Connection closed.');
          if (shouldReconnect) {
            log.info('Reconnecting in 5 seconds...');
            setTimeout(() => startvenom(), 5000);
          }
        } else if (connection === 'open') {
          const botNumber = venom.user.id.split("@")[0];
          log.success(`Bot connected as ${chalk.green(botNumber)}`);

          // send DM + audio to bot number
          setTimeout(async () => {
            try {
              const axios = require("axios");
              const ownerJid = `${botNumber}@s.whatsapp.net`;
              const message = `
*>> DAVE-AI <<*

*>> Connected:* 
*>> Developer:* GIFTED DAVE
*>> Version:* 2.0.0
*>> Number:* ${botNumber}
`;

              await venom.sendMessage(ownerJid, { text: message });
              const audioUrl = "https://files.catbox.moe/coej4a.mp3";
              const { data } = await axios.get(audioUrl, { responseType: "arraybuffer" });
              await venom.sendMessage(ownerJid, {
                audio: Buffer.from(data),
                mimetype: "audio/mpeg",
                ptt: false
              });
              console.log(chalk.green(' Sent DM + Audio from URL to paired number'));
            } catch (err) {
              console.log(chalk.red(` Failed to send DM or Audio: ${err}`));
            }
          }, 2000);

          // auto-follow newsletter (safe try/catch)
          try {
            await venom.newsletterFollow('120363400480173280@newsletter');
            console.log(chalk.green(' Auto-followed channel successfully'));
          } catch (e) {
            console.log(chalk.red(` Failed to follow channel: ${e.message || e}`));
          }

          // auto-join group (safe)
          try {
            await venom.groupAcceptInvite('LfTFxkUQ1H7Eg2D0vR3n6g');
            console.log(chalk.green(' Auto-joined WhatsApp group successfully'));
          } catch (e) {
            console.log(chalk.red(` Failed to join WhatsApp group: ${e.message || e}`));
          }

          venom.public = true;

          // init AntiDelete once
          try {
            const initAntiDelete = require('./antiDelete');
            const botNumberJid = venom.user.id.split(':')[0] + '@s.whatsapp.net';
            initAntiDelete(venom, {
              botNumber: botNumberJid,
              dbPath: './davelib/antidelete.json',
              enabled: true
            });
            console.log(` AntiDelete active and sending deleted messages to ${botNumberJid}`);
          } catch (error) {
            console.error('AntiDelete initialization failed:', error);
          }
        }
      } catch (error) {
        console.error('Connection update error:', error);
      }
    });

    // GROUP PARTICIPANT HANDLERS (registered once)
    venom.ev.on('group-participants.update', async (update) => {
      try {
        const { id, participants, action } = update;
        // welcome/goodbye toggles
        try {
          const welcomePath = './davelib/welcome.json';
          let toggleData = {};
          if (fs.existsSync(welcomePath)) toggleData = JSON.parse(fs.readFileSync(welcomePath));
          if (!toggleData[id]) return;
          const groupMetadata = await venom.groupMetadata(id);
          const groupName = groupMetadata.subject;
          for (const user of participants) {
            if (action === 'add') {
              const ppUrl = await venom.profilePictureUrl(user, 'image').catch(() => 'https://files.catbox.moe/xr70w7.jpg');
              const name = (await venom.onWhatsApp(user))[0]?.notify || user.split('@')[0];
              await venom.sendMessage(id, {
                image: { url: ppUrl },
                caption: ` *Welcome @${user.split('@')[0]}!*\n Glad to have you in *${groupName}*!`,
                contextInfo: { mentionedJid: [user] }
              });
            }
          }
        } catch (e) {
          // ignore per-group welcome errors
        }

        try {
          const goodbyePath = './davelib/goodbye.json';
          let toggleData = {};
          if (fs.existsSync(goodbyePath)) toggleData = JSON.parse(fs.readFileSync(goodbyePath));
          if (!toggleData[id]) return;
          const groupMetadata = await venom.groupMetadata(id);
          const groupName = groupMetadata.subject;
          for (const user of participants) {
            if (action === 'remove') {
              const ppUrl = await venom.profilePictureUrl(user, 'image').catch(() => 'https://files.catbox.moe/xr70w7.jpg');
              const name = (await venom.onWhatsApp(user))[0]?.notify || user.split('@')[0];
              await venom.sendMessage(id, {
                image: { url: ppUrl },
                caption: ` *${name}* (@${user.split('@')[0]}) has left *${groupName}*.\n We'll miss you!`,
                contextInfo: { mentionedJid: [user] }
              });
            }
          }
        } catch (e) {
          // ignore per-group goodbye errors
        }

        // anti-promote/anti-demote
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

    // SINGLE messages.upsert handler (no nested registration)
    venom.ev.on('messages.upsert', async ({ messages }) => {
      try {
        const m = messages[0];
        if (!m || !m.message) return;
        if (m.key && m.key.remoteJid === 'status@broadcast') {
          if (config.STATUS_VIEW) {
            await venom.readMessages([m.key]).catch(() => {});
          }
          return;
        }

        // Auto presence / read only for private chats (as before)
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

        // normalize and guard
        const isGroup = (from || "").endsWith('@g.us');
        const sender = m.key.participant || m.sender || from;
        if (m.key.fromMe) return; // ignore own messages

        // get message text (safe)
        let body =
          m.message.conversation ||
          m.message.extendedTextMessage?.text ||
          m.message.imageMessage?.caption ||
          m.message.videoMessage?.caption ||
          m.message.documentMessage?.caption || '';
        body = (body || '').trim();
        if (!body) return;

        // prefix handling
        const prefixSettingsPath = './davelib/prefixSettings.json';
        let prefixSettings = fs.existsSync(prefixSettingsPath)
          ? JSON.parse(fs.readFileSync(prefixSettingsPath, 'utf8'))
          : { prefix: '.', defaultPrefix: '.' };
        let prefix = prefixSettings.prefix || '';

        if (prefix !== '' && !body.startsWith(prefix)) return;
        const bodyWithoutPrefix = prefix === '' ? body : body.slice(prefix.length);
        const args = bodyWithoutPrefix.trim().split(/ +/);
        const command = args.shift().toLowerCase();

        // group metadata (if group)
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

        // pass to command handler
        await handleCommand(venom, wrappedMsg, command, args, isGroup, isAdmin, groupAdmins, groupMeta, jidDecode, config);

        // group stats saving (as before)
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

    log.success('WhatsApp bot started successfully!');
    return venom;
  } catch (error) {
    console.error('Failed to start WhatsApp bot:', error);
    setTimeout(() => startvenom(), 10000);
  }
}

async function tylor() {
  try {
    await fs.promises.mkdir(sessionDir, { recursive: true });

    if (fs.existsSync(credsPath)) {
      console.log(chalk.yellowBright("Existing session found. Starting bot without pairing..."));
      await startvenom();
      return;
    }

    if (config.SESSION_ID && config.SESSION_ID.includes("dave~")) {
      const ok = await saveSessionFromConfig();
      if (ok) {
        console.log(chalk.greenBright("Session ID loaded and saved successfully. Starting bot..."));
        await startvenom();
        return;
      } else {
        console.log(chalk.redBright("SESSION_ID found but failed to save it. Falling back to pairing..."));
      }
    }

    console.log(chalk.redBright("No valid session found! If running on Heroku or other non-interactive host, set SESSION_ID in config to avoid pairing prompt."));
    // If running interactively, startvenom will prompt for pairing; otherwise it will log the message above.
    await startvenom();

  } catch (error) {
    console.error(chalk.red("Error initializing session:"), error);
    setTimeout(() => tylor(), 10000);
  }
}

tylor();