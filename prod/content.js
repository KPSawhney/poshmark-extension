// Log when content.js is loaded
console.info("content.js loaded");

// Parse the closet URL from the user's Poshmark page
function parseClosetURL() {
  console.log("Parsing closet URL...");
  const closetLinks = Array.from(document.querySelectorAll("a.dropdown__link"));
  const closetLink = closetLinks.find(
    (link) => link.textContent.trim() === "My Closet"
  );
  if (closetLink) {
    const closetURL = closetLink.getAttribute("href");
    const parsedURL = `https://poshmark.com${closetURL}`;
    console.log("Parsed closet URL:", parsedURL);
    return parsedURL;
  }
  console.warn("Closet link not found");
  return null;
}

// Share all items to followers by clicking on various elements in order.

async function shareItemsToFollowers(sendResponse) {
  try {
    // Step 1: Click on the spanner icon
    const spannerIcon = document.querySelector("i.icon.icon-bulk-tools");
    console.log("Spanner icon:", spannerIcon);
    if (!spannerIcon) {
      throw new Error("Error: Spanner icon not found");
    }
    spannerIcon.click();

    // Step 2: Click share to followers dropdown choice
    await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 second
    const shareToFollowersButton = document.querySelector(
      'div[data-et-name="share_to_followers"]'
    );
    console.log("Share to followers button:", shareToFollowersButton);
    if (!shareToFollowersButton) {
      throw new Error("Error: Share to Followers dropdown choice not found");
    }
    shareToFollowersButton.click();

    // Step 3: Click the checkbox to select all clothes after the page reloads
    await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 second
    const selectAllCheckbox = document.querySelector(".tile__checkbox");
    console.log("Select all checkbox:", selectAllCheckbox);
    if (!selectAllCheckbox) {
      throw new Error("Error: Select All checkbox not found");
    }
    selectAllCheckbox.click();

    // Step 4: Click the green share button
    await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 second
    const greenShareButton = document.querySelector(
      'button[data-et-name="share_to_followers"]'
    );
    console.log("Green share button:", greenShareButton);
    if (!greenShareButton) {
      throw new Error("Error: Green share button not found");
    }
    greenShareButton.click();
    console.log("Green share button clicked successfully.");
    sendResponse({ success: true, message: "Green share button clicked." });
  } catch (error) {
    console.error(error);
    sendResponse({ success: false, message: error.message });
  }
}

// Parse the closet URL and sending it to the background script

const closetURL = parseClosetURL();
if (closetURL) {
  console.log("Sending closet URL to background script:", closetURL);
  chrome.runtime.sendMessage({ type: "closetURL", url: closetURL });
} else {
  console.warn("Closet URL not found");
}

// Listen for messages from popup.js in order to trigger the `shareItemsToFollowers` function.
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("Received message:", message);
  if (message.type === "shareToFollowers") {
    console.info("Sharing to followers...");
    shareItemsToFollowers(sendResponse);
    // Close the message channel by returning false since there's no need for asynchronous response
    return false;
  }
});
