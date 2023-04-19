document.addEventListener('DOMContentLoaded', () => {
  function updateLoginStatus() {
    chrome.runtime.sendMessage({ type: 'getPoshmarkLoginStatus' }, (response) => {
      const isLoggedIn = response.isLoggedIn;
      console.log(`Received login status: ${isLoggedIn ? 'Logged In' : 'Not Logged In'}`);
      document.getElementById('loginStatus').textContent = isLoggedIn ? 'Logged In' : 'Not Logged In';
    });
  }

  updateLoginStatus();

  document.getElementById('openPoshmark').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://poshmark.com' });
  });
});
