// POPUP FUNCTIONS

// This function executes the shareToFollowers function from `content.js`, and returns
// a success animation on success

function shareItemsToFollowers(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];

    chrome.tabs.sendMessage(
      tab.id,
      { type: "shareToFollowers" },
      (response) => {
        if (response && response.success) {
          callback(response.message);
          console.info("Clothes were successfully shared!");
        } else {
          console.error(
            "Error: Clothes were not shared after click. Reason: " +
              (response ? response.message : "unknown error")
          );
        }
      }
    );
  });
}

// Explicitly export the functions
export { shareItemsToFollowers };
