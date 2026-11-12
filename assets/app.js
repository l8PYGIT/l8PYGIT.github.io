/* ==========================================================================
   l8PYGIT — portfolio + donate
   Bilingual FA/EN switch · copy-to-clipboard + toast · reveal · status typing
   No dependencies, no network requests. Respects prefers-reduced-motion.
   ========================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Reveal animations are opt-in: if this script never runs, content stays
     visible instead of being stuck behind the `.js` opacity rule. */
  root.classList.add("js");

  /* ------------------------------ i18n ----------------------------------- */
  var LANG_KEY = "l8-lang";
  var TITLES = {
    fa: "l8PYGIT — زیرساخت تونل‌های مقاوم به سانسور",
    en: "l8PYGIT — Infrastructure for censorship-resistant tunnels"
  };
  var DESCRIPTIONS = {
    fa: "l8PYGIT — سازندهٔ زیرساخت تونل‌های معکوس و مقاوم به سانسور: rathole، Backhaul، FRP، GRE، پنل مدیریت کاربر و اتوماسیون تلگرام. پروژه‌های اوپن‌سورس و راه‌های حمایت.",
    en: "l8PYGIT — building multi-location reverse tunnels, multi-carrier transports, user-management panels and Telegram automation. Open-source projects and ways to support the work."
  };
  var TOAST = {
    fa: function (network) { return "آدرس " + network + " کپی شد"; },
    en: function (network) { return network + " address copied"; }
  };

  var lang = root.getAttribute("data-lang") === "en" ? "en" : "fa";

  function snapshotTranslations() {
    document.querySelectorAll("[data-en]").forEach(function (el) {
      if (!el.hasAttribute("data-fa")) {
        el.setAttribute("data-fa", el.textContent);
      }
    });
    document.querySelectorAll("[data-en-alt]").forEach(function (el) {
      if (!el.hasAttribute("data-fa-alt")) {
        el.setAttribute("data-fa-alt", el.getAttribute("alt") || "");
      }
    });
    document.querySelectorAll("[data-en-aria]").forEach(function (el) {
      if (!el.hasAttribute("data-fa-aria")) {
        el.setAttribute("data-fa-aria", el.getAttribute("aria-label") || "");
      }
    });
  }

  function applyLanguage(next, persist) {
    lang = next;
    var isEn = next === "en";
    root.lang = isEn ? "en" : "fa";
    root.dir = isEn ? "ltr" : "rtl";
    root.setAttribute("data-lang", next);

    document.querySelectorAll("[data-en]").forEach(function (el) {
      var value = isEn ? el.getAttribute("data-en") : el.getAttribute("data-fa");
      if (value !== null) el.textContent = value;
    });
    document.querySelectorAll("[data-en-alt]").forEach(function (el) {
      el.setAttribute("alt", isEn ? el.getAttribute("data-en-alt") : el.getAttribute("data-fa-alt"));
    });
    document.querySelectorAll("[data-en-aria]").forEach(function (el) {
      el.setAttribute("aria-label", isEn ? el.getAttribute("data-en-aria") : el.getAttribute("data-fa-aria"));
    });

    document.title = TITLES[next];
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", DESCRIPTIONS[next]);

    var code = document.getElementById("lang-code");
    var toggle = document.getElementById("lang-toggle");
    if (code) code.textContent = isEn ? "FA" : "EN";
    if (toggle) {
      toggle.setAttribute("aria-label",
        isEn ? "تغییر زبان به فارسی" : "Switch language to English");
    }

    resetCopyButtons();

    if (persist) {
      try { localStorage.setItem(LANG_KEY, next); } catch (e) { /* ignore */ }
    }

    root.dispatchEvent(new CustomEvent("l8:lang", { detail: next }));
  }

  /* ------------------------- copy to clipboard ---------------------------- */
  var toast = document.getElementById("toast");
  var toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("show");
    }, 2400);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy") ? resolve() : reject(new Error("execCommand failed"));
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(ta);
      }
    });
  }

  function resetCopyButtons() {
    document.querySelectorAll(".copy-btn").forEach(function (btn) {
      btn.classList.remove("is-copied");
      var label = btn.querySelector(".copy-label");
      if (label) {
        label.textContent = lang === "en" ? label.getAttribute("data-en") : label.getAttribute("data-fa");
      }
      var network = btn.getAttribute("data-network") || "";
      btn.setAttribute("aria-label",
        lang === "en" ? "Copy " + network + " address" : "کپی آدرس " + network);
    });
  }

  function initCopyButtons() {
    document.querySelectorAll(".copy-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var text = btn.getAttribute("data-copy");
        var network = btn.getAttribute("data-network") || "";
        if (!text) return;
        copyText(text).then(function () {
          btn.classList.add("is-copied");
          var label = btn.querySelector(".copy-label");
          if (label) label.textContent = lang === "en" ? "Copied" : "کپی شد";
          btn.setAttribute("aria-label",
            lang === "en" ? network + " address copied" : "آدرس " + network + " کپی شد");
          showToast(TOAST[lang](network));
          window.setTimeout(function () {
            btn.classList.remove("is-copied");
            resetCopyButtons();
          }, 2200);
        }).catch(function () {
          showToast(lang === "en" ? "Copy failed — select the address manually" : "کپی نشد؛ آدرس را دستی انتخاب کن");
        });
      });
    });
  }

  /* --------------------------- status typing ------------------------------ */
  var STATUS = [
    "tunnel up · carrier FRP/QUIC · rtt 38ms",
    "handshake ok · tls 1.3 · 443/tcp",
    "node trk01 · sync 4/4 online",
    "route /trk01 → 127.0.0.1:1001 · ok"
  ];

  function initStatus() {
    var el = document.getElementById("status-text");
    if (!el) return;
    if (reduceMotion) {
      el.textContent = STATUS[0];
      return;
    }
    var index = 0;
    var pos = STATUS[0].length;
    var deleting = false;

    function tick() {
      var target = STATUS[index];
      if (deleting) {
        pos -= 2;
        if (pos <= 0) {
          pos = 0;
          deleting = false;
          index = (index + 1) % STATUS.length;
          el.textContent = "";
          window.setTimeout(tick, 380);
          return;
        }
      } else {
        pos += 1;
        if (pos >= target.length) {
          pos = target.length;
          deleting = true;
          el.textContent = target.slice(0, pos);
          window.setTimeout(tick, 2300);
          return;
        }
      }
      el.textContent = target.slice(0, Math.max(0, pos));
      window.setTimeout(tick, deleting ? 20 : 42);
    }
    el.textContent = STATUS[0];
    window.setTimeout(tick, 2400);
  }

  /* ---------------------------- scroll reveal ----------------------------- */
  function initReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------- nav ------------------------------------ */
  function initNav() {
    var header = document.getElementById("site-header");
    var menuBtn = document.getElementById("menu-btn");
    var nav = menuBtn ? menuBtn.closest("nav") : null;

    function closeMenu() {
      if (!nav) return;
      nav.classList.remove("nav-open");
      if (menuBtn) {
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.setAttribute("aria-label",
          lang === "en" ? "Open menu" : "باز کردن منو");
      }
    }

    if (menuBtn && nav) {
      menuBtn.addEventListener("click", function () {
        var open = nav.classList.toggle("nav-open");
        menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
        menuBtn.setAttribute("aria-label",
          open ? (lang === "en" ? "Close menu" : "بستن منو") : (lang === "en" ? "Open menu" : "باز کردن منو"));
      });
      document.addEventListener("click", function (event) {
        if (nav.classList.contains("nav-open") && !nav.contains(event.target)) closeMenu();
      });
      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") closeMenu();
      });
      nav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", closeMenu);
      });
    }

    /* header shadow once scrolled */
    if (header) {
      var onScroll = function () {
        header.classList.toggle("is-scrolled", window.scrollY > 6);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    /* scroll spy */
    var links = Array.prototype.slice.call(document.querySelectorAll(".nav-list a[href^='#']"));
    var sections = links
      .map(function (link) { return document.querySelector(link.getAttribute("href")); })
      .filter(Boolean);
    if (!sections.length || !("IntersectionObserver" in window)) return;

    var byId = {};
    links.forEach(function (link) { byId[link.getAttribute("href").slice(1)] = link; });

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) {
          link.classList.remove("is-active");
          link.removeAttribute("aria-current");
        });
        var active = byId[entry.target.id];
        if (active) {
          active.classList.add("is-active");
          active.setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-42% 0px -52% 0px", threshold: 0 });

    sections.forEach(function (section) { spy.observe(section); });
  }

  /* ------------------------------- boot ----------------------------------- */
  function boot() {
    snapshotTranslations();
    applyLanguage(lang, false);

    var toggle = document.getElementById("lang-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        applyLanguage(lang === "fa" ? "en" : "fa", true);
      });
    }

    initCopyButtons();
    resetCopyButtons();
    initStatus();
    initReveal();
    initNav();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
