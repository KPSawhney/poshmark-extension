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

  // Check if the user is on their closet page
  checkIsOnClosetPage(closetURL);
} else {
  console.error('Failed to parse closet URL');
}

function checkIsOnClosetPage(closetURL) {
  const currentURL = window.location.href;
  console.log('Current URL:', currentURL);
  console.log('Closet URL:', closetURL);
  if (currentURL === closetURL) {
    console.log('User is on their closet page');
    chrome.runtime.sendMessage({ type: 'isOnClosetPage', isOnClosetPage: true });
  } else {
    console.log('User is not on their closet page');
    chrome.runtime.sendMessage({ type: 'isOnClosetPage', isOnClosetPage: false });
  }
}

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log('Received message:', message);
  if (message.type === 'shareToFollowers') {
    console.info('Sharing to followers...');
    shareItemsToFollowers(sendResponse);
    return true;
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

                // Step 5: Log the flash message
                setTimeout(() => {
                  const flashMessage = document.querySelector('#flash .flash__message');
                  if (flashMessage) {
                    console.info('Flash message:', flashMessage.textContent.trim());
                  } else {
                    console.error('Error: Flash message not found');
                  }
                }, 1000);
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

const observer = new MutationObserver(function (mutations) {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.matches('#app > main > div:nth-child(1)')) {
        console.log('Main content container added to page');

        // Add a new mutation observer to watch for the flash message
        const flashMessageObserver = new MutationObserver(function (flashMutations) {
          flashMutations.forEach((flashMutation) => {
            flashMutation.addedNodes.forEach((flashNode) => {
              if (flashNode.id === 'flash' && flashNode.querySelector('.flash__message')) {
                console.info('Flash message detected:', flashNode.querySelector('.flash__message').textContent.trim());
                // Send the flash message to popup.js
                chrome.runtime.sendMessage({ type: 'flashMessage', content: flashNode.querySelector('.flash__message').textContent.trim() });
              }
            });
          });
        });

        // Start observing the main content container for changes to its children
        flashMessageObserver.observe(node, { childList: true, subtree: true });
      }
    });
  });
});

// Start observing the entire document for new nodes being added
observer.observe(document, { childList: true, subtree: true });
