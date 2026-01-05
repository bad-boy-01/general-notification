// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'notifyDiscord') {
    // Retrieve webhook URL from storage
    chrome.storage.sync.get(['webhookUrl'], (result) => {
      const webhookUrl = result.webhookUrl;
      if (!webhookUrl) {
        console.error('Webhook URL not set');
        return;
      }

      // Send notification to Discord
      const mobName = message.mobName || 'Unknown Mob';
      fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: `${mobName} spawned in Veyra at ${new Date(message.timestamp).toLocaleString()}!`,
        }),
      }).then(response => {
        if (!response.ok) {
          console.error('Failed to send notification to Discord:', response.status);
        }
      }).catch(error => {
        console.error('Error sending notification:', error);
      });
    });
  }
});