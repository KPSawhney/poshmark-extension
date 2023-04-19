let isLoggedIn = false;

function checkPoshmarkLoginStatus(callback) {
  chrome.cookies.get({ url: 'https://poshmark.com', name: 'your_auth_cookie_name' }, (cookie) => {
    isLoggedIn = !!cookie;
    console.log('Checking Poshmark login status:', isLoggedIn ? 'Logged In' : 'Not Logged In');
    if (callback) {
      callback(isLoggedIn);
    }
  });
}

function checkGoogleLoginStatus(callback) {
  chrome.identity.getAuthToken({ 'interactive': false }, (token) => {
    if (chrome.runtime.lastError) {
      console.log('Checking Google login status: Not Logged In');
      callback(false);
    } else {
      console.log('Checking Google login status: Logged In');
      callback(true);
    }
  });
}

function pollForLoginStatusChanges() {
  setInterval(() => {
    checkPoshmarkLoginStatus((poshmarkIsLoggedIn) => {
      checkGoogleLoginStatus((googleIsLoggedIn) => {
        const newIsLoggedIn = poshmarkIsLoggedIn || googleIsLoggedIn;
        if (newIsLoggedIn !== isLoggedIn) {
          console.log('Login status changed:', isLoggedIn ? 'Logged In' : 'Not Logged In');
          isLoggedIn = newIsLoggedIn;
        }
      });
    });
  }, 5000);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'getPoshmarkLoginStatus') {
    console.log('Sending login status:', isLoggedIn ? 'Logged In' : 'Not Logged In');
    sendResponse({ isLoggedIn });
  }
});

checkPoshmarkLoginStatus();
pollForLoginStatusChanges();
