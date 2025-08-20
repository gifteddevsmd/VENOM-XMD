const axios = require("axios");
const fetch = require('node-fetch');

let daveplug = async (m, { text, reply, dave, prefix, command }) => {
    if (!text) return reply(`💠 Example: ${prefix + command} link`);
    if (!text.includes('tiktok')) return reply('💠 Link Invalid!!');
    reply('💠 Please wait...');

    fetch(`https://api.tiklydown.eu.org/api/download/v5?url=${encodeURIComponent(text)}`)
        .then(response => response.json())
        .then(data => {
            if (data.status !== 200) return reply('💠 API error');

            const title = `*Downloaded by ${global.botname}*`;
            const videoUrl = data.result.play;
            const audioUrl = data.result.music;

            dave.sendMessage(m.chat, { caption: title, video: { url: videoUrl } }, { quoted: m });
            dave.sendMessage(m.chat, { audio: { url: audioUrl }, mimetype: 'audio/mp4' }, { quoted: null });
        })
        .catch(err => reply('💠 ' + err.toString()));
};

daveplug.help = ['tt'];
daveplug.tags = ['tiktok'];
daveplug.command = ['tt'];

module.exports = daveplug;