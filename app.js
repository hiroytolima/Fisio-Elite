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

    if (!ocular || !verbal || !motora || !pupilar || !totalEl || !totalPEl || !severityEl) {
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

      if (gcs <= 8) {
        severityEl.classList.add("is-grave");
        severityEl.textContent = "Nivel grave do trauma (coma)";
      } else if (gcs <= 12) {
        severityEl.classList.add("is-moderado");
        severityEl.textContent = "Nivel moderado do trauma";
      } else {
        severityEl.classList.add("is-leve");
        severityEl.textContent = "Nivel leve do trauma";
      }
    }

    form.addEventListener("change", updateScore);
    updateScore();
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
})();
