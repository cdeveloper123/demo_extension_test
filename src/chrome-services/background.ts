export {};

chrome.runtime.onConnect.addListener((port) => {
  alert("[background.js] onInstalled");
});

chrome.runtime.onStartup.addListener(() => {
  alert("[background.js] onInstalled");
});

chrome.runtime.onSuspend.addListener(() => {
  console.log("[background.js] onSuspend");
  alert("[background.js] onSuspend");
});
