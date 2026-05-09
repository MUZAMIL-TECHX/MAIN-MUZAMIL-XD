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
╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
┇     🔥 *ΜƲ𝗭𝗔ΜƖL XD 𝙏𝙀𝘾𝙃* 🔥      ┇
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯

┏•✧✦✧•┃ 👑 OWNER ┃•✧✦✧•┓
┇  ▸ 𝗡𝗮𝗺𝗲    : ΜƲ𝗭𝗔ΜƖ˩ ƘĦ𝗔И       ┇
┇  ▸ 𝗣𝗵𝗼𝗻𝗲  : +923183928892 ┇
┇  ▸ 𝗘𝗺𝗮𝗶𝗹  : teamredxhacker@gmail.com ┇
┇  ▸ Ƭɛℓɛɢяαм    : @TeamRedXhacker1 ┇
┗•✧✦✧•━━━━━━━━━━•✧✦✧•┛

┏•✧✦✧•┃ 🤝 TEAM ┃•✧✦✧•┓
┇  ▸ ΜƲ𝗭𝗔ΜƖ˩ ƘĦ𝗔И (Boss)     ┇
┇  ▸ 𝗔βƉƲ˩ЯЄĦΜ𝗔И (ƧƖЯ)                       ┇
┇  ▸ ЯƲβ𝗔β ƧĦЄƖƘĦ (𝗔ƉΜƖИ)                          ┇
┇  ▸ 𝗭ѲĦЯ𝗔β (ƉЄѴЄ˩ѲƤЄЯ)                          ┇
┇  ▸ Ғ𝗔ĦЄЄΜ ƘĦ𝗔И (ƤЯѲҒ)                          ┇
┗•✧✦✧•━━━━━━━━━━•✧✦✧•┛

╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
┇ *TOP INTERNATIONAL TATAY* 👑 ┇
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯

1:  PANDA                     +923067455102
2:  SAAD MALIK                +923211967283
3:  ABDULLAH                  +923436480747
4:  SALMAN                    +923233215342
5:  ZINKO                     +923315775490
6:  MR HAJI                   +79375788116
7:  SAMI                      +923315027079
8:  BABA TILO                 +923345254458
9:  ALI KHAN                  +923124737734

╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
┇   ⚡ ΜƲ𝗭𝗔ΜƖ˩ ƘĦ𝗔И ⚡    ┇
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯`;

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
