function checkPoshmarkLoginStatus() {
  // Check for jwt and ui cookies
  chrome.cookies.get({ url: 'https://poshmark.com', name: 'jwt' }, function (jwtCookie) {
    chrome.cookies.get({ url: 'https://poshmark.com', name: 'ui' }, function (uiCookie) {
      let poshmarkLoginStatus;
      // If both jwt and ui cookies are present, user is logged in
      if (jwtCookie && uiCookie) {
        poshmarkLoginStatus = 'Logged In';
      } else {
        poshmarkLoginStatus = 'Not Logged In';
      }
      console.log('Poshmark login status:', poshmarkLoginStatus);
      // Send the updated login status to other parts of the extension
      sendLoginStatus(poshmarkLoginStatus);
    });
  });
}

function sendLoginStatus(status) {
  // Add the necessary listener
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'getPoshmarkLoginStatus') {
      sendResponse({ isLoggedIn: status === 'Logged In' });
    }
  });
}

// Call the function initially to set up the listener
checkPoshmarkLoginStatus();
