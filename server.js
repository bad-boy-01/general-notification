const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

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
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  const page = await browser.newPage();

  try {
    // Login
    await page.goto('https://demonicscans.org/signin.php');
    await page.type('input[name="email"]', 'hemopor454@fanlvr.com');
    await page.type('input[name="password"]', 'vice123');
    await page.click('input[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    // Assume after login, the game page is loaded or navigate to GAME_URL
    if (GAME_URL !== 'https://demonicscans.org/signin.php') {
      await page.goto(GAME_URL);
      await page.waitForSelector('.monster-container', { timeout: 10000 });
    }

    const content = await page.content();

    // Check for each boss
    for (const boss of BOSSES) {
      if (content.includes(boss) && !notified.has(boss)) {
        // Boss spawned
        await sendDiscordNotification(`${boss} has spawned!`);
        notified.add(boss);
      }
    }

    console.log('Checked for spawns at', new Date().toISOString());
  } catch (error) {
    console.error('Error checking spawns:', error.message);
  } finally {
    await browser.close();
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