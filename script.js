const folderSystem = document.querySelector(".folder-system");
const pageLinks = document.querySelectorAll("[data-page]");
const pagePanels = document.querySelectorAll("[data-page-panel]");
const folderTabs = document.querySelectorAll(".folder-tabs a");
const sectionOrder = ["projects", "stack", "about", "contact"];
const sliceWidth = 64; // keep in sync with --tab-width in style.css

function selectPage(page, updateUrl = true) {
  const target = folderSystem?.querySelector(`[data-page-panel="${page}"]`);
  if (!target) return;

  folderSystem.dataset.currentPage = page;
  const selectedSectionIndex = Math.max(0, sectionOrder.indexOf(page));
  const previousWidth = selectedSectionIndex * sliceWidth;

  folderTabs.forEach((tab) => {
    const tabIndex = sectionOrder.indexOf(tab.dataset.page);
    tab.classList.remove("is-inner-left", "is-inner-right", "is-outer-right");
    if (tabIndex < selectedSectionIndex) {
      tab.style.left = `${tabIndex * sliceWidth}px`;
      tab.style.right = "auto";
      if (tabIndex === selectedSectionIndex - 1) tab.classList.add("is-inner-right");
    } else {
      tab.style.left = "auto";
      tab.style.right = `${(sectionOrder.length - 1 - tabIndex) * sliceWidth}px`;
      if (tabIndex === selectedSectionIndex) tab.classList.add("is-inner-left");
      if (tabIndex === sectionOrder.length - 1) tab.classList.add("is-outer-right");
    }
  });

  pagePanels.forEach((panel) => {
    const isCurrent = panel.dataset.pagePanel === page;
    panel.style.setProperty("--page-left", `${previousWidth}px`);
    panel.style.zIndex = isCurrent ? "12" : "1";
    panel.setAttribute("aria-hidden", String(!isCurrent));
  });

  pageLinks.forEach((link) => {
    const isActive = link.dataset.page === page;
    link.classList.toggle("is-active", isActive);
    if (isActive && link.closest("nav")) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

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

/* Project stories
   Order, numbering and previous/next buttons all come from the order of the
   project rows ([data-story]) on the Projects page. */
const storyRows = [...document.querySelectorAll("[data-story]")];
const stories = storyRows.map((row) => document.getElementById(row.dataset.story)).filter(Boolean);

function openStory(dialog) {
  stories.forEach((other) => { if (other !== dialog) other.close(); });
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
}

function pagerButton(label, target) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", () => openStory(target));
  return button;
}

const storyTitle = (dialog) => dialog.querySelector(".story__title").textContent;

storyRows.forEach((row) => {
  const dialog = document.getElementById(row.dataset.story);
  if (dialog) row.addEventListener("click", () => openStory(dialog));
});

stories.forEach((dialog, i) => {
  const count = stories.length;
  const prev = stories[(i - 1 + count) % count];
  const next = stories[(i + 1) % count];
  const pager = dialog.querySelector(".story__pager");

  dialog.querySelector(".story__no").textContent = String(i + 1).padStart(2, "0");

  pager.hidden = count < 2;
  if (count > 2) pager.append(pagerButton(`← ${storyTitle(prev)}`, prev));
  if (count > 1) pager.append(pagerButton(`${storyTitle(next)} →`, next));

  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  dialog.querySelector("[data-close]").addEventListener("click", () => dialog.close());
});