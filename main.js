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
  var projectItems  = $$("#projectList .proj");
  var status        = $("#filterStatus");

  function applyFilter(key) {
    var shown = 0;
    projectItems.forEach(function (item) {
      var tags = (item.getAttribute("data-tags") || "").split(/\s+/);
      var match = key === "all" || tags.indexOf(key) !== -1;
      item.classList.toggle("is-hidden", !match);
      if (match) shown++;
    });

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

  /* ----------------------- inline demo clips, politely ------------------- */
  /* Muted autoplay loops, but only when the reader has not asked for less
     motion and only while the clip is actually on screen. */
  var clips = $$("video.proj-video");

  clips.forEach(function (v) {
    if (reduced) {
      v.autoplay = false;
      v.loop = false;
      v.controls = true;
      try { v.pause(); } catch (e) { /* nothing playing yet */ }
      return;
    }
    var play = function () { var r = v.play(); if (r && r.catch) r.catch(function () {}); };
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) play(); else v.pause();
        });
      }, { threshold: 0.2 }).observe(v);
    } else {
      play();
    }
  });

  /* --------------------- highlights: horizontal gallery ------------------ */
  /* Native scrolling does the scrolling. This only adds the arrows, the edge
     fades, pointer dragging on desktop, and a small lightbox. */

  var gal      = $("#gal");
  var galTrack = $("#galTrack");
  var galBtns  = $$("[data-gal-dir]");
  var shots    = $$(".gal-shot", galTrack || document);
  var dragMoved = 0;   /* shared so a drag does not also open the lightbox */

  if (gal && galTrack) {
    var step = function () {
      var first = galTrack.querySelector("li");
      var w = first ? first.getBoundingClientRect().width : 260;
      return Math.max(w + 16, galTrack.clientWidth * 0.8);
    };

    var syncEdges = function () {
      var max = galTrack.scrollWidth - galTrack.clientWidth;
      var x = galTrack.scrollLeft;
      gal.classList.toggle("is-at-start", x <= 2);
      gal.classList.toggle("is-at-end", x >= max - 2);
      galBtns.forEach(function (b) {
        var dir = Number(b.getAttribute("data-gal-dir"));
        b.disabled = max <= 2 || (dir < 0 ? x <= 2 : x >= max - 2);
      });
    };

    galBtns.forEach(function (b) {
      b.addEventListener("click", function () {
        galTrack.scrollBy({
          left: Number(b.getAttribute("data-gal-dir")) * step(),
          behavior: reduced ? "auto" : "smooth"
        });
      });
    });

    galTrack.addEventListener("scroll", syncEdges, { passive: true });
    window.addEventListener("resize", syncEdges, { passive: true });
    syncEdges();

    /* click and drag, for people on a mouse with no horizontal wheel */
    var dragging = false, startX = 0, startLeft = 0;

    galTrack.addEventListener("pointerdown", function (e) {
      dragMoved = 0;
      if (e.pointerType === "touch" || e.button !== 0) return;
      dragging = true;
      startX = e.clientX;
      startLeft = galTrack.scrollLeft;
    });
    galTrack.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      dragMoved = Math.max(dragMoved, Math.abs(dx));
      if (dragMoved > 4) galTrack.classList.add("is-dragging");
      galTrack.scrollLeft = startLeft - dx;
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (evt) {
      galTrack.addEventListener(evt, function () {
        dragging = false;
        galTrack.classList.remove("is-dragging");
      });
    });
  }

  /* ------------------------- lightbox for the gallery -------------------- */

  var lb      = $("#lightbox");
  var lbImg   = $("#lbImg");
  var lbCap   = $("#lbCap");
  var lbClose = $("#lbClose");
  var lbIndex = 0;
  var lastFocus = null;

  function lbShow(i) {
    if (!shots.length) return;
    lbIndex = (i + shots.length) % shots.length;
    var shot = shots[lbIndex];
    var img = shot.querySelector("img");
    lbImg.src = shot.getAttribute("data-full") || (img && img.src) || "";
    lbImg.alt = (img && img.alt) || "";
    lbCap.textContent = shot.getAttribute("data-caption") || "";
  }

  function lbOpen(i) {
    if (!lb) return;
    lastFocus = document.activeElement;
    lbShow(i);
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    if (lbClose) lbClose.focus();
  }

  function lbHide() {
    if (!lb || lb.hidden) return;
    lb.hidden = true;
    lbImg.removeAttribute("src");
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  if (lb && shots.length) {
    shots.forEach(function (shot, i) {
      shot.addEventListener("click", function () {
        if (dragMoved > 4) return;   /* that was a drag, not a tap */
        lbOpen(i);
      });
    });

    $$("[data-lb-dir]", lb).forEach(function (b) {
      b.addEventListener("click", function () {
        lbShow(lbIndex + Number(b.getAttribute("data-lb-dir")));
      });
    });

    if (lbClose) lbClose.addEventListener("click", lbHide);
    lb.addEventListener("click", function (e) {
      if (e.target === lb) lbHide();
    });

    document.addEventListener("keydown", function (e) {
      if (lb.hidden) return;
      if (e.key === "Escape") { lbHide(); return; }
      if (e.key === "ArrowRight") { lbShow(lbIndex + 1); e.preventDefault(); }
      if (e.key === "ArrowLeft")  { lbShow(lbIndex - 1); e.preventDefault(); }
      if (e.key === "Tab") {
        /* keep focus inside the dialog while it is open */
        var f = $$("button", lb);
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
        else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
      }
    });
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
