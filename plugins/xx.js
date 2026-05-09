const { cmd } = require('../command');
const axios = require('axios');

const XV_API = "https://arslan-apis.vercel.app";

const AXIOS_DEFAULTS = {
    timeout: 30000,
    headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json'
    }
};

// 🔁 Retry helper
async function tryRequest(fn, tries = 3) {
    let err;
    for (let i = 1; i <= tries; i++) {
        try {
            return await fn();
        } catch (e) {
            err = e;
            await new Promise(r => setTimeout(r, i * 1000));
        }
    }
    throw err;
}

// ❤️ React helper
async function react(sock, mek, emoji) {
    await sock.sendMessage(mek.key.remoteJid, {
        react: { text: emoji, key: mek.key }
    });
}

// 📦 Stylish info box
function xBox(data) {
    return `
*╭┉┉┉┉◉◉◉┉┉┉┉┉┉┉━┈⍟*
*┋* *_MUZAMIL-XD xᴠɪᴅᴇᴏs_* 
*┋┉┉┉┉◉◉◉┉┉┉┉┉┉┉━•⟢*
*┋▸ 📌 ᴛɪᴛʟᴇ:* ${data.title}
*┇▸ ⏱ ᴅᴜʀᴀᴛɪᴏɴ:* ${data.duration || "N/A"}
*┇▸ 👁️ ᴠɪᴇᴡs:* ${data.views || "N/A"}
*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈⍟*`;
}

// 🔍 Search API
async function searchXvideos(query) {
    const api = `${XV_API}/download/xvideosSearch?text=${encodeURIComponent(query)}`;
    const res = await tryRequest(() => axios.get(api, AXIOS_DEFAULTS));
    if (res.data?.status && res.data.result?.length)
        return res.data.result;
    throw new Error("Search failed");
}

// 🎬 Download API
async function downloadXvideo(url) {
    const api = `${XV_API}/download/xvideosDown?url=${encodeURIComponent(url)}`;
    const res = await tryRequest(() => axios.get(api, AXIOS_DEFAULTS));
    if (res.data?.status && res.data.result?.url)
        return res.data.result;
    throw new Error("Download failed");
}

// ===============================
// 🔞 COMMAND: .xvideo <query|link>
// ===============================
cmd({
    pattern: "xxvideo",
    alias: ["xxx", "sexy"],
    desc: "Search or download Xvideos",
    category: "adult",
    react: "🔞",
    filename: __filename
}, async (sock, mek, m, { reply }) => {
    try {
        const text = m.message?.conversation || m.message?.extendedTextMessage?.text || "";
        const query = text.split(" ").slice(1).join(" ").trim();

        if (!query) return reply("⚠️ *Usage:*\n.xvideo <name or link>");

        await react(sock, mek, "🔍");

        let videoData;
        let videoUrl;

        // 🔗 Direct link
        if (query.startsWith("http")) {
            videoUrl = query;
            videoData = { title: "Xvideos Video", duration: "Unknown", thumb: "https://res.cloudinary.com/di2a9lenz/image/upload/v1777634329/omegatech_media/d7riz8sz6yq3avzq7vaf.jpg" };
        } 
        // 🔎 Search
        else {
            const results = await searchXvideos(query);
            videoData = results[0];
            videoUrl = videoData.url;
        }

        // 📦 Send info box with thumbnail
        await sock.sendMessage(m.chat, {
            image: { url: videoData.thumb || "https://res.cloudinary.com/di2a9lenz/image/upload/v1777634329/omegatech_media/d7riz8sz6yq3avzq7vaf.jpg" },
            caption: xBox(videoData)
        }, { quoted: mek });

        await react(sock, mek, "⏳");

        // 🎬 Download video
        const file = await downloadXvideo(videoUrl);

        await sock.sendMessage(m.chat, {
            video: { url: file.url },
            mimetype: "video/mp4",
            fileName: `${videoData.title}.mp4`,
            caption: `
*╭┉┉┉┉◉◉◉┉┉┉┉┉┉┉━┈៚*
*┋* *_ᴘᴏᴡᴇʀᴇᴅ ʙʏ мʋʓαмιℓ_* 
*╰┉┉┉┉◉◉◉┉┉┉┉┉┉┉━┈៚*`
        }, { quoted: mek });

        await react(sock, mek, "✅");

    } catch (e) {
        console.error(e);
        await react(sock, mek, "❌");
        reply("❌ Download failed!");
    }
});
