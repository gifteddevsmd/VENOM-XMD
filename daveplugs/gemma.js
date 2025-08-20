const axios = require('axios');

let daveplug = async (m, { command, text, dave }) => {
    if (!text) {
        await dave.sendMessage(m.chat, { text: '💠 Example: .gemma you good?' }, { quoted: m });
        return;
    }

    await dave.sendMessage(m.chat, { react: { text: '💠', key: m.key } });

    try {
        const res = await fetch(`https://www.velyn.biz.id/api/ai/gemma-2-9b-it?prompt=${encodeURIComponent(text)}`);
        if (res.ok) {
            const json = await res.json();
            if (json.status) {
                await dave.sendMessage(m.chat, { text: `💠 ${json.data}` }, { quoted: m });
                await dave.sendMessage(m.chat, { react: { text: '💠', key: m.key } });
            } else {
                await dave.sendMessage(m.chat, { text: '💠 Failed to fetch data from API.' }, { quoted: m });
                await dave.sendMessage(m.chat, { react: { text: '💠', key: m.key } });
            }
        } else {
            await dave.sendMessage(m.chat, { text: `💠 Status error: ${res.status}` }, { quoted: m });
            await dave.sendMessage(m.chat, { react: { text: '💠', key: m.key } });
        }
    } catch (e) {
        await dave.sendMessage(m.chat, { text: '💠 An error has occurred.' }, { quoted: m });
        await dave.sendMessage(m.chat, { react: { text: '💠', key: m.key } });
        console.error(e);
    }
};

daveplug.help = ['gemmachat'];
daveplug.tags = ['gemmagpt'];
daveplug.command = ['gemma'];

module.exports = daveplug;