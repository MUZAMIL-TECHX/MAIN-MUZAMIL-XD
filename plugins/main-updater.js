// MUZAMIL-XD/Plugins/update.js - HEROKU PRODUCTION FINAL
const { cmd } = require("../command");
const axios = require('axios');
const fs = require('fs');

const ONLY_OWNER = "923183928892";

// GitHub headers with token support
const getGitHubHeaders = () => {
    const headers = {};
    if (process.env.GITHUB_TOKEN) {
        headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
    }
    return headers;
};

// Get latest commit from GitHub
const getLatestCommit = async () => {
    try {
        const { data } = await axios.get(
            "https://api.github.com/repos/MUZAMIL-TECHX/MAIN-MUZAMIL-XD/commits/main",
            { headers: getGitHubHeaders(), timeout: 10000 }
        );
        return {
            hash: data.sha.slice(0, 7),
            message: data.commit.message.split('\n')[0],
            date: data.commit.author.date
        };
    } catch (error) {
        console.error("GitHub API Error:", error.message);
        return null;
    }
};

// Trigger Heroku deploy
const triggerHerokuDeploy = async () => {
    const HEROKU_APP_NAME = process.env.HEROKU_APP_NAME;
    const HEROKU_API_KEY = process.env.HEROKU_API_KEY;
    
    if (!HEROKU_APP_NAME || !HEROKU_API_KEY) {
        return { success: false, error: "Heroku credentials missing" };
    }
    
    try {
        await axios.post(
            `https://api.heroku.com/apps/${HEROKU_APP_NAME}/builds`,
            {
                source_blob: {
                    url: "https://github.com/MUZAMIL-TECHX/MAIN-MUZAMIL-XD/tarball/main"
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${HEROKU_API_KEY}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.heroku+json; version=3'
                },
                timeout: 15000
            }
        );
        return { success: true };
    } catch (error) {
        console.error("Heroku API Error:", error.message);
        return { success: false, error: error.message };
    }
};

// Main update command
cmd({
    pattern: "update",
    alias: ["upgrade", "deploy"],
    react: '🔄',
    desc: "Update bot on Heroku (Owner Only)",
    category: "owner",
    filename: __filename
}, async (client, message, match, { from }) => {
    try {
        // Owner verification
        const senderRaw = message.key?.participant || message.key?.remoteJid || from;
        const senderNum = senderRaw.replace(/[^0-9]/g, "");
        
        if (senderNum !== ONLY_OWNER) {
            return await client.sendMessage(from, {
                text: "❌ *Access Denied!*\n👑 Owner only command."
            });
        }
        
        await client.sendMessage(from, { 
            text: "🔄 *Checking for updates...*" 
        });
        
        // Get latest commit info
        const latest = await getLatestCommit();
        if (!latest) {
            return await client.sendMessage(from, {
                text: "❌ *Failed to check GitHub*\n📡 Check internet or API limit."
            });
        }
        
        // Read current version (optional - from env or file)
        let currentHash = "unknown";
        if (fs.existsSync('./commit.txt')) {
            currentHash = fs.readFileSync('./commit.txt', 'utf8').trim();
        }
        
        // Check if update needed
        if (currentHash === latest.hash && currentHash !== "unknown") {
            return await client.sendMessage(from, {
                text: `✅ *Already up to date!*\n📦 Current: ${latest.hash}\n📝 ${latest.message}`
            });
        }
        
        await client.sendMessage(from, {
            text: `📥 *New update available!*\n\n🔄 ${currentHash} → ${latest.hash}\n📝 ${latest.message}\n📅 ${new Date(latest.date).toLocaleString()}\n\n🚀 Triggering deploy...`
        });
        
        // Trigger Heroku deploy
        const deploy = await triggerHerokuDeploy();
        
        if (deploy.success) {
            // Save new commit hash (will persist until restart)
            fs.writeFileSync('./commit.txt', latest.hash);
            
            await client.sendMessage(from, {
                text: `✅ *Deploy triggered successfully!*\n\n⏱️ Bot will restart in 2-3 minutes\n📦 New Version: ${latest.hash}\n\n> MUZAMIL-XD • Heroku Production`
            });
        } else {
            await client.sendMessage(from, {
                text: `⚠️ *Manual deploy required*\n\n🔗 https://dashboard.heroku.com/apps\n\nNew commit: ${latest.hash}\n\n${deploy.error ? `\nError: ${deploy.error}` : ''}`
            });
        }
        
    } catch (error) {
        console.error("Update Error:", error);
        await client.sendMessage(from, {
            text: `❌ *Error:*\n${error.message}`
        });
    }
});

// Status check command
cmd({
    pattern: "version",
    alias: ["check", "status", "info"],
    react: '📦',
    desc: "Check bot version and status",
    category: "owner",
    filename: __filename
}, async (client, message, match, { from }) => {
    const latest = await getLatestCommit();
    let current = "unknown";
    
    if (fs.existsSync('./commit.txt')) {
        current = fs.readFileSync('./commit.txt', 'utf8').trim();
    }
    
    const needsUpdate = (current !== latest?.hash && current !== "unknown");
    
    await client.sendMessage(from, {
        text: `╭━━━━━━━━━━━━━━━⬣
┃📦 *BOT STATUS*
┃━━━━━━━━━━━━━━━
┃🆔 Current: ${current}
┃🌐 Latest: ${latest?.hash || "unknown"}
┃📝 ${latest?.message || ""}
┃🔄 Status: ${needsUpdate ? "⚠️ Update available" : "✅ Up to date"}
┃━━━━━━━━━━━━━━━
┃☁️ Platform: Heroku
┃🚀 Command: .update
┃━━━━━━━━━━━━━━━
┃⚡ MUZAMIL-XD
╰━━━━━━━━━━━━━━━⬣`
    });
});
