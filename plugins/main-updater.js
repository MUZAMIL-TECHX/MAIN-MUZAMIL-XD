bot herkou and uskee api based vps prr deploy h firr? sahe h?

// MUZAMIL-XD/Plugins/update.js - PRODUCTION FINAL
const { cmd } = require("../command");
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// 🔒 HARDLOCK - SIRF TERA NUMBER
const ONLY_OWNER = "923183928892";
const BACKUP_DIR = path.join(process.cwd(), '..', 'muzamil_backup_' + Date.now());
const LOG_FILE = path.join(process.cwd(), 'update_log.txt');

// ✅ CHECK INTERNET WITH AXIOS (WORKS EVERYWHERE)
async function checkInternet() {
try {
await axios.get("https://www.google.com", { timeout: 5000 });
return true;
} catch {
return false;
}
}

// ✅ CHECK GITHUB REACHABLE WITH API (WORKS EVERYWHERE)
async function checkGitHub() {
try {
await axios.get("https://api.github.com", { timeout: 5000 });
return true;
} catch {
return false;
}
}

// ✅ CHECK UNZIP INSTALLED
function checkUnzipInstalled() {
return new Promise((resolve) => {
exec('command -v unzip', (err) => {
resolve(!err);
});
});
}

cmd({
pattern: "update",
alias: ["upgrade", "refresh", "renew"],
react: '🔄',
desc: "Update MUZAMIL-XD (Owner Only) - Production Grade",
category: "owner",
filename: __filename
}, async (client, message, match, { from }) => {

try {  
    // 🔒 FIX 1: GROUPS ME OWNER CHECK 100% WORKING  
    // Old: const sender = message.key?.participant || message.key?.remoteJid || from;  
    // Old: const senderNum = sender.split('@')[0];  
      
    // ✅ NEW: Sirf numbers extract karo - group + private dono mein kaam karega  
    const senderRaw = message.key?.participant || message.key?.remoteJid || from;  
    const senderNum = senderRaw.replace(/[^0-9]/g, ""); // Sirf numbers chahiye  
      
    if (senderNum !== ONLY_OWNER) {  
        await client.sendMessage(from, {  
            text: `╭━━━━━━━━━━━━━━━⬣

┃❌ ACCESS DENIED!
┃━━━━━━━━━━━━━━━
┃⚠️ Owner Only Command
┃🔒 This Action Has Been Logged
┃━━━━━━━━━━━━━━━
┃👑 Contact Owner
┃📞 For Assistance
╰━━━━━━━━━━━━━━━⬣

> © MUZAMIL-XD BOT • Production Protected`
});



fs.appendFileSync(LOG_FILE, `[${new Date().toISOString()}] UNAUTHORIZED: ${senderNum}\n`);  
        return;  
    }  
      
    // ✅ OWNER VERIFIED  
    await client.sendMessage(from, {  
        text: `╭━━━━━━━━━━━━━━━⬣

┃✅ ACCESS GRANTED
┃━━━━━━━━━━━━━━━
┃👑 Welcome Boss @${ONLY_OWNER}
┃🔄 Initializing Update
┃📦 Creating Lightweight Backup...
┃🌐 Checking Internet...
╰━━━━━━━━━━━━━━━⬣,   mentions: [${ONLY_OWNER}@s.whatsapp.net`]
});

// 🌐 CHECK INTERNET  
    const isOnline = await checkInternet();  
    if (!isOnline) {  
        await client.sendMessage(from, {  
            text: `❌ *No Internet Connection!*\n📡 *Please check your network*\n🔄 *Try again later*`  
        });  
        return;  
    }  
      
    // 📡 CHECK GITHUB REACHABLE  
    const isGitHubReachable = await checkGitHub();  
    if (!isGitHubReachable) {  
        await client.sendMessage(from, {  
            text: `⚠️ *GitHub is not reachable!*\n🔄 *Check your connection*\n📞 *Try again later*`  
        });  
        return;  
    }  
      
    await client.sendMessage(from, { text: '✅ *Internet & GitHub Reachable*' });  
      
    // ✅ FIX 2: CHECK UNZIP INSTALLED BEFORE ZIP UPDATE  
    const hasUnzip = await checkUnzipInstalled();  
    if (!hasUnzip) {  
        await client.sendMessage(from, {  
            text: `❌ *unzip command not installed on server!*\n📦 *Please install: apt install unzip -y*\n🔄 *Use Git method instead*`  
        });  
        // Try Git method even if no unzip  
        const isGit = fs.existsSync(path.join(process.cwd(), '.git'));  
        if (!isGit) {  
            return;  
        }  
    }  
      
    // 📦 CREATE BACKUP WITH RSYNC  
    const escapedCwd = `"${process.cwd()}"`;  
    const escapedBackup = `"${BACKUP_DIR}"`;  
      
    exec('command -v rsync', async (rsyncErr) => {  
        let backupCmd;  
        if (!rsyncErr) {  
            backupCmd = `rsync -a --exclude=node_modules --exclude=.git --exclude=tmp --exclude=sessions "${process.cwd()}/" "${BACKUP_DIR}"`;  
            await client.sendMessage(from, { text: '📦 *Creating optimized backup (rsync)...*' });  
        } else {  
            backupCmd = `cp -r ${escapedCwd} ${escapedBackup}`;  
            await client.sendMessage(from, { text: '📦 *Creating backup (cp fallback)...*' });  
        }  
          
        exec(backupCmd, async (backupErr) => {  
            if (backupErr) {  
                await client.sendMessage(from, { text: '⚠️ Backup failed but continuing...' });  
                fs.appendFileSync(LOG_FILE, `[${new Date().toISOString()}] BACKUP FAILED: ${backupErr.message}\n`);  
            } else {  
                await client.sendMessage(from, { text: '✅ Lightweight backup created!' });  
                fs.appendFileSync(LOG_FILE, `[${new Date().toISOString()}] BACKUP SUCCESS: ${BACKUP_DIR}\n`);  
            }  
              
            await performUpdate(client, from, message);  
        });  
    });  
      
    async function performUpdate(client, from, message) {  
        const ZIP_URL = 'https://github.com/MUZAMIL-TECHX/MAIN-MUZAMIL-XD/archive/refs/heads/main.zip';  
        const isGit = fs.existsSync(path.join(process.cwd(), '.git'));  
          
        if (isGit) {  
            await client.sendMessage(from, { text: '📡 *Git Mode Activated*' });  
            exec('git pull origin main', async (error, stdout, stderr) => {  
                if (error) {  
                    await client.sendMessage(from, { text: '⚠️ Git failed! Trying ZIP...' });  
                    await updateViaZip(client, from, message, ZIP_URL);  
                    return;  
                }  
                  
                let msg = '✅ *Update Done!*\n```' + (stdout.slice(0, 150) || 'Updated') + '```';  
                fs.appendFileSync(LOG_FILE, `[${new Date().toISOString()}] GIT PULL: ${stdout}\n`);  
                  
                if (stdout.includes('package.json')) {  
                    await client.sendMessage(from, { text: msg + '\n\n📦 Installing dependencies...' });  
                    // ✅ FIX 3: FASTER NPM INSTALL  
                    exec('npm install --force --omit=dev --no-audit --no-fund', () => {  
                        finalizeUpdate(client, from, message);  
                    });  
                } else {  
                    await client.sendMessage(from, { text: msg + '\n\n🔄 Finalizing...' });  
                    finalizeUpdate(client, from, message);  
                }  
            });  
        } else {  
            await updateViaZip(client, from, message, ZIP_URL);  
        }  
    }  
      
    // 📦 ZIP UPDATE WITH UNZIP CHECK  
    async function updateViaZip(client, from, message, zipUrl) {  
        try {  
            // Double check unzip  
            const hasUnzipAgain = await checkUnzipInstalled();  
            if (!hasUnzipAgain) {  
                await client.sendMessage(from, { text: '❌ *unzip not installed! Cannot proceed.*' });  
                return;  
            }  
              
            await client.sendMessage(from, { text: '📥 Downloading latest files...' });  
              
            const response = await axios({  
                method: 'get',  
                url: zipUrl,  
                responseType: 'arraybuffer',  
                timeout: 90000  
            });  
              
            const zipPath = path.join(process.cwd(), 'temp_update.zip');  
            fs.writeFileSync(zipPath, response.data);  
              
            await client.sendMessage(from, { text: '📦 Extracting files...' });  
              
            const escapedZip = `"${zipPath}"`;  
            exec(`unzip -o ${escapedZip} -d ./temp_folder && cp -rf ./temp_folder/MAIN-MUZAMIL-XD-main/. . && rm -rf ./temp_folder ${escapedZip}`, async (err) => {  
                if (err) {  
                    await client.sendMessage(from, { text: '❌ Extract failed! Rolling back...' });  
                    fs.appendFileSync(LOG_FILE, `[${new Date().toISOString()}] EXTRACT FAILED: ${err.message}\n`);  
                    await rollbackUpdate(client, from, message);  
                    return;  
                }  
                  
                if (fs.existsSync('./package.json')) {  
                    await client.sendMessage(from, { text: '📦 Installing dependencies...' });  
                    // ✅ FIX 3: FASTER NPM INSTALL  
                    exec('npm install --force --omit=dev --no-audit --no-fund', () => {  
                        finalizeUpdate(client, from, message);  
                    });  
                } else {  
                    finalizeUpdate(client, from, message);  
                }  
            });  
        } catch (error) {  
            await client.sendMessage(from, { text: '❌ Update failed! Rolling back...' });  
            fs.appendFileSync(LOG_FILE, `[${new Date().toISOString()}] ZIP FAILED: ${error.message}\n`);  
            await rollbackUpdate(client, from, message);  
        }  
    }  
      
    // 🔄 FINALIZE UPDATE  
    async function finalizeUpdate(client, from, message) {  
        await client.sendMessage(from, {  
            text: `╭━━━━━━━━━━━━━━━⬣

┃✅ UPDATE COMPLETE!
┃━━━━━━━━━━━━━━━
┃🔄 Restarting MUZAMIL-XD
┃📞 Back Online In 30 Sec
┃💬 Type .alive to Check
┃━━━━━━━━━━━━━━━
┃🔥 Version: 15.0.0
┃👑 Owner: MUZAMIL KHAN
┃🛡️ Build: Production Final
╰━━━━━━━━━━━━━━━⬣

> ⚡ MUZAMIL-XD • Enterprise Edition`
});



fs.appendFileSync(LOG_FILE, `[${new Date().toISOString()}] UPDATE SUCCESS\n`);  
          
        // Cleanup old backup (keep latest 3)  
        exec(`ls -t ../muzamil_backup_* 2>/dev/null | tail -n +4 | xargs -I {} rm -rf "{}" 2>/dev/null || true`);  
          
        setTimeout(() => {  
            process.exit(0);  
        }, 2500);  
    }  
      
    // 🔄 ROLLBACK SYSTEM  
    async function rollbackUpdate(client, from, message) {  
        await client.sendMessage(from, {  
            text: `⚠️ *UPDATE FAILED!*

🔄 Initiating Rollback...
📦 Restoring from lightweight backup...`
});

const escapedBackup = `"${BACKUP_DIR}"`;  
        exec(`cp -rf ${escapedBackup}/. . && rm -rf ${escapedBackup}`, async (rollbackErr) => {  
            if (rollbackErr) {  
                await client.sendMessage(from, {  
                    text: `❌ *CRITICAL!*

⚠️ Manual intervention needed
📞 Contact: wa.me/${ONLY_OWNER}  });   fs.appendFileSync(LOG_FILE,[${new Date().toISOString()}] ROLLBACK FAILED: ${rollbackErr.message}\n);   } else {   await client.sendMessage(from, {   text: ✅ Rollback Successful!
🔄 Restarting previous version...  });   fs.appendFileSync(LOG_FILE,[${new Date().toISOString()}] ROLLBACK SUCCESS\n`);
setTimeout(() => process.exit(0), 2000);
}
});
}

} catch (err) {  
    console.error('Update Error:', err);  
    fs.appendFileSync(LOG_FILE, `[${new Date().toISOString()}] CRITICAL ERROR: ${err.message}\n`);  
    await client.sendMessage(from, {  
        text: `❌ *System Error!*\n\`\`\`${err.message}\`\`\`\n📞 *Contact: wa.me/${ONLY_OWNER}*`  
    });  
}

});
