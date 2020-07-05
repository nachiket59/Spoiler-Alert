console.log("backcground running");
var words = {},
  whitelist = {};

// listening storage change.
chrome.storage.sync.onChanged.addListener(function (changes) {
  if (changes.words !== undefined) {
    words = changes.words.newValue;
  }
  if (changes.whitelist !== undefined) {
    whitelist = changes.whitelist.newValue;
  }
});
chrome.storage.sync.get(["words", "whitelist"], function (result) {
  if (result.words !== undefined) {
    words = result.words;
  }
  if (result.whitelist !== undefined) {
    whitelist = result.whitelist;
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
//chrome.contextMenus.create(ctmRemoveWord);

chrome.contextMenus.onClicked.addListener(function (e) {
  if (e.menuItemId === "addword" && e.selectionText) {
    chrome.storage.sync.get(["words"], function (result) {
      console.log(result);
      if (result.words === undefined) {
        chrome.storage.sync.set(
          { words: { [e.selectionText]: e.selectionText } },
          function () {
            console.log("Value is set to " + e.selectionText);
            try {
              chrome.notifications.create("addword", {
                type: "basic",
                iconUrl: "icon16.png",
                title: "Word added",
                message: e.selectionText + " word added successfully!",
              });
            } catch (err) {
              console.log(err);
            }
          }
        );
      } else {
        result.words[e.selectionText] = e.selectionText;
        chrome.storage.sync.set({ words: result.words }, function () {
          console.log("Value is set to " + e.selectionText);
          try {
            chrome.notifications.create("addword", {
              type: "basic",
              iconUrl: "icon16.png",
              title: "Word added",
              message: e.selectionText + " word added successfully!",
            });
          } catch (err) {
            console.log(err);
          }
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
          try {
            chrome.notifications.create("removeword", {
              type: "basic",
              iconUrl: "icon16.png",
              title: "Word Removed",
              message: deletedword + " removed successfully!",
            });
          } catch (err) {
            console.log(err);
          }
        });
        chrome.contextMenus.remove(deletedword);
      }
    });
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  //request from contnent page to send word list
  if (request.msg === "send whitelist") {
    sendResponse({ whitelist: whitelist });
  }
  if (request.msg === "send words") {
    sendResponse({ words: words });
  }

  //request form content page to notify that words are masked.
  if (request.msg === "notify") {
    try {
      chrome.notifications.create("replace-update", {
        type: "basic",
        iconUrl: "/icon16.png",
        title: request.count + " Words Masked",
        message: "spoiler words are replaced with ***... !",
      });
    } catch (err) {
      console.log(err);
    }
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
    try {
      chrome.contextMenus.remove("removeword");
    } catch (err) {
      console.log(err);
    }
    chrome.contextMenus.create(ctmRemoveWord);
    for (var key in rmWordChilds) {
      chrome.contextMenus.create(rmWordChilds[key]);
    }
  }
});
