/* =========================================================================
   VEM — Estado local da rodada de testes
   Persistência em localStorage. Nenhum dado sai do navegador.
   Chaves: vem.profile.v1 · vem.verification.v1 · vem.interests.v1 ·
           vem.favorites.v1 · vem.match.v1 · vem.chat.v1 · vem.events.v1 ·
           vem.groups.v1 · vem.signals.v1 · vem.log.v1
   ========================================================================= */

(function () {
  "use strict";

  var KEYS = {
    profile: "vem.profile.v1",
    verification: "vem.verification.v1",
    goal: "vem.goal.v1",
    interests: "vem.interests.v1",
    favorites: "vem.favorites.v1",
    match: "vem.match.v1",
    chat: "vem.chat.v1",
    archive: "vem.chat.archive.v1",
    events: "vem.events.v1",
    groups: "vem.groups.v1",
    signals: "vem.signals.v1",
    social: "vem.social.v1",
    tour: "vem.tour.v1",
    log: "vem.log.v1",
    google: "vem.google.v1"
  };

  var DEFAULTS = {
    profile: { name: "", email: "", birth: "", photo: "", bio: "", cover: "", gallery: [], educator: null, cref: "" },
    verification: "none",
    interests: { broad: [], specific: [], custom: [] },
    favorites: [],
    match: { geral: true, specifics: {}, likes: 0, matched: [] },
    chat: null,
    archive: {},
    events: [],
    groups: [],
    signals: {},
    social: { pending: 0 },
    tour: { step: 0, done: false },
    log: []
  };

  function read(key, fallback) {
    try {
      var raw = window.localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (error) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  function remove(key) {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      /* modo privado pode bloquear o storage */
    }
  }

  var state = {
    profile: read(KEYS.profile, DEFAULTS.profile),
    verification: read(KEYS.verification, DEFAULTS.verification),
    interests: read(KEYS.interests, DEFAULTS.interests),
    favorites: read(KEYS.favorites, DEFAULTS.favorites),
    match: read(KEYS.match, DEFAULTS.match),
    chat: read(KEYS.chat, DEFAULTS.chat),
    archive: read(KEYS.archive, DEFAULTS.archive),
    events: read(KEYS.events, DEFAULTS.events),
    groups: read(KEYS.groups, DEFAULTS.groups),
    signals: read(KEYS.signals, DEFAULTS.signals),
    social: read(KEYS.social, DEFAULTS.social),
    tour: read(KEYS.tour, DEFAULTS.tour),
    google: read(KEYS.google, false)
  };

  /* Normaliza estados antigos ou incompletos. */
  state.profile = Object.assign({}, DEFAULTS.profile, state.profile || {});
  state.interests = Object.assign({}, DEFAULTS.interests, state.interests || {});
  state.match = Object.assign({}, DEFAULTS.match, state.match || {});
  state.match.specifics = state.match.specifics || {};
  state.match.matched = Array.isArray(state.match.matched) ? state.match.matched : [];
  state.favorites = Array.isArray(state.favorites) ? state.favorites.slice(0, 5) : [];
  state.events = Array.isArray(state.events) ? state.events : [];
  state.groups = Array.isArray(state.groups) ? state.groups : [];
  state.signals = state.signals && typeof state.signals === "object" ? state.signals : {};
  state.archive = state.archive && typeof state.archive === "object" ? state.archive : {};
  state.social = Object.assign({}, DEFAULTS.social, state.social || {});
  state.tour = Object.assign({}, DEFAULTS.tour, state.tour || {});
  state.profile.gallery = Array.isArray(state.profile.gallery) ? state.profile.gallery : [];

  function save(key) {
    var map = {
      profile: state.profile,
      verification: state.verification,
      interests: state.interests,
      favorites: state.favorites,
      match: state.match,
      chat: state.chat,
      archive: state.archive,
      events: state.events,
      groups: state.groups,
      signals: state.signals,
      social: state.social,
      tour: state.tour,
      google: state.google
    };
    if (!(key in map)) return false;
    return write(KEYS[key], map[key]);
  }

  function reset() {
    Object.keys(KEYS).forEach(function (name) {
      remove(KEYS[name]);
    });
    remove("vem.chat.queue.v1");
    remove("vem.chat.archived.v1");
  }

  function log(type, detail) {
    var list = read(KEYS.log, []);
    list.push({
      t: new Date().toISOString(),
      type: type,
      detail: detail || null,
      tela: window.VemApp && window.VemApp.current ? window.VemApp.current() : null
    });
    if (list.length > 300) list = list.slice(-300);
    write(KEYS.log, list);
  }

  function downloadLog() {
    var data = JSON.stringify(read(KEYS.log, []), null, 2);
    var blob = new Blob([data], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = "vem-log-teste.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 2000);
  }

  function firstName() {
    return String(state.profile.name || "").trim().split(/\s+/)[0] || "";
  }

  function photo() {
    return state.profile.photo || "";
  }

  window.VemStore = {
    KEYS: KEYS,
    state: state,
    read: read,
    write: write,
    remove: remove,
    save: save,
    reset: reset,
    log: log,
    downloadLog: downloadLog,
    firstName: firstName,
    photo: photo
  };

  /* ?reset=1 limpa o teste inteiro e volta para a tela 01. */
  try {
    var params = new URLSearchParams(window.location.search);
    if (params.get("reset") === "1") {
      reset();
      params.delete("reset");
      params.set("tela", "01");
      window.location.replace(window.location.pathname + "?" + params.toString());
    }
  } catch (error) {
    /* file:// pode bloquear URLSearchParams? Não — só o replace é opcional. */
  }
})();
