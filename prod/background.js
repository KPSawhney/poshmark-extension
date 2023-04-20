function checkPoshmarkLoginStatus(callback) {
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
      callback(poshmarkLoginStatus);
    });
  });
}

chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === "getPoshmarkLoginStatus") {
    checkPoshmarkLoginStatus(function (status) {
      port.postMessage({ isLoggedIn: status === 'Logged In' });
    });
  }
});
