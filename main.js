/* Mashrur Mahmood — portfolio. Small, dependency-free. */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- footer year --- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* --- hero entrance: stagger the .reveal elements once --- */
  var revealed = document.querySelectorAll(".hero .reveal");
  revealed.forEach(function (el, i) {
    if (reduced) { el.classList.add("in"); return; }
    setTimeout(function () { el.classList.add("in"); }, 80 * i);
  });

  /* --- rotating word in the tagline --- */
  var WORDS = ["robots", "autonomous systems", "AI tools", "things that sense and decide"];
  var rotator = document.getElementById("rotator");
  if (rotator && !reduced) {
    var i = 0;
    setInterval(function () {
      rotator.classList.add("out");
      setTimeout(function () {
        i = (i + 1) % WORDS.length;
        rotator.textContent = WORDS[i];
        rotator.classList.remove("out");
      }, 280);
    }, 2600);
  }

  /* --- nav: border on scroll --- */
  var nav = document.getElementById("nav");
  var onScroll = function () {
    nav.classList.toggle("scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* --- nav: mobile toggle --- */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  links.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  /* --- nav: highlight the section currently in view --- */
  var navLinks = Array.prototype.slice.call(links.querySelectorAll("a"));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { observer.observe(s); });
  }
})();
