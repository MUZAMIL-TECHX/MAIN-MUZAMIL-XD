const {
  cmd
} = require("../command");
const DY_SCRAP = require("@dark-yasiya/scrap");
const dy_scrap = new DY_SCRAP();
const axios = require('axios');

// Function to extract YouTube video ID
function getYouTubeID(url) {
  const pattern = /(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(pattern);
  return match ? match[1] : null;
}

// ========== COMMAND 1: play2 (Audio Download - Working with 3 APIs) ==========
cmd({
  'pattern': "splay",
  'alias': ["mp3", "ytmp3", "songplay", "playsong"],
  'react': '🎵',
  'desc': "Download audio from YouTube (MP3)",
  'category': 'download',
  'use': ".play2 <song name or YouTube URL>",
  'filename': __filename
}, async (conn, mek, m, {
  from,
  q,
  reply,
  react
}) => {
  try {
    if (!q) {
      return await reply("❌ *Please provide a song name or YouTube URL!*\n\n📌 *Example:* `.play2 Diljit G.O.A.T`\n📌 *Example:* `.play2 https://youtu.be/xyz123`");
    }
    
    await react("⏳");
    let statusMsg = await reply("🔍 *Searching & processing audio...*");
    
    // Function to extract YouTube ID
    const getYouTubeID = (url) => {
      const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
        /^([a-zA-Z0-9_-]{11})$/
      ];
      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
      }
      return null;
    };
    
    // Search YouTube function (using free API)
    const searchYouTube = async (query) => {
      try {
        const searchUrl = `https://pipedapi.kavin.rocks/search?q=${encodeURIComponent(query)}&filter=videos`;
        const res = await axios.get(searchUrl, { timeout: 10000 });
        if (res.data?.items?.length > 0) {
          const first = res.data.items[0];
          return first.url.split('=')[1] || first.videoId;
        }
        throw new Error("No results");
      } catch (err) {
        // Fallback search
        const fallbackUrl = `https://invidious.projectsegfau.lt/api/v1/search?q=${encodeURIComponent(query)}&type=video`;
        const fallbackRes = await axios.get(fallbackUrl, { timeout: 10000 });
        if (fallbackRes.data?.length > 0) {
          return fallbackRes.data[0].videoId;
        }
        throw new Error("Search failed");
      }
    };
    
    let videoId;
    
    // Check if input is YouTube URL
    if (q.startsWith('http://') || q.startsWith('https://')) {
      videoId = getYouTubeID(q);
      if (!videoId) {
        return await reply("❌ *Invalid YouTube URL!*");
      }
    } else {
      // Search for the song
      await conn.sendMessage(from, {
        'text': "🎵 *Searching for:* " + q,
        'edit': statusMsg.key
      });
      videoId = await searchYouTube(q);
    }
    
    const youtubeUrl = `https://youtube.com/watch?v=${videoId}`;
    let audioData = null;
    let usedApi = "";
    let videoTitle = "";
    
    // API 1: EliteProTech (MP3 format)
    try {
      const eliteApi = `https://eliteprotech-apis.zone.id/ytdown?url=${encodeURIComponent(youtubeUrl)}&format=mp3`;
      const eliteRes = await axios.get(eliteApi, { timeout: 30000 });
      if (eliteRes.data?.success && eliteRes.data?.downloadURL) {
        audioData = eliteRes.data.downloadURL;
        videoTitle = eliteRes.data.title || "Audio";
        usedApi = "EliteProTech";
      }
    } catch (err) {
      console.log("EliteProTech audio failed:", err.message);
    }
    
    // API 2: Yupra (Fallback - MP3)
    if (!audioData) {
      try {
        const yupraApi = `https://api.yupra.my.id/api/downloader/ytmp3?url=${encodeURIComponent(youtubeUrl)}`;
        const yupraRes = await axios.get(yupraApi, { timeout: 30000 });
        if (yupraRes.data?.success && yupraRes.data?.data?.download_url) {
          audioData = yupraRes.data.data.download_url;
          videoTitle = yupraRes.data.data.title || "Audio";
          usedApi = "Yupra";
        }
      } catch (err) {
        console.log("Yupra audio failed:", err.message);
      }
    }
    
    // API 3: Okatsu (Last Fallback - MP4 se audio extract)
    if (!audioData) {
      try {
        const okatsuApi = `https://okatsu-rolezapiiz.vercel.app/downloader/ytmp4?url=${encodeURIComponent(youtubeUrl)}`;
        const okatsuRes = await axios.get(okatsuApi, { timeout: 30000 });
        if (okatsuRes.data?.result?.mp4) {
          // Okatsu returns MP4, we'll use it as audio
          audioData = okatsuRes.data.result.mp4;
          videoTitle = okatsuRes.data.result.title || "Audio";
          usedApi = "Okatsu (Video as Audio)";
        }
      } catch (err) {
        console.log("Okatsu failed:", err.message);
      }
    }
    
    // Agar koi bhi API kaam nahi kiya
    if (!audioData) {
      throw new Error("All 3 APIs failed - Try different song or URL");
    }
    
    await conn.sendMessage(from, {
      'text': `📤 *Audio found via ${usedApi}!*\n🎵 *${videoTitle.substring(0, 50)}*\n⬇️ Downloading & sending...`,
      'edit': statusMsg.key
    });
    
    // Download audio as buffer
    const audioBuffer = await axios.get(audioData, {
      responseType: 'arraybuffer',
      timeout: 60000
    });
    
    // Send audio directly
    await conn.sendMessage(from, {
      audio: Buffer.from(audioBuffer.data),
      mimetype: 'audio/mpeg',
      fileName: `${videoTitle.replace(/[^\w\s-]/g, '').substring(0, 50)}.mp3`,
      caption: `🎵 *${videoTitle.substring(0, 60)}*
      
✅ *Download Complete!*
🔧 *Source:* ${usedApi}
👤 *Requested by:* ${m.pushName || "User"}

💫 *MUZAMIL-XD*`
    }, {
      quoted: mek
    });
    
    await react("✅");
    
  } catch (error) {
    console.error("Audio Download Error:", error);
    await react("❌");
    
    let errorMsg = error.message || 'Something went wrong!';
    if (errorMsg.includes('timeout')) {
      errorMsg = 'Request timeout - Try again with a different song';
    } else if (errorMsg.includes('All 3 APIs failed')) {
      errorMsg = 'No working API found - Try a different song or URL';
    }
    
    await reply(`❌ *Error:* ${errorMsg}\n\n📌 *Tips:*\n• Try with exact YouTube URL\n• Try a different song name\n• Check internet connection`);
  }
});

// ========== COMMAND 2: ytvdl (Video Download Direct Send - Working with 3 APIs) ==========
cmd({
  'pattern': "ytvideo",
  'alias': ["ytvd", "ytd", "dytv"],
  'react': '📥',
  'desc': "Download YouTube video directly (no link)",
  'category': 'download',
  'use': ".ytvideo <YouTube URL>",
  'filename': __filename
}, async (conn, mek, m, {
  from,
  q,
  reply,
  react
}) => {
  try {
    if (!q) {
      return reply("❌ *Please provide a YouTube URL!*\n\n📌 *Example:* `.ytvdl https://youtu.be/xyz123`\n⚡ *Works with:* YouTube links only");
    }
    
    // Extract video ID
    let videoId = getYouTubeID(q);
    if (!videoId) {
      return reply("❌ *Invalid YouTube URL!*\n📌 Please send a valid YouTube link");
    }
    
    await react("⏳");
    const statusMsg = await reply("📥 *Downloading video...*\n⏱️ Please wait 15-30 seconds");
    
    const youtubeUrl = `https://youtube.com/watch?v=${videoId}`;
    let videoData = null;
    let usedApi = "";
    
    // API 1: EliteProTech
    try {
      const eliteApi = `https://eliteprotech-apis.zone.id/ytdown?url=${encodeURIComponent(youtubeUrl)}&format=mp4`;
      const eliteRes = await axios.get(eliteApi);
      if (eliteRes.data?.success && eliteRes.data?.downloadURL) {
        videoData = {
          download_url: eliteRes.data.downloadURL,
          title: eliteRes.data.title || "YouTube Video",
          quality: eliteRes.data.quality || "360p",
          size: eliteRes.data.size || "Unknown"
        };
        usedApi = "EliteProTech";
      }
    } catch (err) {
      console.log("EliteProTech failed:", err.message);
    }
    
    // API 2: Yupra (Fallback)
    if (!videoData) {
      try {
        const yupraApi = `https://api.yupra.my.id/api/downloader/ytmp4?url=${encodeURIComponent(youtubeUrl)}`;
        const yupraRes = await axios.get(yupraApi);
        if (yupraRes.data?.success && yupraRes.data?.data?.download_url) {
          videoData = {
            download_url: yupraRes.data.data.download_url,
            title: yupraRes.data.data.title || "YouTube Video",
            quality: yupraRes.data.data.quality || "360p",
            size: yupraRes.data.data.size || "Unknown",
            thumbnail: yupraRes.data.data.thumbnail
          };
          usedApi = "Yupra";
        }
      } catch (err) {
        console.log("Yupra failed:", err.message);
      }
    }
    
    // API 3: Okatsu (Last Fallback)
    if (!videoData) {
      try {
        const okatsuApi = `https://okatsu-rolezapiiz.vercel.app/downloader/ytmp4?url=${encodeURIComponent(youtubeUrl)}`;
        const okatsuRes = await axios.get(okatsuApi);
        if (okatsuRes.data?.result?.mp4) {
          videoData = {
            download_url: okatsuRes.data.result.mp4,
            title: okatsuRes.data.result.title || "YouTube Video",
            quality: okatsuRes.data.result.quality || "360p",
            size: okatsuRes.data.result.size || "Unknown"
          };
          usedApi = "Okatsu";
        }
      } catch (err) {
        console.log("Okatsu failed:", err.message);
      }
    }
    
    // Agar koi bhi API kaam nahi kiya
    if (!videoData || !videoData.download_url) {
      throw new Error("All 3 APIs failed - Video may be restricted");
    }
    
    await conn.sendMessage(from, {
      'text': `📤 *Video found via ${usedApi}!*\n⬇️ Downloading & sending...`,
      'edit': statusMsg.key
    });
    
    // Download video as buffer
    const videoBuffer = await axios.get(videoData.download_url, {
      responseType: 'arraybuffer',
      timeout: 60000
    });
    
    // Send video directly (NO LINK SHOWN)
    await conn.sendMessage(from, {
      video: Buffer.from(videoBuffer.data),
      caption: `🎬 *${videoData.title}*
      
✅ *Download Complete!*
🔧 *Source:* ${usedApi}
🎥 *Quality:* ${videoData.quality || "360p"}
📊 *Size:* ${videoData.size || "Unknown"}
👤 *Requested by:* ${m.pushName || "User"}

💫 *MUZAMIL-XD*`,
      mimetype: 'video/mp4'
    }, {
      quoted: mek
    });
    
    await react("✅");
    
  } catch (error) {
    console.error("Video Download Error:", error);
    await react("❌");
    
    reply(`❌ *Download Failed!*
    
📌 *Possible reasons:*
• Video is age-restricted
• Video is private/deleted
• Copyright claim
• Region blocked

📌 *Try these alternatives:*
• Use: .play2 (for audio)
• Try a different video
• Use: .ytdl (with link)

❌ Error: ${error.message}`);
  }
});