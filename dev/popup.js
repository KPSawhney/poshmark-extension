console.info('popup.js loaded');

document.addEventListener('DOMContentLoaded', () => {
  const port = chrome.runtime.connect({ name: "getPoshmarkData" });

  port.onMessage.addListener((response) => {
    const isLoggedIn = response.isLoggedIn;
    console.info(`Received login status: ${isLoggedIn ? 'Logged In' : 'Not Logged In'}`);
    document.getElementById('loginStatus').textContent = isLoggedIn ? 'Logged In' : 'Not Logged In';

    const poshmarkButton = document.getElementById('poshmarkButton');
    const myClosetURL = response.closetURL;

    if (isLoggedIn) {
      poshmarkButton.textContent = 'My Closet';
      poshmarkButton.addEventListener('click', () => {
        if (myClosetURL) {
          chrome.tabs.create({ url: myClosetURL });
        } else {
          console.warn('Closet URL not available');
        }
      });
    } else {
      poshmarkButton.textContent = 'Log In to Poshmark';
      poshmarkButton.addEventListener('click', () => {
        chrome.tabs.create({ url: 'https://poshmark.com/login' });
      });
    }
  });
});