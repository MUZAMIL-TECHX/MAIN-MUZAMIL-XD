const axios = require("axios");
const FormData = require('form-data');
const fs = require('fs');
const os = require('os');
const path = require("path");
const { cmd, commands } = require("../command");

cmd({
  'pattern': "tourl",
  'alias': ["imgtourl", "imgurl", "url", "geturl", "upload"],
  'react': '🖇',
  'desc': "Convert media to URL (ImgBB for images, Catbox for others)",
  'category': "utility",
  'use': ".tourl [reply to media]",
  'filename': __filename
}, async (client, message, args, { reply }) => {
  try {
    // Check if quoted message exists and has media
    const quotedMsg = message.quoted ? message.quoted : message;
    const mimeType = (quotedMsg.msg || quotedMsg).mimetype || '';
    
    if (!mimeType) {
      throw "Please reply to an image, video, or audio file";
    }

    // Download the media
    const mediaBuffer = await quotedMsg.download();
    const tempFilePath = path.join(os.tmpdir(), `upload_${Date.now()}`);
    fs.writeFileSync(tempFilePath, mediaBuffer);

    // Get file extension based on mime type
    let extension = '';
    if (mimeType.includes('image/jpeg')) extension = '.jpg';
    else if (mimeType.includes('image/png')) extension = '.png';
    else if (mimeType.includes('image/gif')) extension = '.gif';
    else if (mimeType.includes('video')) extension = '.mp4';
    else if (mimeType.includes('audio')) extension = '.mp3';
    
    const fileName = `file${extension}`;
    let mediaUrl = '';
    let mediaType = 'File';

    // Check if it's an image (for ImgBB)
    const isImage = mimeType.includes('image');
    
    if (isImage) {
      // Use ImgBB for images
      const API_KEY = "38af67e8ea24b4aaebfc239334ef220a";
      const IMGBB_UPLOAD_URL = `https://api.imgbb.com/1/upload?key=${API_KEY}`;
      
      const formData = new FormData();
      formData.append('image', fs.createReadStream(tempFilePath));
      
      const imgbbResponse = await axios.post(IMGBB_UPLOAD_URL, formData, {
        headers: formData.getHeaders()
      });
      
      if (!imgbbResponse.data || !imgbbResponse.data.data || !imgbbResponse.data.data.url) {
        throw "Error uploading to ImgBB";
      }
      
      mediaUrl = imgbbResponse.data.data.url;
      mediaType = 'Image';
    } else {
      // Use Catbox for videos and audio files
      const form = new FormData();
      form.append('fileToUpload', fs.createReadStream(tempFilePath), fileName);
      form.append('reqtype', 'fileupload');
      
      const catboxResponse = await axios.post("https://catbox.moe/user/api.php", form, {
        headers: form.getHeaders()
      });
      
      if (!catboxResponse.data) {
        throw "Error uploading to Catbox";
      }
      
      mediaUrl = catboxResponse.data;
      
      if (mimeType.includes('video')) mediaType = 'Video';
      else if (mimeType.includes('audio')) mediaType = 'Audio';
      else mediaType = 'File';
    }
    
    fs.unlinkSync(tempFilePath);

    // Send response
    await reply(
      `*${mediaType} ᴜᴘʟᴏᴀᴅᴇᴅ sᴜᴄᴄᴇssғᴜʟʟʏ*\n\n` +
      `*Size:* ${formatBytes(mediaBuffer.length)}\n` +
      `*URL:* ${mediaUrl}\n\n` +
      `> © *ᴘᴏᴡᴇʀᴇᴅ ʙʏ мʋʓαмιℓ*`
    );

  } catch (error) {
    console.error(error);
    await reply(`Error: ${error.message || error}`);
  }
});

// Helper function to format bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}