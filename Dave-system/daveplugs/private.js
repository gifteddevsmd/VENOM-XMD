const axios = require("axios");

let daveplug = async (m, { daveshown, reply, dave }) => {
    if (!daveshown) return reply(mess.owner);

    dave.public = false;
    reply('💠 Successfully changed to Self Usage mode.');
};

daveplug.help = ['self'];
daveplug.tags = ['private'];
daveplug.command = ['private'];

module.exports = daveplug;