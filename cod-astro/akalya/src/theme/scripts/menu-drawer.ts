/**
 * Mobile menu drawer (theme layer).
 *
 * Same shape as the cart drawer: open/closed geometry lives in CSS keyed on
 * `data-open` (global.css → #menu-drawer), visibility on the `hidden`
 * attribute, and this controller only toggles the two. Self-initialises on
 * import — there is no ClientRouter, so `astro:page-load` never fires.
 */

const CLOSE_MS = 300;
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function initMenuDrawer(): () => void {
  const noop = () => {};
  const drawer = document.getElementById("menu-drawer");
  const scrim = document.getElementById("menu-scrim");
  const openBtn = document.getElementById("menu-open");
  const closeBtn = document.getElementById("menu-close");
  if (!drawer || !openBtn) return noop;
  if (drawer.dataset.ready === "1") return noop;
  drawer.dataset.ready = "1";

  const aborter = new AbortController();
  const { signal } = aborter;
  let closeTimer: number | null = null;

  const reducedMotion = () =>
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

  function open(): void {
    if (closeTimer !== null) {
      window.clearTimeout(closeTimer);
      closeTimer = null;
    }
    if (scrim) scrim.hidden = false;
    drawer!.hidden = false;
    // Flush styles so the closed position is computed before the open one,
    // otherwise both land in the same frame and nothing slides.
    void drawer!.offsetWidth;
    scrim?.setAttribute("data-open", "");
    drawer!.setAttribute("data-open", "");
    openBtn!.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    closeBtn?.focus();
  }

  function close(returnFocus = true): void {
    if (drawer!.hidden) return;
    drawer!.removeAttribute("data-open");
    scrim?.removeAttribute("data-open");
    openBtn!.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    closeTimer = window.setTimeout(
      () => {
        drawer!.hidden = true;
        if (scrim) scrim.hidden = true;
        closeTimer = null;
      },
      reducedMotion() ? 0 : CLOSE_MS,
    );
    if (returnFocus) openBtn!.focus();
  }

  openBtn.addEventListener("click", () => open(), { signal });
  closeBtn?.addEventListener("click", () => close(), { signal });
  scrim?.addEventListener("click", () => close(), { signal });

  drawer.addEventListener(
    "click",
    (event) => {
      if ((event.target as HTMLElement).closest("a[href]")) close(false);
    },
    { signal },
  );

  document.addEventListener(
    "keydown",
    (event) => {
      if (drawer.hidden) return;
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const items = [...drawer.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null,
      );
      if (items.length === 0) return;
      const first = items[0]!;
      const last = items[items.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    { signal },
  );

  // A desktop-width resize while open would leave the page scroll-locked
  // behind a drawer the layout no longer shows.
  window.matchMedia?.("(min-width: 1024px)").addEventListener(
    "change",
    (event) => {
      if (event.matches) close(false);
    },
    { signal },
  );

  return () => {
    aborter.abort();
    if (closeTimer !== null) window.clearTimeout(closeTimer);
    delete drawer.dataset.ready;
  };
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initMenuDrawer());
  } else {
    initMenuDrawer();
  }
}
