console.info('popup.js loaded');

document.addEventListener('DOMContentLoaded', () => {
  const port = chrome.runtime.connect({ name: "getPoshmarkData" });

  // Listen for messages from background.js
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
});
