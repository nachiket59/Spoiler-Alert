var removeword = document.getElementById("removeword");

chrome.storage.sync.get(["words"], function (result) {
  if (result.words !== undefined) {
    for (var word in result.words) {
      let option = document.createElement("option");
      option.value = result.words[word];
      option.innerHTML = result.words[word];
      removeword.appendChild(option);
    }
  }
});

chrome.storage.sync.onChanged.addListener(function (changes) {
  if (changes.words !== undefined) {
    removeword.textContent = "";
    console.log(changes);
    for (var word in changes.words.newValue) {
      let option = document.createElement("option");
      option.value = changes.words.newValue[word];
      option.innerHTML = changes.words.newValue[word];
      removeword.appendChild(option);
    }
  }
});

var addBtn = document.getElementById("add"),
  removeBtn = document.getElementById("remove"),
  addword = document.getElementById("addword");

addBtn.onclick = function () {
  if (addword.value !== "") {
    chrome.storage.sync.get(["words"], function (result) {
      console.log(result);
      if (result.words === undefined) {
        chrome.storage.sync.set(
          { words: { [addword.value]: addword.value } },
          function () {
            console.log("Value is set to " + addword.value);
            chrome.notifications.create("addword", {
              type: "basic",
              iconUrl: "icon16.png",
              title: "Word added",
              message: removeword.value + "Word added successfully!",
            });
          }
        );
      } else {
        result.words[addword.value] = addword.value;
        chrome.storage.sync.set({ words: result.words }, function () {
          console.log("Value is set to " + addword.value);
          chrome.notifications.create("addword", {
            type: "basic",
            iconUrl: "icon16.png",
            title: "Word added",
            message: removeword.value + "Word added successfully!",
          });
        });
      }
    });
  }
};

removeBtn.onclick = function () {
  chrome.storage.sync.get(["words"], function (result) {
    if (result.words !== undefined) {
      delete result.words[removeword.value];
      chrome.storage.sync.set({ words: result.words }, function () {
        console.log(result.words);
        chrome.notifications.create("removeword", {
          type: "basic",
          iconUrl: "icon16.png",
          title: "Word Removed",
          message: removeword.value + " removed successfully!",
        });
      });
    }
  });
};

var removeall = document.getElementById("removeall");
removeall.onclick = function () {
  chrome.storage.sync.clear();
  chrome.notifications.create("removeall", {
    type: "basic",
    iconUrl: "icon16.png",
    title: "Words Removed",
    message: removeword.value + "All words removed successfully!",
  });
};
