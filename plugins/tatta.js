const { cmd } = require('../command');

cmd({
    pattern: "tatta",
    alias: ["owner", "info", "developer", "team", "about", "muzamil", "md"],
    react: "👑",
    desc: "Get MUZAMIL-XD TEAM + TATAY information",
    category: "info",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const infoMessage = `
💀 𝙈𝙐𝙕𝘼𝙈𝙄𝙇 𝙆𝙃𝘼𝙉 💀
𝘾𝙊𝙉𝙏𝙀𝘾𝙏 +923183928892
> 𝙊𝙒𝙉𝙀𝙍 𝙏𝙀𝘼𝙈𝙍𝙀𝘿𝙓𝙃𝘼𝘾𝙆𝙀𝙍 😔

• 𝘿𝙤𝙣𝙩 𝙏𝙖𝙠𝙚 𝙈𝙮 𝙆𝙞𝙣𝙙𝙚𝙨𝙨 𝘼𝙨 𝙈𝙮 𝙒𝙚𝙖𝙠𝙉𝙚𝙨𝙨
• 𝙈𝙮 𝘽𝙡𝙤𝙘𝙠𝙡𝙞𝙨𝙩 𝙄𝙨 𝙡𝙤𝙣𝙜𝙚𝙧 𝙩𝙝𝙖𝙣 𝙔𝙤𝙪𝙧 𝙁𝙧𝙞𝙚𝙣𝙙 𝙇𝙞𝙨𝙩

𝙏𝙊𝙋 𝙈𝙔 𝙃𝘼𝙏𝙏𝙀𝙍𝙎 
🏅+92 330 6137477
🥇+92 328 7621448
🥈+92 328 2520204
🥉+92 311 5845514
🎖️+92 306 5060112

> 𝙄 𝘿𝙊𝙉𝙏 𝙉𝙀𝙀𝘿 𝙏𝙊 𝙈𝙀𝙉𝙏𝙄𝙊𝙉 𝙏𝙃𝙀𝙈 𝙈𝙔 𝘼𝙐𝙍𝘼 𝙄𝙎 𝙉𝙀𝙓𝙏 𝙇𝙀𝙑𝙀𝙇 🎀`;

        await reply(infoMessage);
        
        await conn.sendMessage(from, {
            react: { text: "👑", key: mek.key }
        });

    } catch (error) {
        console.error("MUZAMIL-XD command error:", error);
        reply(`╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
┇      ❌ ERROR ❌      ┇
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯`);
    }
});
