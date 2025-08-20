const axios = require('axios');

let daveplug = async (m, { example, dave, reply, downloadContentFromMessage }) => {
    if (!m.quoted) return reply("💠 Tag a view-once media");

    let msg = m.quoted.message;
    let type = Object.keys(msg)[0];

    if (!msg[type].viewOnce) return reply("💠 This is not a view-once message!");

    let media = await downloadContentFromMessage(
        msg[type],
        type === 'imageMessage' ? 'image' : type === 'videoMessage' ? 'video' : 'audio'
    );

    let buffer = Buffer.from([]);
    for await (const chunk of media) {
        buffer = Buffer.concat([buffer, chunk]);
    }

    if (/video/.test(type)) {
        return dave.sendMessage(m.chat, { video: buffer, caption: msg[type].caption || "" }, { quoted: m });
    } else if (/image/.test(type)) {
        return dave.sendMessage(m.chat, { image: buffer, caption: msg[type].caption || "" }, { quoted: m });
    } else if (/audio/.test(type)) {
        return dave.sendMessage(m.chat, { audio: buffer, mimetype: "audio/mpeg", ptt: true }, { quoted: m });
    } 
};

daveplug.help = ['vv'];
daveplug.tags = ['openmedia'];
daveplug.command = ['retrieve'];

module.exports = daveplug;