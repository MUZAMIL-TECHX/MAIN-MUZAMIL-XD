const fetch = require("node-fetch");
const { cmd } = require("../command");

cmd({
  pattern: "video",
  alias: ["reels", "shortvideo", "tiktok"],
  desc: "Search for TikTok videos - Get the LONGEST video only",
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
    return reply("🌸 *What video do you want to search?*\n\n*📌 Usage:* `.video <song/name>`\n*✨ Example:* `.video attaullah khan`\n\n*🎯 Returns the LONGEST video from search results*");
  }

  const query = args.join(" ");
  await store.react('⏳');

  try {
    reply(`🔎 *Searching TikTok for:* ${query}`);
    
    const response = await fetch(`https://apis-starlights-team.koyeb.app/starlight/tiktoksearch?text=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (!data || !data.data || data.data.length === 0) {
      await store.react('❌');
      return reply("❌ *No results found for your query.*\n📌 Please try with a different keyword.");
    }

    // Function to convert duration string to seconds
    const durationToSeconds = (duration) => {
      if (!duration) return 0;
      const durationStr = duration.toString();
      
      // Handle format like "00:15" or "1:30" or "1:30:45"
      if (durationStr.includes(':')) {
        const parts = durationStr.split(':');
        if (parts.length === 2) {
          // MM:SS
          return parseInt(parts[0]) * 60 + parseInt(parts[1]);
        } else if (parts.length === 3) {
          // HH:MM:SS
          return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
        }
      }
      
      // Handle plain number (seconds)
      const num = parseInt(durationStr);
      return isNaN(num) ? 0 : num;
    };

    // Format seconds to MM:SS or HH:MM:SS
    const formatDuration = (seconds) => {
      if (!seconds || seconds === 0) return "Unknown";
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      
      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    // Find the video with LONGEST duration
    let longestVideo = null;
    let maxDuration = 0;

    for (const video of data.data) {
      const durationSecs = durationToSeconds(video.duration);
      if (durationSecs > maxDuration) {
        maxDuration = durationSecs;
        longestVideo = video;
      }
    }

    // If no duration found, take first video
    if (!longestVideo && data.data.length > 0) {
      longestVideo = data.data[0];
      maxDuration = durationToSeconds(longestVideo.duration);
    }

    if (!longestVideo || !longestVideo.nowm) {
      await store.react('❌');
      return reply("❌ *Could not retrieve video.*\n📌 Please try again with a different keyword.");
    }

    // Format caption as requested
    const title = longestVideo.title || "Unknown Title";
    const duration = longestVideo.duration || formatDuration(maxDuration);
    const author = longestVideo.author || "Unknown Author";
    const username = m.pushName || sender || "User";
    
    const caption = `🎬 *━━━━━〔 𝙏𝙄𝙆𝙏𝙊𝙆 𝙑𝙄𝘿𝙀𝙊 〕━━━━━* 🎬

┏━━━━━━━━━━━━━━━━━━━━┓
┃  📱 *${title}*
┣━━━━━━━━━━━━━━━━━━━━┫
┃ ⏱️ *𝙳𝚄𝚁𝙰𝚃𝙸𝙾𝙽:* ${duration}
┃ 👤 *𝙰𝚄𝚃𝙷𝙾𝚁:* ${author}
┃ 🔗 *𝚅𝙸𝙳𝙴𝙾 𝙻𝙸𝙽𝙺:* ${longestVideo.link}
┃ 👑 *𝚂𝙴𝙰𝚁𝙲𝙷𝙴𝙳 𝙱𝚈:* ${username}
┃ ⚡ *𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈:* 𝙼𝚄𝚉𝙰𝙼𝙸𝙻-𝚇𝙳
┗━━━━━━━━━━━━━━━━━━━━┛

✨ *Longest video from search results* ✨`;

    // Send the longest video
    await conn.sendMessage(from, {
      video: { url: longestVideo.nowm },
      caption: caption,
      mimetype: 'video/mp4'
    }, { quoted: m });

    await store.react('✅');
    
  } catch (error) {
    console.error("Error in TikTok video search:", error);
    await store.react('❌');
    reply("❌ *An error occurred while searching.*\n📌 Please try again later.");
  }
});