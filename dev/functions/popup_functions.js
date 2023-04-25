// POPUP FUNCTIONS

// This function executes the shareToFollowers function from `content.js`, and returns
// a success animation on success

function openMyCloset(myClosetURL) {
  if (myClosetURL) {
    console.info("Opening My Closet...");

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];

      // Check if the current tab is a Poshmark page
      if (tab.url.includes("poshmark.com")) {
        // Update the current tab's URL to the closet URL
        chrome.tabs.update({ url: myClosetURL }, (updatedTab) => {
          console.info("My Closet opened on current tab:", updatedTab.id);
        });
      } else {
        // Open the closet URL in a new tab
        chrome.tabs.create({ url: myClosetURL }, (newTab) => {
          console.info("My Closet opened in new tab:", newTab.id);
        });
      }
    });
  } else {
    console.warn("Closet URL not available");
  }
};

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

function switchTab(tabName) {
  const tabContents = document.querySelectorAll(".tab-content");
  tabContents.forEach((content) => {
    content.style.display = "none";
  });
  document.getElementById(tabName).style.display = "block";
}

// Explicitly export the functions
export { shareItemsToFollowers, openMyCloset, switchTab };
