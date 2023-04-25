console.info("content.js loaded");

async function shareItemsToFollowers(sendResponse) {
  try {
    const spannerIcon = document.querySelector("i.icon.icon-bulk-tools");
    if (!spannerIcon) {
      throw new Error("Error: Spanner icon not found");
    }
    spannerIcon.click();

    await new Promise((resolve) => setTimeout(resolve, 1000));
    const shareToFollowersButton = document.querySelector(
      'div[data-et-name="share_to_followers"]'
    );
    if (!shareToFollowersButton) {
      throw new Error("Error: Share to Followers dropdown choice not found");
    }
    shareToFollowersButton.click();

    await new Promise((resolve) => setTimeout(resolve, 1000));
    const selectAllCheckbox = document.querySelector(".tile__checkbox");
    if (!selectAllCheckbox) {
      throw new Error("Error: Select All checkbox not found");
    }
    selectAllCheckbox.click();

    await new Promise((resolve) => setTimeout(resolve, 1000));
    const greenShareButton = document.querySelector(
      'button[data-et-name="share_to_followers"]'
    );
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

function parseClosetURL() {
  const closetLink = document.querySelector('.user-info__username a[href*="/closet/"]');
  return closetLink ? closetLink.href : null;
}

const closetURL = parseClosetURL();
if (closetURL) {
  console.log("Sending closet URL to background script:", closetURL);
  chrome.runtime.sendMessage({ type: "closetURL", url: closetURL });
} else {
  console.warn("Closet URL not found");
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("Received message:", message);
  if (message.type === "shareToFollowers") {
    console.info("Sharing to followers...");
    shareItemsToFollowers(sendResponse);
    return false;
  }
});
