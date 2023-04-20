function updateLoginStatus(retries = 3, retryInterval = 1000) {
  if (retries <= 0) {
    console.error('Failed to get Poshmark login status after multiple attempts.');
    return;
  }

  chrome.runtime.sendMessage({ type: 'getPoshmarkLoginStatus' }, (response) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      // Retry after waiting for retryInterval
      setTimeout(() => {
        updateLoginStatus(retries - 1, retryInterval);
      }, retryInterval);
      return;
    }
    const isLoggedIn = response.isLoggedIn;
    console.log(`Received login status: ${isLoggedIn ? 'Logged In' : 'Not Logged In'}`);
    document.getElementById('loginStatus').textContent = isLoggedIn ? 'Logged In' : 'Not Logged In';
  });
}
