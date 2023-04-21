console.info('popup.js loaded');

document.addEventListener('DOMContentLoaded', () => {
  // Connect to background.js
  const port = chrome.runtime.connect({ name: "getPoshmarkData" });

  // Listen for messages from background.js to update UI based on login status
  port.onMessage.addListener((response) => {
    const isLoggedIn = response.isLoggedIn;
    console.info(`Received login status: ${isLoggedIn ? 'Logged In' : 'Not Logged In'}`);
    document.getElementById('loginStatus').textContent = isLoggedIn ? 'Logged In' : 'Not Logged In';

    const poshmarkButton = document.getElementById('poshmarkButton');
    const shareToFollowersButton = document.getElementById('shareToFollowersButton');
    const myClosetURL = response.closetURL;

    // Update button text and behavior based on login status
    if (isLoggedIn) {
      poshmarkButton.textContent = 'My Closet';
      poshmarkButton.addEventListener('click', () => {
        if (myClosetURL) {
          console.info('Opening My Closet...');
          chrome.tabs.create({ url: myClosetURL }, (tab) => {
            if (chrome.runtime.lastError) {
              console.error('Error opening My Closet:', chrome.runtime.lastError);
            } else {
              console.info('My Closet opened in new tab:', tab.id);
            }
          });
        } else {
          console.warn('Closet URL not available');
        }
      });

      shareToFollowersButton.style.display = 'inline-block';
      shareToFollowersButton.addEventListener('click', () => {
        console.info('Share to Followers button clicked');
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, { type: 'shareToFollowers' });
        });
      });
    } else {
      poshmarkButton.textContent = 'Log In to Poshmark';
      poshmarkButton.addEventListener('click', () => {
        chrome.tabs.create({ url: 'https://poshmark.com/login' });
      });

      shareToFollowersButton.style.display = 'none';
    }
  });
})

// Listen for flash messages from content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'flashMessage') {
    console.info('Received flash message:', message.content);
    const itemsShared = message.content.match(/\d+/)
    if (itemsShared) {
      console.info(`${itemsShared[0]} items shared`);
      // Save the number of items shared in local storage
      chrome.storage.local.set({ itemsShared: itemsShared[0] });
      
      // Open the success.html file in a new window
      chrome.windows.create({
        url: 'success.html',
        type: 'popup',
        width: 300,
        height: 200,
      })
    }};
    });
;