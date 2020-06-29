let body = document.getElementsByTagName("body");
function findAndReplace(text, words) {}

function treeSearch(node) {
  if (node.childNodes.length === 0) {
    if (node.nodeType == Element.TEXT_NODE) {
      node.textContent = node.textContent.replace("document", "********");
    }
    return;
  } else {
    for (child of node.childNodes) {
      treeSearch(child);
    }
  }
}
treeSearch(body[0]);

console.log("content js");
