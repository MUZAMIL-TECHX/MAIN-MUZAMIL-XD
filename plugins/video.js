const axios = require("axios");
const { cmd } = require('../command');

// ================== YOUTUBE VIDEO DOWNLOADER (Same as IGDL) ==================
cmd({
    pattern: "video",
    alias: ["ytv", "youtube", "ytvideo", "yt"],
    react: "📥",
    desc: "Download YouTube videos (High Quality)",
    category: "downloader",
    use: ".video <YouTube URL or search>",
    filename: __filename
}, async (conn, mek, m, { from, reply, args, q }) => {
    try {
        // Check if URL or search query provided
        let url = q || m.quoted?.text;
        if (!url) {
            return reply(`❌ *Please provide a YouTube link or video name*

📌 *Usage:* 
.video <YouTube URL>
.video <video name>

✨ *Examples:* 
.video https://youtu.be/abc123
.video Diljit Dosanjh G.O.A.T

⚡ *Powered by MUZAMIL-XD*`);
        }

        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });
        reply("🔍 *Searching/Processing your video...*");

        // Convert search query to URL if needed
        let videoUrl = url;
        if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
            // Using yt-search API to convert name to URL
            const searchApi = `https://api.siputzx.my.id/api/ytsearch?query=${encodeURIComponent(url)}`;
            const search = await axios.get(searchApi);
            
            if (!search.data?.status || !search.data?.data?.videos?.length) {
                await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
                return reply("❌ *No video found! Try different keywords.*");
            }
            
            videoUrl = search.data.data.videos[0].url;
            reply(`✅ *Found:* ${search.data.data.videos[0].title.substring(0, 50)}...\n📥 *Downloading now...*`);
        }

        // MAIN API - Same style as IGDL (Working API)
        const apiUrl = `https://api.siputzx.my.id/api/ytdl?url=${encodeURIComponent(videoUrl)}`;
        const response = await axios.get(apiUrl);

        if (!response.data?.status || !response.data?.data) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("❌ *Failed to fetch video. Link might be invalid or restricted.*");
        }

        const videoData = response.data.data;
        
        // Get video URL (mp4 format)
        let videoLink = videoData.video || videoData.dl || videoData.url;
        
        if (!videoLink) {
            return reply("❌ *Download link not available. Try another video.*");
        }

        // Create caption like Instagram downloader
        const caption = 
`╭─────────────────⭓
│  📥 *YOUTUBE VIDEO DOWNLOADER*
├─────────────────
│  ✦ *Title:* ${videoData.title || "YouTube Video"}
│  ✦ *Duration:* ${videoData.duration || "Unknown"}
│  ✦ *Quality:* ${videoData.quality || "HD"}
│  ✦ *Downloaded by:* *MUZAMIL KHAN*
├─────────────────
│  *𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 Μʋʓαмιℓ-ƵƉ*
╰─────────────────⭓`;

        // Send video directly
        await conn.sendMessage(from, {
            video: { url: videoLink },
            caption: caption,
            mimetype: 'video/mp4'
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error('YouTube Video Error:', error);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        reply(`❌ *Download failed!*

📌 *Try this:*
• Use direct YouTube URL
• Check if video is public
• Try a different video

💡 *Example:* .video https://youtu.be/VIDEO_ID`);
    }
});