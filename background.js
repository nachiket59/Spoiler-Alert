console.log("backcground running");
var words = {};

// listening storage change.
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
//context menu item to select a word from a webpage and add it to spoiler words list.
var ctmAddword = {
  id: "addword",
  title: "add to spoiler word list",
  contexts: ["selection"],
};

var ctmRemoveWord = {
  id: "removeword",
  title: "remove a word form spoiler word list",
  contexts: ["selection"],
};

chrome.contextMenus.create(ctmAddword);
chrome.contextMenus.create(ctmRemoveWord);

chrome.contextMenus.onClicked.addListener(function (e) {
  if (e.menuItemId === "addword" && e.selectionText) {
    chrome.storage.sync.get(["words"], function (result) {
      console.log(result);
      if (result.words === undefined) {
        chrome.storage.sync.set(
          { words: { [e.selectionText]: e.selectionText } },
          function () {
            console.log("Value is set to " + e.selectionText);
            chrome.notifications.create("addword", {
              type: "basic",
              iconUrl: "icon16.png",
              title: "Word added",
              message: e.selectionText + " word added successfully!",
            });
          }
        );
      } else {
        result.words[e.selectionText] = e.selectionText;
        chrome.storage.sync.set({ words: result.words }, function () {
          console.log("Value is set to " + e.selectionText);
          chrome.notifications.create("addword", {
            type: "basic",
            iconUrl: "icon16.png",
            title: "Word added",
            message: e.selectionText + " word added successfully!",
          });
        });
      }
    });
  }
  //remove a word according context menu selction.
  if (words[e.menuItemId]) {
    chrome.storage.sync.get(["words"], function (result) {
      if (result.words !== undefined) {
        let deletedword = words[e.menuItemId];
        delete result.words[words[e.menuItemId]];
        chrome.storage.sync.set({ words: result.words }, function () {
          console.log(result.words);
          chrome.notifications.create("removeword", {
            type: "basic",
            iconUrl: "icon16.png",
            title: "Word Removed",
            message: deletedword + " removed successfully!",
          });
        });
        chrome.contextMenus.remove(deletedword);
      }
    });
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  //request from contnent page to send word list

  if (request.msg === "send words") {
    sendResponse({ words: words });
  }

  //request form content page to notify that words are masked.
  if (request.msg === "notify") {
    chrome.notifications.create("replace-update", {
      type: "basic",
      iconUrl: "/icon16.png",
      title: request.count + " Words Masked",
      message: "spoiler words are replaced with ***... !",
    });
    console.log("notofication");
  }
  // update the removeable words' list in context menu depending on the selection.
  if (request.msg === "updateContextMenu") {
    var rmWordChilds = {};
    for (var key in words) {
      if (words[key].length === request.selection.length)
        rmWordChilds[words[key]] = {
          id: words[key],
          title: words[key],
          contexts: ["selection"],
          parentId: "removeword",
        };
      //console.log(words[key]);
    }
    chrome.contextMenus.remove("removeword");
    chrome.contextMenus.create(ctmRemoveWord);
    for (var key in rmWordChilds) {
      chrome.contextMenus.create(rmWordChilds[key]);
    }
  }
});
