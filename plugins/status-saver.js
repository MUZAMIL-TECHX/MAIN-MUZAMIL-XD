const { cmd } = require("../command");

cmd({
  pattern: "send",
  alias: ["sendme", '🥰'],
  react: '📤',
  desc: "Saves quoted message to your DM (inbox)",
  category: "utility",
  filename: __filename
}, async (client, message, match, { from }) => {
  try {
    if (!match.quoted) {
      return await client.sendMessage(from, {
        text: "*🍁 Please reply to a message/status!*"
      }, { quoted: message });
    }

    // Get the user who used the command
    const sender = message.key.participant || message.key.remoteJid;
    
    const buffer = await match.quoted.download();
    const mtype = match.quoted.mtype;
    
    // Send to user's DM (inbox) instead of current chat
    const dmChat = sender; // sender ka DM
    
    let messageContent = {};
    switch (mtype) {
      case "imageMessage":
        messageContent = {
          image: buffer,
          caption: match.quoted.text || '*📥 Saved to your DM*',
          mimetype: match.quoted.mimetype || "image/jpeg"
        };
        break;
      case "videoMessage":
        messageContent = {
          video: buffer,
          caption: match.quoted.text || '*📥 Saved to your DM*',
          mimetype: match.quoted.mimetype || "video/mp4"
        };
        break;
      case "audioMessage":
        messageContent = {
          audio: buffer,
          mimetype: "audio/mp4",
          ptt: match.quoted.ptt || false
        };
        break;
      default:
        // For text messages or other types
        if (match.quoted.text) {
          messageContent = {
            text: `*📥 Saved Message:*\n\n${match.quoted.text}`
          };
        } else {
          return await client.sendMessage(from, {
            text: "❌ Only image, video, audio, and text messages are supported"
          }, { quoted: message });
        }
    }

    // Send to user's DM (inbox)
    await client.sendMessage(dmChat, messageContent);
    
    // Confirm to user in current chat
    await client.sendMessage(from, {
      text: "✅ *Message Saved!*\n\nCheck your DM (inbox) - message has been saved there.",
      react: '✅'
    }, { quoted: message });
    
  } catch (error) {
    console.error("Save Error:", error);
    await client.sendMessage(from, {
      text: "❌ Error saving message:\n" + error.message
    }, { quoted: message });
  }
});