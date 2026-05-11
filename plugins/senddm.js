const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

cmd({
    pattern: "senddm",
    alias: ["dm", "send", "broadcast", "bc"],
    desc: "Send private message to user or broadcast to all",
    category: "owner",
    react: "📨",
    filename: __filename,
    use: ".senddm @user [message] OR .senddm all [message]"
}, async (conn, mek, m, { from, reply, text, mentioned, pushName, isOwner }) => {
    try {
        // Check if user is owner
        if (!isOwner) {
            return reply("❌ *Owner Command Only!*\nOnly bot owner can use this.");
        }

        const args = text ? text.split(' ') : [];
        const target = args[0]?.toLowerCase();
        const message = args.slice(1).join(' ');

        if (!target || !message) {
            return reply("📌 *Usage:*\n• .senddm @user [message]\n• .senddm all [message]\n• .senddm group [group-id] [message]");
        }

        // Show processing
        await conn.sendMessage(from, { 
            react: { text: "⏳", key: mek.key } 
        });

        // ==================== CASE 1: MENTION USER ====================
        if (mentioned && mentioned.length > 0) {
            const user = mentioned[0];
            const username = user.split('@')[0];
            
            try {
                await conn.sendMessage(user, {
                    text: `📨 *Message from ${pushName || "MUZAMIL-XD Owner"}*\n\n${message}\n\n_This is a private message_`
                });
                
                await reply(`✅ *Message sent to @${username}*`);
                await conn.sendMessage(from, {
                    react: { text: "✅", key: mek.key }
                });
                
            } catch (error) {
                console.error("DM Error:", error);
                await reply(`❌ Failed to send to @${username}\nError: ${error.message}`);
            }
        }
        
        // ==================== CASE 2: BROADCAST TO ALL ====================
        else if (target === 'all' || target === 'broadcast') {
            await reply("📢 *Starting broadcast to all users...*");
            
            let successCount = 0;
            let failCount = 0;
            
            // Get all chats (users)
            try {
                const chats = await conn.chats.all();
                const users = chats.filter(chat => chat.id.endsWith('@s.whatsapp.net'));
                
                await reply(`📊 *Total Users:* ${users.length}\n⏳ *Sending messages...*`);
                
                for (let i = 0; i < users.length; i++) {
                    const user = users[i];
                    
                    try {
                        await conn.sendMessage(user.id, {
                            text: `📢 *Broadcast from ${config?.OWNER_NAME || "MUZAMIL-XD"}*\n\n${message}\n\n_• Do not reply to this broadcast_`
                        });
                        
                        successCount++;
                        
                        // Show progress every 10 messages
                        if (successCount % 10 === 0) {
                            await conn.sendMessage(from, {
                                text: `📤 Sent: ${successCount}/${users.length}`
                            });
                        }
                        
                        // Delay to avoid rate limiting
                        await new Promise(resolve => setTimeout(resolve, 500));
                        
                    } catch (error) {
                        failCount++;
                        console.log(`Failed to send to ${user.id}:`, error.message);
                    }
                }
                
                // Final report
                const report = `
📊 *BROADCAST COMPLETE*
✅ Success: ${successCount}
❌ Failed: ${failCount}
📨 Total: ${users.length}
⏰ Time: ${new Date().toLocaleTimeString()}`;
                
                await reply(report);
                
            } catch (error) {
                console.error("Broadcast Error:", error);
                await reply(`❌ Broadcast failed: ${error.message}`);
            }
        }
        
        // ==================== CASE 3: SEND TO SPECIFIC JID ====================
        else if (target.startsWith('+') || target.startsWith('@')) {
            let jid = target;
            if (jid.startsWith('+')) {
                jid = jid.replace('+', '') + '@s.whatsapp.net';
            } else if (jid.startsWith('@')) {
                jid = jid.substring(1) + '@s.whatsapp.net';
            }
            
            try {
                await conn.sendMessage(jid, {
                    text: `📨 *Message from ${pushName || "MUZAMIL-XD Owner"}*\n\n${message}`
                });
                
                await reply(`✅ *Message sent to ${jid}*`);
                
            } catch (error) {
                await reply(`❌ Failed to send: ${error.message}`);
            }
        }
        
        // ==================== CASE 4: SEND TO GROUP ====================
        else if (target === 'group') {
            const groupId = args[1];
            const groupMessage = args.slice(2).join(' ');
            
            if (!groupId || !groupMessage) {
                return reply("📌 Usage: .senddm group [group-id] [message]");
            }
            
            try {
                await conn.sendMessage(groupId + '@g.us', {
                    text: `📢 *Admin Announcement*\n\n${groupMessage}\n\n_• Sent by ${pushName || "Owner"}_`
                });
                
                await reply(`✅ *Message sent to group ${groupId}*`);
                
            } catch (error) {
                await reply(`❌ Group send failed: ${error.message}`);
            }
        }
        
        else {
            await reply("❌ *Invalid target!*\nUse: @user, all, +923001234567, or group [id]");
        }

    } catch (error) {
        console.error("SENDDM ERROR:", error);
        await reply(`❌ Command failed: ${error.message}`);
    }
});

// ==================== SEND FILE DM ====================
cmd({
    pattern: "sendfile",
    alias: ["filedm", "senddoc"],
    desc: "Send file/document to user",
    category: "owner",
    react: "📎",
    filename: __filename,
    use: ".sendfile @user [file-url] OR .sendfile @user [caption]"
}, async (conn, mek, m, { from, reply, text, mentioned, isOwner }) => {
    if (!isOwner) return reply("❌ Owner only!");
    
    const args = text.split(' ');
    const target = mentioned?.[0];
    const fileUrl = args[args.length - 1];
    
    if (!target || !fileUrl) {
        return reply("📌 Usage: .sendfile @user [file-url] [caption]");
    }
    
    try {
        // Check if URL is valid
        if (fileUrl.startsWith('http')) {
            await conn.sendMessage(target, {
                document: { url: fileUrl },
                mimetype: 'application/octet-stream',
                fileName: 'file_from_owner.pdf'
            });
        } else {
            // Send as text if not URL
            await conn.sendMessage(target, {
                text: `📎 *File Message*\n\n${text}\n\n_Sent by owner_`
            });
        }
        
        await reply(`✅ File sent to @${target.split('@')[0]}`);
        
    } catch (error) {
        await reply(`❌ File send failed: ${error.message}`);
    }
});

// ==================== DM LIST ====================
cmd({
    pattern: "dmlist",
    alias: ["listdm", "dmusers"],
    desc: "List users who can receive DMs",
    category: "owner",
    react: "📋",
    filename: __filename
}, async (conn, mek, m, { from, reply, isOwner }) => {
    if (!isOwner) return reply("❌ Owner only!");
    
    try {
        const chats = await conn.chats.all();
        const users = chats
            .filter(chat => chat.id.endsWith('@s.whatsapp.net'))
            .slice(0, 50); // Show first 50 only
        
        let list = `📋 *DM USERS LIST* (${users.length} total)\n\n`;
        
        users.forEach((user, index) => {
            const number = user.id.split('@')[0];
            const name = user.name || user.notify || `User ${index + 1}`;
            list += `${index + 1}. ${name} (${number})\n`;
        });
        
        if (users.length > 50) {
            list += `\n... and ${users.length - 50} more users`;
        }
        
        await reply(list);
        
    } catch (error) {
        await reply(`❌ Failed to get list: ${error.message}`);
    }
});

console.log("✅ SENDDM Plugin Loaded!");
