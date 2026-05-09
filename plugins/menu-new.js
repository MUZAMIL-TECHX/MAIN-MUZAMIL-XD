const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const axios = require('axios');

cmd({
    pattern: "menu",
    desc: "Show interactive menu system",
    category: "menu",
    react: "🧾",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const menuCaption = `╭━━━〔 *${config.BOT_NAME}* 〕━━━┈⊷
┃★╭──────────────
┃★│ 👑 Owner : *${config.OWNER_NAME}*
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
📋 *ᴄʜᴏᴏsᴇ ᴀ ᴄᴀᴛᴇɢᴏʀʏ ᴛᴏ ᴇxᴘʟᴏʀᴇ:*
> _ʀᴇᴘʟʏ ᴡɪᴛʜ ᴛʜᴇ ᴍᴀᴛᴄʜɪɴɢ ɴᴜᴍʙᴇʀ ᴛᴏ ᴏᴘᴇɴ ᴛʜᴇ ᴍᴇɴᴜ_
 ➦✧ -〘 *ʙᴏᴛ ᴍᴇɴᴜ* 〙 -  ✧━┈⊷
┃✧ ➦♦⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆✧━┈⊷
┃✧│  ❶  *ᴅᴏᴡɴʟᴏᴅᴇᴅ ᴍᴇɴᴜ*
┃✧│  ❷ *ɢʀᴏᴜᴘ ᴍᴇɴᴜ*
┃✧│  ❸ *ғᴜɴ ᴍᴇɴᴜ*
┃✧│  ❹  *ᴏᴡɴᴇʀ ᴍᴇɴᴜ*
┃✧│  ❺  *ᴀɪ ᴍᴇɴᴜ*
┃✧│  ❻  *ᴀɴɪᴍᴇ ᴍᴇɴᴜ*
┃✧│  ❼  *ᴄᴏɴᴠᴇʀᴛ ᴍᴇɴᴜ*
┃✧│  ❽  *ᴏᴛʜᴇʀ ᴍᴇɴᴜ*
┃✧│  ❾  *ʀᴇᴀᴄʏ ᴍᴇɴᴜ*
┃✧│  ❿  *ᴍᴀɪɴ ᴍᴇɴᴜ*
┃✧ ➥ ⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆✧━┈⊷
 ➥⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆✧━┈⊷
> ${config.DESCRIPTION}`;

        const contextInfo = {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363426106687970@newsletter',
                newsletterName: config.OWNER_NAME,
                serverMessageId: 143
            }
        };

        // Function to send menu image with timeout
        const sendMenuImage = async () => {
            try {
                return await conn.sendMessage(
                    from,
                    {
                        image: { url: config.MENU_IMAGE_URL || 'https://res.cloudinary.com/di2a9lenz/image/upload/v1777634329/omegatech_media/d7riz8sz6yq3avzq7vaf.jpg' },
                        caption: menuCaption,
                        contextInfo: contextInfo
                    },
                    { quoted: mek }
                );
            } catch (e) {
                console.log('Image send failed, falling back to text');
                return await conn.sendMessage(
                    from,
                    { text: menuCaption, contextInfo: contextInfo },
                    { quoted: mek }
                );
            }
        };

        // Function to send menu audio with timeout
        const sendMenuAudio = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));
                await conn.sendMessage(from, {
                    audio: { url: 'https://files.catbox.moe/wzodz1.mp3' },
                    mimetype: 'audio/mp4',
                    ptt: true,
                }, { quoted: mek });
            } catch (e) {
                console.log('Audio send failed, continuing without it');
            }
        };
        
        // Send image first, then audio sequentially
        let sentMsg;
        try {
            sentMsg = await Promise.race([
                sendMenuImage(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Image send timeout')), 10000))
            ]);
            
            await Promise.race([
                sendMenuAudio(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Audio send timeout')), 8000))
            ]);
        } catch (e) {
            console.log('Menu send error:', e);
            if (!sentMsg) {
                sentMsg = await conn.sendMessage(
                    from,
                    { text: menuCaption, contextInfo: contextInfo },
                    { quoted: mek }
                );
            }
        }
        
        const messageID = sentMsg.key.id;

        // Menu data (complete version with all commands stacked vertically)
        const menuData = {
            '1': {
                title: "📥 *Download Menu* 📥",
                content: `╭━━━〔 *Download Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ 📥 *Media & Social*
┃★│ • gdrive
┃★│ • apk
┃★│ • apk2
┃★│ • mfire
┃★│ • mediafire
┃★│ • twitter
┃★│ • ig7
┃★│ • ytcommunity
┃★│ • ytpost
┃★│ • spotify
┃★│ • ringtone
┃★│ • img
┃★│ • facebook
┃★│ • fb
┃★│ • fb2
┃★│ • githubstalk
┃★│ • gitclone
┃★│ • instagram2
┃★│ • ig2
┃★│ • igdl2
┃★│ • igvideo4
┃★│ • igdl4
┃★│ • insta
┃★│ • igdl
┃★│ • modapk
┃★│ • tiks
┃★│ • tiktoksearch
┃★│ • tiktokdl
┃★│ • tiktok
┃★│ • tt2
┃★│ • sss
┃★│ • pins
┃★│ • pinterest
┃★│ • pinterestdl
┃★│ • pindl
┃★│ • playvideo
┃★│ • video
┃★│ • video2-10
┃★│ • ytsearch
┃★│ • yts
┃★│ • play
┃★│ • play2-10
┃★│ • play3
┃★│ • audio
┃★│ • ytmp2
┃★│ • ytmp3
┃★│ • ytmp4
┃★│ • song
┃★│ • gana
┃★│ • upload
┃★│ • geturl
┃★│ • imgurl
┃★│ • url
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            },
            '2': {
                title: "👥 *Group Menu* 👥",
                content: `╭━━━〔 *Group Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ 🛠️ *Group Management*
┃★│ • grouplink
┃★│ • antidelete
┃★│ • antilink
┃★│ • antilinks
┃★│ • linksdelete
┃★│ • deletelink
┃★│ • antilinkkick
┃★│ • kicklink
┃★│ • cr
┃★│ • creact
┃★│ • rejectall
┃★│ • acceptall
┃★│ • requestlist
┃★│ • grouppp
┃★│ • groupunmute
┃★│ • unmute
┃★│ • unlock
┃★│ • unlockgc
┃★│ • removeall
┃★│ • kickall
┃★│ • kickall2
┃★│ • kickall3
┃★│ • tagall
┃★│ • tagadmins
┃★│ • tag
┃★│ • hidetag
┃★│ • resetglink
┃★│ • revoke
┃★│ • makeadmin
┃★│ • promote
┃★│ • poll
┃★│ • out
┃★│ • newgc
┃★│ • mute
┃★│ • groupmute
┃★│ • lockgc
┃★│ • invite
┃★│ • leavegc
┃★│ • left
┃★│ • leave
┃★│ • join
┃★│ • gname
┃★│ • upgname
┃★│ • updategname
┃★│ • updategdesc
┃★│ • removeadmin
┃★│ • dismiss
┃★│ • demote
┃★│ • admin
┃★│ • add
┃★│ • remove
┃★│ • kick
┃★│ • welcome
┃★│ • admin-events
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            },
            '3': {
                title: "😄 *Fun Menu* 😄",
                content: `╭━━━〔 *Fun Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ 🎭 *Games & Fun*
┃★│ • drama
┃★│ • couplepp
┃★│ • match
┃★│ • love
┃★│ • ship
┃★│ • larki
┃★│ • bachi
┃★│ • larka
┃★│ • bacha
┃★│ • marige
┃★│ • nikal
┃★│ • hot
┃★│ • confused
┃★│ • moon
┃★│ • shy
┃★│ • sad
┃★│ • angry
┃★│ • heart
┃★│ • happy
┃★│ • chutiya
┃★│ • gandu
┃★│ • tatta
┃★│ • funny
┃★│ • meme
┃★│ • dare
┃★│ • truth
┃★│ • flirt
┃★│ • joke
┃★│ • rate
┃★│ • shapar
┃★│ • insult
┃★│ • hack
┃★│ • character
┃★│ • pickup
┃★│ • hrt
┃★│ • hpy
┃★│ • syd
┃★│ • anger
┃★│ • mon
┃★│ • cunfuzed
┃★│ • muth
┃★│ • fuck
┃★│ • finger
┃★│ • fingering
┃★│ • sex
┃★│ • sex @user
┃★│ • muth @user
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            },
            '4': {
                title: "👑 *Owner Menu* 👑",
                content: `╭━━━〔 *Owner Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ ⚠️ *System Settings*
┃★│ • bot
┃★│ • vv
┃★│ • vv2
┃★│ • vv3
┃★│ • id
┃★│ • jid
┃★│ • gjid
┃★│ • version
┃★│ • setting
┃★│ • env
┃★│ • get
┃★│ • gpass
┃★│ • autostatusreply
┃★│ • autoreact
┃★│ • autoreply
┃★│ • autosticker
┃★│ • antibadword
┃★│ • autoread
┃★│ • status-react
┃★│ • autostatusview
┃★│ • auto-seen
┃★│ • autorecoding
┃★│ • always-online
┃★│ • mention-reply
┃★│ • auto-typing
┃★│ • setmode
┃★│ • mode
┃★│ • prefix
┃★│ • setprefix
┃★│ • upgradeupdate
┃★│ • listsudo
┃★│ • deletesudo
┃★│ • delowner
┃★│ • delsudo
┃★│ • addowner
┃★│ • addsudo
┃★│ • setsudo
┃★│ • dmlist
┃★│ • sendfile
┃★│ • senddm
┃★│ • npm
┃★│ • rw
┃★│ • getprivacy
┃★│ • groupsprivacy
┃★│ • updatebio
┃★│ • setmyname
┃★│ • setonline
┃★│ • setppall
┃★│ • getbio
┃★│ • privacymenu
┃★│ • privacy
┃★│ • status
┃★│ • post
┃★│ • delete
┃★│ • clearchats
┃★│ • shutdown
┃★│ • convert
┃★│ • fetch
┃★│ • forward
┃★│ • checkotp
┃★│ • otpbox
┃★│ • listnumbers
┃★│ • templist
┃★│ • tempnumber
┃★│ • tempnum
┃★│ • msg
┃★│ • report
┃★│ • savecontact
┃★│ • ghosthelp
┃★│ • vanishing
┃★│ • temppoll
┃★│ • ghostpoll
┃★│ • ghostvideo
┃★│ • ghostpic
┃★│ • ghost
┃★│ • tempmsg
┃★│ • disappear
┃★│ • creator
┃★│ • source
┃★│ • block
┃★│ • unblock
┃★│ • fullpp
┃★│ • updatecmd
┃★│ • listcmd
┃★│ • allmenu
┃★│ • bomber
┃★│ • bomb
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            },
            '5': {
                title: "🤖 *AI Menu* 🤖",
                content: `╭━━━〔 *AI Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ 💬 *Intelligence*
┃★│ • ai
┃★│ • openai
┃★│ • gpt
┃★│ • gpt2
┃★│ • gpt3
┃★│ • gptmini
┃★│ • deepseek
┃★│ • meta
┃★│ • stabilityai
┃★│ • stablediffusion
┃★│ • fluxai
┃★│ • imgscan
┃★│ • aivoice
┃★│ • imagine
┃★│ • imagine2
┃★│ • blackbox
┃★│ • luma
┃★│ • dj
┃★│ • khan
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            },
            '6': {
                title: "🎎 *Anime Menu* 🎎",
                content: `╭━━━〔 *Anime Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ 🖼️ *Otaku World*
┃★│ • anime
┃★│ • anime1
┃★│ • anime2
┃★│ • anime3
┃★│ • anime4
┃★│ • anime5
┃★│ • animegirl
┃★│ • animegirl1
┃★│ • animegirl2
┃★│ • animegirl3
┃★│ • animegirl4
┃★│ • animegirl5
┃★│ • awoo
┃★│ • maid
┃★│ • megumin
┃★│ • neko
┃★│ • waifu
┃★│ • garl
┃★│ • naruto
┃★│ • dragonball
┃★│ • fack
┃★│ • dog
┃★│ • foxgirl
┃★│ • loli
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            },
            '7': {
                title: "🔄 *Convert Menu* 🔄",
                content: `╭━━━〔 *Convert Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ 🎨 *Edits & Styles*
┃★│ • style
┃★│ • font
┃★│ • fancy
┃★│ • typography
┃★│ • paint
┃★│ • frozen
┃★│ • castle
┃★│ • tatoo
┃★│ • bulb
┃★│ • angelwings
┃★│ • zodiac
┃★│ • luxury
┃★│ • boom
┃★│ • hacker
┃★│ • devilwings
┃★│ • nigeria
┃★│ • sunset
┃★│ • leaf
┃★│ • galaxy
┃★│ • sans
┃★│ • clouds
┃★│ • futuristic
┃★│ • eraser
┃★│ • america
┃★│ • thor
┃★│ • sadgirl
┃★│ • neonlight
┃★│ • blackpink
┃★│ • deadpool
┃★│ • 3dcomic
┃★│ • wanted
┃★│ • removebg
┃★│ • rmbg
┃★│ • nokia
┃★│ • imgjoke
┃★│ • jail
┃★│ • invert
┃★│ • grey
┃★│ • bluredit
┃★│ • blur
┃★│ • ad
┃★│ • sticker
┃★│ • sticker2
┃★│ • emojimix
┃★│ • stake
┃★│ • take
┃★│ • save
┃★│ • send
┃★│ • tomp3
┃★│ • wallpaper
┃★│ • recaption
┃★│ • caption
┃★│ • getpp
┃★│ • setpp
┃★│ • attp
┃★│ • vsticker
┃★│ • trt
┃★│ • tts
┃★│ • voicehelp
┃★│ • voicedeep
┃★│ • voicechipmunk
┃★│ • voicegirl
┃★│ • base64
┃★│ • unbase64
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            },
            '8': {
                title: "📌 *Other Menu* 📌",
                content: `╭━━━〔 *Other Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ 🛠️ *Utilities*
┃★│ • uptime
┃★│ • weather
┃★│ • define
┃★│ • greet
┃★│ • goodnight
┃★│ • goodevening
┃★│ • goodafternoon
┃★│ • goodmorning
┃★│ • picture
┃★│ • getprofile
┃★│ • getinfo
┃★│ • speed
┃★│ • news
┃★│ • movieinfo
┃★│ • movie
┃★│ • sysinfo
┃★│ • quranmenu
┃★│ • surah
┃★│ • quran
┃★│ • prayertimes
┃★│ • praytime
┃★│ • pins
┃★│ • pin
┃★│ • pong
┃★│ • countryinfo
┃★│ • calculate
┃★│ • count
┃★│ • countx
┃★│ • date
┃★│ • timenow
┃★│ • pick
┃★│ • flip
┃★│ • coinflip
┃★│ • roll
┃★│ • urldecode
┃★│ • urlencode
┃★│ • dbinary
┃★│ • binaryrcolor
┃★│ • rcolor
┃★│ • topdf
┃★│ • person
┃★│ • genmail
┃★│ • tempmail
┃★│ • wiki
┃★│ • wikipedia
┃★│ • wstalk
┃★│ • readmore
┃★│ • repeat
┃★│ • fact
┃★│ • tiktokstalk
┃★│ • valorant
┃★│ • bear
┃★│ • birthday
┃★│ • cat
┃★│ • dog
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            },
            '9': {
                title: "💞 *Reactions Menu* 💞",
                content: `╭━━━〔 *Reactions Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ 🥰 *Feelings*
┃★│ • kiss
┃★│ • slap
┃★│ • dance
┃★│ • cringe
┃★│ • poke
┃★│ • bite
┃★│ • wink
┃★│ • smile
┃★│ • wave
┃★│ • highfive
┃★│ • handhold
┃★│ • blush
┃★│ • yeet
┃★│ • smug
┃★│ • pat
┃★│ • lick
┃★│ • hug
┃★│ • bully
┃★│ • cuddle
┃★│ • cry
┃★│ • kill
┃★│ • bonk
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            },
            '10': {
                title: "🏠 *Main Menu* 🏠",
                content: `╭━━━〔 *Main Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ ℹ️ *Bot Info*
┃★│ • ping
┃★│ • live
┃★│ • alive
┃★│ • runtime
┃★│ • repo
┃★│ • owner
┃★│ • menu
┃★│ • menu2
┃★│ • restart
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            }
        };

        // Message handler with improved error handling
        const handler = async (msgData) => {
            try {
                const receivedMsg = msgData.messages[0];
                if (!receivedMsg?.message || !receivedMsg.key?.remoteJid) return;

                const isReplyToMenu = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;
                
                if (isReplyToMenu) {
                    const receivedText = receivedMsg.message.conversation || 
                                      receivedMsg.message.extendedTextMessage?.text;
                    const senderID = receivedMsg.key.remoteJid;

                    if (menuData[receivedText]) {
                        const selectedMenu = menuData[receivedText];
                        
                        try {
                            if (selectedMenu.image) {
                                await conn.sendMessage(
                                    senderID,
                                    {
                                        image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/yj7zp0.png' },
                                        caption: selectedMenu.content,
                                        contextInfo: contextInfo
                                    },
                                    { quoted: receivedMsg }
                                );
                            } else {
                                await conn.sendMessage(
                                    senderID,
                                    { text: selectedMenu.content, contextInfo: contextInfo },
                                    { quoted: receivedMsg }
                                );
                            }

                            await conn.sendMessage(senderID, {
                                react: { text: '✅', key: receivedMsg.key }
                            });

                        } catch (e) {
                            console.log('Menu reply error:', e);
                            await conn.sendMessage(
                                senderID,
                                { text: selectedMenu.content, contextInfo: contextInfo },
                                { quoted: receivedMsg }
                            );
                        }

                    } else {
                        await conn.sendMessage(
                            senderID,
                            {
                                text: `❌ *Invalid Option!* ❌\n\nPlease reply with a number between 1-10 to select a menu.\n\n*Example:* Reply with "1" for Download Menu\n\n> ${config.DESCRIPTION}`,
                                contextInfo: contextInfo
                            },
                            { quoted: receivedMsg }
                        );
                    }
                }
            } catch (e) {
                console.log('Handler error:', e);
            }
        };

        // Add listener
        conn.ev.on("messages.upsert", handler);

        // Remove listener after 5 minutes
        setTimeout(() => {
            conn.ev.off("messages.upsert", handler);
        }, 300000);

    } catch (e) {
        console.error('Menu Error:', e);
        try {
            await conn.sendMessage(
                from,
                { text: `❌ Menu system is currently busy. Please try again later.\n\n> ${config.DESCRIPTION}` },
                { quoted: mek }
            );
        } catch (finalError) {
            console.log('Final error handling failed:', finalError);
        }
    }
});