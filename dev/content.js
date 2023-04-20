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

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === 'shareToFollowers') {
    console.info('Sharing to followers...');
    shareItemsToFollowers();
  }
});

function shareItemsToFollowers() {
  // Step 1: Click on the spanner icon
  const spannerIcon = document.querySelector('i.icon.icon-bulk-tools');
  if (spannerIcon) {
    spannerIcon.click();

    // Step 2: Click share to followers dropdown choice
    setTimeout(() => {
      const shareToFollowersButton = document.querySelector('div[data-et-name="share_to_followers"]');
      if (shareToFollowersButton) {
        shareToFollowersButton.click();

        // Step 3: Click the checkbox to select all clothes after the page reloads
        setTimeout(() => {
          const selectAllCheckbox = document.querySelector('.tile__checkbox');
          if (selectAllCheckbox) {
            selectAllCheckbox.click();

            // Step 4: Click the green Share Followers button
            setTimeout(() => {
              const greenShareButton = document.querySelector('button[data-et-name="share_to_followers"]');
              if (greenShareButton) {
                greenShareButton.click();
                console.info('Sharing to followers completed successfully.');
              } else {
                console.error('Error: Green Share Followers button not found');
              }
            }, 1000);
          } else {
            console.error('Error: Select All checkbox not found');
          }
        }, 1000);
      } else {
        console.error('Error: Share to Followers dropdown choice not found');
      }
    }, 1000);
  } else {
    console.error('Error: Spanner icon not found');
  }
}
