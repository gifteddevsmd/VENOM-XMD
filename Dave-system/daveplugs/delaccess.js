const axios = require("axios");

let daveplug = async (m, { isPremium, reply, text, delPremiumUser }) => {
    if (!isPremium) return reply('💠 ' + mess.premium);
    if (!text) return reply('💠 Example: /delaccess (number)');

    let user = text.replace(/\D/g, "");
    let removed = delPremiumUser(user);

    reply(removed
        ? `💠 Removed ${user} from bot access`
        : '💠 User was not found or already removed');
};

daveplug.help = ['delaccess'];
daveplug.tags = ['delvip'];
daveplug.command = ['delaccess'];

module.exports = daveplug;