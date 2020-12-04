
function changeCodeBlock() {
  // Find all <pre> tags, check if they have a code tag as a direct child.
  // If so, and the code class Motoko, add run button, else add copy button.
  // Checking first for pre tag
  // ensures we don't add button to code blocks within paragraphs.
  var preTags = document.getElementsByTagName("pre");
  for (var i = 0; i < preTags.length; i++) {
    var preTag = preTags[i];
    var firstChild = preTag.firstChild;
    if (firstChild && firstChild.tagName === "CODE") {
      var isRun = firstChild.classList.contains("language-motoko-run");
      if (isRun) {
        // Restore motoko-run back to motoko for highlight.js
        firstChild.classList.add("language-motoko");
        firstChild.setAttribute("data-lang", "motoko");
      }
      if (firstChild.classList.contains("language-motoko")) {
        firstChild.setAttribute("contenteditable", "true");
        preTag.classList.add("motoko");
        highlightCode(preTag);
        appendRun(preTag, isRun);
      }
    }
  }
}

function highlightCode(pre) {
  var code_text = pre.firstChild.innerText;
  pre.firstChild.innerHTML = code_text;
  window.hljs.highlightBlock(pre);
}

function appendRun(element, isRun) {
  var parent = element.parentNode;
  parent.style = "position:relative";
  var button = document.createElement("button");
  var output = document.createElement("div");
  output.classList = "listingblock";
  if (isRun) {
    output.innerHTML = "<pre>Loading...</pre>";
  }
  button.innerHTML = "▶ Run";
  button.classList = "run-button";
  parent.appendChild(button);
  parent.appendChild(output);
  button.addEventListener("click", function () {
    var code = element.firstChild;
    var file = "stdin";
    Motoko.saveFile(file, code.innerText);
    var out = Motoko.run(file);
    output.innerHTML = "";
    if (out.stderr) {
      var pre = document.createElement("pre");
      pre.style = "color:red";
      pre.innerText = out.stderr;
      output.appendChild(pre);
    }
    if (out.stdout) {
      var pre = document.createElement("pre");
      pre.style = "color:green";
      pre.innerText = out.stdout;
      output.appendChild(pre);
    }
    highlightCode(element);
  });
  if (isRun) {
    button.click();
  }
}
