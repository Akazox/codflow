// ╔══════════════════════════════════════════════════════════════════════╗
// ║  CUSTOMIZE HERE — DEFAULT_CONFIG only                                ║
// ║  Dentalix brand values. The live palette lives in global.css; these  ║
// ║  mirror it for <meta theme-color> and the API-unreachable fallback.  ║
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

export const DEFAULT_CONFIG: StoreConfig = {
  id: "",
  name: "Dentalix",
  domain: null,
  logoUrl: null,
  themeId: "dentalix",
  primaryColor: "#0e7490",
  accentColor: "#14b8a6",
  bgColor: "#ffffff",
  fontFamily: "Inter, IBM Plex Sans Arabic, sans-serif",
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
