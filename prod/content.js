// Log when content.js is loaded
console.info('content.js loaded');

// Parse the closet URL from the user's Poshmark page
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

async function shareItemsToFollowers(sendResponse) {
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
    sendResponse({ success: true, message: 'Green share button clicked.' });
  } catch (error) {
    console.error(error);
    sendResponse({ success: false, message: error.message });
  }
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

// Legacy Flash Messages Code

// // This function observes the flash messages on the page and sends a message to the background script
// // when a new flash message is detected
// function observeFlashMessages() {
//   let flashMessageObserver;

//   // Get the active tab when the function is called
//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     // Check if the active tab is on the Poshmark website
//     if (tabs[0].url.indexOf('https://poshmark.com') !== -1) {
//       console.log('Starting to observe flash messages...');
//       flashMessageObserver = new MutationObserver((mutations) => {
//         mutations.forEach((mutation) => {
//           mutation.addedNodes.forEach((node) => {
//             if (node.id === 'flash') {
//               const flashMessage = node.querySelector('#flash__message');
//               console.log('Flash message detected:', flashMessage.textContent.trim());
//               chrome.runtime.sendMessage({ type: 'flashMessageDetected', message: flashMessage.textContent.trim() });
//             }
//           });
//         });
//       });

//       flashMessageObserver.observe(document.body, { childList: true });
//     } else {
//       console.log('Disable or lock the extension because the active tab is not on the Poshmark website');
//       chrome.management.setEnabled(chrome.runtime.id, false);
//     }
//   });

//   // Listen for changes in the active tab and pause or resume the observation of flash messages accordingly
//   chrome.tabs.onActivated.addListener(function () {
//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//       if (tabs[0].url.indexOf('https://poshmark.com') !== -1) {
//         if (flashMessageObserver) {
//           console.log('Resuming observation of flash messages...');
//           flashMessageObserver.observe(document.body, { childList: true });
//         } else {
//           console.log('Starting to observe flash messages...');
//           flashMessageObserver = new MutationObserver((mutations) => {
//             mutations.forEach((mutation) => {
//               mutation.addedNodes.forEach((node) => {
//                 if (node.id === 'flash') {
//                   const flashMessage = node.querySelector('#flash__message');
//                   console.log('Flash message detected:', flashMessage.textContent.trim());
//                   chrome.runtime.sendMessage({ type: 'flashMessageDetected', message: flashMessage.textContent.trim() });
//                 }
//               });
//             });
//           });

//           flashMessageObserver.observe(document.body, { childList: true });
//         }
//       } else {
//         console.log('Pausing observation of flash messages...');
//         if (flashMessageObserver) {
//           flashMessageObserver.disconnect();
//         }
//       }
//     });
//   });
// }
// observeFlashMessages();