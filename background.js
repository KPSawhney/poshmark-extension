async function checkPoshmarkLoginStatus() {
  return new Promise((resolve) => {
    chrome.cookies.get({ url: 'https://poshmark.com', name: 'MUID' }, (cookie) => {
      resolve(!!cookie);
    });
  });
}

async function checkGoogleLoginStatus() {
  return new Promise((resolve) => {
    chrome.cookies.get({ url: 'https://poshmark.com', name: 'G_AUTHUSER_H' }, (cookie) => {
      resolve(!!cookie);
    });
  });
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.type === 'getPoshmarkLoginStatus') {
    console.log('Checking Poshmark login status...');
    const poshmarkLoggedIn = await checkPoshmarkLoginStatus();
    console.log('Checking Google login status...');
    const googleLoggedIn = await checkGoogleLoginStatus();
    const isLoggedIn = poshmarkLoggedIn || googleLoggedIn;
    console.log(`Sending login status: ${isLoggedIn ? 'Logged In' : 'Not Logged In'}`);
    sendResponse({ isLoggedIn });
  }
  return true;
});
