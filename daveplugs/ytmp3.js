const axios = require('axios');

const ytmp3mobi = async (youtubeUrl, format = "mp3") => {
    const regYoutubeId = /https:\/\/(www.youtube.com\/watch\?v=|youtu.be\/|youtube.com\/shorts\/|youtube.com\/watch\?v=)([^&|^?]+)/;
    const videoId = youtubeUrl.match(regYoutubeId)?.[2];
    if (!videoId) throw Error("Cannot extract YouTube video ID from the link. Please check your URL.");

    const availableFormat = ["mp3", "mp4"];
    if (!availableFormat.includes(format.toLowerCase())) throw Error(`Invalid format "${format}". Available formats: ${availableFormat.join(", ")}.`);

    const urlParam = { v: videoId, f: format, _: Math.random() };
    const headers = { "Referer": "https://id.ytmp3.mobi/" };

    const fetchJson = async (url, description) => {
        const res = await fetch(url, { headers });
        if (!res.ok) throw Error(`Fetch failed on ${description} | ${res.status} ${res.statusText}`);
        return await res.json();
    };

    const { convertURL } = await fetchJson(`https://d.ymcdn.org/api/v1/init?p=y&23=1llum1n471&_=${Math.random()}`, "get convertURL");
    const { progressURL, downloadURL } = await fetchJson(`${convertURL}&${new URLSearchParams(urlParam).toString()}`, "get progressURL and downloadURL");

    let error, progress, title;
    while (progress != 3) {
        ({ error, progress, title } = await fetchJson(progressURL, "fetch progressURL"));
        if (error) throw Error(`Error during processing: ${error}`);
    }

    return { title, downloadURL };
};

let daveplug = async (m, { dave, args, command, reply, daveshown }) => {
    try {
        if (!daveshown) return reply("❌ You are not authorized to use this command!");
        if (!args[0]) return reply(`Provide a YouTube link\nExample: .${command} https://youtu.be/MN_JP4gyBNI`);
        
        const format = command === 'ytmp4' ? 'mp4' : 'mp3';
        reply('⏳ Processing your request...');

        const { title, downloadURL } = await ytmp3mobi(args[0], format);
        const filename = `${title}.${format}`;

        await dave.sendMessage(
            m.chat,
            { document: { url: downloadURL }, fileName: filename, mimetype: format === 'mp4' ? 'video/mp4' : 'audio/mp3' },
            { quoted: m }
        );
    } catch (e) {
        reply(`❌ Error: ${e.message}`);
    }
};

daveplug.help = ['ytmp3', 'ytvid'];
daveplug.command = ['ytmp3', 'ytmp4'];
daveplug.tags = ['downloader'];

module.exports = daveplug;