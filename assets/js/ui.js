/* =========================================================================
   VEM — Interações do protótipo
   Tudo aqui é demonstração: nenhum dado sai do navegador.
   ========================================================================= */

(function () {
  "use strict";

  var DATA = window.VEM_DATA || {};
  var AVATAR = DATA.avatar || "assets/img/avatar.jpg";
  var AVATAR_2 = DATA.avatar2 || "assets/img/avatar_2.jpg";
  var toastTimer = null;

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $$(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  /* -----------------------------------------------------------------------
     Avatares — alterna os dois placeholders entre as pessoas do app
     (o avatar do próprio usuário fica fixo em avatar.jpg)
     ----------------------------------------------------------------------- */

  function alternateAvatars() {
    var index = 0;

    $$(".avatar img").forEach(function (image) {
      /* Fotos reais de pessoas têm prioridade e não entram no rodízio. */
      if (image.hasAttribute("data-avatar")) return;
      if (image.id === "pf-avatar" || image.closest(".avatar-upload")) return;
      if (image.closest("[data-nav='11']")) return;

      image.src = index % 2 ? AVATAR_2 : AVATAR;
      index++;
    });
  }

  /* -----------------------------------------------------------------------
     Toast / feedback global
     ----------------------------------------------------------------------- */

  function hideToast() {
    var el = $("#toast");
    if (!el) return;
    el.classList.remove("is-visible");
    window.clearTimeout(toastTimer);
  }

  function toast(message, action) {
    var el = $("#toast");
    var text = $("#toast-text");
    var btn = $("#toast-action");
    if (!el || !text || !btn) return;

    window.clearTimeout(toastTimer);
    text.textContent = message;

    if (action) {
      btn.hidden = false;
      btn.textContent = action.label || "Desfazer";
      btn.onclick = function () {
        hideToast();
        if (typeof action.onClick === "function") action.onClick();
      };
    } else {
      btn.hidden = true;
      btn.onclick = null;
    }

    el.classList.add("is-visible");
    toastTimer = window.setTimeout(hideToast, action ? 5600 : 3400);
  }

  /* Qualquer elemento com data-toast vira um gatilho de feedback. */
  document.addEventListener("click", function (event) {
    var trigger = event.target.closest("[data-toast]");
    if (!trigger) return;
    if (trigger.tagName === "A") event.preventDefault();
    toast(trigger.getAttribute("data-toast"));
  });

  /* -----------------------------------------------------------------------
     Chips de objetivo e interesse
     ----------------------------------------------------------------------- */

  function syncChipGroup(group) {
    var chips = $$('[data-chip][data-chip-group="' + group + '"]');
    var selected = chips.filter(function (chip) {
      return chip.getAttribute("aria-pressed") === "true";
    });
    var counter = $('[data-chip-counter="' + group + '"]');

    if (counter) {
      counter.innerHTML = selected.length
        ? "<strong>" + selected.length + "</strong> selecionado" + (selected.length > 1 ? "s" : "")
        : "Nenhum selecionado";
    }

    var action = group === "objective" ? $("#objective-continue") : $("#interest-continue");
    if (action) action.disabled = selected.length === 0;
  }

  $$("[data-chip]").forEach(function (chip) {
    chip.addEventListener("click", function () {
      chip.setAttribute("aria-pressed", chip.getAttribute("aria-pressed") === "true" ? "false" : "true");
      syncChipGroup(chip.getAttribute("data-chip-group"));
    });
  });

  /* -----------------------------------------------------------------------
     Criar perfil — validação e foto
     ----------------------------------------------------------------------- */

  var pfName = $("#pf-name");
  var pfEmail = $("#pf-email");
  var pfBirth = $("#pf-birth");
  var pfContinue = $("#profile-continue");

  function fieldOf(input) {
    return input ? input.closest(".field") : null;
  }

  function markField(input, invalid) {
    var field = fieldOf(input);
    if (field) field.classList.toggle("is-invalid", !!invalid);
  }

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(String(value).trim());
  }

  function birthAge(value) {
    var match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(value).trim());
    if (!match) return null;

    var day = Number(match[1]);
    var month = Number(match[2]);
    var year = Number(match[3]);
    var date = new Date(year, month - 1, day);

    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
      return null;
    }

    var now = new Date();
    var age = now.getFullYear() - year;
    var beforeBirthday =
      now.getMonth() < month - 1 || (now.getMonth() === month - 1 && now.getDate() < day);
    if (beforeBirthday) age -= 1;

    if (age < 13 || age > 110) return null;
    return age;
  }

  function profileState() {
    return {
      name: pfName ? pfName.value.trim().length >= 3 : false,
      email: pfEmail ? validEmail(pfEmail.value) : false,
      birth: pfBirth ? birthAge(pfBirth.value) !== null : false
    };
  }

  function updateProfile() {
    if (!pfContinue) return;
    var state = profileState();
    pfContinue.disabled = !(state.name && state.email && state.birth);
  }

  function validateProfile() {
    var state = profileState();
    if (pfName) markField(pfName, pfName.value.trim() !== "" && !state.name);
    if (pfEmail) markField(pfEmail, pfEmail.value.trim() !== "" && !state.email);
    if (pfBirth) markField(pfBirth, pfBirth.value.trim().length === 10 && !state.birth);
  }

  if (pfBirth) {
    pfBirth.addEventListener("input", function () {
      var digits = pfBirth.value.replace(/\D/g, "").slice(0, 8);
      if (digits.length > 4) {
        pfBirth.value = digits.slice(0, 2) + "/" + digits.slice(2, 4) + "/" + digits.slice(4);
      } else if (digits.length > 2) {
        pfBirth.value = digits.slice(0, 2) + "/" + digits.slice(2);
      } else {
        pfBirth.value = digits;
      }
      updateProfile();
    });
  }

  [pfName, pfEmail, pfBirth].forEach(function (input) {
    if (!input) return;
    input.addEventListener("input", updateProfile);
    input.addEventListener("blur", validateProfile);
  });

  var avatarButton = $("#avatar-btn");
  var avatarInput = $("#avatar-input");
  var avatarPreview = $("#pf-avatar");

  if (avatarButton && avatarInput) {
    avatarButton.addEventListener("click", function () {
      avatarInput.click();
    });
  }

  if (avatarInput && avatarPreview) {
    avatarInput.addEventListener("change", function () {
      var file = avatarInput.files && avatarInput.files[0];
      if (!file) return;

      if (!/^image\//.test(file.type)) {
        toast("Escolha um arquivo de imagem.");
        return;
      }

      var reader = new FileReader();
      reader.onload = function () {
        avatarPreview.src = String(reader.result);
        toast("Foto de perfil atualizada.");
      };
      reader.readAsDataURL(file);
    });
  }

  /* -----------------------------------------------------------------------
     Senha — força, requisitos e confirmação
     ----------------------------------------------------------------------- */

  var pw = $("#pw");
  var pwConfirm = $("#pw2");
  var pwSubmit = $("#password-submit");
  var pwStrength = $("#pw-strength");
  var pwConfirmField = $("#pw-confirm-field");

  function updatePassword() {
    if (!pw) return;

    var value = pw.value;
    var rules = {
      length: value.length >= 8,
      letter: /[A-Za-z\u00C0-\u024F]/.test(value),
      number: /\d/.test(value)
    };

    $$("[data-pw-rule]").forEach(function (rule) {
      rule.classList.toggle("is-ok", !!rules[rule.getAttribute("data-pw-rule")]);
    });

    var score = 0;
    if (rules.length) score += 1;
    if (rules.letter) score += 1;
    if (rules.number) score += 1;
    if (score === 3 && value.length >= 12) score = 4;

    $$(".pw-meter__seg").forEach(function (segment, index) {
      segment.classList.remove("is-on", "is-mid");
      if (index < score) segment.classList.add(score >= 4 ? "is-on" : "is-mid");
    });

    var labels = ["Ainda não preenchida.", "Senha fraca.", "Senha razoável.", "Senha boa.", "Senha forte."];
    if (pwStrength) pwStrength.textContent = labels[value ? Math.max(1, score) : 0];

    var filled = pwConfirm ? pwConfirm.value : "";
    var mismatch = filled !== "" && filled !== value;
    if (pwConfirmField) pwConfirmField.classList.toggle("is-invalid", mismatch);

    var ready =
      rules.length &&
      rules.letter &&
      rules.number &&
      filled === value &&
      value !== "";

    if (pwSubmit) pwSubmit.disabled = !ready;
  }

  if (pw) {
    pw.addEventListener("input", updatePassword);
  }

  if (pwConfirm) {
    pwConfirm.addEventListener("input", updatePassword);
    pwConfirm.addEventListener("blur", function () {
      if (pwConfirmField && pwConfirm.value !== "" && pwConfirm.value !== pw.value) {
        pwConfirmField.classList.add("is-invalid");
      }
    });
  }

  $$("[data-toggle-pw]").forEach(function (button) {
    button.addEventListener("click", function () {
      var input = document.getElementById(button.getAttribute("data-toggle-pw"));
      if (!input) return;

      var show = input.type === "password";
      input.type = show ? "text" : "password";
      button.innerHTML = window.VemIcons.icon(show ? "eye-off" : "eye");
      button.setAttribute("aria-label", show ? "Ocultar senha" : "Mostrar senha");
    });
  });

  /* -----------------------------------------------------------------------
     Segmented controls (Social, Feed e cobrança)
     ----------------------------------------------------------------------- */

  $$("[data-segmented]").forEach(function (group) {
    var name = group.getAttribute("data-segmented");
    var buttons = $$("[data-seg-value]", group);

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var value = button.getAttribute("data-seg-value");

        buttons.forEach(function (other) {
          other.setAttribute("aria-selected", other === button ? "true" : "false");
        });

        $$("[data-seg-panel]").forEach(function (panel) {
          var key = panel.getAttribute("data-seg-panel");
          if (key.indexOf(name + ":") !== 0) return;
          panel.hidden = key !== name + ":" + value;
        });
      });
    });
  });

  /* -----------------------------------------------------------------------
     Switches de notificações
     ----------------------------------------------------------------------- */

  $$(".switch[role='switch']").forEach(function (control) {
    control.addEventListener("click", function () {
      var on = control.getAttribute("aria-checked") === "true";
      control.setAttribute("aria-checked", on ? "false" : "true");
      var label = control.getAttribute("aria-label") || "Notificação";
      toast(label + (on ? " desligada." : " ligada."));
    });
  });

  /* -----------------------------------------------------------------------
     Match — deck de pessoas
     ----------------------------------------------------------------------- */

  var matches = DATA.matches || [];
  var matchIndex = 0;
  var matchCard = $("#match-card");

  function currentMatch() {
    return matches[matchIndex % matches.length];
  }

  function renderMatch() {
    if (!matchCard || !matches.length) return;

    var match = currentMatch();
    var photo = $("#match-photo");
    var image = $("#match-img");
    var compatibility = $("#match-compat");
    var name = $("#match-name");
    var age = $("#match-age");
    var distance = $("#match-dist");
    var area = $("#match-area");
    var bio = $("#match-bio");
    var tags = $("#match-tags");
    var star = $("#match-star");

    if (photo) photo.style.background = match.tint;
    if (image) {
      image.src = match.avatar || AVATAR;
      image.alt = "Foto de " + match.name;
    }
    if (compatibility) compatibility.textContent = match.compatibility + "% combinam";
    if (name) name.textContent = match.name;
    if (age) age.textContent = String(match.age);
    if (distance) distance.textContent = match.distance;
    if (area) area.textContent = match.area;
    if (bio) bio.textContent = match.bio;
    if (tags) {
      tags.innerHTML = match.tags
        .map(function (tag) {
          return '<span class="tag">' + tag + "</span>";
        })
        .join("");
    }
    if (star) {
      star.setAttribute("aria-pressed", "false");
      star.classList.remove("is-starred");
    }
  }

  function swipeMatch(direction) {
    if (!matchCard || !matches.length) return;
    if (matchCard.dataset.busy === "1") return;

    var match = currentMatch();
    matchCard.dataset.busy = "1";
    matchCard.classList.add(direction === "like" ? "is-out-right" : "is-out-left");

    if (direction === "like") {
      toast("Você curtiu " + match.name + ". Se for recíproco, vira match.");
    } else {
      toast("Card passado. Próxima pessoa.");
    }

    window.setTimeout(function () {
      matchIndex = (matchIndex + 1) % matches.length;
      matchCard.classList.remove("is-out-left", "is-out-right");
      renderMatch();
      delete matchCard.dataset.busy;
    }, 340);
  }

  var matchPass = $("#match-pass");
  var matchLike = $("#match-like");
  var matchStar = $("#match-star");

  if (matchPass) {
    matchPass.addEventListener("click", function () {
      swipeMatch("pass");
    });
  }

  if (matchLike) {
    matchLike.addEventListener("click", function () {
      swipeMatch("like");
    });
  }

  if (matchStar) {
    matchStar.addEventListener("click", function () {
      var starred = matchStar.getAttribute("aria-pressed") === "true";
      matchStar.setAttribute("aria-pressed", starred ? "false" : "true");
      matchStar.classList.toggle("is-starred", !starred);
      toast(
        currentMatch().name + (starred ? " removida dos favoritos." : " salva nos favoritos.")
      );
    });
  }

  alternateAvatars();
  if (matchCard && matches.length) renderMatch();

  /* -----------------------------------------------------------------------
     Feed — curtir e salvar
     ----------------------------------------------------------------------- */

  $$("[data-like]").forEach(function (button) {
    button.addEventListener("click", function () {
      var liked = button.getAttribute("aria-pressed") === "true";
      var counter = button.querySelector("[data-like-count]");

      button.setAttribute("aria-pressed", liked ? "false" : "true");
      button.classList.toggle("is-liked", !liked);

      if (counter) {
        var total = Number(counter.textContent.replace(/\D/g, "")) || 0;
        counter.textContent = String(total + (liked ? -1 : 1));
      }
    });
  });

  $$("[data-save]").forEach(function (button) {
    button.addEventListener("click", function () {
      var saved = button.getAttribute("aria-pressed") === "true";
      button.setAttribute("aria-pressed", saved ? "false" : "true");
      button.classList.toggle("is-saved", !saved);
      toast(saved ? "Post removido dos salvos." : "Post salvo para depois.");
    });
  });

  /* -----------------------------------------------------------------------
     Atividades — busca e filtros
     ----------------------------------------------------------------------- */

  var activitySearch = $("#activity-search");
  var activityList = $("#activity-list");
  var filterButtons = $$("[data-filter]");
  var activeFilter = "all";
  var activityEmpty = null;

  function activityCount(visible) {
    var label = document.querySelector('[data-screen="13"] .section-head .tiny');
    if (label) label.textContent = visible + (visible === 1 ? " atividade" : " atividades");
  }

  function applyActivityFilters() {
    if (!activityList) return;

    var term = activitySearch ? activitySearch.value.trim().toLowerCase() : "";
    var visible = 0;

    $$(".activity", activityList).forEach(function (card) {
      var category = card.getAttribute("data-cat");
      var matchesCategory = activeFilter === "all" || category === activeFilter;
      var matchesTerm = !term || card.textContent.toLowerCase().indexOf(term) !== -1;
      var show = matchesCategory && matchesTerm;

      card.classList.toggle("is-filtered-out", !show);
      if (show) visible += 1;
    });

    if (!activityEmpty) {
      activityEmpty = document.createElement("div");
      activityEmpty.className = "empty activities__empty";
      activityEmpty.innerHTML =
        '<span data-icon="search"></span>' +
        '<p class="body">Nenhuma atividade com esse filtro por aqui.</p>' +
        '<button class="btn btn--secondary btn--sm" type="button" data-clear-filters>Limpar filtros</button>';
      activityList.parentNode.insertBefore(activityEmpty, activityList.nextSibling);
      window.VemIcons.hydrate(activityEmpty);
    }

    activityEmpty.hidden = visible > 0;
    activityCount(visible);
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      activeFilter = button.getAttribute("data-filter");
      filterButtons.forEach(function (other) {
        other.setAttribute("aria-pressed", other === button ? "true" : "false");
      });
      applyActivityFilters();
    });
  });

  if (activitySearch) {
    activitySearch.addEventListener("input", applyActivityFilters);
  }

  document.addEventListener("click", function (event) {
    if (!event.target.closest("[data-clear-filters]")) return;

    activeFilter = "all";
    filterButtons.forEach(function (button) {
      button.setAttribute("aria-pressed", button.getAttribute("data-filter") === "all" ? "true" : "false");
    });
    if (activitySearch) activitySearch.value = "";
    applyActivityFilters();
  });

  /* -----------------------------------------------------------------------
     GenUI — linguagem natural + card inteligente
     ----------------------------------------------------------------------- */

  var luiForm = $("#lui-form");
  var luiInput = $("#lui-input");
  var luiMic = $("#lui-mic");
  var aiCard = $("#ai-card");
  var aiSkeleton = $("#ai-skeleton");
  var aiContent = $("#ai-content");
  var aiTitle = $("#ai-title");
  var aiText = $("#ai-text");
  var aiMeta = $("#ai-meta");
  var aiTime = aiCard ? aiCard.querySelector(".ai-card__time") : null;
  var aiCta = $("#ai-cta");
  var aiBadge = $("#ai-badge-text");
  var aiDismissed = $("#ai-dismissed");
  var aiUndo = $("#ai-undo");

  function detectIntent(text) {
    var lower = text.toLowerCase();
    var intent = "default";

    (DATA.intents || []).forEach(function (entry) {
      var found = entry.keys.some(function (key) {
        return lower.indexOf(key) !== -1;
      });
      if (found) intent = entry.intent;
    });

    return intent;
  }

  function suggestionFor(text) {
    var suggestions = DATA.suggestions || {};
    return suggestions[detectIntent(text)] || suggestions.default;
  }

  function applySuggestion(suggestion) {
    if (!suggestion) return;

    if (aiTitle) aiTitle.textContent = suggestion.title;
    if (aiText) aiText.innerHTML = suggestion.text;
    if (aiMeta) {
      aiMeta.innerHTML = suggestion.meta
        .map(function (tag) {
          return '<span class="tag">' + tag + "</span>";
        })
        .join("");
    }
    if (aiTime) aiTime.textContent = "agora mesmo";
    if (aiBadge) aiBadge.textContent = "Gerado agora";
    if (aiCta) {
      aiCta.textContent = "Ver treino";
      aiCta.setAttribute("data-nav", "13");
    }

    if (aiCard) {
      aiCard.classList.remove("is-dismissed");
      aiCard.removeAttribute("aria-busy");
    }
    if (aiDismissed) aiDismissed.hidden = true;
  }

  /* Card contextual da Home — muda conforme a jornada escolhida na tela 05 */
  function applyJourneyCard() {
    var item = journey();
    if (!item || !item.card) return;

    var card = item.card;

    if (aiBadge) aiBadge.textContent = card.badge;
    if (aiTitle) aiTitle.textContent = card.title;
    if (aiText) aiText.innerHTML = card.text;
    if (aiMeta) {
      aiMeta.innerHTML = card.meta
        .map(function (tag) {
          return '<span class="tag">' + tag + "</span>";
        })
        .join("");
    }
    if (aiTime) aiTime.textContent = "com base no seu objetivo";
    if (aiCta) {
      aiCta.textContent = card.cta;
      aiCta.setAttribute("data-nav", card.target);
    }
    if (aiCard) {
      aiCard.classList.remove("is-dismissed");
      aiCard.removeAttribute("aria-busy");
    }
    if (aiDismissed) aiDismissed.hidden = true;
  }

  function restoreAi() {
    if (aiCard) aiCard.classList.remove("is-dismissed");
    if (aiDismissed) aiDismissed.hidden = true;
    toast("Sugestão restaurada.");
  }

  function generateSuggestion(text) {
    if (!aiCard) return;

    if (aiDismissed) aiDismissed.hidden = true;
    aiCard.classList.remove("is-dismissed");
    aiCard.setAttribute("aria-busy", "true");
    if (aiContent) aiContent.hidden = true;
    if (aiSkeleton) aiSkeleton.hidden = false;

    window.setTimeout(function () {
      applySuggestion(suggestionFor(text));
      if (aiSkeleton) aiSkeleton.hidden = true;
      if (aiContent) aiContent.hidden = false;
      toast("Sugestão atualizada com base no seu pedido.");
    }, 900);
  }

  if (luiForm) {
    luiForm.addEventListener("submit", function (event) {
      event.preventDefault();

      var text = luiInput ? luiInput.value.trim() : "";
      if (!text) {
        luiForm.classList.remove("is-nudge");
        void luiForm.offsetWidth;
        luiForm.classList.add("is-nudge");
        if (luiInput) luiInput.focus();
        toast("Escreva ou fale o que você quer treinar.");
        return;
      }

      generateSuggestion(text);
    });
  }

  if (aiCard) {
    $$("[data-dismiss-ai]", aiCard).forEach(function (button) {
      button.addEventListener("click", function () {
        aiCard.classList.add("is-dismissed");
        if (aiDismissed) aiDismissed.hidden = false;
        toast("Sugestão descartada.", { label: "Desfazer", onClick: restoreAi });
      });
    });
  }

  if (aiUndo) {
    aiUndo.addEventListener("click", restoreAi);
  }

  if (luiMic && luiForm && luiInput) {
    luiMic.addEventListener("click", function () {
      if (luiMic.dataset.busy === "1") return;
      luiMic.dataset.busy = "1";
      luiForm.classList.add("is-listening");
      luiInput.placeholder = "Ouvindo…";
      toast("Pode falar. Estou ouvindo (demonstração).");

      window.setTimeout(function () {
        luiForm.classList.remove("is-listening");
        luiInput.placeholder = "O que você quer treinar hoje?";
        luiInput.value = "Quero yoga para aliviar o estresse";
        delete luiMic.dataset.busy;

        if (typeof luiForm.requestSubmit === "function") luiForm.requestSubmit();
        else luiForm.dispatchEvent(new Event("submit", { cancelable: true }));

        toast("Transcrição: “Quero yoga para aliviar o estresse”.");
      }, 1500);
    });
  }

  /* -----------------------------------------------------------------------
     Plano vem+ — mensal / anual
     ----------------------------------------------------------------------- */

  var billing = $("[data-billing]");
  var PRICES = {
    monthly: { value: "R$ 19,90", sub: "Cobrado todo mês. Cancele quando quiser." },
    annual: { value: "R$ 13,90", sub: "R$ 166,80 por ano · economize 30%" }
  };

  if (billing) {
    $$("[data-billing-value]", billing).forEach(function (button) {
      button.addEventListener("click", function () {
        var plan = button.getAttribute("data-billing-value");
        var price = PRICES[plan];
        if (!price) return;

        $$("[data-billing-value]", billing).forEach(function (other) {
          other.setAttribute("aria-selected", other === button ? "true" : "false");
        });

        var value = $("#price-value");
        var sub = $("#price-sub");
        if (value) value.textContent = price.value;
        if (sub) sub.textContent = price.sub;
      });
    });
  }

  /* -----------------------------------------------------------------------
     Feedback do treino
     ----------------------------------------------------------------------- */

  var feedbackSubmit = $("#feedback-submit");

  $$("[data-face]").forEach(function (face) {
    face.addEventListener("click", function () {
      $$("[data-face]").forEach(function (other) {
        other.setAttribute("aria-pressed", other === face ? "true" : "false");
      });
      if (feedbackSubmit) feedbackSubmit.disabled = false;
    });
  });

  if (feedbackSubmit) {
    feedbackSubmit.addEventListener("click", function () {
      if (feedbackSubmit.disabled) return;

      var formWrap = $("#feedback-form-wrap");
      var success = $("#feedback-success");
      var foot = $("#feedback-foot");
      var scroller = $("#feedback-wrap");

      if (formWrap) formWrap.hidden = true;
      if (success) success.classList.add("is-visible");
      if (foot) foot.hidden = true;
      if (scroller) scroller.scrollTop = 0;

      toast("Feedback enviado. Valeu por ajudar o vem a melhorar.");
    });
  }

  /* -----------------------------------------------------------------------
     Sair da conta
     ----------------------------------------------------------------------- */

  $$("[data-logout]").forEach(function (button) {
    button.addEventListener("click", function () {
      toast("Você saiu da conta (demonstração).");
      if (window.VemApp) window.VemApp.go("01");
    });
  });

  /* -----------------------------------------------------------------------
     Jornada adaptativa — objetivo da tela 05 ramifica o fluxo
     ----------------------------------------------------------------------- */

  var GOAL_KEY = "vem.goal.v1";
  var goal = null;

  try {
    goal = window.localStorage.getItem(GOAL_KEY);
  } catch (error) {
    goal = null;
  }

  function journey() {
    var list = DATA.journeys || {};
    return (goal && list[goal]) || list.self || null;
  }

  function journeyStart() {
    var item = journey();
    return item ? item.start : "10";
  }

  function setJourney(value) {
    var list = DATA.journeys || {};
    goal = list[value] ? value : null;

    try {
      if (goal) window.localStorage.setItem(GOAL_KEY, goal);
      else window.localStorage.removeItem(GOAL_KEY);
    } catch (error) {
      /* modo privado pode bloquear o storage — a demo segue em memória */
    }

    $$("[data-path]").forEach(function (card) {
      card.setAttribute("aria-pressed", card.getAttribute("data-path") === goal ? "true" : "false");
    });

    var item = journey();
    var counter = $("[data-path-counter]");
    if (counter) {
      counter.innerHTML = item
        ? "Jornada: <strong>" + item.label + "</strong>"
        : "Nenhum selecionado";
    }

    var continueButton = $("#objective-continue");
    if (continueButton) continueButton.disabled = !item;

    var chip = $("#journey-chip-text");
    if (chip && item) chip.textContent = item.label;

    applyJourneyCard();
  }

  $$("[data-path]").forEach(function (card) {
    card.addEventListener("click", function () {
      setJourney(card.getAttribute("data-path"));
    });
  });

  var enterApp = $("#enter-app");
  if (enterApp) {
    enterApp.addEventListener("click", function () {
      if (window.VemApp) window.VemApp.go(journeyStart());
    });
  }

  if (goal && DATA.journeys && DATA.journeys[goal]) {
    setJourney(goal);
  } else {
    goal = null;
    var startChip = $("#journey-chip-text");
    var startJourney = journey();
    if (startChip && startJourney) startChip.textContent = startJourney.label;
    applyJourneyCard();
  }

  window.VemUI = { toast: toast, hideToast: hideToast, journey: function () { return goal; } };
})();
