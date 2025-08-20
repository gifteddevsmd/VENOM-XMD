const axios = require('axios');

let daveplug = async (m, { daveshown, text, dave, reply, isBotAdmins, isAdmins, prefix, command }) => {
    if (!m.isGroup) return reply(mess.group);
    if (!daveshown && !isAdmins) return reply(mess.admin);

    if (!m.quoted && !m.mentionedJid[0] && isNaN(parseInt(text))) {
        return reply(`💠 Example: ${prefix + command} target`);
    }

    let users = m.mentionedJid[0] 
        ? m.mentionedJid[0] 
        : m.quoted 
        ? m.quoted.sender 
        : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';

    if (owner.includes(users.replace('@s.whatsapp.net', ''))) {
        return reply('💠 My Owner, I cannot kick them');
    }

    try {
        await dave.groupParticipantsUpdate(m.chat, [users], 'remove');
        reply('💠 Success');
    } catch (err) {
        console.error(err);
        reply('💠 An error occurred');
    }
};

daveplug.help = ['kik'];
daveplug.tags = ['kick'];
daveplug.command = ['remove'];

module.exports = daveplug;		
			