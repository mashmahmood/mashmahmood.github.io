/* Mashrur Mahmood, portfolio. Dependency free, ~4 KB. */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ------------------------------ footer year ---------------------------- */
  var year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  /* --------------------------- nav: scrolled state ----------------------- */
  var nav = $("#nav");
  var progress = $("#progress");
  var ticking = false;

  function onFrame() {
    ticking = false;
    var y = window.scrollY || document.documentElement.scrollTop;
    if (nav) nav.classList.toggle("is-scrolled", y > 8);

    if (progress) {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      progress.style.transform = "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0) + ")";
    }
  }
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(onFrame);
  }
  onFrame();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  /* ----------------------------- nav: mobile ----------------------------- */
  var toggle = $("#navToggle");
  var links  = $("#navLinks");

  function closeNav() {
    if (!links) return;
    links.classList.remove("is-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
    document.addEventListener("click", function (e) {
      if (!links.classList.contains("is-open")) return;
      if (e.target.closest("#navLinks") || e.target.closest("#navToggle")) return;
      closeNav();
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 820) closeNav();
    }, { passive: true });
  }

  /* ---------------------- reveal elements as they enter ------------------ */
  var revealables = $$(".reveal");

  if (reduced || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var revealIO = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var siblings = el.parentElement ? $$(".reveal", el.parentElement) : [];
        var i = Math.min(siblings.indexOf(el), 6);
        setTimeout(function () { el.classList.add("is-in"); }, i > 0 ? i * 70 : 0);
        obs.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    revealables.forEach(function (el) { revealIO.observe(el); });
  }

  /* ----------------------- nav: highlight active section ----------------- */
  var navAnchors = links ? $$("a[href^='#']", links) : [];
  var sections = navAnchors
    .map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); })
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navAnchors.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------------------------- project filters -------------------------- */
  var filterButtons = $$(".filter");
  var projectItems  = $$("#projectList .tl-item");
  var status        = $("#filterStatus");

  function applyFilter(key) {
    var visible = [];
    projectItems.forEach(function (item) {
      var tags = (item.getAttribute("data-tags") || "").split(/\s+/);
      var match = key === "all" || tags.indexOf(key) !== -1;
      item.classList.toggle("is-hidden", !match);
      item.classList.remove("is-last");
      if (match) visible.push(item);
    });
    // the dashed spine should stop at the last item still on screen
    if (visible.length) visible[visible.length - 1].classList.add("is-last");
    var shown = visible.length;

    if (status) {
      var label = key === "all" ? "all areas" : key;
      status.textContent = shown + (shown === 1 ? " project" : " projects") + " shown in " + label + ".";
    }
  }

  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterButtons.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle("is-on", on);
        b.setAttribute("aria-pressed", String(on));
      });
      applyFilter(btn.getAttribute("data-filter"));
    });
  });

  if (status && projectItems.length) {
    status.textContent = projectItems.length + " projects shown in all areas.";
  }

  /* ------------------------- count up the CP numbers --------------------- */
  var counters = $$("[data-count]");

  function countUp(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (isNaN(target)) return;
    if (reduced) { el.textContent = String(target); return; }

    var start = null;
    var span = 900;
    function step(now) {
      if (start === null) start = now;
      var t = Math.min((now - start) / span, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(target * eased));
      if (t < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  if (counters.length) {
    if (!("IntersectionObserver" in window)) {
      counters.forEach(countUp);
    } else {
      var countIO = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          countUp(entry.target);
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { countIO.observe(el); });
    }
  }
})();
