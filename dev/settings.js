console.info("settings.js loaded");

import { loadSettings, saveSettings } from "./functions/settings_functions.js";

// Get elements from DOM
const shareOnlySelect = document.getElementById("share-only");
const shareIntervalSelect = document.getElementById("share-interval");

// Load settings on page load
document.addEventListener("DOMContentLoaded", loadSettings);

// Add event listener to form submit
document.querySelector("form").addEventListener("submit", saveSettings);
