const path = require('path');
const fs = require('fs');

let daveplug = async (m, { prefix, dave, reply, command, text }) => {
    if (!text) return reply(`💠 Example: ${prefix + command} https://example.com`);

    try {
        let res = await fetch(text);
        if (!res.ok) return m.reply('💠 Invalid URL');
        let html = await res.text();

        const filePath = path.join(__dirname, '../library/lib/html_dump.html');
        fs.writeFileSync(filePath, html);

        await dave.sendMessage(m.chat, {
            document: fs.readFileSync(filePath),
            mimetype: 'text/html',
            fileName: 'results.html'
        }, { quoted: m });

        fs.unlinkSync(filePath); 
    } catch (e) {
        console.error(e);
        m.reply('💠 An error has occurred\n' + e.message);
    }
};

daveplug.help = ['getweb'];
daveplug.tags = ['scweb'];
daveplug.command = ['gethtml'];

module.exports = daveplug;