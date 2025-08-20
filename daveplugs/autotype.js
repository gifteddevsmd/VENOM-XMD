const axios = require('axios');

let daveplug = async (m, { command, prefix, q, daveshown, reply, text, args }) => {
    if (!daveshown) return reply('💠 ' + mess.owner);
    if (args.length < 1) return reply(`💠 Example: ${prefix + command} on/off`);

    if (q === 'on') {
        global.autoTyping = true;
        reply(`💠 Autotyping presence is now set to ${q}`);
    } else if (q === 'off') {
        global.autoTyping = false;
        reply(`💠 Autotyping presence is now set to ${q}`);
    }
};

daveplug.help = ['autotypes'];
daveplug.tags = ['autotyping'];
daveplug.command = ['autotype'];

module.exports = daveplug;