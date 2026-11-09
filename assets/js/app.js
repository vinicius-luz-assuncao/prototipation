/* =========================================================================
   VEM — Roteador do protótipo
   Navegação entre as 20 telas, tabbar contextual, status bar escura e
   escala do device em telas de desktop.
   ========================================================================= */

(function () {
  "use strict";

  var NAV_SCREENS = ["10", "11", "12", "13", "14", "15"];
  /* Controle temporário de teste: visível apenas no onboarding (01–08). */
  var ONBOARDING_SCREENS = ["01", "02", "03", "04", "05", "06", "07", "08"];
  var screens = {};
  var current = null;

  var device = document.getElementById("device");
  var tabbar = document.getElementById("tabbar");
  var skipButton = document.getElementById("skip-onboarding");
  var railItems = Array.prototype.slice.call(document.querySelectorAll(".rail__item"));
  var tabs = tabbar ? Array.prototype.slice.call(tabbar.querySelectorAll(".tab")) : [];

  Array.prototype.forEach.call(document.querySelectorAll("[data-screen]"), function (screen) {
    screens[screen.getAttribute("data-screen")] = screen;
  });

  function syncUrl() {
    try {
      var url = new URL(window.location.href);
      url.searchParams.set("tela", current);
      window.history.replaceState(null, "", url.pathname + url.search);
    } catch (error) {
      /* file:// pode bloquear replaceState — a navegação continua funcionando */
    }
  }

  function go(id) {
    id = String(id);
    var next = screens[id];
    if (!next || current === id) return;

    if (current && screens[current]) {
      screens[current].classList.remove("is-active");
      screens[current].setAttribute("aria-hidden", "true");
    }

    next.classList.add("is-active");
    next.removeAttribute("aria-hidden");
    current = id;

    var scroller = next.querySelector(".screen__scroll");
    if (scroller) scroller.scrollTop = 0;

    var hasNav = NAV_SCREENS.indexOf(id) !== -1;
    var isOnboarding = ONBOARDING_SCREENS.indexOf(id) !== -1;

    if (skipButton) skipButton.hidden = !isOnboarding;

    if (device) {
      device.classList.toggle("is-dark-status", next.getAttribute("data-dark") === "true");
      device.classList.toggle("has-nav", hasNav);
    }

    if (tabbar) {
      tabbar.classList.toggle("is-hidden", !hasNav);
      tabbar.setAttribute("aria-hidden", hasNav ? "false" : "true");
    }

    tabs.forEach(function (tab) {
      if (tab.getAttribute("data-tab") === id) tab.setAttribute("aria-current", "page");
      else tab.removeAttribute("aria-current");
    });

    railItems.forEach(function (item) {
      var active = item.getAttribute("data-nav") === id;
      item.classList.toggle("is-active", active);
      if (active) item.setAttribute("aria-current", "page");
      else item.removeAttribute("aria-current");
    });

    document.title = "vem — " + (next.getAttribute("data-title") || "protótipo");
    syncUrl();
  }

  /* -----------------------------------------------------------------------
     Navegação delegada
     ----------------------------------------------------------------------- */

  document.addEventListener("click", function (event) {
    var nav = event.target.closest("[data-nav]");
    if (nav) {
      if (nav.disabled || nav.getAttribute("aria-disabled") === "true") return;
      event.preventDefault();
      go(nav.getAttribute("data-nav"));
      return;
    }

    var back = event.target.closest("[data-back]");
    if (back) {
      event.preventDefault();
      go(back.getAttribute("data-back"));
      return;
    }

    var tab = event.target.closest("[data-tab]");
    if (tab) {
      event.preventDefault();
      go(tab.getAttribute("data-tab"));
    }
  });

  /* -----------------------------------------------------------------------
     Escala do device no desktop
     ----------------------------------------------------------------------- */

  var fitFrame = null;

  function fitDevice() {
    fitFrame = null;
    var root = document.documentElement;

    if (window.innerWidth <= 560) {
      root.style.removeProperty("--device-scale");
      return;
    }

    var railVisible = window.innerWidth > 1180;
    var availableHeight = window.innerHeight - 96;
    var availableWidth = window.innerWidth - 96 - (railVisible ? 280 + 64 : 0);
    var scale = Math.min(1, availableHeight / 844, availableWidth / 390);
    scale = Math.max(0.45, Math.round(scale * 1000) / 1000);

    root.style.setProperty("--device-scale", String(scale));
  }

  function requestFit() {
    if (fitFrame) return;
    fitFrame = window.requestAnimationFrame(fitDevice);
  }

  window.addEventListener("resize", requestFit);
  window.addEventListener("orientationchange", requestFit);

  /* -----------------------------------------------------------------------
     Inicialização
     ----------------------------------------------------------------------- */

  function start() {
    var params = new URLSearchParams(window.location.search);
    var wanted = params.get("tela");
    var active = document.querySelector(".screen.is-active");
    var startId = wanted && screens[wanted]
      ? wanted
      : active
        ? active.getAttribute("data-screen")
        : "01";

    Array.prototype.forEach.call(document.querySelectorAll(".screen"), function (screen) {
      var isStart = screen.getAttribute("data-screen") === startId;
      screen.classList.toggle("is-active", isStart);
      screen.setAttribute("aria-hidden", isStart ? "false" : "true");
    });

    current = null;
    go(startId);
    fitDevice();
  }

  window.VemApp = {
    go: go,
    current: function () {
      return current;
    },
    screens: Object.keys(screens)
  };

  start();
})();
