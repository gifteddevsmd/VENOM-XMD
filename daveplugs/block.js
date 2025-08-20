const axios = require('axios');

let daveplug = async (m, { daveshown, text, dave, reply }) => {
    if (!daveshown) return reply('💠 ' + mess.owner);
    if (!m.quoted && !m.mentionedJid) return reply('💠 Tag someone or reply to a message');

    let user = m.mentionedJid?.[0] || m.quoted?.sender || text.replace(/\D/g, '') + '@s.whatsapp.net';

    if (user === '254756182478@s.whatsapp.net') return reply('💠 I cannot block my Owner');
    if (user === dave.decodeJid(dave.user.id)) return reply('💠 I cannot block myself 😡');

    await dave.updateBlockStatus(user, 'block');
    reply(`💠 Blocked successfully!`);
};

daveplug.help = ['restrict'];
daveplug.tags = ['ban'];
daveplug.command = ['block'];

module.exports = daveplug;