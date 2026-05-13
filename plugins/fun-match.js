const { cmd } = require("../command");

// Command for random boy selection
cmd({
  pattern: "bacha",
  alias: ["boy", "larka"],
  desc: "Randomly selects a boy from the group",
  react: "👦",
  category: "fun",
  filename: __filename
}, async (conn, mek, store, { isGroup, groupMetadata, reply, sender }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups!");

    const participants = groupMetadata.participants;
    
    // Filter out bot and get random participant
    const eligible = participants.filter(p => !p.id.includes(conn.user.id.split('@')[0]));
    
    if (eligible.length < 1) return reply("❌ No eligible participants found!");

    const randomUser = eligible[Math.floor(Math.random() * eligible.length)];
    
    await conn.sendMessage(
      mek.chat,
      { 
        text: `👦 *Yeh lo tumhara Bacha! Enjoy kro😝* \n\n@${randomUser.id.split('@')[0]} is your handsome boy! 😎`, 
        mentions: [randomUser.id] 
      },
      { quoted: mek }
    );

  } catch (error) {
    console.error("Error in .bacha command:", error);
    reply(`❌ Error: ${error.message}`);
  }
});

// Command for random girl selection
cmd({
  pattern: "bachi",
  alias: ["girl", "kuri", "larki"],
  desc: "Randomly selects a girl from the group",
  react: "👧",
  category: "fun",
  filename: __filename
}, async (conn, mek, store, { isGroup, groupMetadata, reply, sender }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups!");

    const participants = groupMetadata.participants;
    
    // Filter out bot and get random participant
    const eligible = participants.filter(p => !p.id.includes(conn.user.id.split('@')[0]));
    
    if (eligible.length < 1) return reply("❌ No eligible participants found!");

    const randomUser = eligible[Math.floor(Math.random() * eligible.length)];
    
    await conn.sendMessage(
      mek.chat,
      { 
        text: `👧 *Yeh lo tumhari Bachi! Muzamil ne dhondh le😂🫰* \n\n@${randomUser.id.split('@')[0]} is your beautiful girl! 💖`, 
        mentions: [randomUser.id] 
      },
      { quoted: mek }
    );

  } catch (error) {
    console.error("Error in .bachi command:", error);
    reply(`❌ Error: ${error.message}`);
  }
});
cmd({
  pattern: "chacha",
  alias: ["chaho", "uncle"],
  desc: "Randomly selects a boy from the group",
  react: "👴",
  category: "fun",
  filename: __filename
}, async (conn, mek, store, { isGroup, groupMetadata, reply, sender }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups!");

    const participants = groupMetadata.participants;
    
    // Filter out bot and get random participant
    const eligible = participants.filter(p => !p.id.includes(conn.user.id.split('@')[0]));
    
    if (eligible.length < 1) return reply("❌ No eligible participants found!");

    const randomUser = eligible[Math.floor(Math.random() * eligible.length)];
    
    await conn.sendMessage(
      mek.chat,
      { 
        text: `👦 *Yeh lo tumhara Chacha! * \n\n@${randomUser.id.split('@')[0]} is your Uncle! 😎`, 
        mentions: [randomUser.id] 
      },
      { quoted: mek }
    );

  } catch (error) {
    console.error("Error in .bacha command:", error);
    reply(`❌ Error: ${error.message}`);
  }
});
cmd({
  pattern: "chachi",
  alias: ["chachii", "chache"],
  desc: "Randomly selects a boy from the group",
  react: "🧑‍🦳",
  category: "fun",
  filename: __filename
}, async (conn, mek, store, { isGroup, groupMetadata, reply, sender }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups!");

    const participants = groupMetadata.participants;
    
    // Filter out bot and get random participant
    const eligible = participants.filter(p => !p.id.includes(conn.user.id.split('@')[0]));
    
    if (eligible.length < 1) return reply("❌ No eligible participants found!");

    const randomUser = eligible[Math.floor(Math.random() * eligible.length)];
    
    await conn.sendMessage(
      mek.chat,
      { 
        text: `👦 *Yeh lo tumhare Chachi* \n\n@${randomUser.id.split('@')[0]} `, 
        mentions: [randomUser.id] 
      },
      { quoted: mek }
    );

  } catch (error) {
    console.error("Error in .chache command:", error);
    reply(`❌ Error: ${error.message}`);
  }
});
cmd({
  pattern: "husband",
  alias: ["hasband", "hasbend"],
  desc: "Randomly selects a boy from the group",
  react: "🧑‍🦱",
  category: "fun",
  filename: __filename
}, async (conn, mek, store, { isGroup, groupMetadata, reply, sender }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups!");

    const participants = groupMetadata.participants;
    
    // Filter out bot and get random participant
    const eligible = participants.filter(p => !p.id.includes(conn.user.id.split('@')[0]));
    
    if (eligible.length < 1) return reply("❌ No eligible participants found!");

    const randomUser = eligible[Math.floor(Math.random() * eligible.length)];
    
    await conn.sendMessage(
      mek.chat,
      { 
        text: `👦 *Yeh lo tumhara Husband! Enjoy kro😝* \n\n@${randomUser.id.split('@')[0]} Ye ab sy apka husband hy kush rehna 😎`, 
        mentions: [randomUser.id] 
      },
      { quoted: mek }
    );

  } catch (error) {
    console.error("Error in .bacha command:", error);
    reply(`❌ Error: ${error.message}`);
  }
});
cmd({
  pattern: "wife",
  alias: ["wifu", "wifee"],
  desc: "Randomly selects a boy from the group",
  react: "👩‍🦰",
  category: "fun",
  filename: __filename
}, async (conn, mek, store, { isGroup, groupMetadata, reply, sender }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups!");

    const participants = groupMetadata.participants;
    
    // Filter out bot and get random participant
    const eligible = participants.filter(p => !p.id.includes(conn.user.id.split('@')[0]));
    
    if (eligible.length < 1) return reply("❌ No eligible participants found!");

    const randomUser = eligible[Math.floor(Math.random() * eligible.length)];
    
    await conn.sendMessage(
      mek.chat,
      { 
        text: `👦 *Yeh lo tumhare Wife 😂* \n\n@${randomUser.id.split('@')[0]} is your Cute Wife Enjoy karnaa yrr 🥲`, 
        mentions: [randomUser.id] 
      },
      { quoted: mek }
    );

  } catch (error) {
    console.error("Error in .bacha command:", error);
    reply(`❌ Error: ${error.message}`);
  }
});
cmd({
  pattern: "gf",
  alias: ["grilfriend", "girlfriend"],
  desc: "Randomly selects a boy from the group",
  react: "🎀",
  category: "fun",
  filename: __filename
}, async (conn, mek, store, { isGroup, groupMetadata, reply, sender }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups!");

    const participants = groupMetadata.participants;
    
    // Filter out bot and get random participant
    const eligible = participants.filter(p => !p.id.includes(conn.user.id.split('@')[0]));
    
    if (eligible.length < 1) return reply("❌ No eligible participants found!");

    const randomUser = eligible[Math.floor(Math.random() * eligible.length)];
    
    await conn.sendMessage(
      mek.chat,
      { 
        text: `👦 *Yeh lo tumhare Gril Friend 🙂kitine piyaare hy🥹* \n\n@${randomUser.id.split('@')[0]}`, 
        mentions: [randomUser.id] 
      },
      { quoted: mek }
    );

  } catch (error) {
    console.error("Error in .bacha command:", error);
    reply(`❌ Error: ${error.message}`);
  }
});
cmd({
  pattern: "bf",
  alias: ["boyfriend", "boyf"],
  desc: "Randomly selects a boy from the group",
  react: "👨‍🦰",
  category: "fun",
  filename: __filename
}, async (conn, mek, store, { isGroup, groupMetadata, reply, sender }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups!");

    const participants = groupMetadata.participants;
    
    // Filter out bot and get random participant
    const eligible = participants.filter(p => !p.id.includes(conn.user.id.split('@')[0]));
    
    if (eligible.length < 1) return reply("❌ No eligible participants found!");

    const randomUser = eligible[Math.floor(Math.random() * eligible.length)];
    
    await conn.sendMessage(
      mek.chat,
      { 
        text: `👦 *Yeh lo tumhara Handsome Bf😝* \n\n@${randomUser.id.split('@')[0]} is your handsome BF Enjoy With It! 😎`, 
        mentions: [randomUser.id] 
      },
      { quoted: mek }
    );

  } catch (error) {
    console.error("Error in .bacha command:", error);
    reply(`❌ Error: ${error.message}`);
  }
});
cmd({
  pattern: "sis",
  alias: ["sister", "behan"],
  desc: "Randomly selects a boy from the group",
  react: "🙂",
  category: "fun",
  filename: __filename
}, async (conn, mek, store, { isGroup, groupMetadata, reply, sender }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups!");

    const participants = groupMetadata.participants;
    
    // Filter out bot and get random participant
    const eligible = participants.filter(p => !p.id.includes(conn.user.id.split('@')[0]));
    
    if (eligible.length < 1) return reply("❌ No eligible participants found!");

    const randomUser = eligible[Math.floor(Math.random() * eligible.length)];
    
    await conn.sendMessage(
      mek.chat,
      { 
        text: `👦 *Yeh lo tumhare beehaan 🙂🎀* \n\n@${randomUser.id.split('@')[0]} is your cute sister!`, 
        mentions: [randomUser.id] 
      },
      { quoted: mek }
    );

  } catch (error) {
    console.error("Error in .bacha command:", error);
    reply(`❌ Error: ${error.message}`);
  }
});
cmd({
  pattern: "bro",
  alias: ["bhaie", "brother"],
  desc: "Randomly selects a boy from the group",
  react: "😑",
  category: "fun",
  filename: __filename
}, async (conn, mek, store, { isGroup, groupMetadata, reply, sender }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups!");

    const participants = groupMetadata.participants;
    
    // Filter out bot and get random participant
    const eligible = participants.filter(p => !p.id.includes(conn.user.id.split('@')[0]));
    
    if (eligible.length < 1) return reply("❌ No eligible participants found!");

    const randomUser = eligible[Math.floor(Math.random() * eligible.length)];
    
    await conn.sendMessage(
      mek.chat,
      { 
        text: `👦 *Yeh lo tumhara Piyaaraa saa bhaie 🙂🎀* \n\n@${randomUser.id.split('@')[0]} is your handsome Brother! 😎`, 
        mentions: [randomUser.id] 
      },
      { quoted: mek }
    );

  } catch (error) {
    console.error("Error in .bacha command:", error);
    reply(`❌ Error: ${error.message}`);
  }
});
cmd({
  pattern: "father",
  alias: ["aba", "fathar"],
  desc: "Randomly selects a boy from the group",
  react: "👴",
  category: "fun",
  filename: __filename
}, async (conn, mek, store, { isGroup, groupMetadata, reply, sender }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups!");

    const participants = groupMetadata.participants;
    
    // Filter out bot and get random participant
    const eligible = participants.filter(p => !p.id.includes(conn.user.id.split('@')[0]));
    
    if (eligible.length < 1) return reply("❌ No eligible participants found!");

    const randomUser = eligible[Math.floor(Math.random() * eligible.length)];
    
    await conn.sendMessage(
      mek.chat,
      { 
        text: `👦 *Yeh lo tumhara father 😂 bhaie mind na krna ismee mera koie qasoor nhi* \n\n@${randomUser.id.split('@')[0]} is your father! 😎`, 
        mentions: [randomUser.id] 
      },
      { quoted: mek }
    );

  } catch (error) {
    console.error("Error in .bacha command:", error);
    reply(`❌ Error: ${error.message}`);
  }
});
cmd({
  pattern: "ama",
  alias: ["mother", "moom"],
  desc: "Randomly selects a boy from the group",
  react: "👩‍🦰",
  category: "fun",
  filename: __filename
}, async (conn, mek, store, { isGroup, groupMetadata, reply, sender }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups!");

    const participants = groupMetadata.participants;
    
    // Filter out bot and get random participant
    const eligible = participants.filter(p => !p.id.includes(conn.user.id.split('@')[0]));
    
    if (eligible.length < 1) return reply("❌ No eligible participants found!");

    const randomUser = eligible[Math.floor(Math.random() * eligible.length)];
    
    await conn.sendMessage(
      mek.chat,
      { 
        text: `👦 *Yeh lo tumhara amee 😂* \n\n@${randomUser.id.split('@')[0]} is your mother respect her😩! `, 
        mentions: [randomUser.id] 
      },
      { quoted: mek }
    );

  } catch (error) {
    console.error("Error in .bacha command:", error);
    reply(`❌ Error: ${error.message}`);
  }
});
cmd({
  pattern: "crush",
  alias: ["jano", "janemaan"],
  desc: "Randomly selects a boy from the group",
  react: "♥",
  category: "fun",
  filename: __filename
}, async (conn, mek, store, { isGroup, groupMetadata, reply, sender }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups!");

    const participants = groupMetadata.participants;
    
    // Filter out bot and get random participant
    const eligible = participants.filter(p => !p.id.includes(conn.user.id.split('@')[0]));
    
    if (eligible.length < 1) return reply("❌ No eligible participants found!");

    const randomUser = eligible[Math.floor(Math.random() * eligible.length)];
    
    await conn.sendMessage(
      mek.chat,
      { 
        text: `👦 *Yeh lo tumhara Crush* \n\n@${randomUser.id.split('@')[0]} is your crush! iseee pochh kiyaa yee tumsy piyaar karta h?`, 
        mentions: [randomUser.id] 
      },
      { quoted: mek }
    );

  } catch (error) {
    console.error("Error in .bacha command:", error);
    reply(`❌ Error: ${error.message}`);
  }
});
cmd({
  pattern: "gareeb",
  alias: ["poor", "por"],
  desc: "Randomly selects a boy from the group",
  react: "😔",
  category: "fun",
  filename: __filename
}, async (conn, mek, store, { isGroup, groupMetadata, reply, sender }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups!");

    const participants = groupMetadata.participants;
    
    // Filter out bot and get random participant
    const eligible = participants.filter(p => !p.id.includes(conn.user.id.split('@')[0]));
    
    if (eligible.length < 1) return reply("❌ No eligible participants found!");

    const randomUser = eligible[Math.floor(Math.random() * eligible.length)];
    
    await conn.sendMessage(
      mek.chat,
      { 
        text: ` *Yeh saaabh syy ziyada gareeeb hy yrr* \n\n@${randomUser.id.split('@')[0]} iss ko pese do saabh`, 
        mentions: [randomUser.id] 
      },
      { quoted: mek }
    );

  } catch (error) {
    console.error("Error in .bacha command:", error);
    reply(`❌ Error: ${error.message}`);
  }
});
cmd({
  pattern: "ameer",
  alias: ["rich", "pesewala"],
  desc: "Randomly selects a boy from the group",
  react: "💎",
  category: "fun",
  filename: __filename
}, async (conn, mek, store, { isGroup, groupMetadata, reply, sender }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups!");

    const participants = groupMetadata.participants;
    
    // Filter out bot and get random participant
    const eligible = participants.filter(p => !p.id.includes(conn.user.id.split('@')[0]));
    
    if (eligible.length < 1) return reply("❌ No eligible participants found!");

    const randomUser = eligible[Math.floor(Math.random() * eligible.length)];
    
    await conn.sendMessage(
      mek.chat,
      { 
        text: `👦 *Yeh Ameer hy bahie iskee pass buhaat pesa h😂* \n\n@${randomUser.id.split('@')[0]} `, 
        mentions: [randomUser.id] 
      },
      { quoted: mek }
    );

  } catch (error) {
    console.error("Error in .bacha command:", error);
    reply(`❌ Error: ${error.message}`);
  }
});
cmd({
  pattern: "faqeer",
  alias: ["bikare", "lotha"],
  desc: "Randomly selects a boy from the group",
  react: "🙂‍↕️",
  category: "fun",
  filename: __filename
}, async (conn, mek, store, { isGroup, groupMetadata, reply, sender }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups!");

    const participants = groupMetadata.participants;
    
    // Filter out bot and get random participant
    const eligible = participants.filter(p => !p.id.includes(conn.user.id.split('@')[0]));
    
    if (eligible.length < 1) return reply("❌ No eligible participants found!");

    const randomUser = eligible[Math.floor(Math.random() * eligible.length)];
    
    await conn.sendMessage(
      mek.chat,
      { 
        text: `👦 *Wese to bikare shahbaz shareef hy but* \n\n@${randomUser.id.split('@')[0]} yee bhee kaam nhi h😂 😎`, 
        mentions: [randomUser.id] 
      },
      { quoted: mek }
    );

  } catch (error) {
    console.error("Error in .bacha command:", error);
    reply(`❌ Error: ${error.message}`);
  }
});