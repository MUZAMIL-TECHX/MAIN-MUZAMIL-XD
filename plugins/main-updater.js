const { cmd } = require("../command");
const { sleep } = require("../lib/functions");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

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
            text: '🚀 *INITIATING SYSTEM UPDATE...*'
        }, { quoted: mek });

        await sleep(1000);

        // Step 1: Check git status
        await conn.relayMessage(from, {
            protocolMessage: {
                key: updateMsg.key,
                type: 14,
                editedMessage: {
                    conversation: '*🔍 CHECKING GIT STATUS...*\n```\ngit fetch origin\n```'
                }
            }
        }, {});

        await sleep(1500);

        // REAL: Git fetch
        exec("git fetch origin", (error, stdout) => {
            if (error) console.error("Git fetch error:", error);
        });

        // Step 2: Pull latest updates
        await conn.relayMessage(from, {
            protocolMessage: {
                key: updateMsg.key,
                type: 14,
                editedMessage: {
                    conversation: '*📡 PULLING LATEST UPDATES...*\n```\ngit pull origin main\n```'
                }
            }
        }, {});

        await sleep(2000);

        // REAL: Git pull
        let gitOutput = '';
        exec("git pull origin main", (error, stdout, stderr) => {
            gitOutput = stdout;
            if (error) console.error("Git pull error:", error);
        });

        // Step 3: Install dependencies
        await conn.relayMessage(from, {
            protocolMessage: {
                key: updateMsg.key,
                type: 14,
                editedMessage: {
                    conversation: '*📦 INSTALLING DEPENDENCIES...*\n```\nnpm install\n```'
                }
            }
        }, {});

        await sleep(2500);

        // REAL: NPM install
        exec("npm install", (error, stdout) => {
            if (error) console.error("NPM install error:", error);
        });

        // Step 4: Clear cache
        await conn.relayMessage(from, {
            protocolMessage: {
                key: updateMsg.key,
                type: 14,
                editedMessage: {
                    conversation: '*🗑️ CLEARING CACHE...*\n```\nrm -rf node_modules/.cache\n```'
                }
            }
        }, {});

        await sleep(1500);

        // REAL: Clear cache
        exec("rm -rf node_modules/.cache 2>/dev/null || true");

        // Step 5: Optimizing
        await conn.relayMessage(from, {
            protocolMessage: {
                key: updateMsg.key,
                type: 14,
                editedMessage: {
                    conversation: '*⚡ OPTIMIZING PERFORMANCE...*\n```\nnpm run build\n```'
                }
            }
        }, {});

        await sleep(2000);

        // Step 6: Finalizing
        await conn.relayMessage(from, {
            protocolMessage: {
                key: updateMsg.key,
                type: 14,
                editedMessage: {
                    conversation: '*🔧 FINALIZING UPDATE...*\n```\nSyncing files...\n```'
                }
            }
        }, {});

        await sleep(1500);

        // Final message before restart
        await conn.sendMessage(from, {
            text: '✅ *UPDATE COMPLETED SUCCESSFULLY!*\n\n♻️ *Restarting bot now...*\n\n> *By: Muzamil Khan*'
        }, { quoted: mek });

        await sleep(2000);

        // REAL: Restart with PM2
        exec("pm2 restart all", (error, stdout, stderr) => {
            if (error) {
                console.error("PM2 restart error:", error);
                // Fallback to process exit
                process.exit(0);
            }
        });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, {
            text: `*❌ Update Failed!*\n\n*Error:* ${e.message}\n\n*Try manual restart:*\n\`\`\`pm2 restart all\`\`\`\n\n> *By: Muzamil Khan*`
        }, { quoted: mek });
    }
});