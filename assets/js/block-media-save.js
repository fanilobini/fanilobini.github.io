(function () {
  function isMediaTarget(target) {
    if (!target) return false;
    if (target.tagName === "IMG" || target.tagName === "VIDEO") return true;
    if (target.closest(".hero, .project-hero, .infos__media")) return true;
    return !!target.closest("img, video");
  }

  document.addEventListener("contextmenu", (event) => {
    if (isMediaTarget(event.target)) {
      event.preventDefault();
    }
  });

  document.addEventListener("dragstart", (event) => {
    if (isMediaTarget(event.target)) {
      event.preventDefault();
    }
  });
})();
