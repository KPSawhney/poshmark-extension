console.info('popup.js loaded');

let shareInterval;
let sharingIntervalId;

function updateShareInterval() {
  const shareIntervalSelect = document.getElementById('shareInterval');
  shareInterval = parseInt(shareIntervalSelect.value);
  shareToFollowers(shareInterval);
}

function shareToFollowers(interval) {
  if (typeof sharingIntervalId !== 'undefined') {
    clearInterval(sharingIntervalId);
  }

  sharingIntervalId = setInterval(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      shareItemsToFollowers((successMessage) => {
        console.info('Success message:', successMessage);
        document.getElementById('successAnimation').style.display = 'block';
        setTimeout(() => {
          document.getElementById('successAnimation').style.display = 'none';
        }, 2000);
      });
    });
  }, interval);
}

function shareItemsToFollowers(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'shareToFollowers' }, (response) => {
      if (response) {
        callback(response);
      } else {
        console.error('Error: No flash message received.');
      }
    });
    console.info('shareItemsToFollowers loaded');
  });
}

// Listen for flash messages from content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message from content.js:', message);
  if (message.type === 'flashMessage') {
    console.info('Received flash message:', message.content);
    const itemsShared = message.content.match(/\d+/);
    if (itemsShared) {
      console.info(`${itemsShared[0]} items shared`);
      // Save the number of items shared in local storage
      chrome.storage.local.set({ itemsShared: itemsShared[0] });
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // Attach the event listener for the shareInterval dropdown
  document.getElementById('shareInterval').addEventListener('change', updateShareInterval);

  // ... Rest of the code
});
