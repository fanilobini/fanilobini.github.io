// Intersection Observer for scroll-triggered animations
(function () {
  const observerOptions = {
    threshold: 0.05,
    rootMargin: "0px 0px -30px 0px", // Trigger when item comes into view
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.classList.contains("in-view")) {
        entry.target.classList.add("in-view");
      }
    });
  }, observerOptions);

  // Observe all gallery items and project cards
  function observeElements() {
    const elements = document.querySelectorAll(
      ".gallery__item, .project-card"
    );
    elements.forEach((el) => {
      if (!el.dataset.observed) {
        el.dataset.observed = "true";
        observer.observe(el);
      }
    });
  }

  // Watch for dynamically added elements
  const mutationObserver = new MutationObserver(() => {
    observeElements();
  });

  // Set up mutation observer to detect when new elements are added
  function setupMutationObserver() {
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // Initial setup
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      observeElements();
      setupMutationObserver();
    });
  } else {
    observeElements();
    setupMutationObserver();
  }

  // Re-observe after dynamic content is added
  window.PortfolioAnimations = {
    observeElements,
  };
})();
