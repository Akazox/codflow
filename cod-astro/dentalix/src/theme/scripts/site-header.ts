/**
 * Site header: sticky shadow on scroll + the mobile menu panel.
 * The panel's visibility is an inline display, never a class (THEME_GUIDE
 * trap #3), and the module self-initialises on import.
 */

export function initSiteHeader(): (() => void) | void {
  const header = document.querySelector<HTMLElement>("[data-dx-header]");
  if (!header || header.dataset.ready === "1") return;
  header.dataset.ready = "1";

  const toggle = header.querySelector<HTMLButtonElement>("[data-menu-toggle]");
  const menu = header.querySelector<HTMLElement>("[data-mobile-menu]");
  const iconOpen = toggle?.querySelector<SVGElement>("[data-icon-open]");
  const iconClose = toggle?.querySelector<SVGElement>("[data-icon-close]");

  const setOpen = (open: boolean) => {
    if (!toggle || !menu) return;
    menu.style.display = open ? "block" : "none";
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", (open ? toggle.dataset.labelClose : toggle.dataset.labelOpen) ?? "");
    if (iconOpen) iconOpen.style.display = open ? "none" : "";
    if (iconClose) iconClose.style.display = open ? "" : "none";
    header.dataset.open = open ? "true" : "false";
  };

  const onToggle = () => setOpen(toggle?.getAttribute("aria-expanded") !== "true");
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape" && toggle?.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  };
  const onScroll = () => {
    header.dataset.scrolled = window.scrollY > 4 ? "true" : "false";
  };
  const onResize = () => {
    if (window.innerWidth >= 1024) setOpen(false);
  };

  toggle?.addEventListener("click", onToggle);
  menu?.querySelectorAll("[data-menu-link]").forEach((link) => link.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", onKey);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
  onScroll();

  return () => {
    toggle?.removeEventListener("click", onToggle);
    document.removeEventListener("keydown", onKey);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onResize);
    delete header.dataset.ready;
  };
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initSiteHeader());
  } else {
    initSiteHeader();
  }
}
