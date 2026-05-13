const { cmd } = require('../command');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const stream = require('stream');
const pipeline = promisify(stream.pipeline);

cmd({
    pattern: "play",
    alias: ["gana", "music", "song"],
    react: "🎵",
    desc: "Download any song from Spotify",
    category: "downloader",
    use: '.spotify <song name>',
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply("❌ Please provide a song name.\nExample: .spotify pasoori");

        await reply("🎵 Searching & downloading your song...");

        // Search for song
        const searchUrl = `https://jerrycoder.oggyapi.workers.dev/spotify?search=${encodeURIComponent(q)}`;
        const searchRes = await axios.get(searchUrl, { timeout: 20000 });

        if (!searchRes.data || !searchRes.data.tracks || searchRes.data.tracks.length === 0) {
            return reply("❌ No song found!");
        }

        const bestSong = searchRes.data.tracks[0];
        
        // Get download link
        const dlUrl = `https://jerrycoder.oggyapi.workers.dev/dspotify?url=${encodeURIComponent(bestSong.spotifyUrl)}`;
        const dlRes = await axios.get(dlUrl, { timeout: 20000 });

        if (!dlRes.data || !dlRes.data.download_link) {
            return reply("❌ Failed to get download link");
        }

        const audioUrl = dlRes.data.download_link;
        const title = dlRes.data.title || bestSong.trackName;
        const artist = dlRes.data.artist || bestSong.artist;
        const thumbnail = dlRes.data.thumbnail || bestSong.thumbnail;

        // Download audio
        const tempDir = path.join(__dirname, 'temp');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
        
        const tempFile = path.join(tempDir, `spotify_${Date.now()}.mp3`);
        
        const audioResponse = await axios({
            method: 'GET',
            url: audioUrl,
            responseType: 'stream',
            timeout: 120000,
        });
        
        await pipeline(audioResponse.data, fs.createWriteStream(tempFile));
        
        // Read audio file
        const audioBuffer = fs.readFileSync(tempFile);
        
        // Send description
        const description = `╔══════════════════════╗
┃     🎵 SPOTIFY SONG 🎵    ┃
╚══════════════════════╝

✭ 𝙎𝙊𝙉𝙂 : ${title}
✭ 𝙎𝙀𝘼𝙍𝘾𝙃 𝘽𝙔 : ${q}
✭ 𝘼𝙍𝙏𝙄𝙎𝙏 : ${artist}
✭ 𝘿𝙊𝙒𝙉𝙇𝙊𝘼𝘿𝙀𝘿 𝘽𝙔 : 𝙈𝙐𝙕𝘼𝙈𝙄𝙇-𝙓𝘿

╔══════════════════════╗
┃   ✨ Enjoy The Song ✨   ┃
╚══════════════════════╝

> 🎧 MUZAMIL-XD Bot 🎧`;

        await conn.sendMessage(from, { text: description }, { quoted: mek });
        
        // Send audio
        await conn.sendMessage(from, {
            audio: audioBuffer,
            mimetype: 'audio/mpeg',
            fileName: `${title.replace(/[^a-zA-Z0-9]/g, '')}.mp3`,
            ptt: false
        }, { quoted: mek });
        
        // Cleanup
        fs.unlinkSync(tempFile);
        
    } catch (error) {
        console.error('Spotify Error:', error);
        reply("❌ Error: " + error.message);
    }
});