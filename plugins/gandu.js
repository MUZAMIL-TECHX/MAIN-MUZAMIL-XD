const { cmd } = require('../command');

// Sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

cmd({
    pattern: "gandu",
    alias: ["gandu", "chutiya", "bhosdike"],
    react: "🤣",
    desc: "Full Higher Ultra Gandu Prank",
    category: "fun",
    use: '.gandu @mention',
    filename: __filename
}, async (conn, mek, m, { from, quoted, sender, reply, isGroup, participants, botNumber }) => {
    try {
        
        // TARGET DETECTION - FIXED VERSION
        let target = null;
        let targetName = null;
        
        // Case 1: Mention kiya hai to use target
        if (m.mentionedJid && m.mentionedJid.length > 0) {
            target = m.mentionedJid[0];
        }
        // Case 2: Kisi ke message pe reply kiya hai to usko target
        else if (quoted && quoted.sender) {
            target = quoted.sender;
        }
        // Case 3: Sirf .gandu likha to khud ko target (sender)
        else {
            target = sender;
        }
        
        // Check karo ke target bot to nahi hai
        if (target === botNumber) {
            target = sender; // Bot ko mention kiya to sender ko target karo
            await reply("😂 *Aap bot ko gandu bana rahe ho? Chalo aap hi bane!*");
        }
        
        targetName = target.split('@')[0];
        const senderName = sender.split('@')[0];

        // Animation messages
        const animations = [
            { text: "🔍 *SYSTEM SCANNING* 🔍\n__________________________________\nChecking user data...", time: 1000 },
            { text: "📊 *ANALYZING BEHAVIOR* 📊\n__________________________________\n▰▰▰▰▰▰▰▰▰▰ 10%", time: 800 },
            { text: "📊 *ANALYZING BEHAVIOR* 📊\n__________________________________\n▰▰▰▰▰▰▰▰▰▰ 25%", time: 800 },
            { text: "📊 *ANALYZING BEHAVIOR* 📊\n__________________________________\n▰▰▰▰▰▰▰▰▰▰ 50%", time: 800 },
            { text: "📊 *ANALYZING BEHAVIOR* 📊\n__________________________________\n▰▰▰▰▰▰▰▰▰▰ 75%", time: 800 },
            { text: "📊 *ANALYZING BEHAVIOR* 📊\n__________________________________\n▰▰▰▰▰▰▰▰▰▰ 99%", time: 800 },
            { text: "📊 *ANALYZING BEHAVIOR* 📊\n__________________________________\n▰▰▰▰▰▰▰▰▰▰ 100%", time: 500 },
            { text: "⚡ *PROCESSING DATA* ⚡\n__________________________________\nFetching from Gandu Database...", time: 1200 },
            { text: "🔄 *CONNECTING TO SERVER* 🔄\n__________________________________\nIP: 192.168.1.69\nPort: 6969\nStatus: Connected ✅", time: 1500 },
            { text: "🔐 *ACCESSING GOVERNMENT DATABASE* 🔐\n__________________________________\nLevel: Top Secret\nSecurity: Bypassed ✅", time: 1300 },
            { text: "📁 *RETRIEVING FILES* 📁\n__________________________________\n▰▰▰▰▰▰▰▰▰▰ 100%", time: 1000 },
            { text: "🧠 *BRAIN SCAN COMPLETE* 🧠\n__________________________________\nIQ Level: Detecting...", time: 1200 },
            { text: "📈 *FINAL REPORT* 📈\n__________________________________\n", time: 500 },
        ];

        // Gandu facts
        const ganduFacts = [
            `╔══════════════════════╗\n` +
            `║    *USER ANALYSIS*    ║\n` +
            `╠══════════════════════╣\n` +
            `║ 👤 *Target:* @${targetName}\n` +
            `║ 🧠 *IQ Level:* 69\n` +
            `║ 🤡 *Gandu Rating:* ∞/10\n` +
            `║ 💀 *Status:* Professional Gandu\n` +
            `║ 🎭 *Specialty:* Gandugiri\n` +
            `╚══════════════════════╝\n\n` +
            `*FACT:* Is bande ko dekh ke Gandu ko bhi gandu lagta hai! 🤣`,

            `╔══════════════════════╗\n` +
            `║   *GANDU DETECTED*    ║\n` +
            `╠══════════════════════╣\n` +
            `║ 🎯 *Name:* @${targetName}\n` +
            `║ 📍 *Location:* Gandu Nagar\n` +
            `║ 🏆 *Achievement:* Gandu of the Year\n` +
            `║ 📊 *Level:* Pro Max Ultra\n` +
            `║ 🔥 *Power Level:* Over 9000\n` +
            `╚══════════════════════╝\n\n` +
            `*REPORT:* Ye insaan nahi, balki Gandu ka avatar hai! 🎭`,

            `┌──────────────────────────┐\n` +
            `│   *GANDU VERIFICATION*   │\n` +
            `├──────────────────────────┤\n` +
            `│ ✅ Gandu: TRUE\n` +
            `│ ✅ Chutiya: TRUE\n` +
            `│ ✅ Bhosdike: TRUE\n` +
            `│ ✅ Lawde: TRUE\n` +
            `│ ✅ Randi: Checking...\n` +
            `│ ✅ Randi: FOUND!\n` +
            `└──────────────────────────┘\n\n` +
            `*CONCLUSION:* Full Time Gandu! hy yee🏆`,
            
            `╭━━━━━━━━━━━━━━━━╮\n` +
            `┃  *GANDU METER*  ┃\n` +
            `╰━━━━━━━━━━━━━━━━╯\n\n` +
            `@${targetName} ki Gandu percentage:\n\n` +
            `💯 ▰▰▰▰▰▰▰▰▰▰ 100%\n\n` +
            `*RESULT:* Gandu Overload! By SIr Muzamil Khan🔥`
        ];

        // Pehla message bhejo
        let animatedMsg = await conn.sendMessage(from, { 
            text: animations[0].text,
            mentions: [target]
        });

        // Animation chalado
        for (let i = 1; i < animations.length; i++) {
            await sleep(animations[i].time);
            await conn.sendMessage(from, { 
                text: animations[i].text,
                edit: animatedMsg.key,
                mentions: [target]
            });
        }

        // Random fact select karo
        const randomFact = ganduFacts[Math.floor(Math.random() * ganduFacts.length)];

        // Final message
        await sleep(500);
        await conn.sendMessage(from, { 
            text: randomFact,
            edit: animatedMsg.key,
            mentions: [target]
        });

        // Extra message
        await sleep(1000);
        await conn.sendMessage(from, { 
            text: `🎉 *CONGRATULATIONS!* 🎉\n@${targetName} ko aaj ka *Gandu of the Day* declare kiya jata hai! Muzamil Ke taraaf sy😂😩🫰🏆\n\n_Sab log taali bajao! 👏👏👏_`,
            mentions: [target]
        });

    } catch (error) {
        console.error('Gandu Error:', error);
        reply("❌ Gandu detection system failed! Maybe you're the real Gandu? 🤔");
    }
});
