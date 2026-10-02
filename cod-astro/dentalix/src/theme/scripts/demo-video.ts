/**
 * Demo video modal. The player (iframe or <video>) exists only while the
 * dialog is open: it is created on click and removed on close, so the page
 * pays nothing for the video until someone asks for it. The embed URL was
 * validated and rebuilt server-side (utils/demo-video.ts); this script only
 * re-checks the scheme before using it.
 */

export function initDemoVideo(): (() => void) | void {
  const modal = document.getElementById("dx-demo-modal") as HTMLDialogElement | null;
  if (!modal || modal.dataset.ready === "1") return;
  modal.dataset.ready = "1";

  const frame = modal.querySelector<HTMLElement>("[data-demo-frame]");
  const src = modal.dataset.src ?? "";
  const kind = modal.dataset.kind ?? "";
  if (!frame || !src.startsWith("https://")) return;

  let lastFocus: HTMLElement | null = null;

  const mount = () => {
    frame.replaceChildren();
    if (kind === "mp4") {
      const video = document.createElement("video");
      video.src = src;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.preload = "metadata";
      frame.append(video);
    } else {
      const iframe = document.createElement("iframe");
      iframe.src = src;
      iframe.title = modal.dataset.title ?? "";
      iframe.allow = "autoplay; fullscreen; picture-in-picture; encrypted-media";
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      frame.append(iframe);
    }
  };

  const open = (event: Event) => {
    event.preventDefault();
    lastFocus = document.activeElement as HTMLElement | null;
    mount();
    if (typeof modal.showModal === "function") modal.showModal();
    else modal.setAttribute("open", "");
    modal.querySelector<HTMLButtonElement>("[data-demo-close]")?.focus();
  };

  const close = () => {
    if (modal.open && typeof modal.close === "function") modal.close();
    else modal.removeAttribute("open");
  };

  const onClosed = () => {
    frame.replaceChildren();
    lastFocus?.focus?.();
  };

  const onBackdrop = (event: MouseEvent) => {
    if (event.target === modal) close();
  };

  const triggers = document.querySelectorAll<HTMLElement>("[data-demo-trigger], [data-demo-open]");
  triggers.forEach((el) => el.addEventListener("click", open));
  modal.querySelector("[data-demo-close]")?.addEventListener("click", close);
  modal.addEventListener("close", onClosed);
  modal.addEventListener("click", onBackdrop);

  return () => {
    triggers.forEach((el) => el.removeEventListener("click", open));
    modal.removeEventListener("close", onClosed);
    modal.removeEventListener("click", onBackdrop);
    delete modal.dataset.ready;
  };
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initDemoVideo());
  } else {
    initDemoVideo();
  }
}
