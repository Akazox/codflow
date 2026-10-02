/**
 * Demo video URL handling.
 *
 * The merchant pastes a link into `demoVideoUrl` (content keys, via the
 * dashboard's contentJson). Only three shapes ever reach an iframe or a video
 * element: https YouTube, https Vimeo, or an https `.mp4` file. Everything is
 * rebuilt from parsed parts — the raw string is never echoed into markup — so
 * a crafted value cannot smuggle a different host, scheme or parameter in.
 */

export type DemoVideo =
  | { kind: "youtube"; id: string; embedUrl: string; watchUrl: string }
  | { kind: "vimeo"; id: string; embedUrl: string; watchUrl: string }
  | { kind: "mp4"; embedUrl: string; watchUrl: string };

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
]);
const VIMEO_HOSTS = new Set(["vimeo.com", "www.vimeo.com", "player.vimeo.com"]);
const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;
const VIMEO_ID = /^\d{1,12}$/;
const VIMEO_HASH = /^[A-Za-z0-9]{6,32}$/;

function parseHttps(raw: string): URL | null {
  const value = raw.trim();
  if (!value || value.length > 2048) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;
    if (url.username || url.password) return null;
    return url;
  } catch {
    return null;
  }
}

function youtubeStart(url: URL): number | null {
  const raw = url.searchParams.get("t") ?? url.searchParams.get("start");
  if (!raw) return null;
  const match = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/.exec(raw);
  if (!match || !match[0]) return null;
  const seconds = Number(match[1] ?? 0) * 3600 + Number(match[2] ?? 0) * 60 + Number(match[3] ?? 0);
  return seconds > 0 ? seconds : null;
}

function youtubeId(url: URL): string | null {
  const host = url.hostname.toLowerCase();
  const parts = url.pathname.split("/").filter(Boolean);
  if (host === "youtu.be") return parts[0] ?? null;
  if (url.pathname === "/watch") return url.searchParams.get("v");
  if (["embed", "shorts", "live", "v"].includes(parts[0] ?? "")) return parts[1] ?? null;
  return null;
}

function vimeoParts(url: URL): { id: string; hash: string | null } | null {
  const parts = url.pathname.split("/").filter(Boolean);
  const host = url.hostname.toLowerCase();
  let id: string | undefined;
  let hash: string | null = url.searchParams.get("h");
  if (host === "player.vimeo.com") {
    if (parts[0] !== "video") return null;
    id = parts[1];
  } else {
    const idIndex = parts.findIndex((p) => VIMEO_ID.test(p));
    if (idIndex < 0) return null;
    id = parts[idIndex];
    hash = hash ?? parts[idIndex + 1] ?? null;
  }
  if (!id || !VIMEO_ID.test(id)) return null;
  if (hash && !VIMEO_HASH.test(hash)) hash = null;
  return { id, hash };
}

export function parseDemoVideo(raw: string | null | undefined): DemoVideo | null {
  if (!raw) return null;
  const url = parseHttps(raw);
  if (!url) return null;
  const host = url.hostname.toLowerCase();

  if (YOUTUBE_HOSTS.has(host)) {
    const id = youtubeId(url);
    if (!id || !YOUTUBE_ID.test(id)) return null;
    const start = youtubeStart(url);
    const params = new URLSearchParams({ autoplay: "1", rel: "0", modestbranding: "1", playsinline: "1" });
    if (start) params.set("start", String(start));
    return {
      kind: "youtube",
      id,
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}?${params}`,
      watchUrl: `https://www.youtube.com/watch?v=${id}`,
    };
  }

  if (VIMEO_HOSTS.has(host)) {
    const parts = vimeoParts(url);
    if (!parts) return null;
    const params = new URLSearchParams({ autoplay: "1", dnt: "1" });
    if (parts.hash) params.set("h", parts.hash);
    return {
      kind: "vimeo",
      id: parts.id,
      embedUrl: `https://player.vimeo.com/video/${parts.id}?${params}`,
      watchUrl: `https://vimeo.com/${parts.id}${parts.hash ? `/${parts.hash}` : ""}`,
    };
  }

  if (/\.mp4$/i.test(url.pathname)) {
    url.hash = "";
    return { kind: "mp4", embedUrl: url.href, watchUrl: url.href };
  }

  return null;
}

/** An optional https poster image; anything else falls back to the built-in poster. */
export function safePosterUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const url = parseHttps(raw);
  return url ? url.href : null;
}

/** wa.me link from a merchant-typed number, or null when it is not a plausible number. */
export function whatsappLink(number: string | null | undefined, text: string): string | null {
  const digits = (number ?? "").replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) return null;
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

/** tel: link from a merchant-typed number, or null. */
export function phoneLink(number: string | null | undefined): string | null {
  const cleaned = (number ?? "").replace(/[^\d+]/g, "");
  const digits = cleaned.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) return null;
  return `tel:${cleaned.startsWith("+") ? "+" : ""}${digits}`;
}
