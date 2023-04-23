// Log when content.js is loaded
console.info('content.js loaded');

// Define observer which checks when new flash messages are detected, which is used to
// determine the success of the shareItemsToFollowers function.

const flashMessageObserver = new MutationObserver(function (flashMutations) {
  flashMutations.forEach((flashMutation) => {
    flashMutation.addedNodes.forEach((flashNode) => {
      if (flashNode.id === 'flash') {
        const flashMessageElement = flashNode.querySelector('#flash__message');
        if (flashMessageElement) {
          console.info('Flash message detected:', flashMessageElement.textContent.trim());
          // Send the flash message
          chrome.runtime.sendMessage({ type: 'flashMessage', content: flashMessageElement.textContent.trim() });
        } else {
          console.log('Flash container detected, but no flash message element found.');
        }
      }
    });
  });
});

// Parse the closet URL from the current Poshmark page
function parseClosetURL() {
  console.log('Parsing closet URL...');
  const closetLinks = Array.from(document.querySelectorAll('a.dropdown__link'));
  const closetLink = closetLinks.find(link => link.textContent.trim() === 'My Closet');
  if (closetLink) {
    const closetURL = closetLink.getAttribute('href');
    const parsedURL = `https://poshmark.com${closetURL}`;
    console.log('Parsed closet URL:', parsedURL);
    return parsedURL;
  }
  console.warn('Closet link not found');
  return null;
}


// Check the user is on their closet page

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

// Share all items to followers by clicking on various elements in order.

async function shareItemsToFollowers(callback) {
  try {
    // Step 1: Click on the spanner icon
    const spannerIcon = document.querySelector('i.icon.icon-bulk-tools');
    console.log('Spanner icon:', spannerIcon);
    if (!spannerIcon) {
      throw new Error('Error: Spanner icon not found');
    }
    spannerIcon.click();

    // Step 2: Click share to followers dropdown choice
    await new Promise(resolve => setTimeout(resolve, 1000)); // wait for 1 second
    const shareToFollowersButton = document.querySelector('div[data-et-name="share_to_followers"]');
    console.log('Share to followers button:', shareToFollowersButton);
    if (!shareToFollowersButton) {
      throw new Error('Error: Share to Followers dropdown choice not found');
    }
    shareToFollowersButton.click();

    // Step 3: Click the checkbox to select all clothes after the page reloads
    await new Promise(resolve => setTimeout(resolve, 1000)); // wait for 1 second
    const selectAllCheckbox = document.querySelector('.tile__checkbox');
    console.log('Select all checkbox:', selectAllCheckbox);
    if (!selectAllCheckbox) {
      throw new Error('Error: Select All checkbox not found');
    }
    selectAllCheckbox.click();

    // Step 4: Click the green share button
    await new Promise(resolve => setTimeout(resolve, 1000)); // wait for 1 second
    const greenShareButton = document.querySelector('button[data-et-name="share_to_followers"]');
    console.log('Green share button:', greenShareButton);
    if (!greenShareButton) {
      throw new Error('Error: Green share button not found');
    }
    greenShareButton.click();
    console.log('Green share button clicked successfully.');

    // Detect the flash message
    const flashMessage = await waitForFlashMessage('Flash message not detected after green share button clicked within specified time');
  } catch (error) {
    console.error(error);
    callback(error.message);
  }
}

async function waitForFlashMessage(errorMessage) {
  return new Promise((resolve, reject) => {
    const flashMessageObserver = new MutationObserver(async (mutations) => {
      mutations.forEach(async (mutation) => {
        if (mutation.id  === 'flash') {
          console.info('Flash message detected:', flashMessageElement.textContent.trim());
          const flashMessage = mutation.querySelector('#flash__message');
          if (flashMessage) {
            console.log('Flash message detected after green share button clicked:', flashMessage);
            flashMessageObserver.disconnect();
            clearTimeout(flashTimeout);
            resolve(flashMessage);
          }
        }
      });
    });

    // Observe for new flash messages added to the body
    flashMessageObserver.observe(document.body, { childList: true });

    // Set a timeout to handle cases when the flash message is not detected
    const flashTimeout = setTimeout(() => {
      flashMessageObserver.disconnect();
      reject(new Error(errorMessage));
    }, 100000); // You can adjust the timeout duration (in milliseconds) as needed
  });
}

// Listen for messages from popup.js in order to trigger the `shareItemsToFollowers` function.
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log('Received message:', message);
  if (message.type === 'shareToFollowers') {
    console.info('Sharing to followers...');
    shareItemsToFollowers(sendResponse);
    return true;
  }
});
