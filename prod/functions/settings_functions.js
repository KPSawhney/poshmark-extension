function loadSettings() {
  // Get current settings from storage
  chrome.storage.sync.get(["shareOnly", "shareInterval"], (settings) => {
    // Set default values if settings not found
    const shareOnly = settings.shareOnly || "all";
    const shareInterval = settings.shareInterval || "15";

    // Set form values to current settings
    shareOnlySelect.value = shareOnly;
    shareIntervalSelect.value = shareInterval;
  });
}

function saveSettings(event) {
    event.preventDefault();
  
    // Get form values
    const shareOnly = shareOnlySelect.value;
    const shareInterval = shareIntervalSelect.value;
  
    // Create updated settings object
    const updatedSettings = {
      shareSpecificItems: shareOnly === "specific",
      specificItems: ["item1", "item2"],
      sharingInterval: parseInt(shareInterval),
    };
  
    // Save settings to storage
    chrome.storage.sync.set({ settings: updatedSettings }, () => {
      // Show success message
      const status = document.createElement("div");
      status.textContent = "Settings saved.";
      status.classList.add("status");
      document.querySelector("form").appendChild(status);
  
      // Remove success message after 3 seconds
      setTimeout(() => {
        status.remove();
      }, 3000);
  
      // Send message to update settings
      sendUpdateSettingsMessage();
    });
  }  

function sendUpdateSettingsMessage() {
  // Get the updated settings from storage
  chrome.storage.sync.get("settings", (data) => {
    // Send message to background.js to update settings
    chrome.runtime.sendMessage({
      type: "updateSettings",
      settings: data.settings,
    });
  });
}
