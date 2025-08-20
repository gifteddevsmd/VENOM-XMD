const axios = require('axios');
const fetch = require('node-fetch');

let daveplug = async (m, { text, dave, reply }) => {
  if (!text) return m.reply('💠 Provide a URL Pinterest!\nUse: .pinterestdl https://pin.it/2NCffxXoN');

  try {
    await dave.sendMessage(m.chat, {
      react: { text: '💠', key: m.key }
    });

    const res = await fetch(`https://api.nekorinn.my.id/downloader/pinterest?url=${encodeURIComponent(text)}`);
    const data = await res.json();

    if (!data.status || !data.result || !data.result.medias?.length) {
      return reply('💠 Provide a valid media link.');
    }

    const media = data.result.medias.find(m => m.extension === 'mp4') ||
                  data.result.medias.find(m => m.extension === 'jpg');

    if (!media) return reply('💠 Provide a valid media.');

    const caption = `💠 *Pinterest Downloader*\n\n*Title:* ${data.result.title}\n*Size:* ${media.formattedSize || '-'}\n*Share:* ${text}`;
    const type = media.extension === 'mp4' ? 'video' : 'image';

    await dave.sendMessage(m.chat, {
      [type]: { url: media.url },
      caption
    }, { quoted: m });

  } catch (err) {
    console.error('PinterestDL Error:', err);
    reply('💠 Failed to download Pinterest media.');
  }
};

daveplug.help = ['pin'];
daveplug.tags = ['pin'];
daveplug.command = ['pinterestdl'];

module.exports = daveplug;