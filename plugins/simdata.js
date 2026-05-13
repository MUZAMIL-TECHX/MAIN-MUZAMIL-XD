const { cmd, commands } = require('../command');
const { fetchJson } = require('../lib/functions');

cmd({
    pattern: "sim",
    alias: ["siminfo", "simdata", "simdb"],
    desc: "Get SIM card information for any number",
    category: "main",
    react: "📱",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, args, reply }) => {
    try {
        const number = args[0]?.trim();
        
        if (!number) {
            const helpMsg = `🎀 *━━━━━━━ SIM DATABASE ━━━━━━━* 🎀
            
┏━━━━━━━━━━━━━━━━━━━━┓
┃  📱 SIM INFO TOOL   ┃
┗━━━━━━━━━━━━━━━━━━━━┛

✨ *Usage:* .sim 31xxxxxxxx

📌 *Example:* .sim 3123456789

🌸 *Features:*
├─👉 Owner Details
├─👉 CNIC Info  
├─👉 Address
└─👉 Network Provider

🎀 *BY: MUZAMIL KHAN* 🎀`;
            return reply(helpMsg);
        }

        let cleanNumber = number.replace(/^\+92/, '').replace(/^0/, '');
        
        if (!/^\d+$/.test(cleanNumber) || cleanNumber.length < 10) {
            return reply(`❌ *INVALID NUMBER!*\n\nPlease enter valid Pakistani number.\nExample: *3123456789*`);
        }

        // Loading message
        const loadingMsg = await conn.sendMessage(from, {
            text: `🔍 *SEARCHING DATABASE* 🔍\n\n┏━━━━━━━━━━━━━━━━━━━━┓\n┃ 📡 Checking: +92${cleanNumber}\n┃ ⏳ Please wait...\n┗━━━━━━━━━━━━━━━━━━━━┛`
        }, { quoted: mek });

        const apiUrl = `https://sim-info-api.wasif-ali.workers.dev/?search=${cleanNumber}`;
        
        let response;
        try {
            response = await fetchJson(apiUrl);
        } catch (err) {
            await conn.sendMessage(from, { delete: loadingMsg.key });
            return reply(`⚠️ *API ERROR*\n\n❌ ${err.message || 'Connection failed'}\n\n🔄 Try again later.`);
        }

        if (!response || !response.success || response.records.length === 0) {
            await conn.sendMessage(from, { delete: loadingMsg.key });
            return reply(`📭 *NO DATA FOUND*\n\n🔍 Number: +92${cleanNumber}\n\n💔 No records available.`);
        }

        await conn.sendMessage(from, { delete: loadingMsg.key });

        let resultText = `🎀 *━━━━━━━ SIM CARD DATA ━━━━━━━* 🎀\n\n`;
        resultText += `📱 *NUMBER:* +92${cleanNumber}\n`;
        resultText += `📊 *TOTAL:* ${response.records.length} Record(s)\n`;
        resultText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        
        // SAME BOX DESIGN FOR EVERY RECORD
        for (let i = 0; i < response.records.length; i++) {
            const record = response.records[i];
            
            // Record Header
            resultText += `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓\n`;
            resultText += `┃  📇 RECORD ${i + 1} - CARD DATA  ┃\n`;
            resultText += `┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n\n`;
            
            // Main Content Box
            resultText += `┌────────────────────────────────┐\n`;
            resultText += `│ 👤 *NAME*                        │\n`;
            resultText += `│ ${record.name || 'N/A'}│\n`;
            resultText += `├────────────────────────────────┤\n`;
            resultText += `│ 🆔 *CNIC*                        │\n`;
            resultText += `│ ${record.cnic || 'N/A'}│\n`;
            resultText += `├────────────────────────────────┤\n`;
            resultText += `│ 📞 *SIM NUMBER*                  │\n`;
            resultText += `│ ${record.mobile || cleanNumber}│\n`;
            resultText += `├────────────────────────────────┤\n`;
            resultText += `│ 🏠 *ADDRESS*                     │\n`;
            resultText += `│ ${record.address || 'N/A'}│\n`;
            resultText += `├────────────────────────────────┤\n`;
            resultText += `│ 📡 *NETWORK*                     │\n`;
            resultText += `│ ${record.network || 'Unknown'}│\n`;
            resultText += `└────────────────────────────────┘\n`;
            
            // Separator between records (except last one)
            if (i < response.records.length - 1) {
                resultText += `\n🌸 *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━* 🌸\n\n`;
            }
        }
        
        // ONLY YOUR CREDIT
        resultText += `\n┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓\n`;
        resultText += `┃ 💝 *CREDIT & SUPPORT* 💝       ┃\n`;
        resultText += `┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n\n`;
        
        resultText += `┌────────────────────────────────┐\n`;
        resultText += `│ 👨‍💻 *DEVELOPER*                  │\n`;
        resultText += `│ ✨ MUZAMIL KHAN ✨              │\n`;
        resultText += `├────────────────────────────────┤\n`;
        resultText += `│ 📢 *WHATSAPP CHANNEL*           │\n`;
        resultText += `│ https://whatsapp.com/channel/0029VbCkm3rAe5VzCYLtNb2u  │\n`
        resultText += `├────────────────────────────────┤\n`;
        resultText += `│ 📱 *TELEGRAM*                   │\n`;
        resultText += `│ @TeamRedXhacker1               │\n`;
        resultText += `└────────────────────────────────┘\n\n`;
        
        resultText += `🎀 *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━* 🎀\n`;
        resultText += `   ⚡ *POWERED BY TEAM MUZAMIL* ⚡   \n`;
        resultText += `🎀 *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━* 🎀\n\n`;
        
        resultText += `✨ *FOR EDUCATION PURPOSE ONLY* ✨\n`;
        resultText += `💫 *ACCURACY: 99.9% GUARANTEED* 💫`;

        await conn.sendMessage(from, {
            text: resultText,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: "📱 SIM DATABASE PRO",
                    body: `✅ ${response.records.length} Record(s) Found`,
                    thumbnailUrl: "https://res.cloudinary.com/di2a9lenz/image/upload/v1777634329/omegatech_media/d7riz8sz6yq3avzq7vaf.jpg",
                    sourceUrl: "https://whatsapp.com/channel/0029VbCkm3rAe5VzCYLtNb2u",
                    mediaType: 1
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error:", e);
        reply(`❌ *ERROR*\n\n${e.message}\n\n🔄 Try again later.\n\n📌 Report: @MUZAMIL_KHAN`);
    }
});
