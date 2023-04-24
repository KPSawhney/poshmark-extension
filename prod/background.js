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
    checkPoshmarkLoginStatus(async (status) => {
      console.log("Poshmark login status:", status);
      const myClosetURL = await getClosetURL();
      console.log("Sending login status and closet URL to popup.js");
      port.postMessage({
        isLoggedIn: status === "Logged In",
        closetURL: myClosetURL,
      });
    });
  }
});
