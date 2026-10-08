const folderSystem = document.querySelector(".folder-system");
const pageLinks = document.querySelectorAll("[data-page]");
const pagePanels = document.querySelectorAll("[data-page-panel]");
const folderTabs = document.querySelectorAll(".folder-tabs a");
const panelOrder = ["home", "projects", "stack", "about", "contact"];
const sliceWidth = 64;
const sectionOrder = ["projects", "stack", "about", "contact"];

function selectPage(page, updateUrl = true) {
  const target = folderSystem && folderSystem.querySelector(`[data-page-panel="${page}"]`);
  if (!folderSystem || !target) return;

  folderSystem.dataset.currentPage = page;
  const selectedIndex = panelOrder.indexOf(page);
  const selectedSectionIndex = Math.max(0, sectionOrder.indexOf(page));
  const previousWidth = selectedSectionIndex * sliceWidth;
  const followingWidth = (sectionOrder.length - selectedSectionIndex) * sliceWidth;
  folderSystem.style.setProperty("--previous-width", `${previousWidth}px`);
  folderSystem.style.setProperty("--following-width", `${followingWidth}px`);

  folderTabs.forEach((tab) => {
    const tabIndex = sectionOrder.indexOf(tab.dataset.page);
    tab.classList.remove("is-outer-left", "is-inner-left", "is-inner-right", "is-outer-right");
    if (tabIndex < selectedSectionIndex) {
      tab.style.left = `${tabIndex * sliceWidth}px`;
      tab.style.right = "auto";
      if (tabIndex === 0) tab.classList.add("is-outer-left");
      if (tabIndex === selectedSectionIndex - 1) tab.classList.add("is-inner-right");
    } else {
      tab.style.left = "auto";
      tab.style.right = `${(sectionOrder.length - 1 - tabIndex) * sliceWidth}px`;
      if (tabIndex === selectedSectionIndex) tab.classList.add("is-inner-left");
      if (tabIndex === sectionOrder.length - 1) tab.classList.add("is-outer-right");
    }
  });

  pagePanels.forEach((panel) => {
    panel.style.setProperty("--page-left", `${previousWidth}px`);
    panel.style.zIndex = panel.dataset.pagePanel === page ? "12" : "1";
  });
  pageLinks.forEach((link) => {
    const isActive = link.dataset.page === page;
    link.classList.toggle("is-active", isActive);
    if (isActive && link.closest("nav")) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  pagePanels.forEach((panel) => panel.setAttribute("aria-hidden", panel.dataset.pagePanel === page ? "false" : "true"));

  if (updateUrl && window.location.hash !== `#${page}`) {
    window.history.pushState({}, "", `#${page}`);
  }
}

pageLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    selectPage(link.dataset.page);
  });
});

window.addEventListener("popstate", () => {
  selectPage(window.location.hash.slice(1) || "home", false);
});

selectPage(window.location.hash.slice(1) || "home", false);
