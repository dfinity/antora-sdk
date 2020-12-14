
function changeCodeBlock() {
  // Find all <pre> tags, check if they have a code tag as a direct child.
  // If so, and the code class is Motoko, add run button, and make code editable.
  // Checking first for pre tag
  // ensures we don't add button to code blocks within paragraphs.
  var preTags = document.getElementsByTagName("pre");
  for (var i = 0; i < preTags.length; i++) {
    var preTag = preTags[i];
    var firstChild = preTag.firstChild;
    if (firstChild && firstChild.tagName === "CODE") {
      if (firstChild.classList.contains("language-motoko")) {
        preTag.classList.add("motoko");
        var config = extractConfig(preTag);
        appendRun(preTag, config);
      }
    }
  }
}

function extractConfig(pre) {
  // Valid code block has <div class="listingblock"> as parent of parent,
  // and we store the config info in the id and class attributes.
  var div = pre.parentNode.parentNode;
  var name = div.getAttribute("id");
  if (name) {
    name += ".mo";
  }
  var include = [];
  var hook = null;
  for (var i = 0; i < div.classList.length; i++) {
    var config = div.classList[i];
    if (config.startsWith("include")) {
      var split = config.split("_");
      for (var j = 1; j < split.length; j++) {
        include.push(split[j]);
      }
    } else if (config.startsWith("hook")) {
      var split = config.split("_");
      hook = split[1];
    }
  }
  return {
    name: name,
    include: include,
    hook: hook,
    isRun: div.classList.contains("run"),
    noRepl: div.classList.contains("no-repl"),
  };
}

function highlightCode(pre) {
  var code_text = pre.firstChild.innerText;
  // highlight.js is not very good at incremental changes. We need to reset the previous tags.
  pre.firstChild.innerHTML = "";
  pre.firstChild.textContent = code_text;
  window.hljs.highlightBlock(pre);
}

function saveIncluded(include) {
  var codes = {};
  for (var i = 0; i < include.length; i++) {
    var node = document.getElementById(include[i]);
    var codeTag = node.querySelector("div.content").querySelector("pre").querySelector("code");
    var code = codeTag.innerText;
    var name = include[i] + ".mo";
    Motoko.saveFile(name, code);
    codes[name] = code;
  }
  return codes;
}

function appendRun(element, config) {
  if (config.name) {
    Motoko.saveFile(config.name, element.firstChild.innerText);
  }
  if (config.noRepl) {
    return;
  }
  var jar = window.CodeJar(element, window.hljs.highlightBlock);
  element.style = "";
  
  var parent = element.parentNode;
  parent.style = "position:relative";
  var button = document.createElement("button");
  var output = document.createElement("div");
  output.classList = "listingblock";
  if (config.isRun) {
    output.innerHTML = "<pre>Loading...</pre>";
  }
  button.innerHTML = '<span class="run-label">Run</span><svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" style="width: 35px; height: 35px;"><g><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"></path></g></svg>';
  button.classList = "run-button";
  parent.appendChild(button);
  parent.appendChild(output);
  button.addEventListener("click", function () {
    var codes = saveIncluded(config.include);
    var code = element.firstChild.innerText;
    var file = config.name || "stdin";
    Motoko.saveFile(file, code);
    var out;
    if (config.hook) {
      var fn = window[config.hook];
      if (typeof fn !== "function") {
        throw new Error(config.hook + " is not a function");
      }
      out = fn.apply(null, [codes, code]);
    } else {
      var list = config.include.map(function (s) { return s+".mo"});      
      out = Motoko.run(list, file);
    }
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
      //window.hljs.highlightBlock(pre);
    }
    highlightCode(element);
  });
  if (config.isRun) {
    button.click();
  }
}
