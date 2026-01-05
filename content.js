// Monitor for new monster card spawns
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('monster-card')) {
        // Get mob name from h3
        const h3 = node.querySelector('h3');
        const mobName = h3 ? h3.textContent.trim() : 'Unknown Mob';
        // Notify on new spawn
        chrome.runtime.sendMessage({ action: 'notifyDiscord', timestamp: Date.now(), mobName });
      }
    });
  });
});

// Wait for the container to exist and observe it
const checkForContainer = () => {
  const container = document.querySelector('.monster-container');
  if (container) {
    observer.observe(container, { childList: true });
  } else {
    setTimeout(checkForContainer, 100);
  }
};

checkForContainer();

// Refresh the page every 25 seconds to check for updates
setInterval(() => {
  location.reload();
}, 25000);