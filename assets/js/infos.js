(function () {
  const bodyEl = document.getElementById("infosBody");
  const photoEl = document.getElementById("infosPhoto");
  const etsyEl = document.getElementById("etsyLink");
  const cvEl = document.getElementById("cvLink");

  function appendEmphasis(container, text) {
    const parts = text.split("*");
    parts.forEach((part, index) => {
      if (!part) return;
      if (index % 2 === 1) {
        const strong = document.createElement("strong");
        strong.textContent = part;
        container.appendChild(strong);
      } else {
        container.appendChild(document.createTextNode(part));
      }
    });
  }

  function renderBody(text) {
    if (!bodyEl) return;
    bodyEl.innerHTML = "";
    const paragraphs = text.split(/\r?\n\s*\r?\n/).map((p) => p.trim()).filter(Boolean);
    const frag = document.createDocumentFragment();

    if (paragraphs.length === 0 && text.trim()) {
      const p = document.createElement("p");
      appendEmphasis(p, text.trim());
      frag.appendChild(p);
    } else {
      for (const block of paragraphs) {
        const p = document.createElement("p");
        const lines = block.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
        lines.forEach((line, index) => {
          if (index > 0) p.appendChild(document.createElement("br"));
          appendEmphasis(p, line);
        });
        frag.appendChild(p);
      }
    }

    bodyEl.appendChild(frag);
  }

  function applyPayload(payload) {
    const info = payload && payload.infos ? payload.infos : null;
    if (!info) return;

    renderBody(info.main_body || "");

    if (photoEl) {
      if (info.photo) {
        photoEl.src = info.photo;
        photoEl.alt = "Graphic design";
        photoEl.closest(".infos__media")?.classList.remove("is-hidden");
      } else {
        photoEl.closest(".infos__media")?.classList.add("is-hidden");
      }
    }

    if (etsyEl && info.etsy) {
      etsyEl.href = info.etsy;
    }

    if (cvEl) {
      cvEl.setAttribute("aria-disabled", "true");
    }
  }

  window.PortfolioData.loadPayload()
    .then((payload) => applyPayload(payload))
    .catch(() => {
      // Fail silently if infos payload cannot be loaded.
    });
})();
