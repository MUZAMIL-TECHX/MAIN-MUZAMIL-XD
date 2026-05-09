const { cmd } = require('../command');
const axios = require('axios');
const fs = require('fs');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

cmd({
    pattern: "voicegirl",
    alias: ["femalevoice", "girlvoice"],
    desc: "Convert audio to female voice",
    category: "fun",
    react: "👧",
    filename: __filename
}, async (conn, mek, m, { from, reply, quoted }) => {
    try {
        // Check if quoted message has audio
        if (!quoted || !quoted.audio) {
            return reply("❌ *Please reply to an audio message!*");
        }

        // Send processing reaction
        await conn.sendMessage(from, {
            react: { text: "⏳", key: mek.key }
        });

        // Download the audio
        const audioBuffer = await quoted.download();
        const inputFile = `input_${Date.now()}.mp3`;
        const outputFile = `output_girl_${Date.now()}.mp3`;
        
        fs.writeFileSync(inputFile, audioBuffer);

        // FFmpeg command for female voice (high pitch)
        const ffmpegCmd = `ffmpeg -i ${inputFile} -af "asetrate=44100*1.3,atempo=0.9" ${outputFile}`;
        
        await execPromise(ffmpegCmd);

        // Send modified audio
        await conn.sendMessage(from, {
            audio: fs.readFileSync(outputFile),
            mimetype: 'audio/mpeg',
            fileName: 'girl_voice.mp3',
            ptt: true,
            caption: "👧 *Female Voice Converted!*\n⚡ Powered by MUZAMIL-XD"
        }, { quoted: mek });

        // Cleanup
        fs.unlinkSync(inputFile);
        fs.unlinkSync(outputFile);

        // Success reaction
        await conn.sendMessage(from, {
            react: { text: "✅", key: mek.key }
        });

    } catch (error) {
        console.error("Voice Error:", error);
        
        await conn.sendMessage(from, {
            react: { text: "❌", key: mek.key }
        });
        
        reply("❌ *Voice conversion failed!*\nMake sure FFmpeg is installed on server.");
    }
});

// Multiple voice effects
cmd({
    pattern: "voicechipmunk",
    alias: ["chipmunk", "highvoice"],
    desc: "Convert to chipmunk voice",
    react: "🐿️",
    category: "fun",
    filename: __filename
}, async (conn, mek, m, { from, reply, quoted }) => {
    try {
        if (!quoted || !quoted.audio) {
            return reply("❌ *Reply to audio message!*");
        }

        await conn.sendMessage(from, {
            react: { text: "⏳", key: mek.key }
        });

        const audioBuffer = await quoted.download();
        const inputFile = `input_${Date.now()}.mp3`;
        const outputFile = `output_chipmunk_${Date.now()}.mp3`;
        
        fs.writeFileSync(inputFile, audioBuffer);

        // Chipmunk voice (very high pitch)
        const ffmpegCmd = `ffmpeg -i ${inputFile} -af "asetrate=44100*1.8,atempo=0.8" ${outputFile}`;
        
        await execPromise(ffmpegCmd);

        await conn.sendMessage(from, {
            audio: fs.readFileSync(outputFile),
            mimetype: 'audio/mpeg',
            fileName: 'chipmunk_voice.mp3',
            caption: "🐿️ *Chipmunk Voice!*\n⚡ MUZAMIL-XD"
        }, { quoted: mek });

        fs.unlinkSync(inputFile);
        fs.unlinkSync(outputFile);

        await conn.sendMessage(from, {
            react: { text: "✅", key: mek.key }
        });

    } catch (error) {
        reply("❌ *Error!* Check FFmpeg installation.");
    }
});

// Deep male voice
cmd({
    pattern: "voicedeep",
    alias: ["deepvoice", "malevoice"],
    desc: "Convert to deep male voice",
    react: "🎤",
    category: "fun",
    filename: __filename
}, async (conn, mek, m, { from, reply, quoted }) => {
    try {
        if (!quoted || !quoted.audio) {
            return reply("❌ *Reply to audio message!*");
        }

        await conn.sendMessage(from, {
            react: { text: "⏳", key: mek.key }
        });

        const audioBuffer = await quoted.download();
        const inputFile = `input_${Date.now()}.mp3`;
        const outputFile = `output_deep_${Date.now()}.mp3`;
        
        fs.writeFileSync(inputFile, audioBuffer);

        // Deep voice (low pitch)
        const ffmpegCmd = `ffmpeg -i ${inputFile} -af "asetrate=44100*0.7,atempo=1.1" ${outputFile}`;
        
        await execPromise(ffmpegCmd);

        await conn.sendMessage(from, {
            audio: fs.readFileSync(outputFile),
            mimetype: 'audio/mpeg',
            fileName: 'deep_voice.mp3',
            caption: "🎤 *Deep Voice!*\n⚡ MUZAMIL-XD"
        }, { quoted: mek });

        fs.unlinkSync(inputFile);
        fs.unlinkSync(outputFile);

        await conn.sendMessage(from, {
            react: { text: "✅", key: mek.key }
        });

    } catch (error) {
        reply("❌ *Error!*");
    }
});

// Voice effects menu
cmd({
    pattern: "voicehelp",
    alias: ["voiceeffects", "voices"],
    desc: "Show all voice effects",
    react: "🎭",
    category: "help",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    const helpText = `
🎭 *VOICE CHANGER EFFECTS*

👧 *Female Voices:*
• .voicegirl - Sweet girl voice
• .voicechipmunk - High pitch voice
• .voiceanime - Anime girl voice

🎤 *Male Voices:*
• .voicedeep - Deep male voice
• .voicerobot - Robot voice
• .voiceold - Old man voice

👽 *Funny Effects:*
• .voicealien - Alien voice
• .voicedemon - Demon voice
• .voicereverse - Reverse audio
• .voiceslow - Slow motion
• .voicefast - Fast forward

📝 *Usage:*
1. Send/reply to audio message
2. Use any voice command
3. Get modified audio

⚠️ *Requirement:*
FFmpeg must be installed on server

⚡ *ᴘᴏᴡᴇʀᴇᴅ ʙʏ мʋʓαмιℓ*
`;
    
    await reply(helpText);
});