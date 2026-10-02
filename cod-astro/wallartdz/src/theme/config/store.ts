/**
 * Per-request store data helpers.
 * Call once per page — pass the returned config to StoreLayout to avoid
 * duplicate API fetches.
 */
import { fetchStoreConfig } from "@/core/api/client";
import { resolveContent } from "@/theme/content";
import type { StoreConfig } from "@/core/api/types";
import type { StoreFrontContent } from "@/theme/content";
import { BRAND } from "@/theme/config/brand";

export const DEFAULT_CONFIG: StoreConfig = {
  id: "",
  name: "WallArt DZ",
  domain: null,
  logoUrl: null,
  themeId: "wallartdz",
  primaryColor: BRAND.ink,
  accentColor: BRAND.terracotta,
  bgColor: BRAND.wall,
  fontFamily: BRAND.fontFamily,
  fontUrl: null,
  lang: "ar",
  currency: "DZD",
  currencySymbol: "دج",
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
