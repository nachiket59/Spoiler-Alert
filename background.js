console.log("backcground running");
var words = {};
chrome.storage.sync.onChanged.addListener(function (changes) {
  if (changes.words !== undefined) {
    words = changes.words.newValue;
  }
});
chrome.storage.sync.get(["words"], function (result) {
  if (result.words !== undefined) {
    words = result.words;
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.msg === "send words") {
    sendResponse({ words: words });
  }
});
