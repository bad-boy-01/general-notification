// Load existing webhook URL
chrome.storage.sync.get(['webhookUrl'], (result) => {
  document.getElementById('webhookUrl').value = result.webhookUrl || '';
});

// Save webhook URL
document.getElementById('save').addEventListener('click', () => {
  const url = document.getElementById('webhookUrl').value;
  chrome.storage.sync.set({ webhookUrl: url }, () => {
    alert('Webhook URL saved!');
  });
});