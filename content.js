// Monitor for new monster card spawns
const observer = new MutationObserver((mutations) => {
  console.log('MutationObserver triggered');
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      console.log('Added node:', node);
      if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('monster-card')) {
        console.log('Monster card detected');
        // Get mob name from h3
        const h3 = node.querySelector('h3');
        const mobName = h3 ? h3.textContent.trim() : 'Unknown Mob';
        console.log('Mob name:', mobName);
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
    console.log('Container found, starting observation');
    observer.observe(container, { childList: true });
  } else {
    console.log('Container not found, retrying in 100ms');
    setTimeout(checkForContainer, 100);
  }
};

checkForContainer();

// Refresh the page every 60 seconds to check for updates
setInterval(() => {
  location.reload();
}, 60000);