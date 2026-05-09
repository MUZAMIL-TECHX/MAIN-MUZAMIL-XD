// ZORAIB-MD Keep Alive System
const axios = require('axios');
const appName = process.env.HEROKU_APP_NAME;

console.log('🔄 Starting MUZAMIL-XD Keep Alive System...');

function pingServer() {
  if (!appName) {
    console.log('⚠️ HEROKU_APP_NAME not set. Using localhost');
  }
  
  const baseUrl = appName 
    ? `https://${appName}.herokuapp.com`
    : 'http://localhost:3000';
  
  const endpoints = ['/', '/ping', '/health'];
  
  endpoints.forEach(endpoint => {
    axios.get(baseUrl + endpoint, { timeout: 15000 })
      .then(() => {
        console.log(`✅ ${new Date().toLocaleTimeString()} - ${endpoint} pinged`);
      })
      .catch(err => {
        console.log(`⚠️ ${endpoint} failed: ${err.message}`);
      });
  });
}

// Ping immediately
pingServer();

// Ping every 4 minutes
setInterval(pingServer, 240000);

console.log('⏰ Keep-alive active (ping every 4 minutes)');
