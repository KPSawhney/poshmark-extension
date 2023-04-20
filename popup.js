document.addEventListener('DOMContentLoaded', () => {
  const port = chrome.runtime.connect({ name: "getPoshmarkLoginStatus" });

  port.onMessage.addListener((response) => {
    const isLoggedIn = response.isLoggedIn;
    console.log(`Received login status: ${isLoggedIn ? 'Logged In' : 'Not Logged In'}`);
    document.getElementById('loginStatus').textContent = isLoggedIn ? 'Logged In' : 'Not Logged In';
  });

  document.getElementById('openPoshmark').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://poshmark.com' });
  });

  document.getElementById('myCloset').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://poshmark.com/closet/kylesawhney' });
  });  
});
