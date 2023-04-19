function updateTaskCount() {
  chrome.runtime.sendMessage({ type: 'getTaskCount' }, (response) => {
    let count = response.taskCount || 0;
    document.getElementById('taskCount').textContent = count;
  });
}

function updateStatus() {
  chrome.runtime.sendMessage({ type: 'getStatus' }, (response) => {
    document.getElementById('taskStatus').textContent = response.status;
    document.getElementById('pauseResume').textContent = response.status === 'Running' ? 'Pause' : 'Resume';
  });
}

function updateCurrentInterval() {
  chrome.runtime.sendMessage({ type: 'getCurrentInterval' }, (response) => {
    document.getElementById('currentInterval').textContent = response.interval;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateTaskCount();
  updateStatus();
  updateCurrentInterval();

  document.getElementById('pauseResume').addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'toggleStatus' }, () => {
      updateStatus();
    });
  });

  document.getElementById('setInterval').addEventListener('click', () => {
    let customInterval = document.getElementById('customInterval').value;
    chrome.runtime.sendMessage({ type: 'setCustomInterval', customInterval: parseInt(customInterval, 10) }, () => {
      updateCurrentInterval();
    });
  });
});