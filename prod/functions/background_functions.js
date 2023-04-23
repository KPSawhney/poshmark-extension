// BACKGROUND FUNCTIONS

// Check Poshmark login status using jwt and ui cookies
function checkPoshmarkLoginStatus(callback) {
  // Log that we are checking Poshmark login status
  console.info("Checking Poshmark login status...");

  // Declare poshmarkLoginStatus variable
  let poshmarkLoginStatus;

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

// Explicitly export the functions
export { checkPoshmarkLoginStatus, getClosetURL };
