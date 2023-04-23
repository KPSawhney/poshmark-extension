console.info("popup.js loaded");

import { shareItemsToFollowers } from './functions/popup_functions.js';

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

      // Open My Closet page in new tab when button is clicked
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

      // Show "Share to Followers" button
      shareToFollowersButton.style.display = "inline-block";

      // Call shareItemsToFollowers function and show success message when "Share to Followers" button is clicked
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
