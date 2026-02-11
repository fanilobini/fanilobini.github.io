(function () {
  const button = document.querySelector(".back-to-top");
  if (!button) return;

  const threshold = 420;

  function updateVisibility() {
    if (window.scrollY > threshold) {
      button.classList.add("is-visible");
    } else {
      button.classList.remove("is-visible");
    }
  }

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  updateVisibility();
  window.addEventListener("scroll", updateVisibility, { passive: true });
})();
