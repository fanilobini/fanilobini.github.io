(async function () {
  const gridEl = document.getElementById("shopGrid");
  const bioEl = document.getElementById("shopBio");
  const linksEl = document.getElementById("shopLinks");
  const tpl = document.getElementById("shopItemTpl");

  if (!gridEl || !tpl) return;

  // ── Load shop.json — track its directory as base for images ──
  let shopBase = "./";
  async function loadShopJson() {
    const candidates = ["./shop.json", "../shop/shop.json"];
    for (const url of candidates) {
      try {
        const res = await fetch(`${url}?ts=${Date.now()}`);
        if (!res.ok) continue;
        // shopBase = directory that contains shop.json
        shopBase = url.replace(/shop\.json$/, "") || "./";
        return await res.json();
      } catch (_) {
        // try next
      }
    }
    return null;
  }

  // ── Render sidebar bio from shop.json ────────────────
  function renderBio(bio) {
    if (!bio) return;

    if (bioEl && bio.main_body) {
      bioEl.textContent = bio.main_body;
    }

    if (!linksEl) return;

    ["shop1", "shop2"].forEach((key) => {
      const url = bio[key];
      if (!url) return;
      const a = document.createElement("a");
      a.className = "shop__sidebar-link";
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = url.replace(/^https?:\/\//i, "").replace(/\/$/, "").toUpperCase();
      linksEl.appendChild(a);
    });
  }

  // ── Auto slideshow per item ───────────────────────────
  function startSlideshow(mediaEl, imgEl, images) {
    if (!images || images.length <= 1) return;

    let idx = 0;
    let interval = null;

    function show(i) {
      imgEl.style.opacity = "0";
      setTimeout(() => {
        imgEl.src = encodeURI(`${shopBase}${images[i]}`);
        imgEl.style.opacity = "1";
      }, 200);
    }

    function next() {
      idx = (idx + 1) % images.length;
      show(idx);
    }

    mediaEl.addEventListener("mouseenter", () => {
      if (interval) return;
      interval = setInterval(next, 1400);
    });

    mediaEl.addEventListener("mouseleave", () => {
      clearInterval(interval);
      interval = null;
      idx = 0;
      imgEl.style.opacity = "0";
      setTimeout(() => {
        imgEl.src = encodeURI(`${shopBase}${images[0]}`);
        imgEl.style.opacity = "1";
      }, 200);
    });
  }

  // ── Render one item card ──────────────────────────────
  function renderItem(item) {
    const node = tpl.content.cloneNode(true);
    const card = node.querySelector(".shop-item");
    const mediaEl = node.querySelector(".shop-item__media");
    const img = node.querySelector(".shop-item__img");
    const titleEl = node.querySelector(".shop-item__title");
    const priceEl = node.querySelector(".shop-item__price");

    if (item.link) {
      card.href = item.link;
    } else {
      card.removeAttribute("href");
      card.removeAttribute("target");
      card.removeAttribute("rel");
      card.style.pointerEvents = "none";
    }

    titleEl.textContent = item.title || item.name || "";
    priceEl.textContent = item.price || "";

    if (item.images && item.images.length > 0) {
      img.src = encodeURI(`${shopBase}${item.images[0]}`);
      img.alt = item.title || item.name || "";
      img.style.opacity = "1";
    } else {
      img.style.display = "none";
    }

    return { node, mediaEl, img, item };
  }

  // ── Main ─────────────────────────────────────────────
  const shopData = await loadShopJson();

  renderBio(shopData && shopData.bio ? shopData.bio : null);

  if (!shopData || !Array.isArray(shopData.items) || shopData.items.length === 0) {
    gridEl.textContent = "Aucun article disponible.";
    return;
  }

  // Sort descending: highest number first
  const items = [...shopData.items].sort((a, b) => (b.number ?? 0) - (a.number ?? 0));

  const rendered = items.map((item) => renderItem(item));

  rendered.forEach(({ node }) => gridEl.appendChild(node));

  // Attach slideshows after cards are in real DOM
  rendered.forEach(({ mediaEl, img, item }) => {
    if (item.images && item.images.length > 1) {
      startSlideshow(mediaEl, img, item.images);
    }
  });
})();

