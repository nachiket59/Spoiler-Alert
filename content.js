document.addEventListener("selectionchange", function () {
  var selection = window.getSelection().toString().trim();
  if (selection.match(/**/)) {
    console.log("match");
    chrome.runtime.sendMessage({
      msg: "updateContextMenu",
      selection: selection,
    });
  }
});

var words = {},
  ct = 0;
var body = document.getElementsByTagName("body");
chrome.runtime.sendMessage({ msg: "send whitelist" }, function (response) {
  if (!response.whitelist[window.location.hostname]) {
    console.log("domain");

    chrome.runtime.sendMessage({ msg: "send words" }, function (response) {
      words = response.words;
      console.log(words);
      for (var key in words) {
        console.log(words[key]);
        var replace = "";
        for (let i = 0; i < words[key].length; i++) {
          replace += "*";
        }
        if (body[0].textContent.search(words[key]) !== -1)
          treeSearch(body[0], words[key], replace);
      }

      chrome.runtime.sendMessage({ msg: "notify", count: ct });
    });
  }
});
function treeSearch(node, word, replace) {
  var regEx = new RegExp(word, "ig");
  if (node.childNodes.length === 0) {
    if (node.nodeType == Element.TEXT_NODE) {
      let prev = node.textContent;
      node.textContent = node.textContent.replace(regEx, replace);
      if (prev !== node.textContent) {
        ct++;
        //console.log(node.textContent);
      }
    }
    return;
  } else {
    for (child of node.childNodes) {
      if (child.nodeName !== "SCRIPT" && child.nodeName !== "STYLE")
        treeSearch(child, word, replace);
    }
  }
}
console.log("content js");
