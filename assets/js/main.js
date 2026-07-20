// Mobile nav toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Past Years tab switching
  const tabs = document.querySelectorAll(".tab");
  if (tabs.length) {
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const target = tab.getAttribute("data-target");
        document.querySelectorAll(".tab").forEach((t) => t.setAttribute("aria-selected", "false"));
        document.querySelectorAll(".tab-panel").forEach((p) => p.setAttribute("hidden", ""));
        tab.setAttribute("aria-selected", "true");
        document.getElementById(target).removeAttribute("hidden");
        history.replaceState(null, "", "#" + target);
      });
    });
    const hash = window.location.hash.replace("#", "");
    const match = document.querySelector(`.tab[data-target="${hash}"]`);
    if (match) match.click();
  }
});
