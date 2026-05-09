const { cmd, commands } = require("../command");
const moment = require("moment-timezone");

cmd({
    pattern: "menu",
    alias: ["commandlist", "help"],
    desc: "Fetch and display all available bot commands",
    category: "system",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let totalCommands = 0;
        let grouped = {};

        // Group commands by category
        for (const cmd of commands) {
            if (!cmd.pattern || !cmd.category) continue;

            totalCommands++;
            if (!grouped[cmd.category]) grouped[cmd.category] = [];
            grouped[cmd.category].push(cmd.pattern);
        }

        let menuText = "";
        for (const cat in grouped) {
            menuText += `\n🧚‍♀️ *${cat.toUpperCase()}*\n`;
            menuText += grouped[cat].map(c => `☄️ ${c}`).join("\n") + "\n";
        }

        const time = moment().tz("Africa/Kampala").format("HH:mm:ss");
        const date = moment().tz("Africa/Kampala").format("dddd, MMMM Do YYYY");

        const caption = `
╭━━━《 MUZAMIL-XD 》━━━╮
┃ ✦╭─────────────
┃ ✦│▸ Total Commands : *${totalCommands}*
┃ ✦│▸ Time           : ${time}
┃ ✦│▸ Date           : ${date}
┃ ✦│▸ Platform       : Render
┃ ✦╰─────────────
╰━━━━━━━━━━━━┈⊷
${menuText}
`.trim();

        await conn.sendMessage(m.chat, {
            image: { url: "https://res.cloudinary.com/di2a9lenz/image/upload/v1777634329/omegatech_media/d7riz8sz6yq3avzq7vaf.jpg" },
            caption,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                mentionedJid: [m.sender],
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363426106687970@newsletter",
                    newsletterName: "MUZAMIL-XD",
                    serverMessageId: 2,
                },
            },
        }, { quoted: mek });

    } catch (err) {
        console.error("AllMenu Error:", err);
        reply("❌ Error while generating menu.");
    }
});
