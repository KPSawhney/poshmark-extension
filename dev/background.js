import {
  checkPoshmarkLoginStatus,
  getClosetURL,
} from "./functions/background_functions.js";

// Log when background.js is loaded
console.info("background.js loaded");

// Declare myClosetURL variable

let myClosetURL = null;

// Listen for messages from content.js to update myClosetURL
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "closetURL") {
    console.log("Received closet URL message:", message);
    myClosetURL = message.url;
    console.info("Updated closet URL:", myClosetURL);
  }
});

// Await connection from popup.js to send login status and closet URL
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "getPoshmarkData") {
    console.log("Connected to popup.js with the name 'getPoshmarkData'");
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const activeTab = tabs[0];
      const isLoggedIn = await checkPoshmarkLoginStatus();
      const closetURL = await getClosetURL();
    
      function determineState(isLoggedIn, activeTab) {
        if (!isLoggedIn) {
          return 1;
        } else if (activeTab.url.indexOf("poshmark.com") === -1) {
          return 2;
        } else if (activeTab.url.indexOf("poshmark.com/closet/") === -1) {
          return 3;
        } else {
          return 4;
        }
      }
    
      const state = determineState(isLoggedIn, activeTab);
      port.postMessage({ state, closetURL });
    });
  }
});
