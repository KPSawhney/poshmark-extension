// Log when popup.js is loaded
console.info('popup.js loaded');

// Connect to background.js and get the Poshmark data
const port = chrome.runtime.connect({ name: 'getPoshmarkData' });
port.postMessage({ type: 'getPoshmarkData' });
port.onMessage.addListener(function (msg) {
  console.log('Received message:', msg);
  const isLoggedIn = msg.isLoggedIn;
  const closetURL = msg.closetURL;
  if (isLoggedIn && closetURL) {
    const statusEl = document.getElementById('loginStatus'); // Updated ID
    if (statusEl) {
      statusEl.innerText = 'Logged In';
    }
    const openClosetEl = document.getElementById('goToClosetButton'); // Updated ID
    if (openClosetEl) {
      openClosetEl.onclick = function() {
        chrome.tabs.create({ url: closetURL });
      };
      openClosetEl.hidden = false; // Show the button
    }
    const shareToFollowersEl = document.getElementById('shareToFollowersButton'); // Updated ID
    if (shareToFollowersEl) {
      shareToFollowersEl.addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          const activeTab = tabs[0];
          chrome.tabs.sendMessage(activeTab.id, { type: 'shareToFollowers' }, function () {
            const successAnimation = document.getElementById('successAnimation');
            if (successAnimation) {
              successAnimation.classList.add('visible');
              setTimeout(() => {
                successAnimation.classList.remove('visible');
              }, 3000);
            }
          });
        });
      });
      shareToFollowersEl.hidden = false; // Show the button
    }
  } else {
    const statusEl = document.getElementById('loginStatus'); // Updated ID
    if (statusEl) {
      statusEl.innerText = 'Not Logged In';
    }
  }
});
