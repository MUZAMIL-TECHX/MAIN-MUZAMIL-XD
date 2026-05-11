const {
  cmd
} = require("../command");
const fetch = require("node-fetch");
const yts = require("yt-search");
const axios = require('axios');

cmd({
    pattern: "song",
    alias: ["ytmp3", "play", "mp3", "gana", "music", "audio"],
    react: "🎵",
    desc: "YouTube search & MP3 play",
    category: "download",
    use: ".play <song name>",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        const query = args.join(" ");
        if (!query) return reply("❌ Please Provide Me A song Query or Link bot chlana ata nai or command dy rhy hu");

        await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

        // 🔍 YouTube search
        const search = await yts(query);
        if (!search.videos || !search.videos.length) {
            return reply("❌ No result Found");
        }

        const video = search.videos[0];

        // 🎧 MP3 API (tumhari)
        const apiUrl = `https://dark-shan-yt.koyeb.app/download/ytmp3?url=${url}`;
        const res = await axios.get(apiUrl, { timeout: 60000 });

        if (
            !res.data ||
            !res.data.status ||
            !res.data.result ||
            !res.data.result.download ||
            !res.data.result.download.url
        ) {
            return reply("❌ DO NOT GENERATED AUDIO");
        }

        const dlUrl = res.data.result.download.url;
        const meta = res.data.result.metadata;
        const quality = res.data.result.download.quality || "";

        // 🎵 SEND AUDIO (DIRECT STREAM – SAFE)
        await conn.sendMessage(from, {
            audio: { url: dlUrl },
            mimetype: "audio/mpeg",
            ptt: false,
            fileName: `${meta.title}.mp3`,
            caption:
                `🎵 *${meta.title}*\n` +
                `🎚️ Quality: ${quality}\n\n` +
                `> © MUZAMIL-XD`,
            contextInfo: {
                externalAdReply: {
                    title: meta.title.length > 40
                        ? meta.title.substring(0, 40) + "..."
                        : meta.title,
                    body: "YouTube MP3",
                    thumbnailUrl: meta.thumbnail,
                    sourceUrl: video.url,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

    } catch (err) {
        console.error("PLAY ERROR:", err);
        reply("❌ Error Founded Please Try later Or Reported Now My Owner MUZAMIL KHAN Using `.Report` Command! 😎");
        await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
    }
});
