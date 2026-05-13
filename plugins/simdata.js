const { cmd, commands } = require('../command');
const { fetchJson } = require('../lib/functions');

cmd({
    pattern: "sim",
    alias: ["siminfo", "simdata"],
    desc: "Get SIM card information for any number",
    category: "main",
    react: "📱",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, args, reply }) => {
    try {
        const number = args[0]?.trim();
        
        if (!number) {
            return reply(`📱 *SIM INFORMATION TOOL*\n\nExample: *.sim 31××××××××*\n\nGet SIM card details for any Pakistani number.`);
        }

        // Remove leading zero or +92 if present
        let cleanNumber = number.replace(/^\+92/, '').replace(/^0/, '');
        
        // Validate number
        if (!/^\d+$/.test(cleanNumber)) {
            return reply('❌ Please provide a valid phone number.');
        }

        // Use the working API
        const apiUrl = `https://sim-info-api.wasif-ali.workers.dev/?search=${cleanNumber}`;
        
        let response;
        try {
            response = await fetchJson(apiUrl);
        } catch (err) {
            return reply(`❌ API Error: ${err.message || 'Failed to fetch SIM information'}`);
        }

        if (!response || !response.success) {
            return reply(`❌ No information found for number: ${number}`);
        }

        // Build beautiful response with all records
        let resultText = `╭━━━━━━━━━━━━━━━━━━━━╮\n`;
        resultText += `┃ 📱 *SIM CARD DATA* ┃\n`;
        resultText += `╰━━━━━━━━━━━━━━━━━━━━╯\n\n`;
        
        // Show all records
        for (let i = 0; i < response.records.length; i++) {
            const record = response.records[i];
            resultText += `┌────────────────────┐\n`;
            resultText += `│ 📍 *RECORD ${i + 1}*       │\n`;
            resultText += `└────────────────────┘\n`;
            resultText += `┌────────────────────┐\n`;
            resultText += `│ 👤 *NAME*           │\n`;
            resultText += `│ ${record.name || 'N/A'}\n`;
            resultText += `└────────────────────┘\n`;
            resultText += `┌────────────────────┐\n`;
            resultText += `│ 📞 *MOBILE*         │\n`;
            resultText += `│ ${record.mobile || cleanNumber}\n`;
            resultText += `└────────────────────┘\n`;
            resultText += `┌────────────────────┐\n`;
            resultText += `│ 🆔 *CNIC*           │\n`;
            resultText += `│ ${record.cnic || 'N/A'}\n`;
            resultText += `└────────────────────┘\n`;
            resultText += `┌────────────────────┐\n`;
            resultText += `│ 🏠 *ADDRESS*        │\n`;
            resultText += `│ ${record.address || 'Address not available'}\n`;
            resultText += `└────────────────────┘\n`;
            resultText += `┌────────────────────┐\n`;
            resultText += `│ 📡 *NETWORK*        │\n`;
            resultText += `│ ${record.network || 'N/A'}\n`;
            resultText += `└────────────────────┘\n\n`;
        }
        
        // Add developer info
        resultText += `╭━━━━━━━━━━━━━━━━━━━━╮\n`;
        resultText += `┃ ℹ️ *INFO*           ┃\n`;
        resultText += `╰━━━━━━━━━━━━━━━━━━━━╯\n`;
        resultText += `┌────────────────────┐\n`;
        resultText += `│ 👨‍💻 *Developer*     │\n`;
        resultText += `│ ${response.developer || 'MUZAMIL-XD'}\n`;
        resultText += `└────────────────────┘\n`;
        resultText += `┌────────────────────┐\n`;
        resultText += `│ 📱 *Telegram*       │\n`;
        resultText += `│ ${response.telegram || '@TeamRedXhacker1'}\n`;
        resultText += `└────────────────────┘\n`;
        resultText += `┌────────────────────┐\n`;
        resultText += `│ 📢 *Channel*        │\n`;
        resultText += `│ ${response.channel || 'https://whatsapp.com/channel/0029VbCkm3rAe5VzCYLtNb2u'}\n`;
        resultText += `└────────────────────┘\n\n`;
        
        // Total records count
        resultText += `╭━━━━━━━━━━━━━━━━━━━━╮\n`;
        resultText += `┃ 📊 *TOTAL RECORDS: ${response.count || response.records.length}* ┃\n`;
        resultText += `╰━━━━━━━━━━━━━━━━━━━━╯\n\n`;
        
        // Your signature
        resultText += `╭━━━━━━━━━━━━━━━━━━━━╮\n`;
        resultText += `┃ ✨ *BY: MUZAMIL KHAN* ✨ ┃\n`;
        resultText += `╰━━━━━━━━━━━━━━━━━━━━╯\n`;

        await conn.sendMessage(from, {
            text: resultText,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: "📱 SIM DATABASE",
                    body: `Results for +${cleanNumber}`,
                    thumbnailUrl: "https://i.imgur.com/7jZk9WY.png",
                    sourceUrl: "https://whatsapp.com",
                    mediaType: 1
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in sim command:", e);
        reply(`❌ Error: ${e.message}\n\nTry again later.`);
    }
});