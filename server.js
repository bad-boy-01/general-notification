const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration
const GAME_URL = 'https://www.idleheroes.com/grakthar.php?gate=3&wave=8'; // Replace with actual wave URL
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK; // Set in environment variables

// List of boss names to monitor
const BOSSES = [
  'Skarn, The Molten General',
  'Vessir, The Solar Inferna Empress',
  'Hrazz The Dawnflame Seraph',
  'Drakzareth The Tyrant Lizard King'
];

// Track notified bosses to avoid spam
let notified = new Set();

async function checkForSpawns() {
  try {
    const response = await axios.get(GAME_URL);
    const $ = cheerio.load(response.data);

    // Check for each boss
    for (const boss of BOSSES) {
      if (response.data.includes(boss) && !notified.has(boss)) {
        // Boss spawned
        await sendDiscordNotification(`${boss} has spawned in Veyra!`);
        notified.add(boss);
      }
    }

    console.log('Checked for spawns at', new Date().toISOString());
  } catch (error) {
    console.error('Error checking spawns:', error.message);
  }
}

async function sendDiscordNotification(message) {
  if (!DISCORD_WEBHOOK) {
    console.error('Discord webhook not set');
    return;
  }

  try {
    await axios.post(DISCORD_WEBHOOK, {
      content: message
    });
    console.log('Notification sent:', message);
  } catch (error) {
    console.error('Error sending Discord notification:', error.message);
  }
}

// Check every 30 seconds
setInterval(checkForSpawns, 30000);

// Initial check
checkForSpawns();

app.get('/', (req, res) => {
  res.send('Mob Spawn Notifier is running. Checking every 30 seconds.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});