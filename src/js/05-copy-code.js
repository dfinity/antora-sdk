(function() {
  "use strict";

  // Find all <code> tags and add click handler to them
  var codeTags = document.getElementsByTagName("code");
  for (var i = 0; i < codeTags.length; i++) {
    var codeTag = codeTags[i];
    appendButton(codeTag);
  }

  // Find all <pre> tags that don't have <code> tags as a direct child
  // and add click handlers to them
  var preTags = document.getElementsByTagName("pre");
  for (var i = 0; i < preTags.length; i++) {
    var preTag = preTags[i];
    var firstChild = preTag.firstChild;
    if (firstChild && firstChild.tagName !== "CODE") {
      appendButton(preTag);
    }
  }

  // create a button and append it to HTMLelement
  function appendButton(element) {
    var button = document.createElement("button");
    button.innerHTML =
      '<span class="copy-label">copy</span><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.0909 14.5457H16.3636V4.54559C16.3636 4.04376 15.9564 3.63649 15.4545 3.63649H5.45447V0.909196C5.45447 0.407375 5.86174 9.91821e-05 6.36356 9.91821e-05H19.0909C19.5927 9.91821e-05 20 0.407375 20 0.909196V13.6366C20 14.1384 19.5927 14.5457 19.0909 14.5457Z" fill="#333333"/><path d="M13.6365 5.45444H0.909097C0.406366 5.45444 0 5.86081 0 6.36354V19.0909C0 19.5927 0.406366 20 0.909097 20H13.6365C14.1392 20 14.5456 19.5927 14.5456 19.0909V6.36354C14.5456 5.86081 14.1392 5.45444 13.6365 5.45444Z" fill="#333333"/></svg>';
    button.classList = "copy-button";
    element.appendChild(button);
    element.addEventListener("click", handleClick);
  }

  // When the buttons within the code or pre tags are clicked,
  // get the content out of the tag and copy it to the users clicboard
  function handleClick(event) {
    var button = event && event.target;
    var parent = button.parentNode;
    var text = parent.innerText; // get text from element
    var copyLabel = button.querySelector(".copy-label");

    var el = document.createElement("textarea"); // Create a <textarea> element
    el.value = text; // Set its value to the string that you want copied
    el.setAttribute("readonly", ""); // Make it readonly to be tamper-proof
    el.style.position = "absolute";
    el.style.left = "-9999px"; // Move outside the screen to make it invisible
    document.body.appendChild(el); // Append the <textarea> element to the HTML document
    var selected =
      document.getSelection().rangeCount > 0 // Check if there is any content selected previously
        ? document.getSelection().getRangeAt(0) // Store selection if found
        : false; // Mark as false to know no selection existed before
    el.select(); // Select the <textarea> content
    document.execCommand("copy"); // Copy - only works as a result of a user action (e.g. click events)
    document.body.removeChild(el); // Remove the <textarea> element
    if (selected) {
      // If a selection existed before copying
      document.getSelection().removeAllRanges(); // Unselect everything on the HTML document
      document.getSelection().addRange(selected); // Restore the original selection
    }

    copyLabel.innerHTML = "copied";
    setTimeout(function() {
      copyLabel.innerHTML = "copy";
    }, 3000);
  }
})();
