const axios = require("axios");
const fetch = require("node-fetch");
const { sleep } = require('../lib/functions');
const { cmd, commands } = require("../command");

cmd({
  pattern: "joke",
  desc: "😂 Get a random joke",
  react: "🤣",
  category: "fun",
  filename: __filename
}, async (conn, m, store, { reply }) => {
  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    const joke = response.data;

    if (!joke || !joke.setup || !joke.punchline) {
      return reply("❌ Failed to fetch a joke. Please try again.");
    }

    const jokeMessage = `🤣 *Here's a random joke for you!* 🤣\n\n*${joke.setup}*\n\n${joke.punchline} 😆\n\n> *MUZAMIL-XD*`;

    return reply(jokeMessage);
  } catch (error) {
    console.error("❌ Error in joke command:", error);
    return reply("⚠️ An error occurred while fetching the joke. Please try again.");
  }
});

// flirt

cmd({
    pattern: "flirt",
    alias: ["masom", "line"],
    desc: "Get a random flirt or pickup line.",
    react: "💘",
    category: "fun",
    filename: __filename,
}, 
async (conn, mek, m, { from, reply }) => {
    try {
        // Define API key and URL
        const shizokeys = 'shizo';
        const apiUrl = `https://shizoapi.onrender.com/api/texts/flirt?apikey=${shizokeys}`;

        // Fetch data from the API
        const res = await fetch(apiUrl);
        if (!res.ok) {
            throw new Error(`API error: ${await res.text()}`);
        }
        
        const json = await res.json();
        if (!json.result) {
            throw new Error("Invalid response from API.");
        }

        // Extract and send the flirt message
        const flirtMessage = `${json.result}`;
        await conn.sendMessage(from, {
            text: flirtMessage,
            mentions: [m.sender],
        }, { quoted: m });

    } catch (error) {
        console.error("Error in flirt command:", error);
        reply("Sorry, something went wrong while fetching the flirt line. Please try again later.");
    }
});

//truth

cmd({
    pattern: "truth",
    alias: ["truthquestion"],
    desc: "Get a random truth question from the API.",
    react: "❓",
    category: "fun",
    filename: __filename,
}, 
async (conn, mek, m, { from, reply }) => {
    try {
        const shizokeys = 'shizo';
        const res = await fetch(`https://shizoapi.onrender.com/api/texts/truth?apikey=${shizokeys}`);
        
        if (!res.ok) {
            console.error(`API request failed with status ${res.status}`);
            throw new Error(`API request failed with status ${res.status}`);
        }

        const json = await res.json();

        if (!json.result) {
            console.error("Invalid API response: No 'result' field found.");
            throw new Error("Invalid API response: No 'result' field found.");
        }

        const truthText = `${json.result}`;
        await conn.sendMessage(from, { 
            text: truthText, 
            mentions: [m.sender] 
        }, { quoted: m });

    } catch (error) {
        console.error("Error in truth command:", error);
        reply("Sorry, something went wrong while fetching the truth question. Please try again later.");
    }
});

// dare

cmd({
    pattern: "dare",
    alias: ["truthordare"],
    desc: "Get a random dare from the API.",
    react: "🎯",
    category: "fun",
    filename: __filename,
}, 
async (conn, mek, m, { from, reply }) => {
    try {
        // API Key
        const shizokeys = 'shizo';

        // Fetch dare text from the API
        const res = await fetch(`https://shizoapi.onrender.com/api/texts/dare?apikey=${shizokeys}`);
        
        if (!res.ok) {
            console.error(`API request failed with status ${res.status}`);
            throw new Error(`API request failed with status ${res.status}`);
        }

        const json = await res.json();

        if (!json.result) {
            console.error("Invalid API response: No 'result' field found.");
            throw new Error("Invalid API response: No 'result' field found.");
        }

        // Format the dare message
        const dareText = `${json.result}`;

        // Send the dare to the chat
        await conn.sendMessage(from, { 
            text: dareText, 
            mentions: [m.sender] 
        }, { quoted: m });

    } catch (error) {
        console.error("Error in dare command:", error);
        reply("Sorry, something went wrong while fetching the dare. Please try again later.");
    }
});

cmd({
  pattern: "fact",
  desc: "🧠 Get a random fun fact",
  react: "🧠",
  category: "fun",
  filename: __filename
}, async (conn, m, store, { reply }) => {
  try {
    const response = await axios.get("https://uselessfacts.jsph.pl/random.json?language=en");
    const fact = response.data.text;

    if (!fact) {
      return reply("❌ Failed to fetch a fun fact. Please try again.");
    }

    const factMessage = `🧠 *Random Fun Fact* 🧠\n\n${fact}\n\nIsn't that interesting? 😄\n\n> *MUZAMIL-XD*`;

    return reply(factMessage);
  } catch (error) {
    console.error("❌ Error in fact command:", error);
    return reply("⚠️ An error occurred while fetching a fun fact. Please try again later.");
  }
});
const activeGames = new Map(); // Store active game sessions

cmd({
  pattern: "playboomgame",
  desc: "💥 Start a 2-player Boom Game - Challenge someone!",
  category: "fun",
  filename: __filename
}, async (conn, m, store, { reply, sender, pushName }) => {
  try {
    const groupId = m.key.remoteJid;
    
    // Check if game already exists in this group
    if (activeGames.has(groupId)) {
      return reply("❌ *A game is already active in this group!*\n\nLet that game finish first 🎮");
    }
    
    // Create game session
    const gameData = {
      host: sender,
      hostName: pushName || sender.split('@')[0],
      players: [],
      status: 'waiting',
      currentTurn: null,
      boxes: [],
      bombPosition: null,
      turnStartTime: null,
      timerInterval: null,
      msgKey: null,
      winner: null,
      loser: null
    };
    
    // Initial message
    let teks = `💥 *ＢＯＯＭ ＧＡＭＥ* 💥\n\n`;
    teks += `🎮 *Host:* @${sender.split('@')[0]}\n`;
    teks += `👥 *Status:* Waiting for players\n\n`;
    teks += `┌─────────────────┐\n`;
    teks += `│  📢 *REQUIREMENT* │\n`;
    teks += `│  Need 2 players  │\n`;
    teks += `└─────────────────┘\n\n`;
    teks += `✨ *Type* *.join* ✨\n`;
    teks += `to participate in the game!\n\n`;
    teks += `⏱️ *Wait Time:* 60 seconds\n\n`;
    teks += `💫 *ＢＹ: ＭＵＺＡＭＩＬ ＫＨＡＮ*`;
    
    const gameMsg = await reply(teks, { mentions: [sender] });
    gameData.msgKey = gameMsg.key;
    
    // Set timeout for joining (60 seconds)
    const joinTimeout = setTimeout(() => {
      const game = activeGames.get(groupId);
      if (game && game.status === 'waiting') {
        if (game.players.length < 2) {
          reply(`⏰ *Time's up!*\n\nNot enough players joined.\nGame cancelled ❌\n\n💫 *ＢＹ: ＭＵＺＡＭＩＬ ＫＨＡＮ*`);
          activeGames.delete(groupId);
        }
      }
    }, 60000);
    
    gameData.joinTimeout = joinTimeout;
    activeGames.set(groupId, gameData);
    
  } catch (error) {
    console.error('Error in playboomgame:', error);
    reply(`❌ Error: ${error.message}\n\n💫 *ＢＹ: ＭＵＺＡＭＩＬ ＫＨＡＮ*`);
  }
});

// ========== JOIN COMMAND ==========
cmd({
  pattern: "enter",
  desc: "🎮 Join a Boom Game",
  category: "fun",
  filename: __filename
}, async (conn, m, store, { reply, sender, pushName }) => {
  try {
    const groupId = m.key.remoteJid;
    const game = activeGames.get(groupId);
    
    if (!game) {
      return reply("❌ *No active game found!*\n\nUse *.playboomgame* to start one 🎮");
    }
    
    if (game.status !== 'waiting') {
      return reply("❌ *Game already started!*\n\nWait for the next round 🎯");
    }
    
    if (game.players.length >= 2) {
      return reply("❌ *Game is full!*\n\nMaximum 2 players allowed 👥");
    }
    
    if (game.players.some(p => p.id === sender)) {
      return reply("❌ *You already joined!*\n\nWaiting for other player 👤");
    }
    
    // Add player
    game.players.push({
      id: sender,
      name: pushName || sender.split('@')[0],
      score: 0
    });
    
    // Update game message
    let teks = `💥 *ＢＯＯＭ ＧＡＭＥ* 💥\n\n`;
    teks += `🎮 *Host:* @${game.host.split('@')[0]}\n`;
    teks += `👥 *Players:* ${game.players.length}/2\n\n`;
    teks += `┌─────────────────┐\n`;
    teks += `│  ✅ *JOINED* ✅   │\n`;
    teks += `└─────────────────┘\n\n`;
    teks += `✨ *Player 1:* @${game.host.split('@')[0]}\n`;
    teks += `✨ *Player 2:* @${sender.split('@')[0]}\n\n`;
    
    if (game.players.length === 2) {
      teks += `━━━━━━━━━━━━━━━━━━\n`;
      teks += `│  🎲 *GAME READY!*  │\n`;
      teks += `│  Starting soon... │\n`;
      teks += `━━━━━━━━━━━━━━━━━━\n\n`;
      teks += `⏱️ *Game will start in 5 seconds*\n`;
      teks += `💫 *ＢＹ: ＭＵＺＡＭＩＬ ＫＨＡＮ*`;
      
      await conn.sendMessage(groupId, { text: teks, edit: game.msgKey, mentions: [game.host, sender] });
      
      clearTimeout(game.joinTimeout);
      setTimeout(() => startGame(conn, groupId, reply), 5000);
    } else {
      teks += `⏱️ *Waiting for 1 more player...*\n`;
      teks += `💫 *ＢＹ: ＭＵＺＡＭＩＬ ＫＨＡＮ*`;
      
      await conn.sendMessage(groupId, { text: teks, edit: game.msgKey, mentions: [game.host, sender] });
    }
    
  } catch (error) {
    console.error('Error in join:', error);
    reply(`❌ Error: ${error.message}`);
  }
});

// ========== START GAME FUNCTION ==========
async function startGame(conn, groupId, reply) {
  const game = activeGames.get(groupId);
  if (!game || game.players.length !== 2) return;
  
  game.status = 'playing';
  
  // Randomly choose first player
  const firstPlayer = Math.random() < 0.5 ? game.players[0] : game.players[1];
  game.currentTurn = firstPlayer.id;
  game.turnStartTime = Date.now();
  
  // Create 9 boxes (1 bomb, 8 safe)
  const boxes = [];
  for (let i = 1; i <= 9; i++) {
    boxes.push({
      number: i,
      emoji: getNumberEmoji(i),
      isBomb: false,
      isOpened: false,
      openedBy: null
    });
  }
  
  // Place bomb randomly
  const bombIndex = Math.floor(Math.random() * 9);
  boxes[bombIndex].isBomb = true;
  game.bombPosition = bombIndex + 1;
  
  game.boxes = boxes;
  
  await updateGameMessage(conn, groupId, game);
  
  // Start turn timer (40 seconds)
  startTurnTimer(conn, groupId, game);
}

// ========== UPDATE GAME MESSAGE ==========
async function updateGameMessage(conn, groupId, game) {
  let teks = `💥 *ＢＯＯＭ ＧＡＭＥ* 💥\n\n`;
  teks += `🎮 *Host:* @${game.host.split('@')[0]}\n`;
  teks += `👥 *Players:*\n`;
  teks += `   👤 @${game.players[0].id.split('@')[0]} vs 👤 @${game.players[1].id.split('@')[0]}\n\n`;
  
  teks += `━━━━━━━━━━━━━━━━━━\n`;
  teks += `│  🎲 *CURRENT TURN*  │\n`;
  teks += `━━━━━━━━━━━━━━━━━━\n\n`;
  teks += `👑 *Turn:* @${game.currentTurn.split('@')[0]}\n`;
  
  // Calculate remaining time
  const elapsed = Math.floor((Date.now() - game.turnStartTime) / 1000);
  const remaining = Math.max(0, 40 - elapsed);
  teks += `⏱️ *Time left:* ${remaining} seconds\n\n`;
  
  teks += `┌─────────────────┐\n`;
  teks += `│  📦 *BOXES* 📦    │\n`;
  teks += `└─────────────────┘\n\n`;
  
  // Show boxes
  teks += `╔═══════════════════╗\n`;
  for (let i = 0; i < game.boxes.length; i += 3) {
    let row = '║  ';
    for (let j = 0; j < 3; j++) {
      const box = game.boxes[i + j];
      if (box.isOpened) {
        row += box.isBomb ? '💥' : '✅';
      } else {
        row += box.emoji;
      }
      row += '  ';
    }
    teks += row + '║\n';
  }
  teks += `╚═══════════════════╝\n\n`;
  
  teks += `━━━━━━━━━━━━━━━━━━\n`;
  teks += `│  📝 *INSTRUCTIONS* │\n`;
  teks += `━━━━━━━━━━━━━━━━━━\n\n`;
  teks += `✨ Send a *number 1-9* to open a box!\n`;
  teks += `💀 If you get 💥 BOOM → You LOSE!\n`;
  teks += `✅ Safe box → Continue!\n`;
  teks += `🏆 Last player standing → WINNER!\n\n`;
  
  teks += `💫 *ＢＹ: ＭＵＺＡＭＩＬ ＫＨＡＮ*`;
  
  const mentions = [game.host, game.players[0].id, game.players[1].id, game.currentTurn];
  
  if (game.msgKey) {
    await conn.sendMessage(groupId, { text: teks, edit: game.msgKey, mentions });
  } else {
    const msg = await reply(teks, { mentions });
    game.msgKey = msg.key;
  }
}

// ========== START TURN TIMER ==========
function startTurnTimer(conn, groupId, game) {
  if (game.timerInterval) clearInterval(game.timerInterval);
  
  game.timerInterval = setInterval(async () => {
    const currentGame = activeGames.get(groupId);
    if (!currentGame || currentGame.status !== 'playing') {
      clearInterval(game.timerInterval);
      return;
    }
    
    const elapsed = Math.floor((Date.now() - currentGame.turnStartTime) / 1000);
    const remaining = 40 - elapsed;
    
    if (remaining <= 0) {
      clearInterval(currentGame.timerInterval);
      
      const loser = currentGame.currentTurn;
      const winner = currentGame.players.find(p => p.id !== loser);
      
      currentGame.status = 'finished';
      currentGame.winner = winner.id;
      currentGame.loser = loser;
      
      let teks = `⏰ *ＴＩＭＥ ＯＵＴ！* ⏰\n\n`;
      teks += `@${loser.split('@')[0]} took too long to choose!\n`;
      teks += `💀 *${loser.split('@')[0]} loses by timeout!* 💀\n\n`;
      teks += `━━━━━━━━━━━━━━━━━━\n`;
      teks += `│  🏆 *ＧＡＭＥ ＯＶＥＲ* │\n`;
      teks += `━━━━━━━━━━━━━━━━━━\n\n`;
      teks += `🎉 *WINNER:* @${winner.id.split('@')[0]} 🎉\n`;
      teks += `💀 *LOSER:* @${loser.split('@')[0]} 💀\n\n`;
      teks += `💫 *ＢＹ: ＭＵＺＡＭＩＬ ＫＨＡＮ*`;
      
      await conn.sendMessage(groupId, { text: teks, edit: currentGame.msgKey, mentions: [loser, winner.id] });
      activeGames.delete(groupId);
    }
  }, 1000);
}

// ========== HANDLE NUMBER SELECTION ==========
cmd({
  pattern: "^[1-9]$",
  desc: "Select a box in Boom Game",
  category: "fun",
  filename: __filename
}, async (conn, m, store, { reply, sender }) => {
  try {
    const groupId = m.key.remoteJid;
    const game = activeGames.get(groupId);
    
    if (!game || game.status !== 'playing') return;
    if (game.currentTurn !== sender) return;
    
    const number = parseInt(m.text);
    if (isNaN(number) || number < 1 || number > 9) return;
    
    const box = game.boxes[number - 1];
    
    if (box.isOpened) {
      return reply(`❌ *Box ${number} is already opened!*\n\nChoose another box 🔄`);
    }
    
    box.isOpened = true;
    box.openedBy = sender;
    
    if (box.isBomb) {
      clearInterval(game.timerInterval);
      
      const loser = sender;
      const winner = game.players.find(p => p.id !== loser);
      
      game.status = 'finished';
      game.winner = winner.id;
      game.loser = loser;
      
      let teks = `💥 *ＢＯＯＭ！ ＥＸＰＬＯＳＩＯＮ！* 💥\n\n`;
      teks += `@${loser.split('@')[0]} opened box ${number} and...\n`;
      teks += `💣 *ＢＯＯＭ！* 💣\n\n`;
      teks += `━━━━━━━━━━━━━━━━━━\n`;
      teks += `│  🏆 *ＧＡＭＥ ＯＶＥＲ* │\n`;
      teks += `━━━━━━━━━━━━━━━━━━\n\n`;
      teks += `🎉 *WINNER:* @${winner.id.split('@')[0]} 🎉\n`;
      teks += `💀 *LOSER:* @${loser.split('@')[0]} 💀\n\n`;
      teks += `💫 *ＢＹ: ＭＵＺＡＭＩＬ ＫＨＡＮ*`;
      
      await conn.sendMessage(groupId, { text: teks, edit: game.msgKey, mentions: [loser, winner.id] });
      activeGames.delete(groupId);
      
    } else {
      const safeBoxes = game.boxes.filter(b => !b.isBomb);
      const openedSafeBoxes = safeBoxes.filter(b => b.isOpened);
      
      if (openedSafeBoxes.length === safeBoxes.length) {
        clearInterval(game.timerInterval);
        
        const winner = sender;
        const loser = game.players.find(p => p.id !== winner);
        
        game.status = 'finished';
        game.winner = winner.id;
        game.loser = loser.id;
        
        let teks = `🎉 *ＶＩＣＴＯＲＹ！* 🎉\n\n`;
        teks += `@${winner.split('@')[0]} opened the last safe box!\n`;
        teks += `🏆 *WINNER:* @${winner.split('@')[0]} 🏆\n`;
        teks += `💀 *LOSER:* @${loser.split('@')[0]} 💀\n\n`;
        teks += `💫 *ＢＹ: ＭＵＺＡＭＩＬ ＫＨＡＮ*`;
        
        await conn.sendMessage(groupId, { text: teks, edit: game.msgKey, mentions: [winner, loser] });
        activeGames.delete(groupId);
        return;
      }
      
      const otherPlayer = game.players.find(p => p.id !== sender);
      game.currentTurn = otherPlayer.id;
      game.turnStartTime = Date.now();
      
      clearInterval(game.timerInterval);
      startTurnTimer(conn, groupId, game);
      await updateGameMessage(conn, groupId, game);
    }
    
  } catch (error) {
    console.error('Error in number selection:', error);
  }
});

// ========== HELPER FUNCTION ==========
function getNumberEmoji(num) {
  const emojis = {
    1: '1️⃣', 2: '2️⃣', 3: '3️⃣',
    4: '4️⃣', 5: '5️⃣', 6: '6️⃣',
    7: '7️⃣', 8: '8️⃣', 9: '9️⃣'
  };
  return emojis[num];
}
cmd({
    pattern: "pickupline",
    alias: ["pickup"],
    desc: "Get a random pickup line from the API.",
    react: "💬",
    category: "fun",
    filename: __filename,
}, 
async (conn, mek, m, { from, reply }) => {
    try {
        // Fetch pickup line from the API
        const res = await fetch('https://api.popcat.xyz/pickuplines');
        
        if (!res.ok) {
            throw new Error(`API request failed with status ${res.status}`);
        }

        const json = await res.json();

        // Log the API response (for debugging purposes)
        console.log('JSON response:', json);

        // Format the pickup line message
        const pickupLine = `*Here's a pickup line for you:*\n\n"${json.pickupline}"\n\n> *MUZAMIL-XD*`;

        // Send the pickup line to the chat
        await conn.sendMessage(from, { text: pickupLine }, { quoted: m });

    } catch (error) {
        console.error("Error in pickupline command:", error);
        reply("Sorry, something went wrong while fetching the pickup line. Please try again later.");
    }
});

// char

cmd({
    pattern: "character",
    alias: ["char"],
    desc: "Check the character of a mentioned user.",
    react: "🔥",
    category: "fun",
    filename: __filename,
}, 
async (conn, mek, m, { from, isGroup, text, reply }) => {
    try {
        // Ensure the command is used in a group
        if (!isGroup) {
            return reply("This command can only be used in groups.");
        }

        // Extract the mentioned user
        const mentionedUser = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        if (!mentionedUser) {
            return reply("Please mention a user whose character you want to check.");
        }

        // Define character traits
        const userChar = [
            "Sigma",
            "Generous",
            "Grumpy",
            "Overconfident",
            "Obedient",
            "Good",
            "Simp",
            "Kind",
            "Patient",
            "Pervert",
            "Cool",
            "Helpful",
            "Brilliant",
            "Sexy",
            "Hot",
            "Gorgeous",
            "Cute",
        ];

        // Randomly select a character trait
        const userCharacterSelection =
            userChar[Math.floor(Math.random() * userChar.length)];

        // Message to send
        const message = `Character of @${mentionedUser.split("@")[0]} is *${userCharacterSelection}* 🔥⚡`;

        // Send the message with mentions
        await conn.sendMessage(from, {
            text: message,
            mentions: [mentionedUser],
        }, { quoted: m });

    } catch (e) {
        console.error("Error in character command:", e);
        reply("An error occurred while processing the command. Please try again.");
    }
});

cmd({
  pattern: "repeat",
  alias: ["rp", "rpm"],
  desc: "Repeat a message a specified number of times.",
  category: "fun",
  filename: __filename
}, async (conn, m, store, { args, reply }) => {
  try {
    if (!args[0]) {
      return reply("✳️ Use this command like:\n*Example:* .repeat 10,I love you");
    }

    const [countStr, ...messageParts] = args.join(" ").split(",");
    const count = parseInt(countStr.trim());
    const message = messageParts.join(",").trim();

    if (isNaN(count) || count <= 0 || count > 300) {
      return reply("❎ Please specify a valid number between 1 and 300.");
    }

    if (!message) {
      return reply("❎ Please provide a message to repeat.");
    }

    const repeatedMessage = Array(count).fill(message).join("\n");

    reply(`🔄 Repeated ${count} times:\n\n${repeatedMessage}`);
  } catch (error) {
    console.error("❌ Error in repeat command:", error);
    reply("❎ An error occurred while processing your request.");
  }
});

cmd({
  pattern: "send",
  desc: "Send a message multiple times, one by one.",
  category: "fun",
  filename: __filename
}, async (conn, m, store, { args, reply, senderNumber }) => {
  try {
    const botOwner = conn.user.id.split(":")[0]; // Get bot owner's number

    if (senderNumber !== botOwner) {
      return reply("❎ Only the bot owner can use this command.");
    }

    if (!args[0]) {
      return reply("✳️ Use this command like:\n *Example:* .send 10,I love you");
    }

    const [countStr, ...messageParts] = args.join(" ").split(",");
    const count = parseInt(countStr.trim());
    const message = messageParts.join(",").trim();

    if (isNaN(count) || count <= 0 || count > 100) {
      return reply("❎ Please specify a valid number between 1 and 100.");
    }

    if (!message) {
      return reply("❎ Please provide a message to send.");
    }

    reply(`⏳ Sending "${message}" ${count} times. This may take a while...`);

    for (let i = 0; i < count; i++) {
      await conn.sendMessage(m.from, { text: message }, { quoted: m });
      await sleep(1000); // 1-second delay
    }

    reply(`✅ Successfully sent the message ${count} times.`);
  } catch (error) {
    console.error("❌ Error in ask command:", error);
    reply("❎ An error occurred while processing your request.");
  }
});

cmd({
  pattern: "readmore",
  alias: ["rm", "rmore", "readm"],
  desc: "Generate a Read More message.",
  category: "convert",
  use: ".readmore <text>",
  react: "📝",
  filename: __filename
}, async (conn, m, store, { args, reply }) => {
  try {
    const inputText = args.join(" ") || "No text provided.";
    const readMore = String.fromCharCode(8206).repeat(4000); // Creates a large hidden gap
    const message = `${inputText} ${readMore} Continue Reading...`;

    await conn.sendMessage(m.from, { text: message }, { quoted: m });
  } catch (error) {
    console.error("❌ Error in readmore command:", error);
    reply("❌ An error occurred: " + error.message);
  }
});
