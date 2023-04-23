console.info("popup.js loaded");

// This function executes the shareToFollowers function from `content.js`, and returns
// a success animation on success

function shareItemsToFollowers(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { type: "shareToFollowers" },
      (response) => {
        if (response) {
          callback(response);
          console.info("Clothes were successfully shared!");
        } else {
          console.error("Error: Clothes were not shared after click.");
        }
      }
    );
  });
}

// Wrap content inside DOM Content listener to ensure it doesn't run before Poshmark loads.
document.addEventListener("DOMContentLoaded", () => {
  // Connect to background.js
  const port = chrome.runtime.connect({ name: "getPoshmarkData" });

  // Listen for messages from background.js to update UI based on login status
  port.onMessage.addListener((response) => {
    const isLoggedIn = response.isLoggedIn;
    console.info(
      `Received login status: ${isLoggedIn ? "Logged In" : "Not Logged In"}`
    );
    document.getElementById("loginStatus").textContent = isLoggedIn
      ? "Logged In"
      : "Not Logged In";

    // Listen for flash messages from content.js
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log("Received message from content.js:", message);
      if (message.type === "flashMessage") {
        console.info("Received flash message:", message.content);
      }
    });

    const poshmarkButton = document.getElementById("poshmarkButton");
    const shareToFollowersButton = document.getElementById(
      "shareToFollowersButton"
    );
    const myClosetURL = response.closetURL;

    // Update button text and behavior based on login status
    if (isLoggedIn) {
      poshmarkButton.textContent = "My Closet";
      poshmarkButton.addEventListener("click", () => {
        if (myClosetURL) {
          console.info("Opening My Closet...");
          chrome.tabs.create({ url: myClosetURL }, (tab) => {
            if (chrome.runtime.lastError) {
              console.error(
                "Error opening My Closet:",
                chrome.runtime.lastError
              );
            } else {
              console.info("My Closet opened in new tab:", tab.id);
            }
          });
        } else {
          console.warn("Closet URL not available");
        }
      });

      shareToFollowersButton.style.display = "inline-block";
      shareToFollowersButton.addEventListener("click", () => {
        console.info("Share to Followers button clicked");
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          shareItemsToFollowers((successMessage) => {
            console.info("Success message:", successMessage);
            // Update HTML to show success message
            document.getElementById("successAnimation").style.display = "block";
            setTimeout(() => {
              document.getElementById("successAnimation").style.display =
                "none";
            }, 2000);
          });
        });
      });
    } else {
      poshmarkButton.textContent = "Log In to Poshmark";
      poshmarkButton.addEventListener("click", () => {
        chrome.tabs.create({ url: "https://poshmark.com/login" });
        console.info("Poshmark opened in new tab:", tab.id);
      });

      shareToFollowersButton.style.display = "none";
    }
  });
});
