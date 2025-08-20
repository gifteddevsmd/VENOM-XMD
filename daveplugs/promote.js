const axios = require('axios');

let daveplug = async (m, { daveshown, text, dave, reply, isAdmins, prefix, command }) => {
    if (!m.isGroup) return reply(mess.group);
    if (!daveshown && !isAdmins) return reply(mess.admin);
    if (!text) return reply(`*Example :* ${prefix + command} target`);

    let users = m.mentionedJid[0]
        ? m.mentionedJid[0]
        : m.quoted
        ? m.quoted.sender
        : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';

    if (!m.mentionedJid[0] && !m.quoted && !text) return reply(`*Example :* ${prefix + command} target`);

    try {
        await dave.groupParticipantsUpdate(m.chat, [users], 'demote');
        reply('💠 Successfully demoted the user!');
    } catch (err) {
        console.error(err);
        reply('💠 Failed to demote the user!');
    }
};

daveplug.help = ['dismiss'];
daveplug.tags = ['demote'];
daveplug.command = ['demote'];

module.exports = daveplug;