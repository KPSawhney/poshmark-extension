document.addEventListener('DOMContentLoaded', () => {
  function updateLoginStatus() {
    chrome.runtime.sendMessage({ type: 'getPoshmarkLoginStatus' }, (response) => {
      const isLoggedIn = response.isLoggedIn;
      console.log('Received login status:', isLoggedIn ? 'Logged In' : 'Not Logged In'); // Add this log
      document.getElementById('loginStatus').textContent = isLoggedIn ? 'Logged In' : 'Not Logged In';
      document.getElementById('openPoshmark').dataset.isLoggedIn = isLoggedIn;
    });
  }

  updateLoginStatus();

  document.getElementById('openPoshmark').addEventListener('click', () => {
    const isLoggedIn = document.getElementById('openPoshmark').dataset.isLoggedIn === 'true';
    const url = isLoggedIn ? 'https://poshmark.com/my_account' : 'https://poshmark.com/login';
    chrome.tabs.create({ url });
  });
});
