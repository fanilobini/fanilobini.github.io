(function () {
  function isMediaTarget(target) {
    if (!target) return false;
    if (target.tagName === "IMG" || target.tagName === "VIDEO") return true;
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
