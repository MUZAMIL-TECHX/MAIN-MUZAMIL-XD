const config = require('../config')
const l = console.log
const { cmd, commands } = require('../command')
const yts = require('yt-search');
const fs = require('fs-extra')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')

cmd({
    pattern: "ytsearch",
    alias: ["yts", "yt"],
    use: '.ytsearch diljit dosanjh',
    react: "🔎",
    desc: "Search YouTube videos and get details with links",
    category: "search",
    filename: __filename
},

async(conn, mek, m, {from, l, quoted, body, isCmd, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
    try {
        if (!q) return reply('❌ *Please provide search words!*\n\n📌 *Example:* `.ytsearch Diljit Dosanjh`');

        await m.react("⏳");
        reply(`🔍 *Searching for:* ${q}\n⏱️ Please wait...`);

        // Search videos
        let searchResults = await yts(q);
        
        if (!searchResults || !searchResults.all || searchResults.all.length === 0) {
            await m.react("❌");
            return reply(`❌ *No results found for:* ${q}\n\n📌 *Try different keywords*`);
        }

        // Get first 10 videos
        const videos = searchResults.all.slice(0, 10);
        
        // Function to format views
        const formatViews = (views) => {
            if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
            if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
            return views.toString();
        };
        
        // Function to format duration
        const formatDuration = (seconds) => {
            if (!seconds) return "N/A";
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;
            if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
            if (minutes > 0) return `${minutes}m ${secs}s`;
            return `${secs}s`;
        };

        // Build beautiful message
        let message = `╭━━━〔 📺 *YOUTUBE SEARCH* 〕━━━┈ ⊹
┃
┃ 🔍 *QUERY:* ${q}
┃ 📊 *RESULTS:* ${videos.length}/10
┃
`;

        videos.forEach((video, index) => {
            const num = index + 1;
            const title = video.title || "No Title";
            const url = video.url || "#";
            const duration = formatDuration(video.duration || video.timestamp);
            const views = formatViews(video.views || video.viewsCount || 0);
            const uploadDate = video.ago || video.uploadDate || "Unknown";
            const author = video.author?.name || "Unknown Channel";
            
            message += `┏━━━〔 🎬 *VIDEO ${num}* 〕━━━┓
┃
┃ 📌 *TITLE:* ${title.length > 50 ? title.substring(0, 50) + "..." : title}
┃ 👤 *CHANNEL:* ${author}
┃ ⏱️ *DURATION:* ${duration}
┃ 👁️ *VIEWS:* ${views}
┃ 📅 *UPLOADED:* ${uploadDate}
┃ 🔗 *LINK:* ${url}
┃
┗━━━━━━━━━━━━━━━━━━━━━━┛

`;
        });

        message += `╰━━━━━━━━━━━━━━━━━━━━━━━┈ ⊹

┏━━━〔 ✨ *𝙋𝙊𝙒𝙀𝙍𝙀𝘿 𝘽𝙔* 〕━━━┓
┃    𝙈𝙐𝙕𝘼𝙈𝙄𝙇 𝙆𝙃𝘼𝙉
┗━━━━━━━━━━━━━━━━━━━━━━┛

📌 *To download video:* .ytvideo <video_name_or_link>
💫 *Bot is active* 🟢`;

        // Send the message
        await conn.sendMessage(from, { text: message }, { quoted: mek });
        await m.react("✅");
        
    } catch (e) {
        console.error("YT Search Error:", e);
        await m.react("❌");
        reply(`❌ *Error occurred!*\n\n📌 *Error:* ${e.message}`);
    }
});