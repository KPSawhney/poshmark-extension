console.info("popup.js loaded");

import {
  shareItemsToFollowers,
  openMyCloset,
} from "./functions/popup_functions.js";

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

    // Update login status text
    document.getElementById("loginStatus").textContent = isLoggedIn
      ? "Logged In"
      : "Not Logged In";

    // Get button elements
    const poshmarkButton = document.getElementById("poshmarkButton");
    const shareToFollowersButton = document.getElementById(
      "shareToFollowersButton"
    );

    // Get closet URL
    const myClosetURL = response.closetURL;

    // Update button text and behavior based on login status
    if (isLoggedIn) {
      poshmarkButton.textContent = "My Closet";

      // Show "Share to Followers" button
      shareToFollowersButton.style.display = "inline-block";

      // Open My Closet page when button is clicked
      poshmarkButton.addEventListener("click", () => {
        console.info("Open My Closet button clicked");
        openMyCloset(myClosetURL);
      });

      // Call shareItemsToFollowers function and show success message when "Share to Followers" Poshmark button is clicked
      shareToFollowersButton.addEventListener("click", () => {
        console.info("Share to Followers button clicked");

        // Show the "running" animation
        document.getElementById("runningAnimation").style.display = "block";

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          shareItemsToFollowers((successMessage) => {
            console.info("Success message:", successMessage);

            // Hide the "running" animation
            document.getElementById("runningAnimation").style.display = "none";

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
      // Show "Log In to Poshmark" button
      poshmarkButton.textContent = "Log In to Poshmark";
      poshmarkButton.addEventListener("click", () => {
        chrome.tabs.create({ url: "https://poshmark.com/login" }, (tab) => {
          console.info("Poshmark opened in new tab:", tab.id);
        });
      });
      shareToFollowersButton.style.display = "none";
    }
  });
});
