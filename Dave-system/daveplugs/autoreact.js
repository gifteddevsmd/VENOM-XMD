const axios = require('axios');

let daveplug = async (m, { dave, daveshown, reply, text }) => {
    if (!daveshown) return reply('💠 ' + mess.owner); 

    // Parse command for 'on' or 'off'
    const args = text.trim().split(' ')[0];
    if (!args || !["on", "off"].includes(args)) {
        return reply('💠 USE: *autoreact on* OR *autoreact off*');
    }

    if (!global.autoReact) global.autoReact = {};

    // Set auto-react status based on command
    if (args === "on") {
        global.autoReact[m.chat] = true;
        return reply('💠 Autoreact enabled ✅');
    } else if (args === "off") {
        global.autoReact[m.chat] = false;
        return reply('💠 Autoreact is off ❌');
    }
};

daveplug.command = ['autoreact'];
daveplug.tags = ['autoreact'];
daveplug.help = ['autoreact'];

module.exports = daveplug;