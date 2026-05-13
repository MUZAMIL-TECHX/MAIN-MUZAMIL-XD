// update.js - MUZAMIL-XD Update System
const { cmd } = require("../command");
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

cmd({
    pattern: "update",
    alias: ["upgrade", "refresh", "renew"],
    react: '🔄',
    desc: "Update MUZAMIL-XD to latest version (Owner Only)",
    category: "owner",
    filename: __filename
}, async (client, message, match, { from, isCreator }) => {
    
    try {
        // 🔒 OWNER ONLY CHECK
        if (!isCreator) {
            return await client.sendMessage(from, {
                text: `╭━━━━━━━━━━━━━━━⬣
┃❌ *ACCESS DENIED!*
┃━━━━━━━━━━━━━━━
┃👤 *Status:* Unauthorized
┃⚠️ *Warning:* This Action Will Be Reported
┃━━━━━━━━━━━━━━━
┃🔒 *Only Muzamil Can Do This!*
┃👑 *Contact Owner:* wa.me/923183928892
┃📛 *Don't Try Again!*
╰━━━━━━━━━━━━━━━⬣

> © MUZAMIL-XD BOT • All Rights Reserved`,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363304633358907@newsletter',
                        newsletterName: 'MUZAMIL-XD 🔥',
                        serverMessageId: 69
                    }
                }
            }, { quoted: message });
        }

        // ✅ OWNER CONFIRMED - ATTITUDE MODE ON
        await client.sendMessage(from, {
            text: `╭━━━━━━━━━━━━━━━⬣
┃✅ *ACCESS GRANTED!*
┃━━━━━━━━━━━━━━━
┃👑 *Welcome Boss!*
┃👤 *Owner:* MUZAMIL KHAN
┃⚡ *Bot:* MUZAMIL-XD v15.0
┃━━━━━━━━━━━━━━━
┃🔄 *Initiating Update Sequence...*
┃📡 *Status:* Connecting to GitHub
┃⏳ *ETA:* 1-2 Minutes
╰━━━━━━━━━━━━━━━⬣

> ⚡ *MUZAMIL-XD UPDATER • Power By Team RedX*`
        }, { quoted: message });

        const ZIP_URL = 'https://github.com/MUZAMIL-TECHX/MAIN-MUZAMIL-XD/archive/refs/heads/main.zip';
        const isGit = fs.existsSync(path.join(process.cwd(), '.git'));

        if (isGit) {
            // 🔥 GIT METHOD - ELITE WAY
            await client.sendMessage(from, {
                text: `╭━━━━━━━━━━━━━━━⬣
┃📡 *GIT MODE ACTIVATED*
┃━━━━━━━━━━━━━━━
┃🔗 *Repo:* MUZAMIL-TECHX/MAIN-MUZAMIL-XD
┃🌿 *Branch:* Main
┃⚡ *Status:* Fetching Updates...
╰━━━━━━━━━━━━━━━⬣`
            }, { quoted: message });

            exec('git pull origin main', async (error, stdout, stderr) => {
                if (error) {
                    await client.sendMessage(from, {
                        text: `⚠️ *Git Mode Failed!*\n🔄 *Switching to ZIP Mode...*`
                    }, { quoted: message });
                    await updateViaZip(client, from, message, ZIP_URL);
                    return;
                }

                let changes = stdout.trim() || 'No changes detected';
                let updateMsg = `╭━━━━━━━━━━━━━━━⬣\n┃✅ *UPDATE SUCCESSFUL!*\n┃━━━━━━━━━━━━━━━\n┃📊 *Changes:*\n┃${changes.slice(0, 150)}\n╰━━━━━━━━━━━━━━━⬣`;

                if (stdout.includes('package.json')) {
                    await client.sendMessage(from, {
                        text: updateMsg + `\n\n📦 *Installing Dependencies...*\n⏳ Please wait...`
                    }, { quoted: message });
                    
                    exec('npm install', async (npmErr) => {
                        await client.sendMessage(from, {
                            text: `╭━━━━━━━━━━━━━━━⬣\n┃✅ *FINAL STEP COMPLETE!*\n┃━━━━━━━━━━━━━━━\n┃🔄 *Restarting MUZAMIL-XD...*\n┃📞 *Back Online In 30 Seconds*\n┃💬 *Type .alive to Check*\n╰━━━━━━━━━━━━━━━⬣\n\n> 🔥 *MUZAMIL-XD • The Beast Bot*`
                        }, { quoted: message });
                        setTimeout(() => process.exit(0), 3000);
                    });
                } else {
                    await client.sendMessage(from, {
                        text: updateMsg + `\n\n╭━━━━━━━━━━━━━━━⬣\n┃🔄 *Restarting MUZAMIL-XD...*\n┃📞 *Back Online In 30 Seconds*\n┃💬 *Type .alive to Check*\n╰━━━━━━━━━━━━━━━⬣\n\n> 👑 *MUZAMIL-XD • King of Bots*`
                    }, { quoted: message });
                    setTimeout(() => process.exit(0), 3000);
                }
            });
        } else {
            await updateViaZip(client, from, message, ZIP_URL);
        }

        // 📦 ZIP UPDATE FUNCTION
        async function updateViaZip(client, from, message, zipUrl) {
            try {
                await client.sendMessage(from, {
                    text: `╭━━━━━━━━━━━━━━━⬣\n┃📡 *ZIP MODE ACTIVATED*\n┃━━━━━━━━━━━━━━━\n┃📥 *Downloading Files...*\n┃🔗 *Source:* GitHub Latest\n╰━━━━━━━━━━━━━━━⬣`
                }, { quoted: message });

                const response = await axios({
                    method: 'get',
                    url: zipUrl,
                    responseType: 'arraybuffer',
                    timeout: 90000
                });

                const zipPath = path.join(process.cwd(), 'temp_muzamil_update.zip');
                fs.writeFileSync(zipPath, response.data);

                await client.sendMessage(from, {
                    text: `📦 *Extracting Files...*\n⚙️ *Processing Update...*`
                }, { quoted: message });

                exec(`unzip -o ${zipPath} -d ./temp_muzamil && cp -rf ./temp_muzamil/MAIN-MUZAMIL-XD-main/* . && rm -rf ./temp_muzamil ${zipPath}`, async (err) => {
                    if (err) {
                        await client.sendMessage(from, {
                            text: `❌ *Extraction Failed!*\n\`\`\`${err.message}\`\`\`\n\n⚠️ *Try Manual Update From GitHub*`
                        }, { quoted: message });
                        return;
                    }

                    if (fs.existsSync('./package.json')) {
                        await client.sendMessage(from, {
                            text: `📦 *Installing Dependencies...*\n⏳ *Running npm install...*`
                        }, { quoted: message });
                        
                        exec('npm install', async () => {
                            await client.sendMessage(from, {
                                text: `╭━━━━━━━━━━━━━━━⬣\n┃✅ *UPDATE COMPLETE!*\n┃━━━━━━━━━━━━━━━\n┃🔄 *Restarting MUZAMIL-XD...*\n┃📞 *Back Online In 30 Seconds*\n┃💬 *Type .alive to Check*\n┃━━━━━━━━━━━━━━━\n┃🔥 *Version:* 15.0.0\n┃👑 *Owner:* MUZAMIL KHAN\n╰━━━━━━━━━━━━━━━⬣\n\n> ⚡ *MUZAMIL-XD • The Ultimate WhatsApp Bot*`
                            }, { quoted: message });
                            setTimeout(() => process.exit(0), 3000);
                        });
                    } else {
                        await client.sendMessage(from, {
                            text: `╭━━━━━━━━━━━━━━━⬣\n┃✅ *UPDATE COMPLETE!*\n┃━━━━━━━━━━━━━━━\n┃🔄 *Restarting MUZAMIL-XD...*\n┃📞 *Back Online In 30 Seconds*\n┃💬 *Type .alive to Check*\n╰━━━━━━━━━━━━━━━⬣\n\n> 🚀 *MUZAMIL-XD • Power By Team RedX*`
                        }, { quoted: message });
                        setTimeout(() => process.exit(0), 3000);
                    }
                });
            } catch (error) {
                await client.sendMessage(from, {
                    text: `❌ *Update Failed!*\n\`\`\`${error.message}\`\`\`\n\n📌 *Check Internet Connection*\n🔄 *Try Again After Some Time*`
                }, { quoted: message });
            }
        }

    } catch (err) {
        console.error('Update Error:', err);
        await client.sendMessage(from, {
            text: `❌ *System Error!*\n\`\`\`${err.message}\`\`\`\n\n⚠️ *Contact Developer:* wa.me/923183928892`
        }, { quoted: message });
    }
});
