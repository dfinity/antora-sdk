/* Copyright (c) 2018 OpenDevise Inc. and individual contributors.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
(function() {
  "use strict";

  // Grab the sidebar DOM element
  var sidebar = document.querySelector("aside.toc.sidebar");

  // Exit if sidebar does not exist
  if (!sidebar) return;

  // Scan the DOM for headings to pull into the in-page nav
  var doc = document.querySelector("article.doc");
  var headings = find("h1[id].sect0, .sect1 > h2[id]", doc);
  if (document.querySelector(".body.-toc") || headings.length === 0) {
    return;
  }

  var lastActiveFragment;
  var links = {};
  var menu;

  // Create an unordered list from the headings we found
  var list = headings.reduce(function(accum, heading) {
    var link = toArray(heading.childNodes).reduce(function(target, child) {
      if (child.nodeName !== "A") target.appendChild(child.cloneNode(true));
      return target;
    }, document.createElement("a"));
    links[(link.href = "#" + heading.id)] = link;
    link.addEventListener("click", handleClick);
    var listItem = document.createElement("li");
    listItem.appendChild(link);
    accum.appendChild(listItem);
    return accum;
  }, document.createElement("ul"));

  // If the sidebar exists, add a <div> to support the menu
  if (!(menu = sidebar && sidebar.querySelector(".toc-menu"))) {
    menu = document.createElement("div");
    menu.className = "toc-menu";
  }

  // Create the menu header
  var title = document.createElement("h3");
  title.textContent = "On this page";

  // Add our new title and list to the menu
  menu.appendChild(title);
  menu.appendChild(list);

  // If the sidebar exists, add a scroll listener after load
  if (sidebar) {
    window.addEventListener("load", function() {
      onScroll();
      window.addEventListener("scroll", onScroll);
    });
  }

  /**
   * Hijack the menu item link behavior to create a smooth scroll to
   * the selected heading without refreshing the page
   *
   * @param {obj} event The click event.
   */
  function handleClick(event) {
    event.preventDefault();

    var TOP_BAR_HEIGHT = 90;
    var href = event.target.hash;
    var id = href.slice(1, href.length);
    var element = document.getElementById(id);
    var top = element.getBoundingClientRect().top;

    if (typeof window !== "undefined") {
      window.scrollBy({
        top: top - TOP_BAR_HEIGHT,
        left: 0,
        behavior: "smooth",
      });
    }
  }

  /**
   * Scroll to the heading that matches the user-selected menu item
   */
  function onScroll() {
    // NOTE doc.parentNode.offsetTop ~= doc.parentNode.getBoundingClientRect().top + window.pageYOffset
    //var targetPosition = doc.parentNode.offsetTop
    // NOTE no need to compensate when using spacer above [id] elements

    // Calculate scroll offsets
    var targetPosition = 0;

    var activeFragment;
    headings.some(function(heading) {
      var actualPosition = targetPosition + window.scrollY;
      // heading.offsetHeight / 2 seems to deal with problems of inexact scrolling
      var headingPosition = heading.offsetTop - heading.offsetHeight / 2;
      if (headingPosition < actualPosition) {
        activeFragment = "#" + heading.id;
      } else {
        return true;
      }
    });

    // Add an active class on the menu so we can set styles on the
    // last heading to hit the top of the target position
    if (activeFragment) {
      if (activeFragment !== lastActiveFragment) {
        if (lastActiveFragment) {
          links[lastActiveFragment].classList.remove("is-active");
        }
        var activeLink = links[activeFragment];
        activeLink.classList.add("is-active");
        if (menu.scrollHeight > menu.offsetHeight) {
          menu.scrollTop = Math.max(
            0,
            activeLink.offsetTop + activeLink.offsetHeight - menu.offsetHeight
          );
        }
        lastActiveFragment = activeFragment;
      }
    } else if (lastActiveFragment) {
      // Remove previously set active classes from non-active elements
      links[lastActiveFragment].classList.remove("is-active");
      lastActiveFragment = undefined;
    }
  }

  /**
   * Find elements that match the selector within another selector
   * @param {string} selector The element we want to find
   * @param {string} from The DOM node to look within
   * @returns {array} Matching DOM nodes
   */
  function find(selector, from) {
    return toArray((from || document).querySelectorAll(selector));
  }

  /**
   * Convert a NodeList using the Array context
   *
   * @param {obj}
   * @return {array} The converted NodeList as an array.
   */
  function toArray(collection) {
    return [].slice.call(collection);
  }
})();
