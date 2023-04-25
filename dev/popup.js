import {
  openMyCloset,
  shareItemsToFollowers,
  determineState,
  States,
  updateUI,
} from "./popup_functions.js";

document.getElementById("poshmarkButton").addEventListener("click", () => {
  chrome.storage.sync.get(["closetURL"], (result) => {
    openMyCloset(result.closetURL);
  });
});

document
  .getElementById("shareToFollowersButton")
  .addEventListener("click", () => {
    shareItemsToFollowers((message) => {
      console.log(message);
    });
  });

chrome.storage.sync.get(["isLoggedIn", "closetURL"], (result) => {
  const isLoggedIn = result.isLoggedIn;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    const state = determineState(isLoggedIn, activeTab);

    updateUI(state, result.closetURL);
  });
});
