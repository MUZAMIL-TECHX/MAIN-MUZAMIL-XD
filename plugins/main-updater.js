// plugins/update.js
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports = {
    name: 'update',
    description: 'MUZAMIL-XD Updater - Only Owner',
    async execute(conn, mek, from, args) {
        
        // 🔒 SIRF MUZAMIL KA NUMBER
        const OWNER_NUMBER = "923183928892"; // Sirf yeh number use kar sakta hai
        const sender = mek.key.participant || mek.key.remoteJid;
        const senderNum = sender.split('@')[0];
        
        // Agar sender owner nahi hai to warning message bhejo
        if (senderNum !== OWNER_NUMBER && !mek.key.fromMe) {
            await conn.sendMessage(from, { 
                text: `╭━━━━━━━━━━━━━━━⬣\n┃❌ *ACCESS DENIED!*\n┃━━━━━━━━━━━━━━━\n┃👤 *Your Number:* +${senderNum}\n┃⚠️ *Status:* Unauthorized\n┃━━━━━━━━━━━━━━━\n┃🔒 *Only Muzamil Can Do This!*\n┃📞 *Contact:* wa.me/${OWNER_NUMBER}\n╰━━━━━━━━━━━━━━━⬣\n\n> © MUZAMIL-XD BOT` 
            });
            return;
        }
        
        // ✅ Owner hai - update start karo
        const REPO_URL = 'https://github.com/MUZAMIL-TECHX/MAIN-MUZAMIL-XD';
        const ZIP_URL = 'https://github.com/MUZAMIL-TECHX/MAIN-MUZAMIL-XD/archive/refs/heads/main.zip';
        
        await conn.sendMessage(from, { text: '╭━━━━━━━━━━━━━━━⬣\n┃✅ *ACCESS GRANTED!*\n┃━━━━━━━━━━━━━━━\n┃👑 *Welcome Boss Muzamil!*\n┃🔄 *Starting Update...*\n┃⚡ *Version: 15.0.0*\n╰━━━━━━━━━━━━━━━⬣\n\n⏳ *Updating bot, please wait 1-2 minutes...*' });
        
        // Check if git exists
        const isGit = fs.existsSync(path.join(process.cwd(), '.git'));
        
        if (isGit) {
            // METHOD 1: Git pull
            exec('git pull origin main', async (error, stdout, stderr) => {
                if (error) {
                    await conn.sendMessage(from, { text: '❌ *Git pull failed! Trying ZIP method...*' });
                    await updateViaZip(conn, from, mek, ZIP_URL);
                    return;
                }
                
                let msg = '✅ *Update Successful!*\n\n📊 *Changes:*\n```' + (stdout.slice(0, 300) || 'No changes') + '```';
                
                if (stdout.includes('package.json')) {
                    await conn.sendMessage(from, { text: msg + '\n\n📦 *Installing new dependencies...*' });
                    exec('npm install', async (npmErr) => {
                        if (npmErr) {
                            await conn.sendMessage(from, { text: '⚠️ *Dependency install warning but continuing...*' });
                        }
                        await conn.sendMessage(from, { text: '✅ *Update Complete!*\n🔄 *Restarting MUZAMIL-XD...*\n_Type .alive after 30 seconds_ 📞' });
                        setTimeout(() => process.exit(0), 3000);
                    });
                } else {
                    await conn.sendMessage(from, { text: msg + '\n\n🔄 *Restarting MUZAMIL-XD...*\n_Type .alive after 30 seconds_ 📞' });
                    setTimeout(() => process.exit(0), 3000);
                }
            });
        } else {
            // METHOD 2: ZIP download
            await updateViaZip(conn, from, mek, ZIP_URL);
        }
        
        async function updateViaZip(conn, from, mek, zipUrl) {
            try {
                await conn.sendMessage(from, { text: '📥 *Downloading latest files from GitHub...*' });
                
                const response = await axios({
                    method: 'get',
                    url: zipUrl,
                    responseType: 'arraybuffer',
                    timeout: 60000
                });
                
                const zipPath = path.join(process.cwd(), 'temp_muzamil_update.zip');
                fs.writeFileSync(zipPath, response.data);
                
                await conn.sendMessage(from, { text: '📦 *Extracting files...*' });
                
                // Extract and replace
                exec(`unzip -o ${zipPath} -d ./temp_muzamil && cp -rf ./temp_muzamil/MAIN-MUZAMIL-XD-main/* . && rm -rf ./temp_muzamil ${zipPath}`, async (err) => {
                    if (err) {
                        await conn.sendMessage(from, { text: '❌ *Extraction failed!*\n```' + err.message + '```\n\n⚠️ *Try manual update from GitHub*' });
                        return;
                    }
                    
                    // Check for package.json changes
                    if (fs.existsSync('./package.json')) {
                        await conn.sendMessage(from, { text: '📦 *Checking dependencies...*' });
                        exec('npm install', async (npmErr) => {
                            await conn.sendMessage(from, { text: '✅ *Update Complete!*\n🔄 *Restarting MUZAMIL-XD...*\n_Type .alive after 30 seconds_ 📞' });
                            setTimeout(() => process.exit(0), 3000);
                        });
                    } else {
                        await conn.sendMessage(from, { text: '✅ *Update Complete!*\n🔄 *Restarting MUZAMIL-XD...*\n_Type .alive after 30 seconds_ 📞' });
                        setTimeout(() => process.exit(0), 3000);
                    }
                });
            } catch (error) {
                await conn.sendMessage(from, { text: '❌ *Update Failed!*\n```' + error.message + '```\n\n📌 *Check internet or try manual update*' });
            }
        }
    }
}