(async function () {
  const header = document.getElementById("siteHeader");
  const hero = document.getElementById("hero");
  const heroTitle = document.getElementById("heroTitle");
  const projectsEl = document.getElementById("projects");
  const tpl = document.getElementById("projectCardTpl");

  if (!projectsEl || !tpl) return;

  let projects = [];
  try {
    projects = await window.PortfolioData.loadProjects();
  } catch (e) {
    projectsEl.textContent = "Impossible de charger les projets.";
    return;
  }

  projects.sort(window.PortfolioData.byNumberAsc);

  if (heroTitle) {
    heroTitle.textContent = "FANILO BINI";
  }

  if (header) {
    const onScroll = () => {
      if (window.scrollY > 24) header.classList.add("site-header--solid");
      else header.classList.remove("site-header--solid");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Home page top banner slideshow: rotate through each project's banner (image or video)
  const banners = projects
    .filter((p) => p.banner)
    .map((p) => ({
      src: window.PortfolioData.resolveAssetPath(p.banner),
      type: p.bannerType || "image"
    }));

  if (hero && banners.length > 0) {
    let i = 0;

    function setCurrentBanner(index) {
      // Clear existing content
      hero.innerHTML = "";
      
      const banner = banners[index];
      if (banner.type === "video") {
        const video = document.createElement("video");
        video.className = "hero__video";
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = "metadata";
        video.src = banner.src;
        hero.appendChild(video);
      } else {
        hero.style.backgroundImage = `url("${banner.src}")`;
        hero.style.backgroundPosition = "center";
      }
    }

    setCurrentBanner(0);

    // Preload next media (best-effort)
    for (const b of banners) {
      if (b.type === "video") {
        const video = document.createElement("video");
        video.src = b.src;
        video.preload = "metadata";
      } else {
        const img = new Image();
        img.src = b.src;
      }
    }

    if (banners.length > 1) {
      setInterval(() => {
        i = (i + 1) % banners.length;
        setCurrentBanner(i);
      }, 4500);
    }
  }

  const frag = document.createDocumentFragment();

  for (const p of projects) {
    const node = tpl.content.cloneNode(true);
    const a = node.querySelector(".project-card");
    const media = node.querySelector(".project-card__media");
    const img = node.querySelector(".project-card__img");
    const title = node.querySelector(".project-card__title");
    const subtitle = node.querySelector(".project-card__subtitle");

    if (a) a.href = `./project/?p=${encodeURIComponent(p.slug)}`;
    
    // Handle home media (image or video)
    if (media && p.home) {
      const homeUrl = window.PortfolioData.resolveAssetPath(p.home);
      if (p.homeType === "video") {
        // Remove the default image
        if (img) img.remove();
        
        // Create video element
        const video = document.createElement("video");
        video.className = "project-card__video";
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = "auto";
        video.src = homeUrl;
        media.appendChild(video);
        
        // Ensure autoplay starts
        video.play().catch(() => {
          // Silently fail if autoplay is blocked
        });
      } else {
        // Use image as normal
        if (img) {
          img.src = homeUrl;
          img.alt = p.title ?? "Projet";
        }
      }
    }
    
    if (title) title.textContent = p.title ?? p.name ?? "";
    if (subtitle) subtitle.textContent = p.year ? String(p.year) : "";

    frag.appendChild(node);
  }

  projectsEl.innerHTML = "";
  projectsEl.appendChild(frag);
})();
