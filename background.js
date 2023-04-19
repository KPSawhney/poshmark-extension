const defaultInterval = 3 * 60 * 60 * 1000; // 3 hours
let currentInterval = defaultInterval;
let taskCount = 0;
let taskId;
let taskStatus = 'Running';

function openOpenAI() {
  chrome.tabs.create({ url: 'https://openai.com' });
  taskCount++;
  chrome.storage.local.set({ taskCount });
}

function startTask() {
  taskId = setInterval(() => {
    if (taskStatus === 'Running') {
      openOpenAI();
    }
  }, currentInterval);
}

function stopTask() {
  clearInterval(taskId);
}

chrome.runtime.onInstalled.addListener(() => {
  startTask();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case 'getTaskCount':
      sendResponse({ taskCount });
      break;
    case 'getStatus':
      sendResponse({ status: taskStatus });
      break;
    case 'getCurrentInterval':
      sendResponse({ interval: currentInterval / 1000 });
      break;
    case 'toggleStatus':
      taskStatus = taskStatus === 'Running' ? 'Paused' : 'Running';
      break;
    case 'setCustomInterval':
      currentInterval = request.customInterval * 1000;
      stopTask();
      startTask();
      break;
    default:
      break;
  }
});
