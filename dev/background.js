// Log when background.js is loaded
console.info('background.js loaded');

// Check Poshmark login status using jwt and ui cookies
function checkPoshmarkLoginStatus(callback) {
  console.info('Checking Poshmark login status...');
  chrome.cookies.get({ url: 'https://poshmark.com', name: 'jwt' }, function (jwtCookie) {
    chrome.cookies.get({ url: 'https://poshmark.com', name: 'ui' }, function (uiCookie) {
      let poshmarkLoginStatus;
      if (jwtCookie && uiCookie) {
        poshmarkLoginStatus = 'Logged In';
      } else {
        poshmarkLoginStatus = 'Not Logged In';
      }
      console.info('Poshmark login status:', poshmarkLoginStatus);
      callback(poshmarkLoginStatus);
    });
  });
}

// Get closet URL from local storage
async function getClosetURL() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['closetURL'], function (result) {
      resolve(result.closetURL);
    });
  });
}

// Listen for connection from popup.js
chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === "getPoshmarkData") {
    checkPoshmarkLoginStatus(async function (status) {
      const myClosetURL = await getClosetURL();
      port.postMessage({ isLoggedIn: status === 'Logged In', closetURL: myClosetURL });
    });
  }
});

let myClosetURL = null;

// Listen for messages from content.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === 'getLoginStatus') {
    checkPoshmarkLoginStatus(function (status) {
      sendResponse({ status: status });
    });
    return true;
  }
  if (message.type === 'getClosetURL') {
    sendResponse({ url: myClosetURL });
  }
  if (message.type === 'closetURL') {
    myClosetURL = message.url;
    console.info('Received closet URL:', myClosetURL);
  }
});
