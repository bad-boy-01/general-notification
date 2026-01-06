// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message:', message);
  if (message.action === 'notifyDiscord') {
    console.log('Action notifyDiscord received');
    // Use hardcoded webhook URL
    const webhookUrl = 'https://discord.com/api/webhooks/1457674166617509994/_OIZRYTfuey8XDGLrSo4-Qt2B7ZNvZrH3ByD0YFHGfyemrwnpCU4zBDbPWqEYKnQN3b1';
    console.log('Using webhookUrl:', webhookUrl);

    // Send notification to Discord
    const mobName = message.mobName || 'Unknown Mob';
    console.log('Sending notification for mob:', mobName);
    fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: `${mobName} spawned in Veyra at ${new Date(message.timestamp).toLocaleString()}!`,
      }),
    }).then(response => {
      console.log('Fetch response status:', response.status);
      if (!response.ok) {
        console.error('Failed to send notification to Discord:', response.status);
      } else {
        console.log('Notification sent successfully');
      }
    }).catch(error => {
      console.error('Error sending notification:', error);
    });
  }
});