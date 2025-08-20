const axios = require("axios");

let daveplug = async (m, { daveshown, reply, text, addPremiumUser }) => {
  if (!daveshown) return reply('💠 ' + mess.owner);
  if (!text) return reply('💠 Example: /addaccess (number)');

  let user = text.replace(/[^\d]/g, "");
  addPremiumUser(user, 30);
  m.reply(`💠 Yah user ${user} has now got the access`);
};

daveplug.help = ['addaccess'];
daveplug.tags = ['addvip'];
daveplug.command = ['addaccess'];

module.exports = daveplug;