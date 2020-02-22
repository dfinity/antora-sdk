/* Copyright (c) 2018 OpenDevise Inc. and individual contributors.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
(function() {
  "use strict";

  var sidebar = document.querySelector("aside.toc.sidebar");
  if (!sidebar) return;
  var doc = document.querySelector("article.doc");
  var headings = find("h1[id].sect0, .sect1 > h2[id]", doc);
  if (document.querySelector(".body.-toc") || headings.length === 0) {
    return;
  }
  var lastActiveFragment;
  var links = {};
  var menu;

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

  if (!(menu = sidebar && sidebar.querySelector(".toc-menu"))) {
    menu = document.createElement("div");
    menu.className = "toc-menu";
  }

  var title = document.createElement("h3");
  title.textContent = "On this page";
  menu.appendChild(title);
  menu.appendChild(list);

  if (sidebar) {
    window.addEventListener("load", function() {
      onScroll();
      window.addEventListener("scroll", onScroll);
    });
  }

  function handleClick(event) {
    event.preventDefault();

    var TOP_BAR_HEIGHT = 145;
    var href = event.target.hash;
    var id = href.slice(1, href.length);
    var element = document.getElementById(id);
    var top = element.getBoundingClientRect().top;

    if (typeof window !== "undefined") {
      window.scrollBy({
        top: top - TOP_BAR_HEIGHT,
        left: 0,
        behavior: "smooth"
      });
    }
  }

  function onScroll() {
    // NOTE doc.parentNode.offsetTop ~= doc.parentNode.getBoundingClientRect().top + window.pageYOffset
    //var targetPosition = doc.parentNode.offsetTop
    // NOTE no need to compensate when using spacer above [id] elements
    var targetPosition = 0;
    var toolbar = document.querySelector(".toolbar");
    var activeFragment;
    headings.some(function(heading) {
      var actualPosition =
        targetPosition + toolbar.offsetTop + toolbar.offsetHeight;
      // heading.offsetHeight / 2 seems to deal with problems of inexact scrolling
      var headingPosition = heading.offsetTop - heading.offsetHeight / 2;
      if (headingPosition < actualPosition) {
        activeFragment = "#" + heading.id;
      } else {
        return true;
      }
    });
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
      links[lastActiveFragment].classList.remove("is-active");
      lastActiveFragment = undefined;
    }
  }

  function find(selector, from) {
    return toArray((from || document).querySelectorAll(selector));
  }

  function toArray(collection) {
    return [].slice.call(collection);
  }
})();
