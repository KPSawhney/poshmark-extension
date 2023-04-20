// Log when content.js is loaded
console.info('content.js loaded');

// Parse the closet URL from the current Poshmark page
function parseClosetURL() {
  const closetLinks = Array.from(document.querySelectorAll('a.dropdown__link'));
  const closetLink = closetLinks.find(link => link.textContent.trim() === 'My Closet');
  if (closetLink) {
    const closetURL = closetLink.getAttribute('href');
    return `https://poshmark.com${closetURL}`;
  }
  console.warn('Closet link not found');
  return null;
}

const closetURL = parseClosetURL();
if (closetURL) {
  console.info('Parsed closet URL:', closetURL);
  // Send the closet URL to background.js
  chrome.runtime.sendMessage({ type: 'closetURL', url: closetURL });
  // Save the closet URL to local storage
  chrome.storage.local.set({ closetURL: closetURL });
} else {
  console.error('Failed to parse closet URL');
}

