const axios = require('axios');

let daveplug = async (m, { dave, replymenu, menu }) => {
    replymenu(`💠 ${menu}\n`);
};

daveplug.help = ['dave'];
daveplug.tags = ['menu'];
daveplug.command = ['menu'];

module.exports = daveplug;