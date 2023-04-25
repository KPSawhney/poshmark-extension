// Log when content.js is loaded
console.info("content.js loaded");

function displayError(message) {
  const errorContainer = document.getElementById("errorContainer");
  errorContainer.textContent = message;
  errorContainer.style.display = "block";
}

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
  const steps = [
    {
      selector: "i.icon.icon-bulk-tools",
      action: "click",
      description: "Spanner icon",
      errorMessage: "Error: Spanner icon not found",
    },
    {
      selector: 'div[data-et-name="share_to_followers"]',
      action: "click",
      description: "Share to followers button",
      errorMessage: "Error: Share to Followers dropdown choice not found",
      delay: 1000,
    },
    {
      selector: ".tile__checkbox",
      action: "click",
      description: "Select all checkbox",
      errorMessage: "Error: Select All checkbox not found",
      delay: 1000,
    },
    {
      selector: 'button[data-et-name="share_to_followers"]',
      action: "click",
      description: "Green share button",
      errorMessage: "Error: Green share button not found",
      delay: 1000,
    },
  ];

  try {
    for (const step of steps) {
      if (step.delay) {
        await new Promise((resolve) => setTimeout(resolve, step.delay));
      }
      const element = document.querySelector(step.selector);
      console.log(step.description + ":", element);
      if (!element) {
        throw new Error(step.errorMessage);
      }
      element[step.action]();
    }

    console.log("Green share button clicked successfully.");
    sendResponse({ success: true, message: "Green share button clicked." });
  } catch (error) {
    console.error("An error occurred while sharing items:", error);
    displayError("An error occurred while sharing items. Please try again.");
    sendResponse({ success: false, error: error.message });
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

// Set up a listener for messages from popup.js.
// When a "shareToFollowers" message is received, it triggers the `shareItemsToFollowers` function.
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("Received message:", message);

  // Check if the received message is of type "shareToFollowers".
  if (message.type === "shareToFollowers") {
    console.info("Sharing to followers...");

    // Call the shareItemsToFollowers function and pass the sendResponse as a callback.
    shareItemsToFollowers(sendResponse);

    // Return true to keep the message channel open for asynchronous responses.
    // This ensures proper coordination between the scripts while waiting for a response.
    return true;
  }
});

