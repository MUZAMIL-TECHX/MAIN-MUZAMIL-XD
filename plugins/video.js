const { cmd } = require('../command')
const axios = require('axios')
const yts = require('yt-search')
const fs = require('fs')
const path = require('path')

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
.video <video name>
.video <youtube url>

✨ *Example:* 
.video Diljit Dosanjh G.O.A.T
.video https://youtu.be/xyz123

⚡ *Quality:* Best Available
💫 *Video will be sent directly!*`);
        }

        await react("⏳");
        reply("🔄 *Searching video...*\n⏱️ Please wait...");

        let videoUrl = q;
        let videoTitle = "";
        
        // If not a URL, search first using yt-search
        if (!q.includes("youtube.com") && !q.includes("youtu.be")) {
            const searchResults = await yts(q);
            if (!searchResults || !searchResults.videos.length) {
                await react("❌");
                return reply("❌ *No video found!* Try different keywords.");
            }
            
            const video = searchResults.videos[0];
            videoUrl = video.url;
            videoTitle = video.title;
            await reply(`🔍 *Found:* ${videoTitle.substring(0, 50)}...\n📥 *Processing download...*`);
        }

        await react("📥");
        
        // Try multiple APIs (working ones)
        let videoBuffer = null;
        let finalTitle = videoTitle;
        let errors = [];
        
        // API 1: TikMate (Working)
        try {
            const tikMateApi = `https://tikmate.online/api/youtube/download?url=${encodeURIComponent(videoUrl)}`;
            const response = await axios.get(tikMateApi, { timeout: 30000 });
            
            if (response.data && response.data.video_url) {
                const videoRes = await axios.get(response.data.video_url, {
                    responseType: 'arraybuffer',
                    timeout: 60000
                });
                videoBuffer = Buffer.from(videoRes.data);
                finalTitle = response.data.title || finalTitle;
            }
        } catch (e) {
            errors.push("TikMate: " + e.message);
        }
        
        // API 2: Y2Mate Alternative
        if (!videoBuffer) {
            try {
                const y2mateApi = `https://y2mate.ch/api/youtube/mp4?url=${encodeURIComponent(videoUrl)}`;
                const response = await axios.get(y2mateApi, { timeout: 30000 });
                
                if (response.data && response.data.download_url) {
                    const videoRes = await axios.get(response.data.download_url, {
                        responseType: 'arraybuffer',
                        timeout: 60000
                    });
                    videoBuffer = Buffer.from(videoRes.data);
                    finalTitle = response.data.title || finalTitle;
                }
            } catch (e) {
                errors.push("Y2Mate: " + e.message);
            }
        }
        
        // API 3: SSYoutube Alternative
        if (!videoBuffer) {
            try {
                const ssApi = `https://ssyoutube.com/api/convert?url=${encodeURIComponent(videoUrl)}&format=mp4`;
                const response = await axios.get(ssApi, { timeout: 30000 });
                
                if (response.data && response.data.download_url) {
                    const videoRes = await axios.get(response.data.download_url, {
                        responseType: 'arraybuffer',
                        timeout: 60000
                    });
                    videoBuffer = Buffer.from(videoRes.data);
                    finalTitle = response.data.title || finalTitle;
                }
            } catch (e) {
                errors.push("SSYouTube: " + e.message);
            }
        }
        
        // Send video if we have buffer
        if (videoBuffer && videoBuffer.length > 0) {
            await conn.sendMessage(from, {
                video: videoBuffer,
                caption: `🎬 *${finalTitle || "YouTube Video"}*
                
✅ *Download Complete!*
📊 *Size:* ${(videoBuffer.length / (1024 * 1024)).toFixed(2)} MB
👤 *Requested by:* ${m.pushName || "User"}

💫 *MUZAMIL-XD*`,
                mimetype: 'video/mp4'
            }, { quoted: mek });
            
            await react("✅");
        } else {
            throw new Error("All APIs failed: " + errors.join(", "));
        }
        
    } catch (e) {
        console.error("YT Video Error:", e);
        await react("❌");
        
        reply(`❌ *Download Failed!*
        
📌 *Try These Solutions:*
• Use exact video title
• Try with direct YouTube URL
• Video might be restricted/copyrighted
• Try a shorter video (under 10 minutes)

❌ *Error:* ${e.message}

💡 *Tip:* Try command: .video <song name> (keep it short)`);
    }
});