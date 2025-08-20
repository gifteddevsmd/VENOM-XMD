const axios = require("axios");

let daveplug = async (m, { text, dave, reply }) => {
  if (!text) return reply('💠 provide a query *Example :* what is node js?');

  let { data } = await axios.get('https://www.abella.icu/hika-ai?q=' + encodeURIComponent(text));

  let res = data.data;
  await reply(`💠 ${res.answer.trim()}`);

  let ref = res.references?.map((v, i) => `${i+1}. ${v.name}\n${v.url}`).join('\n\n');
  if (ref) await m.reply(`💠 Results :\n\n${ref}`);
};

daveplug.help = ['hika'];
daveplug.tags = ['ai2'];
daveplug.command = ['indo-ai'];

module.exports = daveplug;