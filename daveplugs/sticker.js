const axios = require('axios');

let daveplug = async (m, { dave, prefix, command, reply, text, mime, quoted, downloadContentFromMessage }) => {
    if (!quoted) return reply(`💠 Reply to an image/video with caption ${prefix + command}`);
    
    if (/image/.test(mime)) {
        let media = await quoted.download();
        await dave.sendImageAsSticker(m.chat, media, m, {
            packname: global.packname,
            author: global.author
        });
    } else if (/video/.test(mime)) {
        if ((quoted.msg || quoted).seconds > 31) return reply('💠 Maximum 30 seconds!');
        let media = await quoted.download();
        await dave.sendVideoAsSticker(m.chat, media, m, {
            packname: global.packname,
            author: global.author
        });
    } else {
        return reply(`💠 Reply to an image/video with caption ${prefix + command}\nDuration Video 1-30 seconds`);
    }
};

daveplug.help = ['s'];
daveplug.tags = ['sticker'];
daveplug.command = ['s'];

module.exports = daveplug;