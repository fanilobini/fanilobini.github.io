(function () {
  const button = document.querySelector(".back-to-top");
  if (!button) return;

  const footer = document.querySelector(".footer");
  const baseOffset = 20;
  let footerInView = false;

  const threshold = 420;

  function updateVisibility() {
    if (window.scrollY > threshold) {
      button.classList.add("is-visible");
    } else {
      button.classList.remove("is-visible");
    }
  }

  function updateFooterOffset() {
    if (!footer) return;
    if (footerInView) {
      const footerHeight = footer.getBoundingClientRect().height;
      button.style.bottom = `${baseOffset + footerHeight}px`;
      return;
    }

    button.style.bottom = `${baseOffset}px`;
  }

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  updateVisibility();
  updateFooterOffset();
  window.addEventListener("scroll", updateVisibility, { passive: true });

  if (footer) {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        footerInView = entry.isIntersecting;
        updateFooterOffset();
      },
      { threshold: 0 }
    );

    observer.observe(footer);
    window.addEventListener("resize", updateFooterOffset, { passive: true });
  }
})();
