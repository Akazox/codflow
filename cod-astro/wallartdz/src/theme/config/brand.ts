/**
 * WallArt DZ brand constants that have to exist outside CSS.
 *
 * The palette itself lives in styles/global.css (`--brand-*`). These mirror the
 * two values a <meta> tag and the offline DEFAULT_CONFIG need — change them
 * together with global.css.
 */
export const BRAND = {
  ink: "#1f2a44",
  wall: "#f7f5f0",
  terracotta: "#e07a5f",
  fontFamily: "IBM Plex Sans Arabic, sans-serif",
  fontsHref:
    "https://fonts.googleapis.com/css2?family=El+Messiri:wght@500;600;700&family=Fraunces:opsz,wght@9..144,500;9..144,600&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap",
} as const;
