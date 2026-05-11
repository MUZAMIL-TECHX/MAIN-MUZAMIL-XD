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

        // API call
        const apiUrl = `https://sim-info-api.wasif-ali.workers.dev/?search=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        // Check if data exists
        if (!data.success || !data.records || data.records.length === 0) {
            await react("❌");
            return reply(`🔍 *No records found for:* \`${q}\``);
        }

        const totalRecords = data.records.length;
        const maxPerMessage = 3; // 3 records per message (avoid message too long)
        const totalMessages = Math.ceil(totalRecords / maxPerMessage);
        
        // Function to format a single record
        const formatRecord = (record, index) => {
            return `
┏━━━━━━━━━━━━━━━━━━━━━━┓
┃  📱 *RECORD ${index}*  ┃
┣━━━━━━━━━━━━━━━━━━━━━━┫
┃ 👤 *NAME:* ${record.name || "N/A"}
┃ 📞 *MOBILE:* ${record.mobile || "N/A"}
┃ 🆔 *CNIC:* ${record.cnic || "N/A"}
┃ 🏠 *ADDRESS:* ${record.address || "N/A"}
┃ 📡 *NETWORK:* ${record.network || "N/A"}
┃ ⏱️ *DATE:* ${record.date || "N/A"}
┗━━━━━━━━━━━━━━━━━━━━━━┛`;
        };

        // Function to send formatted messages
        const sendMessage = async (records, pageNum, isLastPage = false) => {
            let recordsText = "";
            records.forEach((record, idx) => {
                recordsText += formatRecord(record, (pageNum - 1) * maxPerMessage + idx + 1);
            });
            
            const header = `╭━━━━〔 📱 *SIM DATABASE* 〕━━━━━┈ ⊹
┃ 🔍 *SEARCH:* \`${q}\`
┃ 📊 *TOTAL RECORDS:* ${totalRecords}
┃ 📄 *PAGE:* ${pageNum}/${totalMessages}
┣━━━━━━━━━━━━━━━━━━━━━━┈ ⊹`;
            
            const footer = isLastPage ? `
╰━━━━━━━━━━━━━━━━━━━━━━┈ ⊹

┏━━━〔 ✨ *𝘿𝙀𝙑𝙀𝙇𝙊𝙋𝙀𝘿 𝘽𝙔* 〕━━━┓
┃    𝙈𝙐𝙕𝘼𝙈𝙄𝙇-𝙓𝘿 𝘿𝘼𝙏𝘼
┃    𝘽𝙔: 𝙈𝙐𝙕𝘼𝙈𝙄𝙇 𝙆𝙃𝘼𝙉
┗━━━━━━━━━━━━━━━━━━━━━━┛

🌟 *Requested by:* ${m.pushName || "User"}` : `
╰━━━━━━━━━━━━━━━━━━━━━━┈ ⊹
📌 *Reply with next to see more records*`;
            
            const finalText = header + recordsText + footer;
            
            if (isLastPage) {
                await conn.sendMessage(from, { text: finalText }, { quoted: mek });
            } else {
                await conn.sendMessage(from, { text: finalText }, { quoted: mek });
                return true; // Indicates more pages available
            }
        };

        // Send first page
        let currentPage = 1;
        let startIdx = 0;
        let endIdx = Math.min(maxPerMessage, totalRecords);
        let currentRecords = data.records.slice(startIdx, endIdx);
        
        await sendMessage(currentRecords, currentPage, totalMessages === 1);
        
        // If more than one page, handle pagination
        if (totalMessages > 1) {
            // Store session for pagination
            if (!global.simSessions) global.simSessions = {};
            global.simSessions[m.sender] = {
                data: data.records,
                totalMessages: totalMessages,
                maxPerMessage: maxPerMessage,
                currentPage: 1,
                query: q
            };
            
            // Wait for user reply
            const response = await conn.waitForMessage(from, m.sender, 30000);
            if (response && response.body && response.body.toLowerCase() === "next") {
                await react("⏩");
                currentPage = 2;
                startIdx = maxPerMessage;
                endIdx = Math.min(maxPerMessage * 2, totalRecords);
                currentRecords = data.records.slice(startIdx, endIdx);
                await sendMessage(currentRecords, currentPage, currentPage === totalMessages);
                await react("✅");
            }
        } else {
            await react("✅");
        }
        
    } catch (e) {
        console.error("SIM Data Error:", e);
        await react("❌");
        
        let errorMsg = "❌ *Error fetching SIM information!*\n\n";
        if (e.response?.status === 400) {
            errorMsg += "⚠️ *Invalid format!*\n📌 Use CNIC (without dashes) or mobile number";
        } else if (e.response?.status === 404) {
            errorMsg += "🔍 *No information found!*";
        } else {
            errorMsg += "🔄 *API error!*\n`" + e.message + "`";
        }
        
        reply(errorMsg);
    }
});