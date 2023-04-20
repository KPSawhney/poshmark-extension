console.info('content.js loaded');

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
  chrome.runtime.sendMessage({ type: 'closetURL', url: closetURL });
  chrome.storage.local.set({ closetURL: closetURL });
} else {
  console.error('Failed to parse closet URL');
}

