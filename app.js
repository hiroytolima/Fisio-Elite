(function () {
  "use strict";

  function normalizePath(pathname) {
    if (!pathname) {
      return "";
    }

    var cleaned = pathname.replace(/\\/g, "/");
    if (cleaned.endsWith("/")) {
      cleaned += "fisioapp-home.html";
    }
    return cleaned;
  }

  function extractFrameAndTitle(htmlText) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(htmlText, "text/html");
    return {
      frame: doc.querySelector(".frame"),
      title: doc.title || "Fisio Elite"
    };
  }

  function isInternalHtmlLink(anchor) {
    if (!anchor || !anchor.getAttribute("href")) {
      return false;
    }

    var href = anchor.getAttribute("href").trim();
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      return false;
    }

    var targetUrl;
    try {
      targetUrl = new URL(href, window.location.href);
    } catch (error) {
      return false;
    }

    if (targetUrl.origin !== window.location.origin) {
      return false;
    }

    return targetUrl.pathname.toLowerCase().endsWith(".html");
  }

  function setActiveMenuByPath(pathname) {
    var links = document.querySelectorAll(".item-link");
    if (!links.length) {
      return;
    }

    var currentPath = normalizePath(pathname);
    links.forEach(function (link) {
      var href = link.getAttribute("href") || "";
      var targetPath = normalizePath(new URL(href, window.location.href).pathname);
      var isActive = currentPath === targetPath;
      link.classList.toggle("is-active", isActive);
      link.setAttribute("aria-current", isActive ? "page" : "false");
    });
  }

  function bindLinks() {
    var links = document.querySelectorAll("a[href]");

    links.forEach(function (link) {
      if (link.dataset.routerBound === "true") {
        return;
      }

      link.dataset.routerBound = "true";
      link.addEventListener("click", function (event) {
        if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
          return;
        }

        if (!isInternalHtmlLink(link)) {
          return;
        }

        var targetUrl = new URL(link.getAttribute("href"), window.location.href);
        event.preventDefault();
        navigate(targetUrl.pathname, false);
      });
    });
  }

  function replaceFrame(newFrame) {
    var currentFrame = document.querySelector(".frame");
    if (!currentFrame || !newFrame) {
      return false;
    }

    currentFrame.replaceWith(newFrame);
    return true;
  }

  function initGlasgowCalculator() {
    var form = document.getElementById("gcs-form");
    if (!form) {
      return;
    }

    var ocular = document.getElementById("gcs-ocular");
    var verbal = document.getElementById("gcs-verbal");
    var motora = document.getElementById("gcs-motora");
    var pupilar = document.getElementById("gcs-pupilar");
    var totalEl = document.getElementById("gcs-total");
    var totalPEl = document.getElementById("gcs-p-total");
    var severityEl = document.getElementById("gcs-severity");
    var severityDescEl = document.getElementById("gcs-severity-desc");

    if (!ocular || !verbal || !motora || !pupilar || !totalEl || !totalPEl || !severityEl || !severityDescEl) {
      return;
    }

    function updateScore() {
      var ocularScore = parseInt(ocular.value, 10) || 0;
      var verbalScore = parseInt(verbal.value, 10) || 0;
      var motoraScore = parseInt(motora.value, 10) || 0;
      var pupilarScore = parseInt(pupilar.value, 10) || 0;

      var gcs = ocularScore + verbalScore + motoraScore;
      var gcsp = Math.max(1, gcs - pupilarScore);

      totalEl.textContent = String(gcs);
      totalPEl.textContent = String(gcsp);

      severityEl.classList.remove("is-grave", "is-moderado", "is-leve");

      if (gcsp <= 8) {
        severityEl.classList.add("is-grave");
        severityEl.textContent = "Nivel grave do trauma (coma)";
        severityDescEl.textContent = "Paciente com comprometimento neurologico grave, exige monitorizacao intensiva e intervencao imediata.";
      } else if (gcsp <= 12) {
        severityEl.classList.add("is-moderado");
        severityEl.textContent = "Nivel moderado do trauma";
        severityDescEl.textContent = "Paciente com comprometimento neurologico moderado, requer vigilância clinica estreita e reavaliacoes frequentes.";
      } else {
        severityEl.classList.add("is-leve");
        severityEl.textContent = "Nivel leve do trauma";
        severityDescEl.textContent = "Paciente com comprometimento neurologico leve, manter observacao clinica e reavaliacoes seriadas.";
      }
    }

    form.addEventListener("change", updateScore);
    updateScore();
  }

  function initRassCalculator() {
    var form = document.getElementById("rass-form");
    if (!form) {
      return;
    }

    var scoreSelect = document.getElementById("rass-score");
    var totalEl = document.getElementById("rass-total");
    var severityEl = document.getElementById("rass-severity");
    var severityDescEl = document.getElementById("rass-severity-desc");

    if (!scoreSelect || !totalEl || !severityEl || !severityDescEl) {
      return;
    }

    function updateRass() {
      var score = parseInt(scoreSelect.value, 10);

      totalEl.textContent = score > 0 ? "+" + String(score) : String(score);
      severityEl.classList.remove("is-grave", "is-moderado", "is-leve");

      if (score === 4) {
        severityEl.classList.add("is-grave");
        severityEl.textContent = "Agitacao: Combativo, violento, com perigo imediato para a equipe.";
        severityDescEl.textContent = "Paciente com aumento de atividade psicomotora, podendo exigir contencao verbal, ajuste de analgesia ou sedacao.";
      } else if (score === 3) {
        severityEl.classList.add("is-grave");
        severityEl.textContent = "Agitacao: Conduta agressiva, puxa ou remove dispositivos, agressivo verbalmente.";
        severityDescEl.textContent = "Paciente com aumento de atividade psicomotora, podendo exigir contencao verbal, ajuste de analgesia ou sedacao.";
      } else if (score === 2) {
        severityEl.classList.add("is-grave");
        severityEl.textContent = "Agitacao: Movimentos despropositados frequentes, briga com o ventilador.";
        severityDescEl.textContent = "Paciente com aumento de atividade psicomotora, podendo exigir contencao verbal, ajuste de analgesia ou sedacao.";
      } else if (score === 1) {
        severityEl.classList.add("is-grave");
        severityEl.textContent = "Agitacao: Intranquilo, ansioso, sem movimentos vigorosos ou agressivos.";
        severityDescEl.textContent = "Paciente com aumento de atividade psicomotora, podendo exigir contencao verbal, ajuste de analgesia ou sedacao.";
      } else if (score >= 1) {
        severityEl.classList.add("is-grave");
        severityEl.textContent = "Agitacao";
        severityDescEl.textContent = "Paciente com aumento de atividade psicomotora, podendo exigir contencao verbal, ajuste de analgesia ou sedacao.";
      } else if (score === 0) {
        severityEl.classList.add("is-leve");
        severityEl.textContent = "Nivel alvo: alerta e calmo";
        severityDescEl.textContent = "Paciente em estado ideal de sedacao para monitorizacao e manejo clinico.";
      } else if (score === -1) {
        severityEl.classList.add("is-moderado");
        severityEl.textContent = "Sedacao: Adormecido, facilmente despertavel, mantem contato visual por mais de 10 segundos";
        severityDescEl.textContent = "Paciente com reducao de responsividade, exigindo reavaliacao frequente e ajuste cuidadoso da sedacao.";
      } else if (score === -2) {
        severityEl.classList.add("is-moderado");
        severityEl.textContent = "Sedacao: Despertar precoce ao estimulo verbal, mantem contato visual por menos de 10 segundos";
        severityDescEl.textContent = "Paciente com reducao de responsividade, exigindo reavaliacao frequente e ajuste cuidadoso da sedacao.";
      } else if (score === -3) {
        severityEl.classList.add("is-moderado");
        severityEl.textContent = "Sedacao: Movimentos e abertura ocular ao estimulo verbal, mas sem contato visual.";
        severityDescEl.textContent = "Paciente com reducao de responsividade, exigindo reavaliacao frequente e ajuste cuidadoso da sedacao.";
      } else if (score === -4) {
        severityEl.classList.add("is-moderado");
        severityEl.textContent = "Sedacao: Sem resposta ao estimulo verbal, mas apresenta movimentos ou abertura ocular ao estimulo fisico.";
        severityDescEl.textContent = "Paciente com reducao de responsividade, exigindo reavaliacao frequente e ajuste cuidadoso da sedacao.";
      } else if (score === -5) {
        severityEl.classList.add("is-moderado");
        severityEl.textContent = "Sedacao: Sem resposta ao estimulo verbal ou fisico.";
        severityDescEl.textContent = "Paciente com reducao de responsividade, exigindo reavaliacao frequente e ajuste cuidadoso da sedacao.";
      } else {
        severityEl.classList.add("is-moderado");
        severityEl.textContent = "Sedacao";
        severityDescEl.textContent = "Paciente com reducao de responsividade, exigindo reavaliacao frequente e ajuste cuidadoso da sedacao.";
      }
    }

    form.addEventListener("change", updateRass);
    updateRass();
  }

  function navigate(pathname, isPopState) {
    var path = normalizePath(pathname);
    var current = normalizePath(window.location.pathname);

    if (!isPopState && current !== path) {
      window.history.pushState({}, "", path);
    }

    fetch(path)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Failed to load page");
        }
        return response.text();
      })
      .then(function (htmlText) {
        var payload = extractFrameAndTitle(htmlText);
        if (!replaceFrame(payload.frame)) {
          window.location.assign(path);
          return;
        }

        document.title = payload.title;
        bindLinks();
        setActiveMenuByPath(path);
        initGlasgowCalculator();
        initRassCalculator();
        window.scrollTo({ top: 0, behavior: "instant" });
      })
      .catch(function () {
        // Fallback when running without an HTTP server or blocked fetch.
        window.location.assign(path);
      });
  }

  window.addEventListener("popstate", function () {
    navigate(window.location.pathname, true);
  });

  bindLinks();
  setActiveMenuByPath(window.location.pathname);
  initGlasgowCalculator();
  initRassCalculator();
})();
