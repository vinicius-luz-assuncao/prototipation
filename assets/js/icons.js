/* =========================================================================
   VEM — Ícones (sprite SVG injetado)
   Traço 1.75 · 24px · pontas arredondadas
   ========================================================================= */

(function () {
  "use strict";

  var PATHS = {
    home: '<path d="M3.5 10.8 12 3.6l8.5 7.2"/><path d="M5.5 9.6V20h13V9.6"/><path d="M9.5 20v-5.6h5V20"/>',
    heart:
      '<path d="M12 20.2S4.4 15.6 4.4 10.6A4.4 4.4 0 0 1 12 7.2a4.4 4.4 0 0 1 7.6 3.4c0 5-7.6 9.6-7.6 9.6Z"/>',
    users:
      '<circle cx="9" cy="8.4" r="3.2"/><path d="M2.9 20a6.2 6.2 0 0 1 12.2 0"/><path d="M15.9 5.6a3.2 3.2 0 0 1 0 5.9"/><path d="M17.4 14.4A5.6 5.6 0 0 1 21.1 20"/>',
    grid:
      '<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>',
    user:
      '<circle cx="12" cy="8" r="3.4"/><path d="M4.9 20a7.3 7.3 0 0 1 14.2 0"/>',
    bell:
      '<path d="M18 9.2a6 6 0 0 0-12 0c0 4.8-2 6.3-2 6.3h16s-2-1.5-2-6.3Z"/><path d="M10 19a2.2 2.2 0 0 0 4 0"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.2"/><path d="m15.4 15.4 4.4 4.4"/>',
    sparkle:
      '<path d="M11.5 3.5 13 8.4l4.9 1.5-4.9 1.5-1.5 4.9-1.5-4.9L5.1 9.9 10 8.4l1.5-4.9Z"/><path d="M18 15.4l.7 2.2 2.2.7-2.2.7-.7 2.2-.7-2.2-2.2-.7 2.2-.7.7-2.2Z"/>',
    mic:
      '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.6 11.2a6.4 6.4 0 0 0 12.8 0"/><path d="M12 17.6V21"/>',
    "chevron-right": '<path d="m9.5 5.5 6.5 6.5-6.5 6.5"/>',
    "chevron-left": '<path d="M14.5 5.5 8 12l6.5 6.5"/>',
    "chevron-down": '<path d="m5.5 9.5 6.5 6.5 6.5-6.5"/>',
    "arrow-right": '<path d="M3.5 12h16"/><path d="m13.5 6 6 6-6 6"/>',
    "arrow-left": '<path d="M20.5 12h-16"/><path d="m10.5 6-6 6 6 6"/>',
    check: '<path d="m4.8 12.6 4.7 4.7L19.4 6.8"/>',
    "check-circle":
      '<circle cx="12" cy="12" r="8.8"/><path d="m8.2 12.2 2.6 2.6 5-5.4"/>',
    x: '<path d="M6.2 6.2 17.8 17.8M17.8 6.2 6.2 17.8"/>',
    plus: '<path d="M12 4.5v15M4.5 12h15"/>',
    lock:
      '<rect x="4.5" y="10.2" width="15" height="9.8" rx="3"/><path d="M8 10.2V7.6a4 4 0 0 1 8 0v2.6"/>',
    shield: '<path d="M12 3.5 19 6.1v5.5c0 4.4-3 7.5-7 9-4-1.5-7-4.6-7-9V6.1l7-2.6Z"/>',
    "shield-check":
      '<path d="M12 3.5 19 6.1v5.5c0 4.4-3 7.5-7 9-4-1.5-7-4.6-7-9V6.1l7-2.6Z"/><path d="m8.6 11.9 2.4 2.4 4.4-4.7"/>',
    mail:
      '<rect x="3.2" y="5.2" width="17.6" height="13.6" rx="3"/><path d="m4.6 7.6 7.4 5.2 7.4-5.2"/>',
    calendar:
      '<rect x="3.5" y="5.2" width="17" height="15.3" rx="3"/><path d="M8.2 3v4.2M15.8 3v4.2M3.5 10.2h17"/>',
    camera:
      '<path d="M4.6 8h2.8l1.4-2h6.4l1.4 2h2.8a1.6 1.6 0 0 1 1.6 1.6v7.8a1.6 1.6 0 0 1-1.6 1.6H4.6A1.6 1.6 0 0 1 3 17.4v-7.8A1.6 1.6 0 0 1 4.6 8Z"/><circle cx="12" cy="13.2" r="3.2"/>',
    scan:
      '<path d="M3.8 8.2V5.6A1.8 1.8 0 0 1 5.6 3.8h2.6M15.8 3.8h2.6a1.8 1.8 0 0 1 1.8 1.8v2.6M20.2 15.8v2.6a1.8 1.8 0 0 1-1.8 1.8h-2.6M8.2 20.2H5.6a1.8 1.8 0 0 1-1.8-1.8v-2.6"/><path d="M8 10.4h8M8 13.6h5.4"/>',
    eye:
      '<path d="M2.6 12S6.2 5.8 12 5.8 21.4 12 21.4 12 17.8 18.2 12 18.2 2.6 12 2.6 12Z"/><circle cx="12" cy="12" r="3"/>',
    "eye-off":
      '<path d="M4.2 4.2 19.8 19.8"/><path d="M9.9 6.2A9.9 9.9 0 0 1 12 5.8c5.8 0 9.4 6.2 9.4 6.2a16 16 0 0 1-3.2 3.9M14.2 17.8A9.6 9.6 0 0 1 12 18.2C6.2 18.2 2.6 12 2.6 12a16.3 16.3 0 0 1 4-4.5"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
    star:
      '<path d="m12 3.6 2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8L12 3.6Z"/>',
    "star-fill":
      '<path d="m12 3.6 2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8L12 3.6Z"/>',
    message:
      '<path d="M20.4 11.6a7.9 7.9 0 0 1-11.7 7L4 20l1.4-4.6a7.9 7.9 0 1 1 15-3.8Z"/>',
    send: '<path d="M21 3 10.2 13.8"/><path d="m21 3-7 18-3.8-7.2L3 10l18-7Z"/>',
    share:
      '<circle cx="6" cy="12" r="2.4"/><circle cx="18" cy="6" r="2.4"/><circle cx="18" cy="18" r="2.4"/><path d="m8.2 10.9 7.6-3.7M8.2 13.1l7.6 3.7"/>',
    bookmark:
      '<path d="M6.6 4.2h10.8a1 1 0 0 1 1 1V21l-6.4-4.4L5.6 21V5.2a1 1 0 0 1 1-1Z"/>',
    flame:
      '<path d="M12 20.6c3.7 0 6.2-2.4 6.2-5.8 0-4.4-4.4-6.3-3.9-11.1-2.9 1-4.9 3.9-4.9 6.3 0 1.5.5 2.4.5 2.4S8.1 11 7.1 9.5c-1 2.4-1.5 3.9-1.5 5.3 0 3.4 2.5 5.8 6.4 5.8Z"/>',
    crown:
      '<path d="M3.6 8.4 7 11.8l5-5.9 5 5.9 3.4-3.4-1.9 9.8H5.5L3.6 8.4Z"/><path d="M6.2 20.4h11.6"/>',
    trophy:
      '<path d="M8.2 4h7.6v4.6a3.8 3.8 0 0 1-7.6 0V4Z"/><path d="M8.2 5.8H5.6a2.4 2.4 0 0 0 2.4 4.8M15.8 5.8h2.6a2.4 2.4 0 0 1-2.4 4.8"/><path d="M12 12.4v4.2M8.4 20.6h7.2M9.8 20.6v-2.4h4.4v2.4"/>',
    clock: '<circle cx="12" cy="12" r="8.8"/><path d="M12 7.4V12l3.2 2"/>',
    pin:
      '<path d="M12 21s6.8-5.9 6.8-10.8a6.8 6.8 0 1 0-13.6 0C5.2 15.1 12 21 12 21Z"/><circle cx="12" cy="10.1" r="2.4"/>',
    settings:
      '<path d="M4 7h9M18.5 7H20M4 17h1.5M11 17h9"/><circle cx="15.5" cy="7" r="2.4"/><circle cx="8" cy="17" r="2.4"/>',
    globe:
      '<circle cx="12" cy="12" r="8.8"/><path d="M3.4 12h17.2M12 3.2c2.4 2.4 3.6 5.4 3.6 8.8s-1.2 6.4-3.6 8.8c-2.4-2.4-3.6-5.4-3.6-8.8S9.6 5.6 12 3.2Z"/>',
    help:
      '<circle cx="12" cy="12" r="8.8"/><path d="M9.6 9.4a2.5 2.5 0 0 1 4.9.7c0 1.8-2.5 2.3-2.5 4"/><circle cx="12" cy="17.2" r=".9" fill="currentColor" stroke="none"/>',
    info:
      '<circle cx="12" cy="12" r="8.8"/><path d="M12 11v5.4"/><circle cx="12" cy="7.8" r=".9" fill="currentColor" stroke="none"/>',
    document:
      '<path d="M6 3.5h7.2L19 9.3V20.5H6V3.5Z"/><path d="M13 3.6v6h6M9 13h6M9 16.4h4"/>',
    logout:
      '<path d="M14.5 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="m9.5 8-4 4 4 4M5.5 12h10"/>',
    trash:
      '<path d="M4 6.8h16M9.2 6.8V4.6h5.6v2.2M6.4 6.8l.9 13.6h9.4l.9-13.6"/><path d="M10.2 10.4v6.4M13.8 10.4v6.4"/>',
    edit:
      '<path d="m14.8 5.2 4 4L9.6 18.4l-5 1 1-5L14.8 5.2Z"/><path d="m13.2 6.8 4 4"/>',
    dumbbell:
      '<rect x="2.6" y="9" width="3" height="6" rx="1.2"/><rect x="18.4" y="9" width="3" height="6" rx="1.2"/><path d="M5.6 12h12.8"/><path d="M7.6 7.4v9.2M16.4 7.4v9.2"/>',
    run:
      '<circle cx="15.4" cy="4.6" r="2"/><path d="M14.2 8.6 10 11.4l2.4 3.2-2.6 6M12.4 14.6l3.6 3.2.6 3.2M10 11.4 6.6 10M14.2 8.6l3.6 2.6"/>',
    lotus:
      '<path d="M12 20.2c-4.4 0-7.4-2.5-8.4-6 3-.9 5.4.3 8.4 3 3-2.7 5.4-3.9 8.4-3-1 3.5-4 6-8.4 6Z"/><path d="M12 17.2c-2.5-3-3-6.4-1.5-9.8 2.5 1.4 3.9 4.8 3.7 8.3"/><path d="M8.6 9.8c.4 2.4 1.6 4.4 3.4 6M15.4 9.8c-.4 2.4-1.6 4.4-3.4 6"/>',
    music:
      '<path d="M9.4 18V6.2l9.4-2v10.6"/><circle cx="6.6" cy="18.2" r="2.6"/><circle cx="16" cy="16.8" r="2.6"/>',
    swim:
      '<circle cx="16.4" cy="7" r="2.2"/><path d="M3 15.2c2-1.8 4-1.8 6 0s4 1.8 6 0 4-1.8 6 0"/><path d="M3 19.2c2-1.8 4-1.8 6 0s4 1.8 6 0 4-1.8 6 0"/><path d="M7.4 12.2 11 10l4.4 3.4"/>',
    glove:
      '<path d="M7 4.4h6.8a4.1 4.1 0 0 1 4.1 4.1v3.6a5 5 0 0 1-5 5H8.2a2 2 0 0 1-2-2V6.4a2 2 0 0 1 .8-2Z"/><path d="M6.2 11H4.8a2 2 0 0 1 0-4h1.4M9.8 17.1v2.1h6.6v-3.6"/>',
    bike:
      '<circle cx="5.6" cy="17" r="3.2"/><circle cx="18.4" cy="17" r="3.2"/><path d="m5.6 17 4.2-7h5.4l3.2 7"/><path d="M9.8 10h5.8M14.6 10l-2.2 7H5.6"/>',
    ball:
      '<circle cx="12" cy="12" r="8.8"/><path d="M12 3.2c2 2.6 3 5.6 3 8.8s-1 6.2-3 8.8c-2-2.6-3-5.6-3-8.8s1-6.2 3-8.8ZM3.6 9.4c2.6 1 5.4 1.5 8.4 1.5s5.8-.5 8.4-1.5M3.6 14.6c2.6-1 5.4-1.5 8.4-1.5s5.8.5 8.4 1.5"/>',
    play: '<path d="M8.4 5.2 19 12 8.4 18.8V5.2Z"/>',
    refresh: '<path d="M20 12a8 8 0 1 1-2.4-5.7"/><path d="M20.2 4.2v4.2H16"/>',
    bolt: '<path d="M13.2 2.4 4.6 14h5.8l-1 7.6 8.8-11.8h-5.8l.8-7.4Z"/>',
    activity: '<path d="M2.8 12h4.4l2.6-6.4 4.4 12.8 2.6-6.4h4.4"/>',
    more:
      '<circle cx="5.2" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="18.8" cy="12" r="1.3" fill="currentColor" stroke="none"/>',
    verified:
      '<path d="m12 2.6 2.3 1.9 3-.2.9 2.8 2.4 1.7-1 2.8 1 2.9-2.4 1.7-.9 2.8-3-.2L12 21.4l-2.3-1.9-3 .2-.9-2.8-2.4-1.7 1-2.9-1-2.8L5.8 7.1l.9-2.8 3 .2L12 2.6Z"/><path d="m8.8 12.2 2.2 2.2 4.2-4.6"/>',
    filter: '<path d="M4 7h16M7 12h10M10 17h4"/>',
    timer: '<circle cx="12" cy="13.2" r="7.6"/><path d="M12 9.6v3.6l2.4 1.6M9.4 3.4h5.2M12 3.4v2.2"/>',
    moon: '<path d="M20 14.4A8.4 8.4 0 0 1 9.6 4 8.4 8.4 0 1 0 20 14.4Z"/>',
    image:
      '<rect x="3.4" y="4.6" width="17.2" height="14.8" rx="3"/><circle cx="8.8" cy="10" r="1.6"/><path d="m4.6 17.4 5-4.8 4 3.6 3-2.8 3.8 4"/>',
    "face-1":
      '<circle cx="12" cy="12" r="8.8"/><circle cx="8.8" cy="10" r=".9" fill="currentColor" stroke="none"/><circle cx="15.2" cy="10" r=".9" fill="currentColor" stroke="none"/><path d="M8 16.8c1-1.9 2.3-2.8 4-2.8s3 .9 4 2.8"/>',
    "face-2":
      '<circle cx="12" cy="12" r="8.8"/><circle cx="8.8" cy="9.8" r=".9" fill="currentColor" stroke="none"/><circle cx="15.2" cy="9.8" r=".9" fill="currentColor" stroke="none"/><path d="M8.4 16.4c1.1-1.2 2.3-1.8 3.6-1.8s2.5.6 3.6 1.8"/>',
    "face-3":
      '<circle cx="12" cy="12" r="8.8"/><circle cx="8.8" cy="9.8" r=".9" fill="currentColor" stroke="none"/><circle cx="15.2" cy="9.8" r=".9" fill="currentColor" stroke="none"/><path d="M8.6 15.2h6.8"/>',
    "face-4":
      '<circle cx="12" cy="12" r="8.8"/><circle cx="8.8" cy="9.6" r=".9" fill="currentColor" stroke="none"/><circle cx="15.2" cy="9.6" r=".9" fill="currentColor" stroke="none"/><path d="M8.2 14.2c1 2 2.3 3 3.8 3s2.8-1 3.8-3"/>',
    "face-5":
      '<circle cx="12" cy="12" r="8.8"/><path d="M7.8 8.2c.8-.8 1.8-1 2.8-.6M16.2 8.2c-.8-.8-1.8-1-2.8-.6"/><path d="M7.6 13.4c1 2.4 2.5 3.6 4.4 3.6s3.4-1.2 4.4-3.6Z"/>',
    wifi:
      '<path d="M3.4 9.4a13 13 0 0 1 17.2 0M6.4 12.8a8.4 8.4 0 0 1 11.2 0M9.4 16.2a4 4 0 0 1 5.2 0"/><circle cx="12" cy="19.2" r="1" fill="currentColor" stroke="none"/>'
  };

  var names = Object.keys(PATHS);

  function sprite() {
    var markup =
      '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden">';
    names.forEach(function (name) {
      markup += '<symbol id="i-' + name + '" viewBox="0 0 24 24">' + PATHS[name] + "</symbol>";
    });
    markup += "</svg>";
    return markup;
  }

  function icon(name, cls) {
    return (
      '<svg class="icon' +
      (cls ? " " + cls : "") +
      '" aria-hidden="true" focusable="false"><use href="#i-' +
      name +
      '"></use></svg>'
    );
  }

  function hydrate(root) {
    var scope = root || document;
    scope.querySelectorAll("[data-icon]").forEach(function (el) {
      if (el.dataset.iconDone === "1") return;
      el.innerHTML = icon(el.dataset.icon, el.dataset.iconClass || "");
      el.dataset.iconDone = "1";
    });
  }

  if (!document.getElementById("vem-sprite")) {
    var holder = document.createElement("div");
    holder.id = "vem-sprite";
    holder.innerHTML = sprite();
    document.body.insertBefore(holder, document.body.firstChild);
  }

  window.VemIcons = { icon: icon, hydrate: hydrate, names: names };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      hydrate(document);
    });
  } else {
    hydrate(document);
  }
})();
