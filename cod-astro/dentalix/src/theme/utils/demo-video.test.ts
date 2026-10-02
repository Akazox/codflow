import { describe, it, expect } from "vitest";
import { parseDemoVideo, safePosterUrl, whatsappLink, phoneLink } from "./demo-video";

describe("parseDemoVideo", () => {
  it("accepts the common YouTube shapes and rebuilds a privacy-enhanced embed", () => {
    for (const raw of [
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "https://youtu.be/dQw4w9WgXcQ",
      "https://m.youtube.com/watch?v=dQw4w9WgXcQ&feature=share",
      "https://www.youtube.com/embed/dQw4w9WgXcQ",
      "https://www.youtube.com/shorts/dQw4w9WgXcQ",
      "  https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ  ",
    ]) {
      const video = parseDemoVideo(raw);
      expect(video?.kind, raw).toBe("youtube");
      expect(video?.embedUrl.startsWith("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?")).toBe(true);
    }
  });

  it("keeps a YouTube start time and nothing else from the query", () => {
    const video = parseDemoVideo("https://youtu.be/dQw4w9WgXcQ?t=1m30s&onload=alert(1)");
    expect(video?.embedUrl).toContain("start=90");
    expect(video?.embedUrl).not.toContain("onload");
  });

  it("accepts Vimeo links, including unlisted hashes", () => {
    expect(parseDemoVideo("https://vimeo.com/76979871")?.embedUrl).toBe(
      "https://player.vimeo.com/video/76979871?autoplay=1&dnt=1",
    );
    expect(parseDemoVideo("https://vimeo.com/76979871/abcdef1234")?.embedUrl).toContain("h=abcdef1234");
    expect(parseDemoVideo("https://player.vimeo.com/video/76979871?h=abcdef1234")?.kind).toBe("vimeo");
  });

  it("accepts a direct https mp4 file", () => {
    const video = parseDemoVideo("https://media.example.com/demo/tour.MP4#t=3");
    expect(video).toEqual({
      kind: "mp4",
      embedUrl: "https://media.example.com/demo/tour.MP4",
      watchUrl: "https://media.example.com/demo/tour.MP4",
    });
  });

  it("rejects everything else", () => {
    for (const raw of [
      "",
      "   ",
      "http://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "javascript:alert(1)//youtube.com",
      "https://evil.example/watch?v=dQw4w9WgXcQ",
      "https://youtube.com.evil.example/watch?v=dQw4w9WgXcQ",
      "https://www.youtube.com/watch?v=short",
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ\"><script>",
      "https://vimeo.com/channels/staffpicks",
      "https://media.example.com/demo.mov",
      "https://user:pass@media.example.com/demo.mp4",
      "data:video/mp4;base64,AAAA",
    ]) {
      expect(parseDemoVideo(raw), raw).toBeNull();
    }
  });
});

describe("contact helpers", () => {
  it("only lets https posters through", () => {
    expect(safePosterUrl("https://cdn.example.com/poster.jpg")).toBe("https://cdn.example.com/poster.jpg");
    expect(safePosterUrl("http://cdn.example.com/poster.jpg")).toBeNull();
    expect(safePosterUrl("javascript:alert(1)")).toBeNull();
  });

  it("builds wa.me and tel: links from loosely typed numbers", () => {
    expect(whatsappLink("+213 555 12 34 56", "Bonjour")).toBe("https://wa.me/213555123456?text=Bonjour");
    expect(whatsappLink("abc", "x")).toBeNull();
    expect(phoneLink("0555 12 34 56")).toBe("tel:0555123456");
    expect(phoneLink("+213 (0) 555-12-34-56")).toBe("tel:+2130555123456");
    expect(phoneLink("")).toBeNull();
  });
});
