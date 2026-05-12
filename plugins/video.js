const axios = require("axios");
const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

// ================== YOUTUBE VIDEO DOWNLOADER (Direct Video Send) ==================
cmd({
    pattern: "ytdl",
    alias: ["ytv", "youtube", "ytvideo", "yt"],
    react: "📥",
    desc: "Download YouTube videos (Direct Video Send)",
    category: "downloader",
    use: ".video <YouTube URL or search>",
    filename: __filename
}, async (conn, mek, m, { from, reply, args, q }) => {
    try {
        let url = q || m.quoted?.text;
        if (!url) {
            return reply(`❌ *Please provide a YouTube link or video name*

📌 *Usage:* 
.video <YouTube URL>

✨ *Examples:* 
.video https://youtu.be/abc123

⚡ *Powered by MUZAMIL-XD*`);
        }

        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });
        reply("🔍 *Processing your video...*");

        // Convert search query to URL if needed
        let videoUrl = url;
        if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
            const searchApi = `https://api.siputzx.my.id/api/ytsearch?query=${encodeURIComponent(url)}`;
            const search = await axios.get(searchApi);
            
            if (!search.data?.status || !search.data?.data?.videos?.length) {
                await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
                return reply("❌ *No video found! Try different keywords.*");
            }
            
            videoUrl = search.data.data.videos[0].url;
            reply(`✅ *Found:* ${search.data.data.videos[0].title.substring(0, 50)}...\n📥 *Downloading now...*`);
        }

        // ========== GET DOWNLOAD URL FROM API ==========
        let downloadUrl = null;
        let videoTitle = null;
        
        try {
            const apiUrl = `https://eliteprotech-apis.zone.id/ytdown?url=${encodeURIComponent(videoUrl)}`;
            console.log("Calling API:", apiUrl);
            
            const response = await axios.get(apiUrl, { timeout: 20000 });
            console.log("API Response:", JSON.stringify(response.data, null, 2));

            if (response.data?.success === true) {
                downloadUrl = response.data.downloadURL;  // Yahaan downloadURL hai
                videoTitle = response.data.title;
                console.log("Download URL:", downloadUrl);
            } else {
                throw new Error("API response invalid");
            }
            
        } catch (err) {
            console.error("API Error:", err.message);
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply(`❌ *API Error:* ${err.message}\n\nTry again later.`);
        }

        if (!downloadUrl) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("❌ *Download link not found!*");
        }

        // ========== DOWNLOAD VIDEO FROM DOWNLOAD URL ==========
        reply("📥 *Muzamil-XD Downloading video from server...*\n⏱️ *Please wait *");

        const videoPath = path.join(__dirname, '../temp', `vid_${Date.now()}.mp4`);
        
        // Ensure temp directory exists
        if (!fs.existsSync(path.join(__dirname, '../temp'))) {
            fs.mkdirSync(path.join(__dirname, '../temp'), { recursive: true });
        }

        // Download video file
        const writer = fs.createWriteStream(videoPath);
        const videoResponse = await axios({
            method: 'get',
            url: downloadUrl,
            responseType: 'stream',
            timeout: 60000  // 60 seconds timeout for 5MB video
        });

        videoResponse.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        const videoStats = fs.statSync(videoPath);
        const videoSizeMB = (videoStats.size / (1024 * 1024)).toFixed(2);
        
        console.log(`Video downloaded: ${videoSizeMB} MB`);

        // ========== SEND DIRECT VIDEO TO WHATSAPP ==========
        const caption = 
`╭─────────────────⭓
│  📥 *YOUTUBE VIDEO DOWNLOADER*
├─────────────────
│  ✦ *Title:* ${videoTitle || "YouTube Video"}
│  ✦ *Size:* ${videoSizeMB} MB
│  ✦ *Quality:* HD
│  ✦ *API:* EliteProtech ⚡
│  ✦ *Downloaded by:* *Muzamil Khan*
├─────────────────
│  *Powered By: Muzamil-XD*
╰─────────────────⭓`;

        // ✅ DIRECT VIDEO BHEJ RAHA HAIN (SIRF LINK NAHI)
        await conn.sendMessage(from, {
            video: { url: videoPath },  // Local file path se video bhejega
            caption: caption,
            mimetype: 'video/mp4'
        }, { quoted: mek });

        // Cleanup - delete temp file
        fs.unlinkSync(videoPath);
        
        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
        reply(`✅ *Video sent successfully!*\n📊 *Size:* ${videoSizeMB} MB`);

    } catch (error) {
        console.error('YouTube Video Error:', error);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        reply(`❌ *Download failed!*\n\nError: ${error.message}\n\n💡 Try again or use different video.`);
        
        // Cleanup on error
        try {
            const tempDir = path.join(__dirname, '../temp');
            if (fs.existsSync(tempDir)) {
                const files = fs.readdirSync(tempDir);
                files.forEach(file => {
                    if (file.startsWith('vid_')) {
                        fs.unlinkSync(path.join(tempDir, file));
                    }
                });
            }
        } catch(e) {}
    }
});