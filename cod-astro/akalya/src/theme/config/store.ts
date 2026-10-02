// ╔══════════════════════════════════════════════════════════════════════╗
// ║  CUSTOMIZE HERE (Custom mode) — DEFAULT_CONFIG only                  ║
// ║  Edit DEFAULT_CONFIG to change fallback colors/font/meta when the    ║
// ║  API is unreachable. All other code in this file is core engine.     ║
// ╚══════════════════════════════════════════════════════════════════════╝
/**
 * Per-request store data helpers.
 * Call once per page — pass the returned config to StoreLayout to avoid
 * duplicate API fetches.
 */
import { fetchStoreConfig } from "@/core/api/client";
import { resolveContent } from "@/theme/content";
import type { StoreConfig } from "@/core/api/types";
import type { StoreFrontContent } from "@/theme/content";

// Akalya owns its palette and fonts in styles/global.css (`--akl-*`). These
// colour/font fields mirror it for metadata only (theme-color) — the dashboard's
// values are never injected into the page. Keep them in step with global.css.
export const DEFAULT_CONFIG: StoreConfig = {
  id: "",
  name: "Akalya",
  domain: null,
  logoUrl: null,
  themeId: "akalya",
  primaryColor: "#b5562f",
  accentColor: "#7d8b6a",
  bgColor: "#f6efe6",
  fontFamily: "Fraunces, Jost, serif",
  fontUrl: null,
  lang: "fr",
  currency: "DZD",
  currencySymbol: "DA",
  contentJson: null,
  metaTitle: null,
  metaDescription: null,
  ogImage: null,
  announcementBar: null,
  reviewsEnabled: true,
  cartEnabled: false,
  freeShippingThreshold: null,
  otpEnabled: false,
  turnstileEnabled: false,
  turnstileSiteKey: null,
  status: "active",
  pixelId: null,
  conversionEvent: null,
  pages: [],
  legalContact: null,
  whatsapp: null,
};

export interface StoreContext {
  config: StoreConfig;
  content: StoreFrontContent;
  isRTL: boolean;
}

export async function getStoreContext(): Promise<StoreContext> {
  const config = (await fetchStoreConfig()) ?? DEFAULT_CONFIG;
  const content = resolveContent(config.lang, config.contentJson);
  const isRTL = config.lang === "ar";
  return { config, content, isRTL };
}
