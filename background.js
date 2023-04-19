let isLoggedIn = false;

function checkPoshmarkLoginStatus(callback) {
  chrome.cookies.get({ url: 'https://poshmark.com', name: 'remember_user_token' }, (cookie) => {
    isLoggedIn = !!cookie;
    console.log('Checking login status:', isLoggedIn ? 'Logged In' : 'Not Logged In');
    if (callback) {
      callback(isLoggedIn);
    }
  });
}

function pollForLoginStatusChanges() {
  setInterval(() => {
    checkPoshmarkLoginStatus((newIsLoggedIn) => {
      if (newIsLoggedIn !== isLoggedIn) {
        console.log('Login status changed:', isLoggedIn ? 'Logged In' : 'Not Logged In');
        isLoggedIn = newIsLoggedIn;
      }
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
