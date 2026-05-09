const { cmd } = require("../command");
const { sleep } = require("../lib/functions");

cmd({
    pattern: "update",
    alias: ["upgrade", "sync"],
    desc: "Update and restart the bot system",
    category: "owner",
    react: "🚀",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) {
            return reply("*📛 тнιs ιs αη σωηεя-σηℓү cσммαη∂!*");
        }

        // Initial message
        const updateMsg = await conn.sendMessage(from, {
            text: 'ιηιтιαтιηg sүsтεм υρ∂αтε...🚀'
        }, { quoted: mek });

        // Update steps with emojis
        const updateSteps = [
            "*🔍 cнєcкιηg sүsтєм sтαтυs...*",
            "*🛠️ ρяєραʀιηg υρ∂αтє cσмρσηєηтs...*",
            "*📦 ғιηαℓιzιηg ραcкαgєs...*",
            "*⚡ σρтιмιzιηg ρєʀғσʀмαηcε...*",
            "*🔃 ɮօֆֆ-ʍɖ ʀєѕτατ...*",
            "*♻️ ʀєѕτατιηg sεʀvιcεs...*"
        ];

        // Show each step with delay
        for (const step of updateSteps) {
            await sleep(1500);
            await conn.relayMessage(
                from,
                {
                    protocolMessage: {
                        key: updateMsg.key,
                        type: 14,
                        editedMessage: {
                            conversation: step,
                        },
                    },
                },
                {}
            );
        }

        // Final message before restart
        await conn.sendMessage(from, {
            text: '- *✅ Μʋʓαмιℓ-ƵƉ υρ∂αтє cσмρℓєтє∂ ʀєѕτατιηg*'
        }, { quoted: mek });

        // Execute restart after a short delay
        await sleep(1000);
        require('child_process').exec("pm2 restart all");

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, {
            text: `*❌ Update Failed!*\n_Error:_ ${e.message}\n\n*Try manually:*\n\`\`\`pm2 restart all\`\`\``
        }, { quoted: mek });
    }
});
