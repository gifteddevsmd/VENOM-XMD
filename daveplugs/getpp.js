const axios = require("axios");

let daveplug = async (m, { daveshown, dave, q, reply }) => {
    if (!daveshown) return reply(mess.owner);

    let target;

    // Check if mention exists
    if (m.mentionedJid && m.mentionedJid.length > 0) {
        target = m.mentionedJid[0];
    } else if (m.quoted && m.quoted.sender) {
        target = m.quoted.sender;
    } else if (q) {
        const nomor = q.replace(/[^0-9]/g, '');
        target = nomor + '@s.whatsapp.net';
    } else {
        return m.reply(`💠 Example: .getpp 254xxx / @tag`);
    }

    try {
        const pp = await dave.profilePictureUrl(target, 'image').catch(() => null);
        if (!pp) return m.reply(`💠 Profile picture is hidden/private.`);
        await dave.sendMessage(m.chat, {
            image: { url: pp },
            caption: `💠 Success: ${target.split('@')[0]}`
        }, { quoted: m });
    } catch (err) {
        console.log(err);
        m.reply(`💠 An error has occurred.`);
    }
};

daveplug.help = ['getdp'];
daveplug.tags = ['dp'];
daveplug.command = ['getpp'];

module.exports = daveplug;