document.addEventListener("DOMContentLoaded", function () {
  checkLoginStatus();
});

function checkLoginStatus() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "checkLogin" }, function (response) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }
      handleLoginStatus(response);
    });
  });
}

function handleLoginStatus(request) {
  let loggedInDiv = document.getElementById("loggedIn");
  let loggedOutDiv = document.getElementById("loggedOut");

  if (request.loggedIn && request.profileImageUrl && request.closetUrl) {
    loggedInDiv.style.display = "block";
    loggedOutDiv.style.display = "none";
    document.getElementById("userProfileImage").src = request.profileImageUrl;
    document.getElementById("myClosetButton").href = request.closetUrl;
  } else {
    loggedInDiv.style.display = "none";
    loggedOutDiv.style.display = "block";
  }
}
