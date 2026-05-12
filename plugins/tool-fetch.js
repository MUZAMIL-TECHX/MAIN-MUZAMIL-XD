const { cmd, commands } = require('../command');
const { fetchJson } = require('../lib/functions');

cmd({
    pattern: "fetch",
    alias: ["get", "api"],
    desc: "Fetch data from a provided URL or API",
    category: "main",
    react: "🌐",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, args, reply }) => {
    try {
        const q = args.join(' ').trim(); // Extract the URL or API query
        if (!q) return reply('❌ Please provide a valid URL or query.');

        if (!/^https?:\/\//.test(q)) return reply('❌ URL must start with http:// or https://.');

        const data = await fetchJson(q); // Use your fetchJson utility function to get data
        const content = JSON.stringify(data, null, 2);

        await conn.sendMessage(from, {
            text: `🔍 *Fetched Data*:\n\`\`\`${content.slice(0, 2048)}\`\`\``,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardingSourceMessage: 'Your Data Request',
            }
        }, { quoted: mek });
    } catch (e) {
        console.error("Error in fetch command:", e);
        reply(`❌ An error occurred:\n${e.message}`);
    }
});

cmd({
    pattern: "simdata",
    alias: ["sim", "siminfo", "cnicinfo"],
    desc: "Get SIM/CNIC information from database",
    category: "info",
    react: "📱",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) {
            return reply("📛 *Please provide CNIC or mobile number!*\n\n✨ *Example:* `.simdata 41201×××××××`\n📌 *OR:* `.simdata 318×××××××`");
        }

        await react("⏳");

        // API call - FIXED: Use axios properly
        const axios = require('axios');
        const apiUrl = `https://sim-info-api.wasif-ali.workers.dev/?search=${encodeURIComponent(q)}`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        // Check if data exists - FIXED structure check
        if (!data || !data.status || data.status !== "success") {
            await react("❌");
            return reply(`🔍 *No records found for:* \`${q}\``);
        }

        // Get records array - FIXED: Check different possible structures
        let records = [];
        if (data.records && Array.isArray(data.records) && data.records.length > 0) {
            records = data.records;
        } else if (data.data && Array.isArray(data.data) && data.data.length > 0) {
            records = data.data;
        } else if (Array.isArray(data) && data.length > 0) {
            records = data;
        } else {
            await react("❌");
            return reply(`🔍 *No information found for:* \`${q}\``);
        }

        const totalRecords = records.length;
        
        // Format single message with all records
        let resultText = `╭━━━━〔 📱 *SIM DATABASE* 〕━━━━━┈ ⊹\n`;
        resultText += `┃ 🔍 *SEARCH:* \`${q}\`\n`;
        resultText += `┃ 📊 *TOTAL RECORDS:* ${totalRecords}\n`;
        resultText += `┣━━━━━━━━━━━━━━━━━━━━━━┈ ⊹\n\n`;

        // Add each record
        records.forEach((record, index) => {
            resultText += `┏━━━━━━━━━━━━━━━━━━━━━━┓\n`;
            resultText += `┃  📱 *RECORD ${index + 1}*  ┃\n`;
            resultText += `┣━━━━━━━━━━━━━━━━━━━━━━┫\n`;
            resultText += `┃ 👤 *NAME:* ${record.name || record.holder_name || "N/A"}\n`;
            resultText += `┃ 📞 *MOBILE:* ${record.mobile || record.phone || "N/A"}\n`;
            resultText += `┃ 🆔 *CNIC:* ${record.cnic || record.id_number || "N/A"}\n`;
            resultText += `┃ 🏠 *ADDRESS:* ${record.address || record.location || "N/A"}\n`;
            resultText += `┃ 📡 *NETWORK:* ${record.network || record.operator || "N/A"}\n`;
            resultText += `┃ ⏱️ *DATE:* ${record.date || record.issue_date || "N/A"}\n`;
            resultText += `┗━━━━━━━━━━━━━━━━━━━━━━┛\n\n`;
        });

        const footer = `╰━━━━━━━━━━━━━━━━━━━━━━┈ ⊹

┏━━━〔 ✨ *𝘿𝙀𝙑𝙀𝙇𝙊𝙋𝙀𝘿 𝘽𝙔* 〕━━━┓
┃    𝙈𝙐𝙕𝘼𝙈𝙄𝙇-𝙓𝘿 𝘿𝘼𝙏𝘼
┃    𝘽𝙔: 𝙈𝙐𝙕𝘼𝙈𝙄𝙇 𝙆𝙃𝘼𝙉
┗━━━━━━━━━━━━━━━━━━━━━━┛

🌟 *Requested by:* ${m.pushName || "User"}`;

        resultText += footer;

        // Send the complete message
        await conn.sendMessage(from, { text: resultText }, { quoted: mek });
        await react("✅");
        
    } catch (e) {
        console.error("SIM Data Error:", e);
        await react("❌");
        
        let errorMsg = "❌ *Error fetching SIM information!*\n\n";
        
        if (e.response) {
            if (e.response.status === 400) {
                errorMsg += "⚠️ *Invalid format!*\n📌 Use CNIC (without dashes) or mobile number";
            } else if (e.response.status === 404) {
                errorMsg += "🔍 *No information found!*";
            } else {
                errorMsg += `🔄 *API Error ${e.response.status}*\n\`${e.response.statusText}\``;
            }
        } else if (e.request) {
            errorMsg += "🌐 *Network error!*\nPlease check your internet connection";
        } else {
            errorMsg += "⚙️ *Internal error!*\n" + e.message;
        }
        
        reply(errorMsg);
    }
});