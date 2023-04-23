// Log when background.js is loaded
console.info("background.js loaded");

// Declare myClosetURL variable
let myClosetURL = null;

// Check Poshmark login status using jwt and ui cookies
function checkPoshmarkLoginStatus(callback) {
  // Log that we are checking Poshmark login status
  console.info("Checking Poshmark login status...");

  // Get the jwt and ui cookies from Poshmark
  chrome.cookies.get(
    {
      url: "https://poshmark.com",
      name: "jwt",
    },
    function (jwtCookie) {
      chrome.cookies.get(
        {
          url: "https://poshmark.com",
          name: "ui",
        },
        function (uiCookie) {
          // If both cookies are present, the user is logged in
          if (jwtCookie && uiCookie) {
            poshmarkLoginStatus = "Logged In";
          } else {
            poshmarkLoginStatus = "Not Logged In";
          }
          // Log the Poshmark login status
          console.info("Poshmark login status:", poshmarkLoginStatus);

          // Call the callback function with the Poshmark login status
          callback(poshmarkLoginStatus);
        }
      );
    }
  );
}

// Get closet URL from local storage
async function getClosetURL() {
  // Log that we are getting the closet URL from local storage
  console.info("Getting closet URL from local storage...");

  // Try to get the closet URL from local storage
  return new Promise((resolve) => {
    chrome.storage.local.get("closetURL", function (data) {
      if (chrome.runtime.lastError) {
        // Log the error
        console.error(
          "Error getting closet URL from local storage:",
          chrome.runtime.lastError
        );
        resolve(null);
      } else {
        // Log the closet URL
        console.info("Closet URL from local storage:", data.closetURL);

        // Return the closet URL
        resolve(data.closetURL);
      }
    });
  });
}

// Listen for messages from content.js to update myClosetURL
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  // If the message type is "closetURL",
  // update myClosetURL with the closet URL
  if (message.type === "closetURL") {
    // Check if the active tab has a Poshmark URL
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0].url.startsWith("https://poshmark.com")) {
        myClosetURL = message.url;
        console.info("Received closet URL:", myClosetURL);
      } else {
        console.info("No active Poshmark tab found");
      }
    });
  }
});

// Await connection from popup.js to send login status and closet URL
chrome.runtime.onConnect.addListener(function (port) {
  // If the connection is from the popup.js script with the name "getPoshmarkData",
  // check the Poshmark login status and get the closet URL
  if (port.name === "getPoshmarkData") {
    checkPoshmarkLoginStatus(async function (status) {
      const myClosetURL = await getClosetURL();
      port.postMessage({
        isLoggedIn: status === "Logged In",
        closetURL: myClosetURL,
      });
    });
  }
});
