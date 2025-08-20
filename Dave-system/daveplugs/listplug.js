const fs = require("fs");
const path = require('path');

let daveplug = async (m, { dave, text, reply, example }) => {
    let dir = fs.readdirSync('./daveplugs');
    if (dir.length < 1) return reply("💠 No files in the plugins");

    let teks = "\n";
    for (let e of dir) {
        teks += `💠 ${e}\n`;
    }

    reply(teks);
}

daveplug.command = ["listplugin", "listplugins"];

module.exports = daveplug;