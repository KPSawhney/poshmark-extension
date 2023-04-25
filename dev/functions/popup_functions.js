// POPUP FUNCTIONS

function openMyCloset(myClosetURL) {
  if (myClosetURL) {
    console.info("Opening My Closet...");

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];

      if (tab.url.includes("poshmark.com")) {
        chrome.tabs.update({ url: myClosetURL }, (updatedTab) => {
          console.info("My Closet opened on current tab:", updatedTab.id);
        });
      } else {
        chrome.tabs.create({ url: myClosetURL }, (newTab) => {
          console.info("My Closet opened in new tab:", newTab.id);
        });
      }
    });
  } else {
    console.warn("Closet URL not available");
  }
}

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

const States = {
  NOT_LOGGED_IN: 1,
  NOT_POSHMARK: 2,
  POSHMARK_NOT_CLOSET: 3,
  POSHMARK_CLOSET: 4,
};

function determineState(isLoggedIn, activeTab) {
  let state;

  if (!isLoggedIn) {
    state = States.NOT_LOGGED_IN;
  } else if (
    activeTab.url.indexOf("poshmark.com/closet/") !== -1 ||
    activeTab.url.indexOf("poshmark.com/closet") !== -1
  ) {
    state = States.POSHMARK_CLOSET;
  } else if (activeTab.url.indexOf("poshmark.com") !== -1) {
    state = States.POSHMARK_NOT_CLOSET;
  } else {
    state = States.NOT_POSHMARK;
  }

  console.log("Determined state:", state, Object.keys(States)[state - 1]);
  return state;
}

function updateUI(state, closetURL) {
  const loginStatus = document.getElementById("loginStatus");
  const poshmarkButton = document.getElementById("poshmarkButton");
  const shareToFollowersButton = document.getElementById("shareToFollowersButton");

  switch (state) {
    case States.NOT_LOGGED_IN:
      loginStatus.textContent = "Not logged in";
      poshmarkButton.disabled = true;
      shareToFollowersButton.disabled = true;
      break;
    case States.NOT_POSHMARK:
    case States.POSHMARK_NOT_CLOSET:
      loginStatus.textContent = "Logged in";
      poshmarkButton.disabled = false;
      shareToFollowersButton.disabled = true;
      break;
    case States.POSHMARK_CLOSET:
      loginStatus.textContent = "Logged in";
      poshmarkButton.disabled = true;
      shareToFollowersButton.disabled = false;
      break;
  }
}

export { openMyCloset, shareItemsToFollowers, determineState, States, updateUI };
