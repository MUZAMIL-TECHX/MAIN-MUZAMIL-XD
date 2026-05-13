const axios = require('axios');
const { cmd } = require("../command");

cmd({
  pattern: "mp4",
  alias: ["ytvideo", "ytv", "drama"],
  desc: "Download YouTube videos - Get video from YouTube",
  react: '🎬',
  category: 'tools',
  filename: __filename
}, async (conn, m, store, {
  from,
  args,
  reply,
  sender
}) => {
  if (!args[0]) {
    return reply("🌸 *What YouTube video do you want to download?*\n\n*📌 Usage:* `.video <YouTube URL or search query>`\n*✨ Example:* `.video https://youtu.be/xxx`\n*✨ Or:* `.video attaullah khan song`\n\n*🎯 Downloads YouTube video in best quality*");
  }

  const query = args.join(" ");
  await store.react('⏳');

  try {
    reply(`🔎 *Processing your request...*\n📹 *Query:* ${query}`);
    
    const HECTOR_API_URL = 'https://yt-dl.officialhectormanuel.workers.dev/';
    
    // If it's a YouTube URL
    let videoUrl = query;
    const youtubeRegex = /(youtu\.be\/|youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/;
    
    if (!youtubeRegex.test(query)) {
      // Search for video first (you may need a search API)
      reply(`🔍 *Searching YouTube for:* ${query}\n⏳ Please wait...`);
      // For search, you might need another API, or just ask user to provide URL
      return reply(`❌ *Please provide a valid YouTube URL*\n\n📌 *Example:*\n.video https://youtu.be/dQw4w9WgXcQ\n\nOr search on YouTube and share the link here.`);
    }
    
    // Download video using Hector API
    const apiResponse = await axios.get(`${HECTOR_API_URL}?url=${encodeURIComponent(videoUrl)}`, {
      timeout: 30000
    });
    
    if (!apiResponse.data || !apiResponse.data.url) {
      await store.react('❌');
      return reply("❌ *Failed to get video download link*\n📌 Please try another URL");
    }
    
    const downloadUrl = apiResponse.data.url;
    const title = apiResponse.data.title || "YouTube Video";
    const quality = apiResponse.data.quality || "Best";
    const username = m.pushName || sender || "User";
    
    const caption = `🎬 *━━━━━〔 𝙼𝚄𝚉𝙰𝙼𝙸𝙻-𝚇𝙳 𝚅𝙸𝙳𝙴𝙾 〕━━━━━* 🎬

┏━━━━━━━━━━━━━━━━━━━━┓
┃  📹 *${title.substring(0, 50)}*
┣━━━━━━━━━━━━━━━━━━━━┫
┃ 🎯 *𝚀𝚄𝙰𝙻𝙸𝚃𝚈:* ${quality}
┃ 👑 *𝚁𝙴𝚀𝚄𝙴𝚂𝚃𝙴𝙳 𝙱𝚈:* ${username}
┃ ⚡ *𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈:* 𝙼𝚄𝚉𝙰𝙼𝙸𝙻-𝚇𝙳
┗━━━━━━━━━━━━━━━━━━━━┛

✨ *Downloaded successfully!* ✨`;

    // Send video
    await conn.sendMessage(from, {
      video: { url: downloadUrl },
      caption: caption,
      mimetype: 'video/mp4'
    }, { quoted: m });

    await store.react('✅');
    
  } catch (error) {
    console.error("Error in YouTube download:", error);
    await store.react('❌');
    reply(`❌ *Error downloading video*\n📌 *Reason:* ${error.message}\n\n💡 *Try:*\n1. Check if URL is correct\n2. Try another video\n3. Make sure video is not age-restricted`);
  }
});