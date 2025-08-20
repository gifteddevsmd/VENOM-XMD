const fs = require("fs");

let daveplug = async (m, { dave, daveshown, reply, text, example }) => {
    if (!daveshown) return reply(mess.owner);
    if (!text) return reply("💠 Provide a plugin name");
    if (!text.endsWith(".js")) return reply("💠 File name must end with .js");
    if (!fs.existsSync("./daveplugs/" + text.toLowerCase())) return reply("💠 File not found!");

    let res = await fs.readFileSync("./daveplugs/" + text.toLowerCase());
    return reply(`${res.toString()}`);
};

daveplug.command = ["getp", "gp", "getplugins", "getplugin"];

module.exports = daveplug;