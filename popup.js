var black_url = document.getElementById("black_url"),
  removeword = document.getElementById("removeword");

//creating options list for remove word select tag and blackilst select tag.
chrome.storage.sync.get(["words", "whitelist"], function (result) {
  if (result.words !== undefined) {
    for (var word in result.words) {
      let option = document.createElement("option");
      option.value = result.words[word];
      option.innerHTML = result.words[word];
      removeword.appendChild(option);
    }
  }
  if (result.whitelist !== undefined) {
    for (var word in result.whitelist) {
      let option = document.createElement("option");
      option.value = result.whitelist[word];
      option.innerHTML = result.whitelist[word];
      black_url.appendChild(option);
    }
  }
});

//updating options in remove word select tag and blacklist select tag on storage change
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
  if (changes.whitelist !== undefined) {
    black_url.textContent = "";
    console.log(changes);
    for (var word in changes.whitelist.newValue) {
      let option = document.createElement("option");
      option.value = changes.whitelist.newValue[word];
      option.innerHTML = changes.whitelist.newValue[word];
      black_url.appendChild(option);
    }
  }
});

//onclick events for all the button - add word, remove word
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
            try {
              chrome.notifications.create("addword", {
                type: "basic",
                iconUrl: "icon16.png",
                title: "Word added",
                message: addword.value + " word added successfully!",
              });
            } catch (err) {
              console.log(err);
            }
          }
        );
      } else {
        result.words[addword.value] = addword.value;
        chrome.storage.sync.set({ words: result.words }, function () {
          console.log("Value is set to " + addword.value);
          try {
            chrome.notifications.create("addword", {
              type: "basic",
              iconUrl: "icon16.png",
              title: "Word added",
              message: addword.value + " word added successfully!",
            });
          } catch (err) {
            console.log(err);
          }
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
        try {
          chrome.notifications.create("removeword", {
            type: "basic",
            iconUrl: "icon16.png",
            title: "Word Removed",
            message: removeword.value + " removed successfully!",
          });
        } catch (err) {
          console.log(err);
        }
      });
    }
  });
};

var removeall = document.getElementById("removeall");
removeall.onclick = function () {
  chrome.storage.sync.clear();
  try {
    chrome.notifications.create("removeall", {
      type: "basic",
      iconUrl: "icon16.png",
      title: "Words Removed",
      message: "All words removed successfully!",
    });
  } catch (err) {
    console.log(err);
  }
};

//mute and unmute notifications.
var mutenot = document.getElementById("mutenot");
chrome.permissions.contains({ permissions: ["notifications"] }, function (res) {
  if (res) {
    mutenot.textContent = "on";
  } else {
    mutenot.textContent = "off";
  }
});

mutenot.onclick = function () {
  chrome.permissions.contains({ permissions: ["notifications"] }, function (
    res
  ) {
    if (res) {
      chrome.permissions.remove(
        {
          permissions: ["notifications"],
        },
        function (res) {
          if (res) {
            mutenot.textContent = "off";
          } else {
            mutenot.textContent = "on";
          }
        }
      );
    } else {
      chrome.permissions.request(
        {
          permissions: ["notifications"],
        },
        function (res) {
          if (res) {
            mutenot.textContent = "on";
          } else {
            mutenot.textContent = "off";
          }
        }
      );
    }
  });
};

//whitelist url
var white_url = document.getElementById("white_url"),
  whitelist = document.getElementById("whitelist");

whitelist.onclick = function () {
  var domain = new URL(white_url.value).hostname;
  if (domain !== "") {
    chrome.storage.sync.get(["whitelist"], function (result) {
      console.log(result);
      if (result.whitelist === undefined) {
        chrome.storage.sync.set(
          { whitelist: { [domain]: domain } },
          function () {
            console.log("Value is set to " + domain);
            try {
              chrome.notifications.create("addwhitelist", {
                type: "basic",
                iconUrl: "icon16.png",
                title: "Whitelisted",
                message: domain + " whitelisted successfully!",
              });
            } catch (err) {
              console.log(err);
            }
          }
        );
      } else {
        result.whitelist[domain] = domain;
        chrome.storage.sync.set({ whitelist: result.whitelist }, function () {
          console.log("Value is set to " + domain);
          try {
            chrome.notifications.create("addwhitelist", {
              type: "basic",
              iconUrl: "icon16.png",
              title: "Whitelisted",
              message: domain + " whitelisted successfully!",
            });
          } catch (err) {
            console.log(err);
          }
        });
      }
    });
  }
};

//blacklist url
var blacklist = document.getElementById("blacklist");
blacklist.onclick = function () {
  chrome.storage.sync.get(["whitelist"], function (result) {
    if (result.whitelist !== undefined) {
      delete result.whitelist[black_url.value];
      chrome.storage.sync.set({ whitelist: result.whitelist }, function () {
        console.log(result.whitelist);
        try {
          chrome.notifications.create("black_url", {
            type: "basic",
            iconUrl: "icon16.png",
            title: "Domain Removed",
            message: black_url.value + " removed successfully!",
          });
        } catch (err) {
          console.log(err);
        }
      });
    }
  });
};
