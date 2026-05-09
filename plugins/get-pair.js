const { cmd } = require('../command');
const axios = require('axios');

// 🎯 BOSS STYLE - UNIQUE & ATTRACTIVE
const DESIGN = {
    header: "╭━━━━━━━━━━━━━━━━━━━━━━╮\n┃    🔥 *MUZAMIL-XD PAIRING 🔥   ┃\n╰━━━━━━━━━━━━━━━━━━━━━━╯",
    footer: "╭━━━━━━━━━━━━━━━━━━━━━━╮\n┃    ⚡ MUZAMIL-XD PAIRING⚡    ┃\n╰━━━━━━━━━━━━━━━━━━━━━━╯",
    line: "─━━━━━━━━━━━━━━━━━━━━─",
    successIcon: "✅",
    errorIcon: "❌",
    phoneIcon: "📱",
    codeIcon: "🔐",
    timeIcon: "⏰",
    infoIcon: "📌",
    warnIcon: "⚠️"
};

cmd({
    pattern: "pair",
    alias: ["getpair", "clonebot"],
    react: "✅",
    desc: "Get pairing code for  MUZAMIL-XD",
    category: "download",
    use: ".pair 923183928XXX",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, senderNumber, reply }) => {
    try {
        const phoneNumber = q ? q.trim().replace(/[^0-9]/g, '') : senderNumber.replace(/[^0-9]/g, '');

        if (!phoneNumber || phoneNumber.length < 10 || phoneNumber.length > 15) {
            return await reply(`${DESIGN.header}\n\n` +
                `${DESIGN.errorIcon} *ERROR*\n` +
                `${DESIGN.line}\n` +
                `• Invalid number\n` +
                `• Format: 923452401XXX\n\n` +
                `📌 Example: .pair 923452401XXX\n\n` +
                `${DESIGN.footer}`);
        }

        await conn.sendMessage(from, {
            react: { text: "⏳", key: mek.key }
        });

        const response = await axios.get(`https://pairing-site-boss-874t.onrender.com/code?number=${encodeURIComponent(phoneNumber)}`);

        if (!response.data || !response.data.code) {
            return await reply(`${DESIGN.header}\n\n` +
                `${DESIGN.errorIcon} *FAILED*\n` +
                `${DESIGN.line}\n` +
                `• No code received\n` +
                `• Try again later\n\n` +
                `${DESIGN.footer}`);
        }

        const pairingCode = response.data.code;
        
        // SINGLE MESSAGE - ALL IN ONE
        const finalMsg = `${DESIGN.header}\n\n` +
            `╭────────────────────╮\n` +
            `│   ✅ SUCCESS ✅    │\n` +
            `╰────────────────────╯\n\n` +
            `${DESIGN.line}\n` +
            `${DESIGN.phoneIcon} *Number:* \`${phoneNumber}\`\n` +
            `${DESIGN.codeIcon} *Code:* \`${pairingCode}\`\n` +
            `${DESIGN.timeIcon} *Time:* ${new Date().toLocaleTimeString()}\n` +
            `${DESIGN.line}\n\n` +
            `╭────────────────────╮\n` +
            `│   📋 HOW TO USE    │\n` +
            `╰────────────────────╯\n` +
            `1️⃣ Open WhatsApp\n` +
            `2️⃣ Linked Devices\n` +
            `3️⃣ Link a Device\n` +
            `4️⃣ Enter code\n\n` +
            `${DESIGN.warnIcon} *Note:*\n` +
            `• Valid for 15 minutes\n` +
            `• One-time use only\n\n` +
            `${DESIGN.footer}`;

        await reply(finalMsg);

        await conn.sendMessage(from, {
            react: { text: "✅", key: mek.key }
        });

    } catch (error) {
        console.error("Pair command error:", error);
        
        const errorMsg = `${DESIGN.header}\n\n` +
            `${DESIGN.errorIcon} *SYSTEM ERROR*\n` +
            `${DESIGN.line}\n` +
            `• ${error.message || "Unknown error"}\n` +
            `• Try again later\n\n` +
            `${DESIGN.footer}`;
        
        await reply(errorMsg);
        
        await conn.sendMessage(from, {
            react: { text: "❌", key: mek.key }
        });
    }
});

cmd({
    pattern: "pairinfo",
    alias: ["pairhelp"],
    react: "ℹ️",
    desc: "Show pairing system information",
    category: "info",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    const infoMsg = `${DESIGN.header}\n\n` +
        `╭────────────────────╮\n` +
        `│   📌 PAIR GUIDE    │\n` +
        `╰────────────────────╯\n\n` +
        `${DESIGN.line}\n` +
        `• *Command:* .pair <number>\n` +
        `• *Example:* .pair 923452401XXX\n` +
        `• *Format:* Without + sign\n` +
        `• *Validity:* 15 minutes\n` +
        `${DESIGN.line}\n\n` +
        `╭────────────────────╮\n` +
        `│   ⚠️ IMPORTANT     │\n` +
        `╰────────────────────╯\n` +
        `• One-time use code\n` +
        `• Keep it private\n` +
        `• Use immediately\n\n` +
        `${DESIGN.footer}`;
    
    await reply(infoMsg);
});
