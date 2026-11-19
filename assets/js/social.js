/* =========================================================================
   VEM — Rodada de testes v2
   Verificação com advertising · interesses em duas camadas · conexões gerais e
   por atividade (fan-out) · grupos ancorados em conexões · eventos · feed com
   sinais · conversa simulada com roteiro sim/não.
   ========================================================================= */

(function () {
  "use strict";

  var DATA = window.VEM_DATA || {};
  var STORE = window.VemStore;
  if (!STORE) return;

  var S = STORE.state;
  var PEOPLE = DATA.people || {};
  var MATCHES = DATA.matches || [];
  var ACTIVITIES = DATA.activities || [];
  var BROAD = DATA.broadTags || [];
  var BROAD_PRIMARY = DATA.broadPrimary || [];
  var SUGGESTED = DATA.suggestedActivities || [];
  var EVENTS = DATA.events || [];
  var GROUPS = DATA.groups || [];

  var ACT = {};
  ACTIVITIES.forEach(function (item) {
    ACT[item.slug] = item;
  });

  var verifyReturn = "04";
  var matchIndex = 0;
  var matchBusy = false;
  var chatTimer = null;

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $$(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function toast(message, action) {
    if (window.VemUI) window.VemUI.toast(message, action);
  }

  function go(id) {
    if (window.VemApp) window.VemApp.go(id);
  }

  function currentScreen() {
    return window.VemApp ? window.VemApp.current() : null;
  }

  function save() {
    STORE.save("profile");
    STORE.save("verification");
    STORE.save("interests");
    STORE.save("favorites");
    STORE.save("match");
    STORE.save("chat");
    STORE.save("archive");
    STORE.save("events");
    STORE.save("groups");
    STORE.save("signals");
  }

  function activityOf(slug) {
    return ACT[slug] || { slug: slug, label: slug, emoji: "⭐" };
  }

  function eventOf(id) {
    return EVENTS.filter(function (item) {
      return item.id === id;
    })[0] || null;
  }

  function personOf(id) {
    return PEOPLE[id] || null;
  }

  function labelFor(list) {
    if (!list.length) return "";
    if (list.length === 1) return list[0];
    return list.slice(0, -1).join(", ") + " e " + list[list.length - 1];
  }

  function matchedIds() {
    return S.match.matched.map(function (item) {
      return item.id;
    });
  }

  function isMatched(id) {
    return matchedIds().indexOf(id) !== -1;
  }

  function activeSpecifics() {
    return Object.keys(S.match.specifics).filter(function (slug) {
      return S.match.specifics[slug] === true;
    });
  }

  function isVerified() {
    return S.verification === "verified";
  }

  /* Gate suave: a pessoa explora, mas conexão/grupo/conversa pedem verificação. */
  function guardVerified(action) {
    if (isVerified()) return true;
    toast("Verifique para " + action + ". Leva menos de um minuto.", {
      label: "Verificar",
      onClick: function () {
        openVerification("10");
      }
    });
    STORE.log("verify:blocked", action);
    return false;
  }

  /* -----------------------------------------------------------------------
     Identidade do testador
     ----------------------------------------------------------------------- */

  function userName() {
    return String(S.profile.name || "").trim();
  }

  function displayName() {
    return userName() || "Seu perfil";
  }

  function setPhoto(el, src) {
    if (!el) return;
    var wrap = el.closest(".avatar");
    if (src) {
      el.src = src;
      el.hidden = false;
      if (wrap) wrap.classList.remove("is-empty");
    } else {
      el.removeAttribute("src");
      el.hidden = true;
      if (wrap) wrap.classList.add("is-empty");
    }
  }

  function renderVerificationState() {
    var verified = isVerified();

    var confirmed = $("#verify-verified");
    var confirmedFoot = $("#verify-verified-foot");
    var pending = $("#verify-pending");
    var pendingFoot = $("#verify-pending-foot");

    if (confirmed) confirmed.hidden = !verified;
    if (confirmedFoot) confirmedFoot.hidden = !verified;
    if (pending) pending.hidden = verified;
    if (pendingFoot) pendingFoot.hidden = verified;
  }

  function renderSignals() {
    var host = $("#signal-list");
    if (!host) return;

    var rows = Object.keys(S.signals)
      .map(function (slug) {
        return { slug: slug, count: S.signals[slug] };
      })
      .filter(function (row) {
        return row.count > 0;
      })
      .sort(function (a, b) {
        return b.count - a.count;
      })
      .slice(0, 3);

    if (!rows.length) {
      host.innerHTML = '<p class="tiny">Nenhum sinal ainda. Explore o Feed.</p>';
      return;
    }

    host.innerHTML = rows
      .map(function (row) {
        var act = activityOf(row.slug);
        return (
          '<div class="signal">' +
          '<span class="signal__emoji">' + act.emoji + "</span>" +
          '<span class="signal__body"><strong>' + esc(act.label) + "</strong>" +
          '<span class="tiny">' + row.count + " interaç" + (row.count === 1 ? "ão" : "ões") + " no Feed</span></span>" +
          '<button class="signal__remove" type="button" data-signal-remove="' + esc(row.slug) + '" aria-label="Remover sinal de ' + esc(act.label) + '"><span data-icon="x"></span></button>' +
          "</div>"
        );
      })
      .join("");
    if (window.VemIcons) window.VemIcons.hydrate(host);
  }

  function renderProfileTags() {
    var host = $("#profile-tags");
    if (!host) return;

    var slugs = S.interests.specific.slice(0, 5);
    if (!slugs.length) {
      host.innerHTML = '<span class="tag">Sem interesses ainda</span>';
      return;
    }

    host.innerHTML = slugs
      .map(function (slug) {
        var act = activityOf(slug);
        return '<span class="tag tag--sage">' + act.emoji + " " + esc(act.label) + "</span>";
      })
      .join("");
  }

  function refresh() {
    var first = STORE.firstName();
    var photo = S.profile.photo;

    var hello = $("#home-hello");
    if (hello) hello.textContent = first ? "Bom dia, " + first : "Bom dia";

    $$('img[data-photo="user"]').forEach(function (image) {
      setPhoto(image, photo);
    });

    var name = displayName();
    var profileName = $("#profile-name");
    if (profileName) profileName.textContent = name;

    var settingsName = $("#settings-name");
    if (settingsName) settingsName.textContent = name;

    var settingsMail = $("#settings-mail");
    if (settingsMail) settingsMail.textContent = S.profile.email || "Sem e-mail cadastrado";

    var verifiedIcon = $("#profile-verified");
    if (verifiedIcon) verifiedIcon.hidden = !isVerified();

    var pendingTag = $("#profile-pending");
    if (pendingTag) pendingTag.hidden = isVerified();

    var verifyBanner = $("#verify-banner");
    if (verifyBanner) verifyBanner.hidden = isVerified();

    var profileNudge = $("#profile-nudge");
    if (profileNudge) profileNudge.hidden = !!(S.profile.name && S.profile.photo);

    var settingsVerify = $("#settings-verify");
    if (settingsVerify) {
      settingsVerify.textContent = isVerified()
        ? "Verificado"
        : S.verification === "pending"
          ? "Pendente"
          : "Verificar agora";
    }

    var educator = $("#profile-educator");
    if (educator) educator.hidden = !S.profile.educator;

    var friends = $('[data-stat="friends"]');
    if (friends) friends.textContent = String(S.match.matched.length);

    var bio = $("#profile-bio");
    if (bio) {
      bio.textContent = S.profile.bio
        ? S.profile.bio
        : S.profile.educator
          ? "Educador físico em análise no CREF. Crie eventos e modere grupos da comunidade."
          : S.match.matched.length
            ? "Seu perfil está em construção. " + S.match.matched.length + " conexão" + (S.match.matched.length > 1 ? "ões" : "") + " e " + S.events.length + " evento" + (S.events.length === 1 ? "" : "s") + " confirmado" + (S.events.length === 1 ? "" : "s") + "."
            : "Seu perfil começa vazio. Preencha no cadastro e edite quando quiser.";
    }

    var cover = $("#profile-cover-img");
    if (cover && S.profile.cover) cover.src = S.profile.cover;

    if (window.VemUI && window.VemUI.renderGallery) window.VemUI.renderGallery();

    var level = $("#profile-level");
    if (level) {
      level.innerHTML =
        "<b>Nível " + (S.match.matched.length ? 2 : 1) + "</b> · " +
        (S.profile.educator ? "Educador em análise" : S.match.matched.length ? "Explorando" : "Começando") +
        '<span class="progress progress--amber profile__levelbar" aria-hidden="true"><span class="progress__bar" style="width: ' +
        (S.match.matched.length ? 32 : 8) + '%"></span></span>';
    }

    renderProfileTags();
    renderSignals();
    renderVerificationState();
    updateChatBadge();
  }

  function hydrateProfileForm() {
    var name = $("#pf-name");
    var email = $("#pf-email");
    var birth = $("#pf-birth");
    var preview = $("#pf-avatar");

    if (name && !name.value && S.profile.name) name.value = S.profile.name;
    if (email && !email.value && S.profile.email) email.value = S.profile.email;
    if (birth && !birth.value && S.profile.birth) birth.value = S.profile.birth;
    if (preview) setPhoto(preview, S.profile.photo);

    [name, email, birth].forEach(function (input) {
      if (input && input.value) input.dispatchEvent(new Event("input", { bubbles: true }));
    });
  }

  /* -----------------------------------------------------------------------
     Verificação
     ----------------------------------------------------------------------- */

  function openVerification(returnTo) {
    verifyReturn = returnTo || "10";
    renderVerificationState();
    go("03");
    STORE.log("verify:open");
  }

  function completeVerification() {
    S.verification = "verified";
    STORE.save("verification");
    STORE.log("verify:done");
    renderVerificationState();
    refresh();
    toast("Verificação concluída.");
  }

  document.addEventListener("click", function (event) {
    var start = event.target.closest("[data-verify-start]");
    if (start) {
      verifyReturn = "04";
      completeVerification();
      go("03");
      return;
    }

    var later = event.target.closest("[data-verify-later]");
    if (later) {
      S.verification = "pending";
      STORE.save("verification");
      STORE.log("verify:later");
      verifyReturn = "04";
      renderVerificationState();
      refresh();
      go("03");
      return;
    }

    if (event.target.closest("#verify-now")) {
      completeVerification();
      return;
    }

    if (event.target.closest("#verify-continue")) {
      go(verifyReturn === "10" ? "10" : "04");
      return;
    }

    if (event.target.closest("[data-verify-open]")) {
      openVerification("10");
    }
  });

  /* -----------------------------------------------------------------------
     Google simulado + login
     ----------------------------------------------------------------------- */

  document.addEventListener("click", function (event) {
    if (!event.target.closest("[data-google]")) return;

    S.google = true;
    STORE.save("google");
    STORE.log("auth:google");
    toast("Conta Google conectada (simulação). Complete seu cadastro.");
    go("02");
  });

  var loginEnter = $("#login-enter");
  if (loginEnter) {
    loginEnter.addEventListener("click", function () {
      STORE.log("auth:login");
      toast(STORE.firstName() ? "Bem-vindo de volta, " + STORE.firstName() + "." : "Bem-vindo de volta.");
    });
  }

  /* -----------------------------------------------------------------------
     CREF / educador físico
     ----------------------------------------------------------------------- */

  var crefInput = $("#cref-number");
  var crefSubmit = $("#cref-submit");
  var crefFile = $("#cref-file");
  var crefFileName = $("#cref-file-name");

  function renderCref() {
    var pending = S.profile.educator === "pending";
    var form = $("#cref-form-wrap");
    var pendingWrap = $("#cref-pending-wrap");
    var foot = $("#cref-foot");
    var footPending = $("#cref-foot-pending");

    if (form) form.hidden = pending;
    if (pendingWrap) pendingWrap.hidden = !pending;
    if (foot) foot.hidden = pending;
    if (footPending) footPending.hidden = !pending;

    if (crefInput) crefInput.value = S.profile.cref || "";
    updateCrefSubmit();
  }

  function updateCrefSubmit() {
    if (!crefSubmit) return;
    var value = crefInput ? crefInput.value.trim() : "";
    crefSubmit.disabled = value.length < 4;
  }

  if (crefInput) {
    crefInput.addEventListener("input", updateCrefSubmit);
  }

  var crefFileBtn = $("#cref-file-btn");
  if (crefFileBtn && crefFile) {
    crefFileBtn.addEventListener("click", function () {
      crefFile.click();
    });
  }

  if (crefFile && crefFileName) {
    crefFile.addEventListener("change", function () {
      var file = crefFile.files && crefFile.files[0];
      crefFileName.textContent = file ? file.name : "Nenhum arquivo selecionado.";
      if (file) toast("Documento anexado (simulação).");
    });
  }

  if (crefSubmit) {
    crefSubmit.addEventListener("click", function () {
      if (crefSubmit.disabled) return;

      S.profile.educator = "pending";
      S.profile.cref = crefInput ? crefInput.value.trim() : "";
      STORE.save("profile");
      STORE.log("cref:submit", S.profile.cref);
      renderCref();
      refresh();
      toast("Documentação enviada. Análise simulada.");
    });
  }

  /* -----------------------------------------------------------------------
     Interesses em duas camadas
     ----------------------------------------------------------------------- */

  var broadHost = $("#broad-tags");
  var specificHost = $("#specific-tags");
  var interestSearch = $("#interest-search");
  var suggestHost = $("#interest-suggest");
  var interestContinue = $("#interest-continue");

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function findActivity(term) {
    var needle = normalize(term);
    if (!needle) return null;
    return ACTIVITIES.filter(function (item) {
      return normalize(item.label) === needle || normalize(item.slug) === needle;
    })[0] || null;
  }

  function activityLabel(slug) {
    if (slug.indexOf("custom:") === 0) return slug.slice(7);
    return activityOf(slug).label;
  }

  function activityEmoji(slug) {
    if (slug.indexOf("custom:") === 0) return "⭐";
    return activityOf(slug).emoji;
  }

  function customSlug(label) {
    return "custom:" + String(label).trim().toLowerCase();
  }

  function broadOf(slug) {
    for (var i = 0; i < BROAD.length; i++) {
      if (BROAD[i].slug === slug) return BROAD[i];
    }
    return null;
  }

  function renderBroad(term) {
    if (!broadHost) return;
    var needle = normalize(term || "");

    var list = BROAD_PRIMARY.map(broadOf).filter(Boolean);

    /* A busca revela também os contextos que não estão entre os principais. */
    if (needle) {
      var matches = BROAD.filter(function (tag) {
        return normalize(tag.label).indexOf(needle) !== -1;
      });
      list = matches;
    }

    broadHost.innerHTML = list.map(function (tag) {
      var on = S.interests.broad.indexOf(tag.slug) !== -1;
      return (
        '<button class="chip chip--compact" type="button" data-broad="' + tag.slug + '" aria-pressed="' + (on ? "true" : "false") + '">' +
        '<span class="chip__emoji" aria-hidden="true">' + tag.emoji + "</span><span>" + esc(tag.label) + "</span>" +
        "</button>"
      );
    }).join("");
  }

  function renderSuggested() {
    var host = $("#interest-suggested");
    if (!host) return;

    host.innerHTML = SUGGESTED.map(function (slug) {
      var act = activityOf(slug);
      var chosen = S.interests.specific.indexOf(slug) !== -1;
      return (
        '<button class="chip chip--compact' + (chosen ? " is-selected" : "") + '" type="button" data-add-activity="' + slug + '" aria-pressed="' + (chosen ? "true" : "false") + '">' +
        '<span class="chip__emoji" aria-hidden="true">' + act.emoji + "</span><span>" + esc(act.label) + "</span>" +
        "</button>"
      );
    }).join("");
  }

  function syncInterestCounters() {
    var broadCounter = $('[data-chip-counter="broad"]');
    if (broadCounter) {
      var broadCount = S.interests.broad.length;
      broadCounter.innerHTML = broadCount
        ? "<strong>" + broadCount + "</strong> contexto" + (broadCount > 1 ? "s" : "") + " selecionado" + (broadCount > 1 ? "s" : "")
        : "Nenhum contexto selecionado";
    }

    var specificCounter = $('[data-chip-counter="specific"]');
    if (specificCounter) {
      var total = S.interests.specific.length;
      var favorites = Math.min(total, 5);
      specificCounter.innerHTML = total
        ? "<strong>" + total + "</strong> atividade" + (total > 1 ? "s" : "") +
          " · <strong>" + favorites + "</strong> favorita" + (favorites > 1 ? "s" : "") + " de 5"
        : "Nenhuma atividade escolhida";
    }

    if (interestContinue) {
      interestContinue.disabled = !(
        S.interests.broad.length ||
        S.interests.specific.length ||
        S.interests.custom.length
      );
    }
  }

  function renderSpecific() {
    if (!specificHost) return;

    if (!S.interests.specific.length) {
      specificHost.innerHTML =
        '<p class="specific-tags__empty">As atividades escolhidas aparecem aqui, com o emoji da modalidade.</p>';
      return;
    }

    specificHost.innerHTML = S.interests.specific.map(function (slug, index) {
      return (
        '<span class="activity-chip' + (index < 5 ? " is-favorite" : "") + '">' +
        '<span class="activity-chip__emoji" aria-hidden="true">' + activityEmoji(slug) + "</span>" +
        '<span class="activity-chip__label">' + esc(activityLabel(slug)) + "</span>" +
        (index < 5 ? '<span class="activity-chip__flag" title="Favorita">★</span>' : "") +
        '<button class="activity-chip__remove" type="button" data-remove-activity="' + esc(slug) + '" aria-label="Remover ' + esc(activityLabel(slug)) + '"><span data-icon="x"></span></button>' +
        "</span>"
      );
    }).join("");

    if (window.VemIcons) window.VemIcons.hydrate(specificHost);
  }

  function syncFavorites() {
    S.favorites = S.interests.specific.slice(0, 5).map(function (slug) {
      return { slug: slug, label: activityLabel(slug), emoji: activityEmoji(slug) };
    });

    Object.keys(S.match.specifics).forEach(function (slug) {
      if (!S.favorites.some(function (fav) { return fav.slug === slug; })) {
        delete S.match.specifics[slug];
      }
    });
  }

  function syncInterests() {
    syncFavorites();
    save();
    syncInterestCounters();
    renderSpecific();
    renderSuggested();
    renderFanout();
    renderMatch();
    refresh();
  }

  function addSpecific(slug) {
    if (S.interests.specific.indexOf(slug) !== -1) {
      toast("Essa atividade já está na sua lista.");
      return;
    }
    if (S.interests.specific.length >= 5) {
      toast("Você já tem 5 favoritas. Remova uma para escolher outra.");
      return;
    }

    S.interests.specific.push(slug);
    if (S.interests.custom.indexOf(slug) !== -1) {
      /* já é custom, mantém */
    }
    STORE.log("interest:add", slug);
    syncInterests();
    toast(activityEmoji(slug) + " " + activityLabel(slug) + " adicionada.");
  }

  function addCustom(label) {
    var clean = String(label || "").trim();
    if (clean.length < 2) return;

    var existing = findActivity(clean);
    if (existing) {
      addSpecific(existing.slug);
      return;
    }

    var slug = customSlug(clean);
    if (S.interests.specific.indexOf(slug) !== -1) {
      toast("Essa atividade já está na sua lista.");
      return;
    }
    if (S.interests.specific.length >= 8) {
      toast("Você já escolheu 8 atividades. Remova uma para adicionar outra.");
      return;
    }

    if (S.interests.custom.indexOf(slug) === -1) S.interests.custom.push(slug);
    S.interests.specific.push(slug);
    STORE.log("interest:custom", clean);
    syncInterests();
    toast("“" + clean + "” adicionada como atividade livre.");
  }

  function renderSuggest(term) {
    if (!suggestHost) return;

    var needle = normalize(term);
    if (!needle) {
      suggestHost.hidden = true;
      suggestHost.innerHTML = "";
      return;
    }

    var results = ACTIVITIES.filter(function (item) {
      return normalize(item.label).indexOf(needle) !== -1;
    }).slice(0, 6);

    var exact = findActivity(term);
    var html = results.map(function (item) {
      return (
        '<button class="suggest__item" type="button" data-add-activity="' + item.slug + '">' +
        '<span class="suggest__emoji" aria-hidden="true">' + item.emoji + "</span>" +
        "<span>" + esc(item.label) + "</span>" +
        '<span class="suggest__action">Adicionar</span>' +
        "</button>"
      );
    }).join("");

    if (!exact && term.trim().length >= 2) {
      html +=
        '<button class="suggest__item suggest__item--custom" type="button" data-add-custom="' + esc(term.trim()) + '">' +
        '<span class="suggest__emoji" aria-hidden="true">⭐</span>' +
        "<span>Criar “" + esc(term.trim()) + "”</span>" +
        '<span class="suggest__action">Adicionar</span>' +
        "</button>";
    }

    suggestHost.innerHTML = html || '<p class="suggest__empty tiny">Nenhuma atividade encontrada. Escreva e crie uma.</p>';
    suggestHost.hidden = false;
  }

  function hydrateInterests() {
    renderBroad();
    renderSuggested();
    renderSpecific();
    syncInterestCounters();
  }

  var broadSearch = $("#broad-search");
  if (broadSearch) {
    broadSearch.addEventListener("input", function () {
      renderBroad(broadSearch.value);
    });
  }

  if (broadHost) {
    broadHost.addEventListener("click", function (event) {
      var chip = event.target.closest("[data-broad]");
      if (!chip) return;

      var slug = chip.getAttribute("data-broad");
      var at = S.interests.broad.indexOf(slug);
      if (at === -1) S.interests.broad.push(slug);
      else S.interests.broad.splice(at, 1);

      chip.setAttribute("aria-pressed", at === -1 ? "true" : "false");
      STORE.log("interest:broad", slug);
      save();
      syncInterestCounters();
      refresh();
    });
  }

  if (interestSearch) {
    interestSearch.addEventListener("input", function () {
      renderSuggest(interestSearch.value);
    });

    interestSearch.addEventListener("keydown", function (event) {
      if (event.key !== "Enter") return;
      event.preventDefault();

      var term = interestSearch.value.trim();
      if (!term) return;

      var first = ACTIVITIES.filter(function (item) {
        return normalize(item.label).indexOf(normalize(term)) !== -1;
      })[0];

      if (first) addSpecific(first.slug);
      else addCustom(term);

      interestSearch.value = "";
      renderSuggest("");
    });

    interestSearch.addEventListener("blur", function () {
      window.setTimeout(function () {
        if (suggestHost) suggestHost.hidden = true;
      }, 180);
    });
  }

  document.addEventListener("click", function (event) {
    var suggestion = event.target.closest("[data-add-activity]");
    if (suggestion) {
      addSpecific(suggestion.getAttribute("data-add-activity"));
      if (interestSearch) interestSearch.value = "";
      renderSuggest("");
      return;
    }

    var custom = event.target.closest("[data-add-custom]");
    if (custom) {
      addCustom(custom.getAttribute("data-add-custom"));
      if (interestSearch) interestSearch.value = "";
      renderSuggest("");
      return;
    }

    var remove = event.target.closest("[data-remove-activity]");
    if (remove) {
      var slug = remove.getAttribute("data-remove-activity");
      S.interests.specific = S.interests.specific.filter(function (item) {
        return item !== slug;
      });
      S.interests.custom = S.interests.custom.filter(function (item) {
        return item !== slug;
      });
      STORE.log("interest:remove", slug);
      syncInterests();
    }
  });

  /* -----------------------------------------------------------------------
     Conexões — deck, leque de atividades e curtidas
     ----------------------------------------------------------------------- */

  function deck() {
    var specs = activeSpecifics();

    return MATCHES.filter(function (person) {
      var specMatch = specs.some(function (slug) {
        return person.activities.indexOf(slug) !== -1;
      });

      if (specs.length) {
        return S.match.geral ? specMatch || person.compatibility >= 80 : specMatch;
      }

      return S.match.geral;
    });
  }

  function currentPerson() {
    var list = deck();
    if (!list.length) return null;
    return list[matchIndex % list.length];
  }

  function activityForMatch(person) {
    var specs = activeSpecifics();
    var hit = specs.filter(function (slug) {
      return person.activities.indexOf(slug) !== -1;
    })[0];
    if (hit) return hit;
    return person.activities[0] || "corrida";
  }

  function renderMatch() {
    var card = $("#match-card");
    var empty = $("#match-empty");
    var actions = $(".match__actions");
    if (!card) return;

    var list = deck();
    var person = list.length ? list[matchIndex % list.length] : null;

    card.hidden = !person;
    if (empty) empty.hidden = !!person;
    if (actions) actions.hidden = !person;

    if (!person) return;

    var image = $("#match-img");
    var photo = $("#match-photo");
    var compatibility = $("#match-compat");
    var name = $("#match-name");
    var age = $("#match-age");
    var distance = $("#match-dist");
    var area = $("#match-area");
    var bio = $("#match-bio");
    var tags = $("#match-tags");
    var activityBadge = $("#match-activity");

    if (photo) photo.style.background = person.tint;
    if (image) {
      image.src = person.photo || person.avatar;
      image.alt = "Foto de " + person.name;
    }
    if (compatibility) compatibility.textContent = person.compatibility + "% combinam";
    if (name) name.textContent = person.name;
    if (age) age.textContent = String(person.age);
    if (distance) distance.textContent = person.distance;
    if (area) area.textContent = person.area;
    if (bio) bio.textContent = person.bio;

    if (tags) {
      tags.innerHTML = person.activities
        .slice(0, 3)
        .map(function (slug) {
          return '<span class="tag">' + activityEmoji(slug) + " " + esc(activityLabel(slug)) + "</span>";
        })
        .join("") +
        '<span class="tag">' + esc(person.level) + "</span>";
    }

    if (activityBadge) {
      var specs = activeSpecifics();
      var specific = specs.filter(function (slug) {
        return person.activities.indexOf(slug) !== -1;
      })[0];

      if (specific) {
        activityBadge.hidden = false;
        activityBadge.textContent = "Conexão em " + activityLabel(specific);
      } else if (specs.length) {
        activityBadge.hidden = false;
        activityBadge.textContent = "Conexões gerais";
      } else {
        activityBadge.hidden = true;
      }
    }
  }

  function updateFabBadge() {
    var badge = $("#match-fab-badge");
    if (!badge) return;
    var count = activeSpecifics().length;
    badge.textContent = String(count);
    badge.hidden = count === 0;
  }

  function renderFanout() {
    var host = $("#match-fanout-items");
    if (!host) return;

    var items = [
      '<button class="fanout-item fanout-item--geral" type="button" data-toggle-match="geral" aria-pressed="' +
        (S.match.geral ? "true" : "false") + '">' +
        '<span class="fanout-item__emoji" aria-hidden="true">🏃</span>' +
        '<span class="fanout-item__label">Geral</span>' +
        "</button>"
    ];

    S.favorites.forEach(function (fav) {
      var on = S.match.specifics[fav.slug] === true;
      items.push(
        '<button class="fanout-item" type="button" data-toggle-match="' + esc(fav.slug) + '" aria-pressed="' + (on ? "true" : "false") + '">' +
        '<span class="fanout-item__emoji" aria-hidden="true">' + fav.emoji + "</span>" +
        '<span class="fanout-item__label">' + esc(fav.label) + "</span>" +
        "</button>"
      );
    });

    host.innerHTML = items.join("");
    updateFabBadge();
  }

  function closeFanout() {
    var fanout = $("#match-fanout");
    var fab = $("#match-fab");
    if (fanout) fanout.hidden = true;
    if (fab) {
      fab.setAttribute("aria-expanded", "false");
      fab.classList.remove("is-open");
    }
  }

  function openFanout() {
    var fanout = $("#match-fanout");
    var fab = $("#match-fab");
    if (!fanout) return;
    fanout.hidden = false;
    if (fab) {
      fab.setAttribute("aria-expanded", "true");
      fab.classList.add("is-open");
    }
  }

  /* Folha reutilizável */
  function openSheet(title, html) {
    var sheet = $("#sheet");
    var titleEl = $("#sheet-title");
    var body = $("#sheet-body");
    if (!sheet || !titleEl || !body) return;

    titleEl.textContent = title;
    body.innerHTML = html;
    sheet.hidden = false;

    if (window.VemIcons) window.VemIcons.hydrate(body);
  }

  function closeSheet() {
    var sheet = $("#sheet");
    if (sheet) sheet.hidden = true;
  }

  function openActivityPicker() {
    var pool = [];

    S.interests.specific.forEach(function (slug) {
      if (pool.indexOf(slug) === -1) pool.push(slug);
    });

    ["yoga", "corrida", "musculacao", "danca", "natacao", "boxe", "ciclismo", "volei", "escalada", "caminhada"].forEach(function (slug) {
      if (pool.indexOf(slug) === -1 && pool.length < 12) pool.push(slug);
    });

    var html =
      '<p class="tiny mb-2">Escolha até 5 atividades. Elas viram o leque de conexões e a base dos grupos sugeridos.</p>' +
      '<div class="picker-grid">' +
      pool.slice(0, 12).map(function (slug) {
        return (
          '<button class="picker-item" type="button" data-pick-activity="' + esc(slug) + '">' +
          '<span class="picker-item__emoji" aria-hidden="true">' + activityEmoji(slug) + "</span>" +
          '<span class="picker-item__label">' + esc(activityLabel(slug)) + "</span>" +
          "</button>"
        );
      }).join("") +
      "</div>";

    openSheet("Escolha uma atividade", html);
  }

  function pickActivity(slug) {
    if (!S.favorites.some(function (fav) { return fav.slug === slug; })) {
      if (S.favorites.length >= 5) {
        toast("Você já tem 5 favoritas. Remova uma no seu perfil ou nos interesses.");
        return;
      }
      S.favorites.push({ slug: slug, label: activityLabel(slug), emoji: activityEmoji(slug) });
    }

    S.match.specifics[slug] = true;
    STORE.log("match:pick", slug);
    save();
    renderFanout();
    renderMatch();
    closeSheet();
    openFanout();
    toast(activityEmoji(slug) + " conexão ativada em " + activityLabel(slug) + ".");
  }

  var matchCard = $("#match-card");

  /* -----------------------------------------------------------------------
     Reação do match — animações Lottie em SVG, dois estados
     "thumb"    → a pessoa ainda não deu like (curtida enviada)
     "highfive" → a pessoa já deu like (conexão mútua confirmado)
     ----------------------------------------------------------------------- */

  var LOTTIE_MS = { thumb: 1017, highfive: 2428 };
  /* Ponto de parada de cada reação (o high-five para no auge do toque). */
  var LOTTIE_STOP_MS = { thumb: 987, highfive: 1900 };
  var thumbSvg = null;
  var reactionSvg = null;

  function mountLottie(host, markup) {
    if (!host || !markup) return null;
    host.innerHTML = markup;
    var svg = host.querySelector("svg");
    if (!svg) return null;
    svg.setAttribute("focusable", "false");
    restSvg(svg);
    return svg;
  }

  function restSvg(svg) {
    if (!svg) return;
    try {
      svg.pauseAnimations();
      svg.setCurrentTime(0);
    } catch (error) {
      /* ambiente sem SMIL: segue sem controle de tempo */
    }
  }

  function playSvg(svg, kind, done) {
    if (!svg) {
      done();
      return;
    }

    var duration = Math.max(0.12, (LOTTIE_STOP_MS[kind] || LOTTIE_MS[kind]) / 1000);
    var finished = false;
    var started = null;
    var raf = window.requestAnimationFrame;
    var guard = null;
    var ticker = null;

    function finish() {
      if (finished) return;
      finished = true;
      if (guard) window.clearTimeout(guard);
      if (ticker) window.clearInterval(ticker);
      try {
        svg.pauseAnimations();
      } catch (error) {
        /* ignora */
      }
      done();
    }

    try {
      /* O timeline do SMIL não avança de forma confiável em alguns
         navegadores; a animação é dirigida manualmente por frame. */
      svg.pauseAnimations();
      svg.setCurrentTime(0);
    } catch (error) {
      finish();
      return;
    }

    /* Rede de segurança: se nenhum relógio rodar (janela oculta ou aba em
       segundo plano), a reação ainda conclui. */
    guard = window.setTimeout(finish, duration * 1000 + 200);

    function step(timestamp) {
      if (finished) return;
      if (started === null) started = timestamp;

      var elapsed = (timestamp - started) / 1000;

      if (elapsed >= duration - 0.03) {
        try {
          svg.setCurrentTime(duration - 0.03);
        } catch (error) {
          /* ignora */
        }
        finish();
        return;
      }

      try {
        svg.setCurrentTime(elapsed);
      } catch (error) {
        finish();
      }
    }

    if (raf) {
      (function loop(timestamp) {
        step(timestamp);
        if (!finished) raf(loop);
      })(window.performance && window.performance.now ? window.performance.now() : Date.now());
    }

    /* Relógio de reserva para ambientes que suspendem o rAF. */
    ticker = window.setInterval(function () {
      step(window.performance && window.performance.now ? window.performance.now() : Date.now());
    }, 32);
  }

  function hideReaction() {
    var overlay = $("#match-reaction");
    if (overlay) {
      overlay.hidden = true;
      overlay.classList.remove("is-leaving");
    }
    var thumbOverlay = $("#match-thumb-reaction");
    if (thumbOverlay) {
      thumbOverlay.hidden = true;
      thumbOverlay.classList.remove("is-leaving");
    }
    restSvg(reactionSvg);
    restSvg(thumbSvg);
  }

  function playReaction(kind, done) {
    var overlay = kind === "highfive" ? $("#match-reaction") : $("#match-thumb-reaction");
    var svg = kind === "highfive" ? reactionSvg : thumbSvg;

    if (!overlay) {
      playSvg(svg, kind, done);
      return;
    }

    overlay.classList.remove("is-leaving");
    overlay.hidden = false;

    playSvg(svg, kind, function () {
      overlay.classList.add("is-leaving");
      window.setTimeout(function () {
        hideReaction();
        done();
      }, 160);
    });
  }

  function initReactions() {
    var data = window.VemLottie;
    if (!data) return;
    thumbSvg = mountLottie($("#match-thumb-reaction-lottie"), data.thumb);
    reactionSvg = mountLottie($("#match-reaction-lottie"), data.highfive);
    hideReaction();
  }

  function advanceMatch(direction) {
    if (!matchCard || matchBusy) return;
    var person = currentPerson();
    if (!person) return;

    matchBusy = true;
    matchCard.classList.add(direction === "like" ? "is-out-right" : "is-out-left");

    window.setTimeout(function () {
      matchIndex += 1;
      matchCard.classList.remove("is-out-left", "is-out-right");
      hideReaction();
      restSvg(thumbSvg);
      renderMatch();
      matchBusy = false;
    }, 320);
  }

  function registerMatch(person, activitySlug) {
    var activity = activitySlug || activityForMatch(person);
    if (!isMatched(person.id)) {
      S.match.matched.push({
        id: person.id,
        activity: activity,
        at: Date.now()
      });
      S.social.pending += 1;
      STORE.save("social");
    }
    save();
    renderSocial();
    refresh();
    updateChatBadge();
  }

  function armConversation(person) {
    if (chatTimer) window.clearTimeout(chatTimer);

    var delay = 7000 + Math.round(Math.random() * 3000);
    toast(person.name + " vai te chamar em instantes…");
    STORE.log("chat:armed", person.id);

    chatTimer = window.setTimeout(function () {
      chatTimer = null;
      if (S.chat && S.chat.personId === person.id) return;

      startChat(person, activityForMatch(person), { open: false });
      toast(person.name + " te mandou uma mensagem.", {
        label: "Abrir",
        onClick: function () {
          openChat(person.id);
        }
      });
      STORE.log("chat:received", person.id);
      updateChatBadge();
      renderSocial();
    }, delay);
  }

  var reacting = false;

  function reducedMotion() {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  /* Conexão (curtida) reutilizável — usada pelo menu radial e pelo perfil da
     pessoa. `activitySlug` opcional liga a conexão a uma atividade específica. */
  function likePerson(person, activitySlug) {
    if (matchBusy || reacting) return;
    if (!person) return;
    if (!guardVerified("conectar")) return;

    var specific = activitySlug || null;
    if (specific) {
      if (!S.favorites.some(function (fav) { return fav.slug === specific; }) && S.favorites.length < 5) {
        S.favorites.push({ slug: specific, label: activityLabel(specific), emoji: activityEmoji(specific) });
      }
      S.match.specifics[specific] = true;
    }

    var mutual = !!person.likedYou;
    reacting = true;

    S.match.likes += 1;
    registerMatch(person, specific);
    STORE.log("match:like", {
      id: person.id,
      likes: S.match.likes,
      mutual: mutual,
      activity: specific || null
    });
    if (mutual) STORE.log("match:mutual", person.id);
    if (specific) STORE.log("match:activity", specific);

    var act = specific || activityForMatch(person);

    function afterReaction() {
      reacting = false;

      if (mutual) {
        if (S.match.matched.length === 3) {
          armConversation(person);
        }

        modal({
          emoji: "🤝",
          title: "Vocês conectaram!",
          text: "Você e " + person.name + " combinaram de treinar " + activityEmoji(act) + " " + activityLabel(act) + ". Bora conversar?",
          primaryLabel: "Iniciar conversa",
          secondaryLabel: "Continuar",
          onConfirm: function () {
            startChat(person, act, { open: true });
            advanceMatch("like");
          },
          onSecondary: function () {
            advanceMatch("like");
          }
        });
        return;
      }

      if (specific) {
        toast(
          "Conexão enviada para treinar " +
          activityEmoji(act) + " " + activityLabel(act) + " com " + person.name + "."
        );
      } else {
        toast("Conexão enviada para " + person.name + ".");
      }

      if (S.match.matched.length === 3) {
        armConversation(person);
      }

      advanceMatch("like");
    }

    if (reducedMotion()) {
      afterReaction();
      return;
    }

    playReaction(mutual ? "highfive" : "thumb", afterReaction);
  }

  if ($("#match-like")) {
    $("#match-like").addEventListener("click", function () {
      likePerson(currentPerson(), null);
    });
  }

  if ($("#match-pass")) {
    $("#match-pass").addEventListener("click", function () {
      advanceMatch("pass");
    });
  }

  /* -----------------------------------------------------------------------
     Menu radial do card de conexão (estilo Pinterest)
     Toque curto → perfil da pessoa · toque longo → menu radial com
     X (passar), conectar (direita) e as atividades da pessoa no arco.
     ----------------------------------------------------------------------- */

  var radial = $("#match-radial");
  var radialChips = $("#match-radial-chips");
  var pressTimer = null;
  var pressStart = null;
  var radialOpen = false;

  function closeRadial() {
    radialOpen = false;
    if (matchCard) matchCard.classList.remove("is-radial-open");
    if (radial) radial.hidden = true;
    clearHover();
  }

  function clearHover() {
    if (!radial) return;
    var h = radial.querySelectorAll(".is-hovered");
    for (var i = 0; i < h.length; i++) h[i].classList.remove("is-hovered");
  }

  function radialPerson() {
    return currentPerson();
  }

  /* Posiciona as pílulas de atividades ao longo de um arco no topo. */
  function layoutRadial(person) {
    if (!radial || !radialChips) return;

    var acts = (person ? person.activities : []).slice(0, 5);
    radialChips.innerHTML = acts.map(function (slug, i) {
      return (
        '<button class="match-radial__action match-radial__chip" type="button" ' +
        'data-radial-action="activity" data-slug="' + esc(slug) + '" ' +
        'aria-label="Conectar para ' + esc(activityLabel(slug)) + '">' +
        '<span class="match-radial__emoji" aria-hidden="true">' + activityEmoji(slug) + "</span>" +
        esc(activityLabel(slug)) +
        "</button>"
      );
    }).join("");

    if (!acts.length) return;

    var w = matchCard ? matchCard.clientWidth : 360;
    var h = matchCard ? matchCard.clientHeight : 520;

    /* Arco suave na faixa superior do card: as pílulas se distribuem na
       horizontal, com as do centro levemente mais altas. */
    var n = acts.length;
    var leftX = w * 0.20;
    var rightX = w * 0.80;
    var baseY = h * 0.30;
    var arcRise = h * 0.12;

    var chips = radialChips.querySelectorAll(".match-radial__chip");
    for (var i = 0; i < chips.length; i++) {
      var t = n === 1 ? 0.5 : i / (n - 1);
      var x = leftX + (rightX - leftX) * t;
      var rise = Math.sin(Math.PI * t) * arcRise;
      var y = baseY - rise;

      chips[i].style.setProperty("--tx", (x - w / 2).toFixed(1) + "px");
      chips[i].style.setProperty("--ty", (y - h / 2).toFixed(1) + "px");
      chips[i].style.transitionDelay = (60 + i * 45) + "ms";
    }
  }

  function openRadial() {
    var person = radialPerson();
    if (!person || !radial) return;
    layoutRadial(person);
    radial.hidden = false;
    radialOpen = true;
    if (matchCard) matchCard.classList.add("is-radial-open");
    if (navigator.vibrate) { try { navigator.vibrate(12); } catch (e) {} }
    STORE.log("match:radial-open", person.id);
  }

  function runRadialAction(el) {
    if (!el) return;
    var person = radialPerson();
    var action = el.getAttribute("data-radial-action");
    closeRadial();

    if (!person) return;

    if (action === "skip") {
      STORE.log("match:radial-skip", person.id);
      advanceMatch("pass");
    } else if (action === "activity") {
      var slug = el.getAttribute("data-slug");
      if (slug) likePerson(person, slug);
    } else {
      likePerson(person, null);
    }
  }

  function actionAt(clientX, clientY) {
    var el = document.elementFromPoint(clientX, clientY);
    if (!el) return null;
    return el.closest(".match-radial__action");
  }

  /* Toque longo abre o menu; toque curto abre o perfil da pessoa. */
  if (matchCard) {
    matchCard.addEventListener("pointerdown", function (event) {
      if (event.button != null && event.button !== 0) return;
      if (event.target.closest(".match-radial")) return;
      if (matchBusy) return;

      pressStart = { x: event.clientX, y: event.clientY };
      pressTimer = window.setTimeout(function () {
        pressTimer = null;
        openRadial();
      }, 420);
    });

    window.addEventListener("pointermove", function (event) {
      if (!pressTimer && !radialOpen) return;

      if (pressTimer && pressStart) {
        var dx = event.clientX - pressStart.x;
        var dy = event.clientY - pressStart.y;
        if (dx * dx + dy * dy > 100) {
          window.clearTimeout(pressTimer);
          pressTimer = null;
        }
      }

      if (radialOpen) {
        clearHover();
        var el = actionAt(event.clientX, event.clientY);
        if (el) el.classList.add("is-hovered");
      }
    });

    window.addEventListener("pointerup", function (event) {
      if (pressTimer) {
        window.clearTimeout(pressTimer);
        pressTimer = null;

        /* Toque curto: abrir o perfil da pessoa. */
        if (event.target.closest(".match-card") && !event.target.closest(".match-radial")) {
          openPersonProfile(currentPerson());
        }
        return;
      }

      if (radialOpen) {
        var el = actionAt(event.clientX, event.clientY);
        runRadialAction(el);
      }
    });

    /* Clicar fora do card (no botão "Ações" ou no botão direito) fecha/cancela. */
    document.addEventListener("click", function (event) {
      if (!radialOpen) return;
      if (event.target.closest(".match-radial")) return;
      closeRadial();
    });
  }

  if ($("#match-actions-open")) {
    $("#match-actions-open").addEventListener("click", function (event) {
      event.stopPropagation();
      if (radialOpen) closeRadial();
      else openRadial();
    });
  }

  /* Perfil da pessoa (toque curto no card). */
  function openPersonProfile(person) {
    if (!person) return;

    var acts = person.activities.map(function (slug) {
      return (
        '<button class="picker-item" type="button" data-person-activity="' + esc(slug) + '">' +
        '<span class="picker-item__emoji" aria-hidden="true">' + activityEmoji(slug) + "</span>" +
        '<span class="picker-item__label">' + esc(activityLabel(slug)) + "</span>" +
        "</button>"
      );
    }).join("");

    var html =
      '<div class="person-profile">' +
      '<img class="person-profile__photo" src="' + esc(person.photo || person.avatar) + '" alt="Foto de ' + esc(person.name) + '">' +
      '<div class="person-profile__head">' +
      '<div><p class="h3">' + esc(person.name) + ", " + esc(String(person.age)) + "</p>" +
      '<p class="tiny mt-1"><span data-icon="pin"></span> ' + esc(person.distance) + " · " + esc(person.area) + "</p></div>" +
      '<span class="badge">' + esc(String(person.compatibility)) + "% combinam</span>" +
      "</div>" +
      '<p class="mb-2">' + esc(person.bio) + "</p>" +
      '<p class="eyebrow">Atividades</p>' +
      '<div class="picker-grid">' + acts + "</div>" +
      '<button class="btn btn--primary btn--block mt-3" type="button" data-person-connect>' +
      "Conectar" +
      "</button>" +
      "</div>";

    openSheet(person.name, html);
    STORE.log("match:profile-open", person.id);
  }

  document.addEventListener("click", function (event) {
    var connectBtn = event.target.closest("[data-person-connect]");
    if (connectBtn) {
      var p = currentPerson();
      closeSheet();
      if (p) likePerson(p, null);
      return;
    }

    var actBtn = event.target.closest("[data-person-activity]");
    if (actBtn) {
      var slug = actBtn.getAttribute("data-person-activity");
      var per = currentPerson();
      closeSheet();
      if (per) likePerson(per, slug);
      return;
    }
  });

  if ($("#match-fab")) {
    $("#match-fab").addEventListener("click", function (event) {
      event.stopPropagation();

      if (!S.favorites.length) {
        STORE.log("match:fab-empty");
        openActivityPicker();
        return;
      }

      var fanout = $("#match-fanout");
      if (fanout && fanout.hidden) openFanout();
      else closeFanout();
    });
  }

  var resetMatch = $("#match-empty-reset");
  if (resetMatch) {
    resetMatch.addEventListener("click", function () {
      S.match.geral = true;
      save();
      renderFanout();
      matchIndex = 0;
      renderMatch();
      toast("Conexões gerais reativadas.");
    });
  }

  document.addEventListener("click", function (event) {
    var toggle = event.target.closest("[data-toggle-match]");
    if (toggle) {
      var slug = toggle.getAttribute("data-toggle-match");

      if (slug === "geral") {
        S.match.geral = !S.match.geral;
      } else {
        S.match.specifics[slug] = !S.match.specifics[slug];
      }

      STORE.log("match:toggle", { slug: slug, on: slug === "geral" ? S.match.geral : S.match.specifics[slug] });
      save();
      matchIndex = 0;
      renderFanout();
      renderMatch();

      if (!S.match.geral && !activeSpecifics().length) {
        toast("Com tudo desligado, você não aparece em nenhuma conexão. Reative pelo menos o geral.", {
          label: "Reativar",
          onClick: function () {
            S.match.geral = true;
            save();
            renderFanout();
            renderMatch();
          }
        });
      }
      return;
    }

    var pick = event.target.closest("[data-pick-activity]");
    if (pick) {
      pickActivity(pick.getAttribute("data-pick-activity"));
      return;
    }

    if (event.target.closest("[data-sheet-close]")) {
      closeSheet();
      return;
    }

    if (!event.target.closest("#match-fanout") && !event.target.closest("#match-fab")) {
      closeFanout();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeFanout();
      closeSheet();
    }
  });

  /* -----------------------------------------------------------------------
     Conversa simulada
     ----------------------------------------------------------------------- */

  function chatEventFor(activity) {
    var direct = EVENTS.filter(function (item) {
      return item.activity === activity;
    })[0];
    if (direct) return direct;
    return EVENTS[0] || null;
  }

  function startChat(person, activity, options) {
    options = options || {};

    var event = chatEventFor(activity);

    if (S.chat && S.chat.personId !== person.id) archiveCurrent();
    if (S.chat && S.chat.personId === person.id) {
      if (options.open !== false) openChat(person.id);
      return;
    }

    S.chat = {
      id: "sim-" + person.id + "-" + Date.now(),
      personId: person.id,
      activity: activity,
      eventId: event ? event.id : null,
      state: "awaiting_yn",
      messages: [
        {
          from: "match",
          text: "Oi! Vi que você também curte " + activityLabel(activity).toLowerCase() + " " + activityEmoji(activity) + ". Bora treinar junto essa semana?",
          ts: Date.now()
        }
      ],
      unread: options.open === false,
      shareCount: 0
    };

    STORE.save("chat");
    STORE.log("chat:start", { person: person.id, activity: activity });
    updateChatBadge();

    if (options.open !== false) {
      S.chat.unread = false;
      STORE.save("chat");
      renderChat();
      go("22");
    }
  }

  /* Conversas antigas ficam arquivadas: abrir outra pessoa não apaga o histórico. */
  function archiveCurrent() {
    if (!S.chat) return;
    S.archive[S.chat.personId] = S.chat;
    S.chat = null;
    STORE.save("archive");
    STORE.save("chat");
  }

  function takeArchived(personId) {
    var archived = S.archive[personId];
    if (!archived) return null;
    delete S.archive[personId];
    STORE.save("archive");
    S.chat = archived;
    STORE.save("chat");
    return archived;
  }

  function chatById(id) {
    if (S.chat && S.chat.id === id) return S.chat;
    var keys = Object.keys(S.archive);
    for (var i = 0; i < keys.length; i += 1) {
      if (S.archive[keys[i]].id === id) return S.archive[keys[i]];
    }
    return null;
  }

  function archivedList() {
    return Object.keys(S.archive)
      .map(function (key) {
        return S.archive[key];
      })
      .sort(function (a, b) {
        var lastA = a.messages[a.messages.length - 1];
        var lastB = b.messages[b.messages.length - 1];
        return (lastB ? lastB.ts : 0) - (lastA ? lastA.ts : 0);
      });
  }

  function openChat(personId) {
    if (!guardVerified("conversar")) return;

    if (S.chat && (!personId || S.chat.personId === personId)) {
      S.chat.unread = false;
      STORE.save("chat");
      updateChatBadge();
      renderChat();
      go("22");
      return;
    }

    if (!personId) {
      var latest = archivedList()[0];
      if (latest) personId = latest.personId;
    }

    var person = personOf(personId) || PEOPLE.marina;
    if (!person) return;

    if (S.archive[person.id]) {
      archiveCurrent();
      takeArchived(person.id);
      S.chat.unread = false;
      STORE.save("chat");
      updateChatBadge();
      renderChat();
      go("22");
      return;
    }

    var activity =
      (S.chat && S.chat.activity) ||
      (S.interests.specific[0] && ACT[S.interests.specific[0]] ? S.interests.specific[0] : null) ||
      person.activities[0] ||
      "yoga";

    if (S.chat && S.chat.personId !== person.id) {
      STORE.log("chat:switch", { from: S.chat.personId, to: person.id });
    }

    startChat(person, activity, { open: true });
  }

  function closeChat() {
    if (!S.chat) return;
    S.chat.unread = false;
    STORE.save("chat");
    updateChatBadge();
  }

  function pushMessage(from, text, extra) {
    if (!S.chat) return;
    var message = { from: from, text: text, ts: Date.now() };
    if (extra) Object.keys(extra).forEach(function (key) {
      message[key] = extra[key];
    });
    S.chat.messages.push(message);
    STORE.save("chat");
    if (currentScreen() === "22") renderChat();
  }

  /* Entrega uma fala do roteiro mesmo se a conversa já estiver arquivada. */
  function deliverTo(chatId, text, extra) {
    var target = chatById(chatId);
    if (!target) return false;

    var message = { from: "match", text: text, ts: Date.now() };
    if (extra) Object.keys(extra).forEach(function (key) {
      message[key] = extra[key];
    });
    target.messages.push(message);

    if (target === S.chat) {
      STORE.save("chat");
      if (currentScreen() === "22") renderChat();
    } else {
      target.unread = true;
      STORE.save("archive");
      STORE.log("chat:queued", target.personId);
      updateChatBadge();
      renderSocial();
    }
    return true;
  }

  function showTyping(on) {
    var typing = $("#chat-typing");
    if (!typing) return;
    typing.hidden = !on;
    if (on) scrollChat();
  }

  function botSay(text, extra, delay) {
    if (!S.chat) return;
    var chatId = S.chat.id;

    showTyping(true);
    window.setTimeout(function () {
      if (S.chat && S.chat.id === chatId) showTyping(false);

      deliverTo(chatId, text, extra);
      if (extra && extra.eventId) addEvent(extra.eventId);
      if (S.chat && S.chat.id === chatId) renderChat();
    }, delay || 800);
  }

  function scrollChat() {
    var scroller = $("#chat-scroll");
    if (scroller) scroller.scrollTop = scroller.scrollHeight;
  }

  function chatStatus() {
    if (!S.chat) return "";
    var event = eventOf(S.chat.eventId);

    if (S.chat.state === "declined") return "Conversa encerrada";
    if (S.chat.state === "scheduled" && event) return "Atividade marcada · " + event.long;
    if (S.chat.state === "scheduled") return "Conversa aberta · sem data marcada";
    return "Primeiro contato";
  }

  function messageHtml(message) {
    if (message.kind === "event") {
      var event = eventOf(message.eventId);
      if (event) {
        return (
          '<div class="chat-msg chat-msg--match">' +
          '<div class="chat-event">' +
          '<img src="' + event.image + '" alt="">' +
          '<div class="chat-event__body">' +
          '<span class="badge badge--amber">' + event.emoji + " " + esc(event.when) + "</span>" +
          '<p class="h3 mt-1">' + esc(event.title) + "</p>" +
          '<p class="tiny">' + esc(event.place) + "</p>" +
          '<button class="btn btn--secondary btn--sm mt-1" type="button" data-nav="23">Ver evento</button>' +
          "</div></div></div>"
        );
      }
    }

    return (
      '<div class="chat-msg chat-msg--' + (message.from === "me" ? "me" : "match") + '">' +
      "<p>" + esc(message.text) + "</p>" +
      "</div>"
    );
  }

  function optionsFor(state) {
    if (state === "awaiting_yn") {
      return [
        { label: "Sim", action: "yes" },
        { label: "Não", action: "no" }
      ];
    }
    if (state === "awaiting_pref") {
      return [
        { label: "Manhã no parque", action: "morning" },
        { label: "Aula à noite", action: "night" }
      ];
    }
    if (state === "awaiting_event") {
      return [
        { label: "Quero participar", action: "accept" },
        { label: "Prefiro outro dia", action: "other" }
      ];
    }
    return [];
  }

  function renderChat() {
    if (!S.chat) {
      var fallback = PEOPLE.marina;
      if (fallback) startChat(fallback, "yoga", { open: false });
      if (!S.chat) return;
    }

    var person = personOf(S.chat.personId) || PEOPLE.marina;
    var activity = activityOf(S.chat.activity);
    var event = eventOf(S.chat.eventId);

    var avatar = $("#chat-avatar");
    if (avatar && person) {
      avatar.src = person.avatar;
      avatar.alt = "Foto de " + person.name;
    }

    var name = $("#chat-name");
    if (name && person) name.textContent = person.name;

    var activityEl = $("#chat-activity");
    if (activityEl) activityEl.textContent = activity.emoji + " " + activity.label + " · " + chatStatus();

    var context = $("#chat-context");
    if (context) {
      var icon = S.chat.state === "scheduled" ? "✓" : S.chat.state === "declined" ? "—" : "🔒";
      context.innerHTML =
        '<span class="chat__context-chip">' + icon + " " + esc(chatStatus()) + "</span>" +
        (event ? '<span class="chat__context-event">' + event.emoji + " " + esc(event.title) + " · " + esc(event.when) + "</span>" : "");
    }

    var host = $("#chat-messages");
    if (host) {
      host.innerHTML = S.chat.messages.map(messageHtml).join("");
      if (window.VemIcons) window.VemIcons.hydrate(host);
    }

    var optionsHost = $("#chat-options");
    if (optionsHost) {
      var options = optionsFor(S.chat.state);
      optionsHost.hidden = !options.length;
      optionsHost.innerHTML = options
        .map(function (option) {
          return '<button class="chat-option" type="button" data-chat-option="' + option.action + '">' + esc(option.label) + "</button>";
        })
        .join("");
    }

    scrollChat();
  }

  function addEvent(id) {
    if (!id) return;
    if (S.events.indexOf(id) === -1) {
      S.events.push(id);
      STORE.save("events");
      STORE.log("event:join", id);
      renderEvents();
      renderSocial();
    }
  }

  function handleOption(action) {
    if (!S.chat) return;

    var name = (personOf(S.chat.personId) || {}).name || "Sua conexão";
    var activity = activityOf(S.chat.activity);
    var event = eventOf(S.chat.eventId);

    if (action === "yes") {
      pushMessage("me", "Sim");
      S.chat.state = "awaiting_pref";
      STORE.save("chat");
      STORE.log("chat:yes");
      botSay("Que bom! Você prefere manhã no parque ou aula à noite?", null, 700);
      renderChat();
      return;
    }

    if (action === "no") {
      pushMessage("me", "Não");
      S.chat.state = "declined";
      STORE.save("chat");
      STORE.log("chat:no");
      botSay("Tranquilo! Em outro momento a gente tenta fazer alguma atividade física. 😊", null, 700);
      renderChat();
      return;
    }

    if (action === "morning" || action === "night") {
      pushMessage("me", action === "morning" ? "Manhã no parque" : "Aula à noite");
      S.chat.state = "awaiting_event";
      STORE.save("chat");
      STORE.log("chat:pref", action);

      if (event) {
        botSay(
          "Ah, tem um evento de " + activity.label.toLowerCase() + " no " + event.place + " " + event.when.toLowerCase() + ". Quer participar? Eu vou!",
          null,
          900
        );
      } else {
        botSay("Boa! Vou procurar um horário e te aviso.", null, 900);
        S.chat.state = "scheduled";
        STORE.save("chat");
      }
      renderChat();
      return;
    }

    if (action === "accept") {
      pushMessage("me", "Quero participar");
      S.chat.state = "scheduled";
      addEvent(S.chat.eventId);
      STORE.save("chat");
      STORE.log("chat:accept", S.chat.eventId);
      botSay("Fechado! Vou te mandar o convite. Nos vemos lá " + activity.emoji, { kind: "event", eventId: S.chat.eventId }, 800);
      renderChat();
      return;
    }

    if (action === "other") {
      pushMessage("me", "Prefiro outro dia");
      S.chat.state = "scheduled";
      STORE.save("chat");
      STORE.log("chat:other");
      botSay("Sem problema! Me chama quando puder que a gente combina. 😊", null, 700);
      renderChat();
    }
  }

  function chatFallback(text) {
    if (!S.chat) return;
    pushMessage("me", text);

    if (S.chat.state === "declined") {
      botSay("Essa conversa foi encerrada, mas a conexão continua aqui. Você pode chamar outra pessoa.", null, 700);
      return;
    }

    var prompts = {
      awaiting_yn: "Boa! Me conta mais — você prefere treinar de manhã ou à noite?",
      awaiting_pref: "Legal! E prefere manhã no parque ou aula à noite?",
      awaiting_event: "Combinado! Quer participar do evento ou prefere outro dia?"
    };

    botSay(prompts[S.chat.state] || "Boa! Me conta mais sobre o seu ritmo de treino.", null, 700);
  }

  var chatForm = $("#chat-form");
  if (chatForm) {
    chatForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var input = $("#chat-input");
      var text = input ? input.value.trim() : "";
      if (!text) return;
      if (input) input.value = "";
      STORE.log("chat:text", text);
      chatFallback(text);
    });
  }

  document.addEventListener("click", function (event) {
    var option = event.target.closest("[data-chat-option]");
    if (option) {
      handleOption(option.getAttribute("data-chat-option"));
      return;
    }

    var share = event.target.closest("#chat-share");
    if (share) {
      openEventPicker();
      return;
    }

    var open = event.target.closest("[data-chat]");
    if (open) {
      openChat(open.getAttribute("data-chat"));
    }
  });

  function openEventPicker() {
    if (!S.chat) return;

    var html =
      '<p class="tiny mb-2">Escolha um evento para enviar no chat. Se a conexão aceitar, ele entra em Meus eventos.</p>' +
      '<div class="picker-list">' +
      EVENTS.map(function (event) {
        return (
          '<button class="picker-row" type="button" data-share-event="' + event.id + '">' +
          '<span class="picker-row__emoji" aria-hidden="true">' + event.emoji + "</span>" +
          '<span class="picker-row__body"><strong>' + esc(event.title) + "</strong><small>" + esc(event.when) + " · " + esc(event.place) + "</small></span>" +
          '<span class="picker-row__action">Enviar</span>' +
          "</button>"
        );
      }).join("") +
      "</div>";

    openSheet("Compartilhar evento", html);
  }

  function shareEvent(eventId) {
    if (!S.chat) return;
    var event = eventOf(eventId);
    if (!event) return;

    closeSheet();
    pushMessage("me", "Olha esse evento: " + event.title, { kind: "event", eventId: event.id });
    addEvent(event.id);
    S.chat.shareCount += 1;
    S.chat.eventId = event.id;
    STORE.save("chat");
    STORE.log("chat:share", event.id);

    var accept = S.chat.shareCount % 2 === 1;
    if (event.activity === S.chat.activity) accept = true;

    if (accept) {
      S.chat.state = "scheduled";
      STORE.save("chat");
      botSay("Adorei! Pode contar comigo. Vou confirmar lá no evento também. 🙌", null, 900);
    } else {
      botSay("Esse horário não rola pra mim, mas topo no fim de semana. Tem outro evento parecido?", null, 900);
    }

    renderChat();
  }

  document.addEventListener("click", function (event) {
    var share = event.target.closest("[data-share-event]");
    if (share) shareEvent(share.getAttribute("data-share-event"));
  });

  function updateChatBadge() {
    var badge = $("#social-tab-badge");
    if (!badge) return;

    var unread = S.chat && S.chat.unread ? 1 : 0;
    Object.keys(S.archive).forEach(function (key) {
      if (S.archive[key].unread) unread += 1;
    });

    var total = unread + (S.social.pending || 0);

    badge.hidden = total === 0;
    badge.textContent = String(total);
  }

  function maybeNudge() {
    if (!S.chat || S.chat.unread) return;
    if (S.chat.state === "declined" || S.chat.state === "scheduled") return;

    var last = S.chat.messages[S.chat.messages.length - 1];
    if (!last || last.from !== "match") return;
    if (Date.now() - last.ts < 120000) return;
    if (last.nudge) return;

    last.nudge = true;
    S.chat.messages.push({
      from: "match",
      text: "Oi! Ainda topa treinar essa semana? 😊",
      ts: Date.now(),
      nudge: true
    });
    S.chat.unread = true;
    STORE.save("chat");
    updateChatBadge();
  }

  /* -----------------------------------------------------------------------
     Social — conexões, grupos e eventos
     ----------------------------------------------------------------------- */

  function connectionRow(id) {
    var person = personOf(id);
    if (!person) return "";

    var activity = null;
    S.match.matched.forEach(function (item) {
      if (item.id === id) activity = item.activity;
    });
    var act = activity ? activityOf(activity) : activityOf(person.activities[0]);

    return (
      '<div class="list-row">' +
      '<div class="avatar avatar--ring" style="--ring: ' + person.ring + '"><img src="' + person.avatar + '" alt="Foto de ' + esc(person.name) + '" data-avatar="' + person.id + '"></div>' +
      '<div class="list-row__body">' +
      '<span class="list-row__title">' + esc(person.name) + "</span>" +
      '<span class="list-row__sub">' + act.emoji + " Conexão em " + esc(act.label) + " · " + esc(person.distance) + "</span>" +
      "</div>" +
      '<button class="iconbtn iconbtn--surface" type="button" data-chat="' + person.id + '" aria-label="Conversar com ' + esc(person.name) + '">' +
      '<span data-icon="message"></span>' +
      "</button>" +
      "</div>"
    );
  }

  function emptyState(icon, title, text, action) {
    return (
      '<div class="empty">' +
      '<span data-icon="' + icon + '"></span>' +
      '<p class="h3">' + esc(title) + "</p>" +
      '<p class="tiny">' + esc(text) + "</p>" +
      (action
        ? '<button class="btn btn--secondary btn--sm" type="button" data-nav="' + action.target + '">' + esc(action.label) + "</button>"
        : "") +
      "</div>"
    );
  }

  function renderConnections() {
    var host = $("#social-connections");
    if (!host) return;

    var ids = matchedIds();
    var count = $("#social-tab-connections");
    if (count) count.textContent = String(ids.length);

    var total = $("#social-count");
    if (total) total.textContent = ids.length + (ids.length === 1 ? " conexão" : " conexões");

    if (!ids.length) {
      host.innerHTML = emptyState("users", "Nenhuma conexão ainda", "Conecte na aba Conexões para começar sua turma.", { target: "12", label: "Ver pessoas" });
    } else {
      host.innerHTML = '<div class="social__list">' + ids.map(connectionRow).join("") + "</div>";
    }

    if (window.VemIcons) window.VemIcons.hydrate(host);
  }

  function renderGroups() {
    var host = $("#social-groups");
    if (!host) return;

    var ids = matchedIds();
    var visible = GROUPS.filter(function (group) {
      return group.members.some(function (id) {
        return ids.indexOf(id) !== -1;
      });
    });

    var count = $("#social-tab-groups");
    if (count) count.textContent = String(visible.length);

    if (!visible.length) {
      host.innerHTML = emptyState("users", "Nenhum grupo por enquanto", "Um grupo aparece quando alguém com quem você se conectou já está nele.", { target: "12", label: "Conectar" });
      if (window.VemIcons) window.VemIcons.hydrate(host);
      return;
    }

    host.innerHTML = visible.map(function (group) {
      var joined = S.groups.indexOf(group.id) !== -1;
      var inside = group.members.filter(function (id) {
        return ids.indexOf(id) !== -1;
      }).map(function (id) {
        return (PEOPLE[id] || {}).name;
      }).filter(Boolean);

      return (
        '<div class="group-card">' +
        '<span class="circle ' + group.tint + '"><span class="group-card__emoji" aria-hidden="true">' + group.emoji + "</span></span>" +
        '<div class="group-card__body">' +
        '<p class="h3">' + esc(group.name) + "</p>" +
        '<p class="tiny">' + esc(group.detail) + "</p>" +
        '<p class="group-card__context">' + (inside.length ? esc(labelFor(inside)) + (inside.length > 1 ? " estão" : " está") + " aqui" : "Conexão confirmada") + "</p>" +
        "</div>" +
        '<button class="btn ' + (joined ? "btn--ghost" : "btn--secondary") + ' btn--sm group-card__cta" type="button" data-join-group="' + group.id + '"' + (joined ? " disabled" : "") + ">" +
        (joined ? "Participando" : "Entrar") +
        "</button>" +
        "</div>"
      );
    }).join("");
  }

  function eventCard(event, options) {
    options = options || {};
    var confirmed = event.confirmed
      .map(function (id) {
        var person = PEOPLE[id];
        if (!person) return "";
        return '<span class="avatar"><img src="' + person.avatar + '" alt="" data-avatar="' + person.id + '"></span>';
      })
      .join("");

    return (
      '<article class="event-ticket">' +
      '<div class="event-ticket__media"><img src="' + event.image + '" alt="">' +
      '<span class="badge badge--glass">' + event.emoji + " " + esc(event.when) + "</span></div>" +
      '<div class="event-ticket__body">' +
      '<p class="h3">' + esc(event.title) + "</p>" +
      '<p class="tiny mt-1">' + esc(event.place) + " · " + esc(event.duration) + "</p>" +
      '<div class="event-ticket__foot">' +
      '<div class="avatar-stack" aria-hidden="true">' + confirmed + "</div>" +
      '<div class="event-ticket__actions">' +
      (options.toggle
        ? '<button class="btn btn--ghost btn--sm" type="button" data-event-toggle="' + event.id + '">' +
          (S.events.indexOf(event.id) === -1 ? "Inscrever-se" : "Desinscrever") +
          "</button>"
        : "") +
      (options.share
        ? '<button class="btn btn--secondary btn--sm" type="button" data-share-to-chat="' + event.id + '">Compartilhar</button>'
        : '<button class="btn btn--ghost btn--sm" type="button" data-nav="23">Ver evento</button>') +
      "</div></div></div></article>"
    );
  }

  function renderSocialEvents() {
    var host = $("#social-events");
    if (!host) return;

    var count = $("#social-tab-events");
    if (count) count.textContent = String(S.events.length);

    var list = S.events.map(eventOf).filter(Boolean);

    if (!list.length) {
      host.innerHTML = emptyState("calendar", "Nenhum evento confirmado", "Entre em uma atividade para ela aparecer aqui.", { target: "13", label: "Ver atividades" });
      if (window.VemIcons) window.VemIcons.hydrate(host);
      return;
    }

    host.innerHTML = list.map(function (event) {
      return eventCard(event, { share: true, toggle: true });
    }).join("");
  }

  function renderEvents() {
    var host = $("#events-list");
    if (!host) return;

    var list = S.events.map(eventOf).filter(Boolean);

    if (!list.length) {
      host.innerHTML = emptyState("calendar", "Sua agenda está vazia", "Confirme uma atividade para guardar o evento aqui.", { target: "13", label: "Encontrar atividades" });
      if (window.VemIcons) window.VemIcons.hydrate(host);
      return;
    }

    host.innerHTML = list.map(function (event) {
      return eventCard(event, { share: true, toggle: true });
    }).join("");
  }

  function renderSocial() {
    renderConnections();
    renderGroups();
    renderSocialEvents();
    renderEvents();
    maybeNudge();
    updateChatBadge();
  }

  document.addEventListener("click", function (event) {
    var join = event.target.closest("[data-join-group]");
    if (join) {
      if (!guardVerified("entrar em grupos")) return;
      var id = join.getAttribute("data-join-group");
      if (S.groups.indexOf(id) === -1) {
        S.groups.push(id);
        STORE.save("groups");
        STORE.log("group:join", id);
        toast("Você entrou no grupo. Os encontros aparecem em Meus eventos.");
      }
      renderGroups();
      refresh();
      return;
    }

    var share = event.target.closest("[data-share-to-chat]");
    if (share) {
      var eventId = share.getAttribute("data-share-to-chat");
      var people = matchedIds();

      if (!people.length) {
        toast("Conecte com alguém antes de compartilhar um evento.");
        return;
      }

      if (S.chat) {
        openChat(S.chat.personId);
        window.setTimeout(function () {
          shareEvent(eventId);
        }, 120);
        return;
      }

      openSheet(
        "Compartilhar com quem?",
        '<div class="picker-list">' +
          people.map(function (id) {
            var person = personOf(id);
            return (
              '<button class="picker-row" type="button" data-share-with="' + id + '" data-event="' + eventId + '">' +
              '<span class="picker-row__emoji"><img class="picker-row__avatar" src="' + person.avatar + '" alt=""></span>' +
              '<span class="picker-row__body"><strong>' + esc(person.name) + "</strong><small>Conexão em " + esc(activityLabel((S.match.matched.filter(function (m) { return m.id === id; })[0] || {}).activity || person.activities[0])) + "</small></span>" +
              '<span class="picker-row__action">Enviar</span>' +
              "</button>"
            );
          }).join("") +
          "</div>"
      );
      return;
    }

    var shareWith = event.target.closest("[data-share-with]");
    if (shareWith) {
      var personId = shareWith.getAttribute("data-share-with");
      var evId = shareWith.getAttribute("data-event");
      closeSheet();
      openChat(personId);
      window.setTimeout(function () {
        shareEvent(evId);
      }, 120);
    }
  });

  /* -----------------------------------------------------------------------
     Atividades — participar/desinscrever guarda ou remove o evento
     ----------------------------------------------------------------------- */

  var ACTIVITY_EVENT_MAP = {
    corrida: "evento-corrida",
    yoga: "evento-yoga",
    forca: "evento-forca",
    natacao: "evento-natacao"
  };

  function renderActivityButtons() {
    $$(".activity").forEach(function (card) {
      var cat = card.getAttribute("data-cat");
      var id = ACTIVITY_EVENT_MAP[cat];
      var button = card.querySelector(".btn");
      if (!button || !id) return;

      var subscribed = isSubscribed(id);
      button.textContent = subscribed ? "Desinscrever" : "Participar";
      button.classList.toggle("btn--primary", !subscribed);
      button.classList.toggle("btn--ghost", subscribed);
    });
  }

  document.addEventListener("click", function (event) {
    var button = event.target.closest(".activity .btn");
    if (!button) return;

    var card = button.closest(".activity");
    if (!card) return;

    var cat = card.getAttribute("data-cat");
    var id = ACTIVITY_EVENT_MAP[cat];
    if (!id) return;

    if (isSubscribed(id)) {
      unsubscribeEvent(id);
    } else {
      subscribeEvent(id);
    }
    renderActivityButtons();
    STORE.log("activity:join", id);
  });

  /* -----------------------------------------------------------------------
     Feed — sinais de atividade
     ----------------------------------------------------------------------- */

  function signal(slug) {
    if (!slug) return;
    S.signals[slug] = (S.signals[slug] || 0) + 1;
    STORE.save("signals");
    STORE.log("feed:signal", slug);
    renderSignals();
  }

  document.addEventListener("click", function (event) {
    var action = event.target.closest("[data-like], [data-save]");
    if (!action) return;

    var post = action.closest(".post");
    var media = post ? post.querySelector("[data-post-activity]") : null;
    if (!media) return;

    signal(media.getAttribute("data-post-activity"));
  });

  document.addEventListener("click", function (event) {
    var remove = event.target.closest("[data-signal-remove]");
    if (!remove) return;

    var slug = remove.getAttribute("data-signal-remove");
    delete S.signals[slug];
    STORE.save("signals");
    renderSignals();
    toast("Sinal removido. As conexões deixam de considerar essa atividade.");
  });

  /* -----------------------------------------------------------------------
     Configurações — reset e exportação
     ----------------------------------------------------------------------- */

  document.addEventListener("click", function (event) {
    if (event.target.closest("[data-export-log]")) {
      STORE.log("log:export");
      STORE.downloadLog();
      toast("Log do teste exportado em JSON.");
      return;
    }

    if (event.target.closest("[data-reset-test]")) {
      toast("Reiniciar apaga perfil, conexões, conversas e eventos deste navegador.", {
        label: "Reiniciar",
        onClick: function () {
          STORE.reset();
          window.location.href = window.location.pathname + "?tela=01";
        }
      });
    }
  });

  /* -----------------------------------------------------------------------
     v3 — modal, inscrição em eventos, badge do Social e tutorial do Vem
     ----------------------------------------------------------------------- */

  function modal(options) {
    if (window.VemUI && window.VemUI.modal) window.VemUI.modal(options);
  }

  function isSubscribed(id) {
    return S.events.indexOf(id) !== -1;
  }

  function removeEvent(id) {
    S.events = S.events.filter(function (item) {
      return item !== id;
    });
    STORE.save("events");
    STORE.log("event:leave", id);
    renderEvents();
    renderSocial();
    renderFeedEvents();
    renderActivityButtons();
    toast("Você saiu do evento.");
  }

  function subscribeEvent(id) {
    if (S.events.indexOf(id) === -1) {
      S.events.push(id);
      STORE.save("events");
      STORE.log("event:join", id);
    }
    renderEvents();
    renderSocial();
    renderFeedEvents();
    renderActivityButtons();
    toast("Inscrição confirmada. O evento está em Meus eventos.");
  }

  /* Inscrever não pede confirmação (reversível e de baixo risco); desinscrever
     pede, porque remove um compromisso já assumido. */
  function unsubscribeEvent(id) {
    var event = eventOf(id);
    var title = event ? event.title : "evento";
    modal({
      emoji: "🗓️",
      title: "Desinscrever do evento?",
      text: "Você vai sair de “" + title + "”. Pode se inscrever de novo quando quiser.",
      primaryLabel: "Desinscrever",
      danger: true,
      secondaryLabel: "Cancelar",
      onConfirm: function () {
        removeEvent(id);
      }
    });
  }

  document.addEventListener("click", function (event) {
    var toggle = event.target.closest("[data-event-toggle]");
    if (!toggle) return;
    var id = toggle.getAttribute("data-event-toggle");
    if (isSubscribed(id)) unsubscribeEvent(id);
    else subscribeEvent(id);
  });

  function feedEventCard(event) {
    var subscribed = isSubscribed(event.id);
    return (
      '<article class="feed-event" data-event-activity="' + event.activity + '">' +
      '<div class="feed-event__media"><img src="' + event.image + '" alt=""></div>' +
      '<div class="feed-event__body">' +
      '<p class="feed-event__title">' + esc(event.title) + "</p>" +
      '<p class="feed-event__meta">' + event.emoji + " " + esc(event.when) + " · " + esc(event.place) + "</p>" +
      "</div>" +
      '<button class="btn btn--' + (subscribed ? "ghost" : "primary") + ' btn--sm" type="button" data-event-toggle="' + event.id + '">' +
      (subscribed ? "Desinscrever" : "Inscrever-se") +
      "</button>" +
      "</article>"
    );
  }

  function renderFeedEvents() {
    var host = $("#feed-events");
    if (!host) return;
    host.innerHTML =
      '<p class="feed__events-title">Eventos perto de você</p>' +
      EVENTS.map(feedEventCard).join("");
  }

  /* Ao visitar o Social, as pendências de conexão deixam de marcar a badge. */
  document.addEventListener("vem:visited-social", function () {
    if (S.social.pending) {
      S.social.pending = 0;
      STORE.save("social");
      updateChatBadge();
    }
  });

  /* -----------------------------------------------------------------------
     Tutorial do Vem — mascote com balões de fala
     ----------------------------------------------------------------------- */

  function showBubble(text, actions) {
    var bubble = $("#vem-bubble");
    if (!bubble) return;
    var textEl = $("#vem-bubble-text");
    var actionsEl = $("#vem-bubble-actions");

    if (textEl) textEl.textContent = text;
    if (actionsEl) {
      actionsEl.innerHTML = "";
      (actions || []).forEach(function (action) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn btn--" + (action.primary ? "primary" : "ghost");
        btn.textContent = action.label;
        btn.onclick = action.onClick;
        actionsEl.appendChild(btn);
      });
    }
    bubble.hidden = false;
  }

  function hideBubble() {
    var bubble = $("#vem-bubble");
    if (bubble) bubble.hidden = true;
  }

  function simulateVemMatch() {
    hideBubble();

    var vem = personOf("vem") || PEOPLE.vem;
    if (!vem) return;

    if (!isMatched("vem")) {
      S.match.matched.push({ id: "vem", activity: "corrida", at: Date.now() });
      S.match.likes += 1;
      S.social.pending += 1;
      STORE.save("match");
      STORE.save("social");
    }

    STORE.log("tour:simulate-match", "vem");
    renderSocial();
    refresh();
    updateChatBadge();

    /* Cria a conversa com o Vem (não lida) para acender a badge do Social. */
    if (!S.chat || S.chat.personId !== "vem") {
      startChat(vem, "corrida", { open: false });
    }

    S.tour.step = 2;
    STORE.save("tour");

    showBubble(
      "🎉 Conectamos! (Eu sou o Vem.) Agora veja como funciona uma conversa — vai aparecer um aviso no Social.",
      [
        {
          label: "Abrir Social",
          primary: true,
          onClick: function () {
            S.tour.step = 3;
            STORE.save("tour");
            hideBubble();
            go("14");
          }
        }
      ]
    );
  }

  function runTour(id) {
    if (S.tour.done) {
      hideBubble();
      return;
    }

    if (id === "10" && S.tour.step === 0) {
      showBubble(
        "Oi! Eu sou o Vem 👋 Que tal conhecer as Conexões? É onde você encontra gente para treinar. (Dica: você pode dar feedback em Configurações.)",
        [
          {
            label: "Começar tour",
            primary: true,
            onClick: function () {
              S.tour.step = 1;
              STORE.save("tour");
              hideBubble();
              go("12");
            }
          },
          {
            label: "Agora não",
            onClick: function () {
              S.tour.done = true;
              STORE.save("tour");
              hideBubble();
            }
          }
        ]
      );
      return;
    }

    if (id === "12" && S.tour.step === 1) {
      showBubble(
        "É aqui que você conhece gente. Toque e segure um card para abrir as ações, ou toque rápido para ver o perfil. Vamos simular uma conexão comigo?",
        [
          { label: "Simular conexão", primary: true, onClick: simulateVemMatch },
          { label: "Entendi", onClick: hideBubble }
        ]
      );
      return;
    }

    if (id === "14" && S.tour.step === 3) {
      showBubble(
        "Sua conexão está aqui no Social. Toque na conversa para continuar. 🎉",
        [{ label: "Entendi", primary: true, onClick: hideBubble }]
      );
      return;
    }

    hideBubble();
  }

  var vemBubbleClose = $("#vem-bubble-close");
  if (vemBubbleClose) {
    vemBubbleClose.addEventListener("click", hideBubble);
  }

  /* -----------------------------------------------------------------------
     Navegação e inicialização
     ----------------------------------------------------------------------- */

  document.addEventListener("vem:screen", function (event) {
    var id = event.detail && event.detail.id;

    if (id === "03") renderVerificationState();
    if (id === "04") hydrateProfileForm();
    if (id === "06") hydrateInterests();
    if (id === "10") refresh();
    if (id === "11") refresh();
    if (id === "12") renderMatch();
    if (id === "13") renderActivityButtons();
    if (id === "14") renderSocial();
    if (id === "19") refresh();
    if (id === "21") renderCref();
    if (id === "22") {
      if (S.chat) S.chat.unread = false;
      STORE.save("chat");
      updateChatBadge();
      renderChat();
    }
    if (id === "23") renderEvents();

    if (id === "22" && S.tour.step === 3) {
      S.tour.done = true;
      STORE.save("tour");
      hideBubble();
    }

    if (id === "14" || id === "22") {
      document.dispatchEvent(new CustomEvent("vem:visited-social"));
    }

    runTour(id);
  });

  /* Objetivo professor → documentação antes dos interesses. */
  var objectiveContinue = $("#objective-continue");
  if (objectiveContinue) {
    objectiveContinue.addEventListener("click", function () {
      if (objectiveContinue.disabled) return;

      var goal = null;
      try {
        goal = window.localStorage.getItem(STORE.KEYS.goal);
      } catch (error) {
        goal = null;
      }

      if (goal === "teacher" && S.profile.educator !== "pending") {
        go("21");
        return;
      }

      go("06");
    });
  }

  /* Restaura a foto e os dados do perfil no formulário ao abrir a tela 04. */
  if (currentScreen() === "04") hydrateProfileForm();

  /* Boot */
  renderVerificationState();
  hydrateInterests();
  initReactions();
  renderFanout();
  renderMatch();
  renderSocial();
  renderCref();
  renderFeedEvents();
  renderActivityButtons();
  updateChatBadge();
  refresh();

  window.VemSocial = {
    refresh: refresh,
    renderSocial: renderSocial,
    renderEvents: renderEvents,
    openChat: openChat,
    startChat: startChat,
    openVerification: openVerification,
    signal: signal
  };
})();
