const { cmd } = require('../command')
const axios = require('axios')
const yts = require('yt-search')
const fs = require('fs')
const path = require('path')
const ffmpeg = require('fluent-ffmpeg')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path

cmd({
    pattern: "video",
    alias: ["ytv", "youtubevideo", "ytdl"],
    desc: "Download and send YouTube video directly",
    category: "downloader",
    react: "📥",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) {
            return reply(`🎥 *YouTube Video Downloader*
            
📌 *Usage:* 
.ytvideo <video name>
.ytvideo <youtube url>

✨ *Example:* 
.ytvideo Diljit Dosanjh G.O.A.T
.ytvideo https://youtu.be/xyz123

⚡ *Quality:* 360p (Fast)
💫 *Video will be sent directly!*`);
        }

        await react("⏳");
        reply("🔄 *Searching video...*\n⏱️ Please wait 15-30 seconds");

        let videoUrl = q;
        let videoTitle = "";
        
        // If not a URL, search first
        if (!q.includes("youtube.com") && !q.includes("youtu.be")) {
            const searchApi = `https://api.popcat.xyz/searchyt?q=${encodeURIComponent(q)}`;
            const searchRes = await axios.get(searchApi);
            
            if (!searchRes.data || !searchRes.data[0]) {
                await react("❌");
                return reply("❌ *No video found!* Try different keywords.");
            }
            
            videoUrl = searchRes.data[0].url;
            videoTitle = searchRes.data[0].title;
            await reply(`🔍 *Found:* ${videoTitle.substring(0, 50)}...\n📥 *Processing download...*`);
        }

        await react("📥");
        
        // API that returns direct video (not link)
        const downloadApi = `https://api.ryzendesu.vip/api/download/ytmp4?url=${encodeURIComponent(videoUrl)}`;
        const dlRes = await axios.get(downloadApi);
        
        if (!dlRes.data || !dlRes.data.download_url) {
            throw new Error("Download link not found");
        }

        // Download video to buffer
        const videoResponse = await axios.get(dlRes.data.download_url, {
            responseType: 'arraybuffer'
        });
        
        const videoBuffer = Buffer.from(videoResponse.data);
        
        // Send video directly (NO LINK SHOWN)
        await conn.sendMessage(from, {
            video: videoBuffer,
            caption: `🎬 *${videoTitle || dlRes.data.title || "YouTube Video"}*
            
✅ *Download Complete!*
🎥 *Quality:* ${dlRes.data.quality || "360p"}
📊 *Size:* ${dlRes.data.size || "Unknown"}
👤 *Requested by:* ${m.pushName || "User"}

💫 *MUZAMIL-XD*`,
            mimetype: 'video/mp4'
        }, { quoted: mek });
        
        await react("✅");
        
    } catch (e) {
        console.error("YT Video Error:", e);
        await react("❌");
        
        // Alternative API (y2mate)
        try {
            reply("🔄 *Trying alternative server...*");
            
            const y2mateApi = `https://y2mate.in/api/ajax/search?q=${encodeURIComponent(videoUrl || q)}`;
            const y2mateRes = await axios.get(y2mateApi);
            
            if (y2mateRes.data && y2mateRes.data.video) {
                const videoBuffer = await axios.get(y2mateRes.data.video[0].url, {
                    responseType: 'arraybuffer'
                });
                
                await conn.sendMessage(from, {
                    video: Buffer.from(videoBuffer.data),
                    caption: "🎬 *YouTube Video (Alt Server)*\n💫 MUZAMIL-XD",
                    mimetype: 'video/mp4'
                }, { quoted: mek });
                await react("✅");
                return;
            }
        } catch (fallbackErr) {}
        
        reply(`❌ *Download Failed!*
        
📌 *Try:*
• Use exact video name
• Try with YouTube URL directly
• Video might be restricted

❌ *Error:* ${e.message}`);
    }
});