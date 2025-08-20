const axios = require("axios");

let daveplug = async (m, { daveshown, reply, dave }) => {
    if (!daveshown) return reply(mess.owner);
    dave.private = false;
    reply('💠 Successful in Changing To Public Usage');
};

daveplug.help = ['public'];
daveplug.tags = ['public'];
daveplug.command = ['public'];

module.exports = daveplug;