const axios = require('axios');

let daveplug = async (m, { dave, text, reply, daveshown }) => {
  if (!daveshown) return reply("❌ You are not authorized to use this command!");
  if (!text) return reply('Provide a YouTube URL!\n\nUse: .ytmp4 https://youtube.com/watch?v=xxxx 360p');

  let [url, quality] = text.split(' ');
  quality = quality || '480p';

  const qualityMap = {
    '1080p': 'Full HD (1080p)',
    '720p': 'HD (720p)',
    '480p': 'SD (480p)',
    '360p': 'Low (360p)',
    '240p': 'Very Low (240p)',
    '144p': 'Tiny (144p)'
  };

  if (!qualityMap[quality]) return m.reply(
    `Quality must be valid!\n\nProvide a valid format:\n${Object.keys(qualityMap).join(', ')}`
  );

  try {
    let { data } = await axios.post('https://api.ytmp4.fit/api/video-info', { url }, {
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://ytmp4.fit',
        'Referer': 'https://ytmp4.fit/'
      }
    });

    if (!data || !data.title) throw new Error('Failed to retrieve video info.');

    let { title, duration, channel, views, thumbnail } = data;

    await dave.sendMessage(m.chat, {
      text: `🎬 *YouTube Video Info:*\n\n📌 Title: ${title}\n📺 Channel: ${channel}\n⏱ Duration: ${duration}\n👁 Views: ${views}\n\n⏳ Quality: *${qualityMap[quality]}*...`,
      contextInfo: {
        externalAdReply: {
          title: title,
          body: channel,
          thumbnailUrl: thumbnail,
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: url
        }
      }
    }, { quoted: m });

    let videoRes = await axios.post('https://api.ytmp4.fit/api/download', { url, quality }, {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/octet-stream',
        'Origin': 'https://ytmp4.fit',
        'Referer': 'https://ytmp4.fit/'
      }
    });

    if (!videoRes.headers['content-type'].includes('video')) {
      throw new Error('Error occurred while fetching the video.');
    }

    let filename = decodeURIComponent(
      (videoRes.headers['content-disposition'] || '').split("filename*=UTF-8''")[1] || `video_${quality}.mp4`
    ).replace(/[\/\\:*?"<>|]/g, '_');

    await dave.sendMessage(m.chat, {
      video: Buffer.from(videoRes.data),
      mimetype: 'video/mp4',
      fileName: filename,
      caption: `✅ *Video successfully downloaded!*\n\n📌 Title: ${title}\n🎞️ Quality: ${qualityMap[quality]}\n\nPowered by ${botname}`
    }, { quoted: m });

  } catch (err) {
    reply(`❌ Error: ${err.message}`);
  }
};

daveplug.help = ['ytmp4'];
daveplug.tags = ['ytmp4'];
daveplug.command = ['ytvid'];

module.exports = daveplug;