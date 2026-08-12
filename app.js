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

  function initGasometriaCalculator() {
    var form = document.getElementById("gasometria-form");
    if (!form) {
      return;
    }

    var pacienteInput = document.getElementById("gasometria-paciente");
    var idadeInput = document.getElementById("gasometria-idade");
    var phInput = document.getElementById("gasometria-ph");
    var paco2Input = document.getElementById("gasometria-paco2");
    var hco3Input = document.getElementById("gasometria-hco3");
    var pao2Input = document.getElementById("gasometria-pao2");
    var sao2Input = document.getElementById("gasometria-sao2");
    var fio2Input = document.getElementById("gasometria-fio2");
    var lactatoInput = document.getElementById("gasometria-lactato");
    var beInput = document.getElementById("gasometria-be");
    var naInput = document.getElementById("gasometria-na");
    var clInput = document.getElementById("gasometria-cl");
    var calcularBtn = document.getElementById("gasometria-calcular");
    var resetarBtn = document.getElementById("gasometria-resetar");
    var imprimirBtn = document.getElementById("gasometria-imprimir");
    var phStatusEl = document.getElementById("gasometria-ph-status");
    var disturbioEl = document.getElementById("gasometria-disturbio");
    var pfEl = document.getElementById("gasometria-pf");
    var oxigenacaoEl = document.getElementById("gasometria-oxigenacao");
    var beStatusEl = document.getElementById("gasometria-be-status");
    var agEl = document.getElementById("gasometria-ag");
    var severityEl = document.getElementById("gasometria-severity");
    var severityDescEl = document.getElementById("gasometria-severity-desc");
    var ajustesEl = document.getElementById("gasometria-ajustes");
    var printPacienteEl = document.getElementById("gasometria-print-paciente");
    var printIdadeEl = document.getElementById("gasometria-print-idade");
    var printDataEl = document.getElementById("gasometria-print-data");

    if (!pacienteInput || !idadeInput || !phInput || !paco2Input || !hco3Input || !pao2Input || !sao2Input || !fio2Input || !lactatoInput || !beInput || !naInput || !clInput || !calcularBtn || !resetarBtn || !imprimirBtn || !phStatusEl || !disturbioEl || !pfEl || !oxigenacaoEl || !beStatusEl || !agEl || !severityEl || !severityDescEl || !ajustesEl || !printPacienteEl || !printIdadeEl || !printDataEl) {
      return;
    }

    function updatePrintHeader() {
      var paciente = String(pacienteInput.value || "").trim();
      var idade = String(idadeInput.value || "").trim();
      var agora = new Date();
      printPacienteEl.textContent = paciente || "Nao informado";
      printIdadeEl.textContent = idade ? idade + " anos" : "Nao informada";
      printDataEl.textContent = agora.toLocaleString("pt-BR");
    }

    function readValue(input, fallback) {
      var rawValue = String(input.value || "").trim().replace(",", ".");
      var value = parseFloat(rawValue);
      return Number.isFinite(value) ? value : fallback;
    }

    function renderCondutas(condutas) {
      ajustesEl.innerHTML = "";
      condutas.forEach(function (conduta) {
        var item = document.createElement("li");
        var acao = document.createElement("div");
        acao.textContent = conduta.acao;
        var motivo = document.createElement("div");
        motivo.className = "gaso-conduta-motivo";
        motivo.innerHTML = "<strong>Motivo:</strong> " + conduta.motivo;
        item.appendChild(acao);
        item.appendChild(motivo);
        if (conduta.urgente) {
          item.classList.add("is-urgente");
        }
        ajustesEl.appendChild(item);
      });
    }

    function renderDefault() {
      severityEl.classList.remove("is-grave", "is-moderado", "is-leve");
      severityEl.classList.add("is-leve");
      phStatusEl.textContent = "Faixa normal";
      disturbioEl.textContent = "Aguardando";
      pfEl.textContent = "--";
      oxigenacaoEl.textContent = "Aguardando";
      beStatusEl.textContent = "Aguardando";
      agEl.textContent = "--";
      severityEl.textContent = "Resultado Clinico";
      severityDescEl.textContent = "Preencha os campos e clique em Calcular.";
      renderCondutas([
        { acao: "Preencha os campos para visualizar condutas.", motivo: "sem dados suficientes para recomendacao.", urgente: false }
      ]);
      updatePrintHeader();
    }

    function calcularGasometria() {
      var ph = readValue(phInput, 7.4);
      var paco2 = readValue(paco2Input, 40);
      var hco3 = readValue(hco3Input, 24);
      var pao2 = readValue(pao2Input, 95);
      var sao2 = readValue(sao2Input, 97);
      var fio2 = readValue(fio2Input, 21);
      var lactato = readValue(lactatoInput, 1.2);
      var be = readValue(beInput, 0);
      var sodio = readValue(naInput, 140);
      var cloro = readValue(clInput, 104);
      var ratio = fio2 > 0 ? pao2 / (fio2 / 100) : 0;
      var anionGap = sodio - (cloro + hco3);
      var disturbio = "Gasometria normal";
      var oxigenacao = "Oxigenacao preservada";
      var beStatus = "BE normal";
      var description = "Sem sinais de gravidade imediata. Manter monitorizacao e reavaliacao clinica seriada.";
      var severityClass = "is-leve";
      var condutas = [];

      if (ph < 7.35) {
        phStatusEl.textContent = "Acidemia";
      } else if (ph > 7.45) {
        phStatusEl.textContent = "Alcalemia";
      } else {
        phStatusEl.textContent = "Faixa normal";
      }

      pfEl.textContent = ratio > 0 ? String(Math.round(ratio)) : "--";

      if (ph < 7.35) {
        if (paco2 > 45 && hco3 < 22) {
          disturbio = "Disturbio misto: acidose respiratoria e metabolica";
        } else if (paco2 > 45) {
          disturbio = "Acidose respiratoria";
        } else if (hco3 < 22) {
          disturbio = "Acidose metabolica";
        } else {
          disturbio = "Acidemia sem padrao completo";
        }
      } else if (ph > 7.45) {
        if (paco2 < 35 && hco3 > 26) {
          disturbio = "Disturbio misto: alcalose respiratoria e metabolica";
        } else if (paco2 < 35) {
          disturbio = "Alcalose respiratoria";
        } else if (hco3 > 26) {
          disturbio = "Alcalose metabolica";
        } else {
          disturbio = "Alcalemia sem padrao completo";
        }
      } else if (paco2 > 45 && hco3 > 26) {
        disturbio = "Padrao compativel com acidose respiratoria compensada";
      } else if (paco2 < 35 && hco3 < 22) {
        disturbio = "Padrao compativel com alcalose respiratoria compensada";
      } else if ((paco2 < 35 && hco3 > 26) || (paco2 > 45 && hco3 < 22)) {
        disturbio = "Disturbio misto com pH aparentemente normal";
      }

      if (ratio >= 300) {
        oxigenacao = "Lesao pulmonar leve ou ausente";
      } else if (ratio >= 200) {
        oxigenacao = "Lesao pulmonar moderada";
      } else if (ratio >= 100) {
        oxigenacao = "Hipoxemia moderada";
      } else {
        oxigenacao = "Hipoxemia grave";
      }

      if (be < -2) {
        beStatus = "BE negativo (excesso de acidos)";
      } else if (be > 2) {
        beStatus = "BE positivo (excesso de base)";
      }

      if (anionGap > 16 && disturbio.indexOf("Acidose") >= 0) {
        disturbio += " com anion gap elevado";
      }

      severityEl.classList.remove("is-grave", "is-moderado", "is-leve");

      if (ratio < 200 || sao2 < 90 || ph < 7.25 || ph > 7.55 || lactato >= 4 || anionGap > 20) {
        severityClass = "is-grave";
        description = "Resultado clinico grave: necessidade de intervencao imediata, ajuste ventilatorio rapido e monitorizacao intensiva.";
      } else if (ratio < 300 || sao2 < 94 || ph < 7.35 || ph > 7.45 || lactato >= 2 || be < -2 || be > 2 || anionGap > 16 || disturbio !== "Gasometria normal") {
        severityClass = "is-moderado";
        description = "Resultado clinico moderado: requer vigilancia estreita e reavaliacao gasometrica apos condutas.";
      }

      if (paco2 > 45) {
        condutas.push({
          acao: "Aumentar FR (ex: +2 irpm).",
          motivo: "hipercapnia com necessidade de elevar ventilacao-minuto para reduzir PaCO2.",
          urgente: false
        });
      } else if (paco2 < 35) {
        condutas.push({
          acao: "Reduzir FR (ex: -2 irpm).",
          motivo: "hipocapnia com risco de hiperventilacao e alcalose respiratoria.",
          urgente: false
        });
      }

      if (ratio < 300 || sao2 < 94) {
        if (fio2 < 60) {
          condutas.push({
            acao: "Aumentar FiO2 de forma gradual.",
            motivo: "suporte de oxigenacao para manter SaO2 alvo entre 92% e 96%.",
            urgente: false
          });
        } else {
          condutas.push({
            acao: "Aumentar PEEP em passos de 2 cmH2O e reavaliar hemodinamica.",
            motivo: "hipoxemia persistente com FiO2 elevada.",
            urgente: false
          });
        }
      }

      if (ratio < 200) {
        condutas.push({
          acao: "Aplicar ventilacao protetora: VT em torno de 6 mL/kg de peso predito e pressao de plato < 30 cmH2O.",
          motivo: "reduzir risco de lesao pulmonar induzida por ventilacao.",
          urgente: false
        });
      }

      if (ph < 7.25 && paco2 > 50) {
        condutas.push({
          acao: "Na acidemia hipercapnica importante, aumentar FR adicionalmente e checar auto-PEEP.",
          motivo: "corrigir acidemia grave e evitar hiperinsuflacao dinamica.",
          urgente: false
        });
      }

      if (be < -6 || lactato >= 4) {
        condutas.push({
          acao: "Reavaliar perfusao tecidual e causa metabolica associada em paralelo aos ajustes ventilatorios.",
          motivo: "alteracao metabolica relevante associada a pior prognostico.",
          urgente: false
        });
      }

      if (ratio < 100 || sao2 < 88 || ph < 7.20 || lactato >= 4) {
        condutas.push({
          acao: "URGENTE: comunicar equipe medica imediatamente e repetir gasometria apos ajuste inicial.",
          motivo: "criterio de gravidade com risco imediato de deterioracao clinica.",
          urgente: true
        });
      }

      if (condutas.length === 0) {
        condutas.push({
          acao: "Sem ajuste ventilatorio imediato relevante; manter estrategia atual e repetir gasometria conforme evolucao clinica.",
          motivo: "parametros atuais sem desvio que indique intervencao imediata.",
          urgente: false
        });
      }

      disturbioEl.textContent = disturbio;
      oxigenacaoEl.textContent = oxigenacao;
      beStatusEl.textContent = beStatus;
      agEl.textContent = anionGap.toFixed(1);
      severityEl.classList.add(severityClass);
      severityEl.textContent = "Resultado Clinico";
      severityDescEl.textContent = description + " Disturbio: " + disturbio + ". PaO2/FiO2: " + (ratio > 0 ? Math.round(ratio) : "--") + ". SaO2: " + sao2.toFixed(0) + "%. Lactato: " + lactato.toFixed(1) + ". BE: " + be.toFixed(1) + ". Anion gap: " + anionGap.toFixed(1) + ".";
      renderCondutas(condutas);
      updatePrintHeader();
    }

    calcularBtn.addEventListener("click", calcularGasometria);
    resetarBtn.addEventListener("click", function () {
      form.reset();
      renderDefault();
    });

    imprimirBtn.addEventListener("click", function () {
      updatePrintHeader();
      window.print();
    });

    window.addEventListener("beforeprint", updatePrintHeader);

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      calcularGasometria();
    });

    renderDefault();
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
        initGasometriaCalculator();
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
  initGasometriaCalculator();
})();
