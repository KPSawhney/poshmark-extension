chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'getLoginStatus') {
    console.log('Checking Poshmark login status...');
    checkPoshmarkLoginStatus().then((poshmarkLoggedIn) => {
      console.log('Poshmark login status:', poshmarkLoggedIn ? 'Logged In' : 'Not Logged In');

      console.log('Checking Google login status...');
      checkGoogleLoginStatus().then((googleLoggedIn) => {
        console.log('Google login status:', googleLoggedIn ? 'Logged In' : 'Not Logged In');

        const isLoggedIn = poshmarkLoggedIn || googleLoggedIn;
        console.log('Sending login status:', isLoggedIn ? 'Logged In' : 'Not Logged In');
        sendResponse({ isLoggedIn });
      });
    });

    return true; // Required for async response handling
  }
});
