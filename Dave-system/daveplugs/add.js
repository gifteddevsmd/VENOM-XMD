const axios = require('axios');

let daveplug = async (m, {command, prefix, isAdmins, daveshown, reply, text, dave }) => {
    if (!m.isGroup) return reply(mess.group);
    if (!isAdmins && !daveshown) return reply(mess.admin);

    if (!text && !m.quoted) {
        reply(`_Example :_\n\n ${prefix + command} 254xxx`);
    } else {
        const numbersOnly = text ? text.replace(/\D/g, '') + '@s.whatsapp.net' : m.quoted?.sender;
        try {
            await dave.groupParticipantsUpdate(m.chat, [numbersOnly], 'add')
                .then(async (res) => {
                    for (let i of res) {
                        let invv = await dave.groupInviteCode(m.chat);

                        if (i.status == 408) return reply(`💠 _[ Error ]_ User already added in the group`);
                        if (i.status == 401) return reply(`💠 _[ Error ]_ Bot blocked User`);
                        if (i.status == 409) return reply(`💠 _[ Report ]_ User has left the group recently`);
                        if (i.status == 500) return reply(`💠 _[ Invalid ]_ try again later`);

                        if (i.status == 403) {
                            await dave.sendMessage(m.chat, { 
                                text: `@${numbersOnly.split('@')[0]} Target cannot be added because the account is private. An invitation will be sent to the private chat`, 
                                mentions: [numbersOnly] 
                            }, { quoted: m });

                            await dave.sendMessage(`${numbersOnly ? numbersOnly : creator}`, { 
                                text: `${'https://chat.whatsapp.com/' + invv}\n━━━━━━━━━━━━━━━━━━━━━\n\nAdmin: wa.me/${m.sender}\nyou have been invited to this group`, 
                                detectLink: true, 
                                mentions: [numbersOnly] 
                            }, { quoted: floc2 }).catch((err) => reply('💠 failed to send invitation!'));
                        } else {
                            reply(mess.succes);
                        }
                    }
                });
        } catch (e) {
            reply('💠 couldnt add user!');
        }
    }
};

daveplug.help = ['add'];
daveplug.tags = ['add'];
daveplug.command = ['add'];

module.exports = daveplug;