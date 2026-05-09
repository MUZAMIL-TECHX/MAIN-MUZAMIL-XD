const axios = require('axios');
const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "ping",
    alias: ["speed","pong"],
    use: '.ping',
    desc: "Check bot's response time.",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, quoted, sender, reply }) => {
    try {
        const start = new Date().getTime();

        const reactionEmojis = ['🔥', '⚡', '🚀', '💨', '🎯', '🎉', '🌟', '💥', '🕐', '🔹'];
        const textEmojis = ['💎', '🏆', '⚡️', '🚀', '🎶', '🌠', '🌀', '🔱', '🛡️', '✨'];

        const reactionEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
        let textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];

        while (textEmoji === reactionEmoji) {
            textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];
        }

        // ⚡ Reaction
        await conn.sendMessage(from, {
            react: { text: textEmoji, key: mek.key }
        });

        const end = new Date().getTime();
        const responseTime = (end - start) / 1000;

        const text = `> *MUZAMIL-XD SPEED: ${responseTime.toFixed(2)}ms ${reactionEmoji}*`;

        // 📄 Text message
        await conn.sendMessage(from, {
            text,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true
            }
        }, { quoted: mek });

        // 🎤 Voice Note (IMPORTANT PART)
        const url = 'https://files.catbox.moe/vh1lyy.mp3';
        const res = await axios.get(url, { responseType: 'arraybuffer' });

        await conn.sendMessage(from, {
            audio: Buffer.from(res.data),
            mimetype: 'audio/mpeg',
            ptt: true // 👈 Voice note banata hai
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in ping command:", e);
        reply(`Error: ${e.message}`);
    }
});
