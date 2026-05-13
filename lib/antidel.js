const { isJidGroup } = require('@whiskeysockets/baileys');
const { loadMessage, getAnti } = require('../data');
const config = require('../config');

const DeletedText = async (conn, mek, deleteInfo, isGroup, update) => {
    const messageContent = mek.message?.conversation || mek.message?.extendedTextMessage?.text || 'Unknown content';
    deleteInfo += `\n◈ Content ━ ${messageContent}`;

    // SIRF OWNER KE INBOX MEIN (conn.user.id = bot ka number jisne login kiya)
    await conn.sendMessage(
        conn.user.id,  // 👈 YAHAN CHANGE - hamesha owner ke inbox mein jayega
        {
            text: deleteInfo,
            contextInfo: {
                mentionedJid: isGroup ? [update.key.participant, mek.key.participant] : [update.key.remoteJid],
            },
        },
        { quoted: mek },
    );
};

const DeletedMedia = async (conn, mek, deleteInfo) => {
    const antideletedmek = structuredClone(mek.message);
    const messageType = Object.keys(antideletedmek)[0];
    if (antideletedmek[messageType]) {
        antideletedmek[messageType].contextInfo = {
            stanzaId: mek.key.id,
            participant: mek.sender,
            quotedMessage: mek.message,
        };
    }
    
    // SIRF OWNER KE INBOX MEIN MEDIA BHEJE
    if (messageType === 'imageMessage' || messageType === 'videoMessage') {
        antideletedmek[messageType].caption = deleteInfo;
        await conn.relayMessage(conn.user.id, antideletedmek, {});  // 👈 Owner ke inbox mein
    } else if (messageType === 'audioMessage' || messageType === 'documentMessage') {
        await conn.sendMessage(conn.user.id, { text: `*⚠️ Deleted Message Alert*\n${deleteInfo}` }, { quoted: mek });  // 👈 Owner ke inbox mein
    } else {
        await conn.relayMessage(conn.user.id, antideletedmek, {});  // 👈 Baki sab bhi owner ke inbox mein
    }
};

const AntiDelete = async (conn, updates) => {
    for (const update of updates) {
        if (update.update.message === null) {
            const store = await loadMessage(update.key.id);

            if (store && store.message) {
                const mek = store.message;
                const isGroup = isJidGroup(store.jid);
                const antiDeleteStatus = await getAnti();
                if (!antiDeleteStatus) continue;

                const deleteTime = new Date().toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                });

                let deleteInfo;
                
                if (isGroup) {
                    const groupMetadata = await conn.groupMetadata(store.jid);
                    const groupName = groupMetadata.subject;
                    const sender = mek.key.participant?.split('@')[0];
                    const deleter = update.key.participant?.split('@')[0];

                    deleteInfo = `*╭────⬡ ANTI-DELETE ⬡────*
*├♻️ SENDER:* @${sender}
*├👥 GROUP:* ${groupName}
*├⏰ TIME:* ${deleteTime}
*├🗑️ DELETED BY:* @${deleter}
*╰💬 CONTENT:* 🔽`;
                } else {
                    const senderNumber = mek.key.remoteJid?.split('@')[0];
                    const deleterNumber = update.key.remoteJid?.split('@')[0];
                    
                    deleteInfo = `*╭────⬡ ANTI-DELETE ⬡────*
*├👤 SENDER:* @${senderNumber}
*├⏰ TIME:* ${deleteTime}
*├🗑️ DELETED BY:* @${deleterNumber}
*╰💬 CONTENT:* 🔽`;
                }

                if (mek.message?.conversation || mek.message?.extendedTextMessage) {
                    await DeletedText(conn, mek, deleteInfo, isGroup, update);
                } else {
                    await DeletedMedia(conn, mek, deleteInfo);
                }
            }
        }
    }
};

module.exports = {
    DeletedText,
    DeletedMedia,
    AntiDelete,
};