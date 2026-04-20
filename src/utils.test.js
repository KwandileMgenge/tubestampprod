import { describe, it, expect } from "vitest";

/**
 * Utility function tests
 * These test helper functions used in components
 */

// Test: timestampsCopyText
describe("timestampsCopyText", () => {
  function timestampsCopyText(data) {
    if (!data || typeof data !== "object") return "";
    if (
      typeof data.timestamps_string === "string" &&
      data.timestamps_string.trim()
    ) {
      return data.timestamps_string.replace(/\n+$/, "");
    }
    if (Array.isArray(data.timestamps_list)) {
      return data.timestamps_list.join("\n");
    }
    return "";
  }

  it("should return empty string for null or undefined data", () => {
    expect(timestampsCopyText(null)).toBe("");
    expect(timestampsCopyText(undefined)).toBe("");
  });

  it("should return empty string for non-object data", () => {
    expect(timestampsCopyText("string")).toBe("");
    expect(timestampsCopyText(123)).toBe("");
    expect(timestampsCopyText([])).toBe("");
  });

  it("should return timestamps_string without trailing newlines", () => {
    const data = { timestamps_string: "0:00 - Intro\n1:30 - Main Content\n" };
    expect(timestampsCopyText(data)).toBe("0:00 - Intro\n1:30 - Main Content");
  });

  it("should return empty string for empty timestamps_string", () => {
    const data = { timestamps_string: "   \n\n" };
    expect(timestampsCopyText(data)).toBe("");
  });

  it("should join timestamps_list with newlines", () => {
    const data = {
      timestamps_list: ["0:00 - Intro", "1:30 - Main", "5:00 - Outro"],
    };
    expect(timestampsCopyText(data)).toBe("0:00 - Intro\n1:30 - Main\n5:00 - Outro");
  });

  it("should prefer timestamps_string over timestamps_list", () => {
    const data = {
      timestamps_string: "0:00 - Start",
      timestamps_list: ["1:00 - Other"],
    };
    expect(timestampsCopyText(data)).toBe("0:00 - Start");
  });

  it("should handle empty timestamps_list", () => {
    const data = { timestamps_list: [] };
    expect(timestampsCopyText(data)).toBe("");
  });
});

// Test: isoDurationToMinutes
describe("isoDurationToMinutes", () => {
  function isoDurationToMinutes(duration) {
    if (!duration || typeof duration !== "string") return 0;
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const matches = duration.match(regex);
    if (!matches) return 0;
    const hours = parseInt(matches[1] || 0, 10);
    const minutes = parseInt(matches[2] || 0, 10);
    const seconds = parseInt(matches[3] || 0, 10);
    return hours * 60 + minutes + (seconds > 0 ? 1 : 0);
  }

  it("should return 0 for null or undefined duration", () => {
    expect(isoDurationToMinutes(null)).toBe(0);
    expect(isoDurationToMinutes(undefined)).toBe(0);
  });

  it("should return 0 for non-string duration", () => {
    expect(isoDurationToMinutes(123)).toBe(0);
    expect(isoDurationToMinutes({})).toBe(0);
  });

  it("should return 0 for invalid ISO 8601 format", () => {
    expect(isoDurationToMinutes("invalid")).toBe(0);
    expect(isoDurationToMinutes("")).toBe(0);
  });

  it("should parse hours correctly", () => {
    expect(isoDurationToMinutes("PT1H")).toBe(60);
    expect(isoDurationToMinutes("PT2H")).toBe(120);
  });

  it("should parse minutes correctly", () => {
    expect(isoDurationToMinutes("PT30M")).toBe(30);
    expect(isoDurationToMinutes("PT5M")).toBe(5);
  });

  it("should parse seconds correctly (rounds up)", () => {
    expect(isoDurationToMinutes("PT30S")).toBe(1);
    expect(isoDurationToMinutes("PT0S")).toBe(0);
  });

  it("should parse combined formats correctly", () => {
    expect(isoDurationToMinutes("PT1H30M")).toBe(90);
    expect(isoDurationToMinutes("PT2H45M30S")).toBe(166); // 120 + 45 + 1
    expect(isoDurationToMinutes("PT10M45S")).toBe(11); // 10 + 1
  });
});

// Test: YouTube URL validation regex
describe("YouTube URL Validation", () => {
  const youtubeUrlRegex =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[?&/#][^\s]*)?$/i;

  function isValidYoutubeUrl(url) {
    return youtubeUrlRegex.test(url.trim());
  }

  function extractVideoId(url) {
    const match = url.trim().match(youtubeUrlRegex);
    return match ? match[1] : null;
  }

  it("should validate standard youtube.com watch URLs", () => {
    expect(isValidYoutubeUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(true);
    expect(isValidYoutubeUrl("https://youtube.com/watch?v=dQw4w9WgXcQ")).toBe(true);
    expect(isValidYoutubeUrl("http://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(true);
  });

  it("should validate youtube shorts URLs", () => {
    expect(isValidYoutubeUrl("https://www.youtube.com/shorts/dQw4w9WgXcQ")).toBe(true);
  });

  it("should validate youtu.be short URLs", () => {
    expect(isValidYoutubeUrl("https://youtu.be/dQw4w9WgXcQ")).toBe(true);
    expect(isValidYoutubeUrl("youtu.be/dQw4w9WgXcQ")).toBe(true);
  });

  it("should validate embed URLs", () => {
    expect(isValidYoutubeUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe(true);
  });

  it("should validate URLs with query parameters", () => {
    expect(isValidYoutubeUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10s")).toBe(
      true
    );
    expect(isValidYoutubeUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLxxx")).toBe(
      true
    );
  });

  it("should reject invalid video IDs", () => {
    expect(isValidYoutubeUrl("https://www.youtube.com/watch?v=short")).toBe(false);
    expect(isValidYoutubeUrl("https://www.youtube.com/watch?v=toolongivideoidthatistoolongg")).toBe(
      false
    );
  });

  it("should reject non-youtube URLs", () => {
    expect(isValidYoutubeUrl("https://www.example.com/video/dQw4w9WgXcQ")).toBe(false);
    expect(isValidYoutubeUrl("https://www.vimeo.com/dQw4w9WgXcQ")).toBe(false);
  });

  it("should extract video IDs correctly", () => {
    expect(extractVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
      "dQw4w9WgXcQ"
    );
    expect(extractVideoId("youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(extractVideoId("https://www.youtube.com/shorts/dQw4w9WgXcQ")).toBe(
      "dQw4w9WgXcQ"
    );
  });

  it("should return null for invalid URLs", () => {
    expect(extractVideoId("invalid-url")).toBe(null);
  });
});

// Test: Thumbnail selection
describe("getBestThumbnail", () => {
  function getBestThumbnail(thumbnails) {
    return (
      thumbnails?.maxres?.url ||
      thumbnails?.standard?.url ||
      thumbnails?.high?.url ||
      thumbnails?.medium?.url ||
      thumbnails?.default?.url ||
      ""
    );
  }

  it("should prefer maxres thumbnail", () => {
    const thumbnails = {
      default: { url: "default.jpg" },
      medium: { url: "medium.jpg" },
      high: { url: "high.jpg" },
      standard: { url: "standard.jpg" },
      maxres: { url: "maxres.jpg" },
    };
    expect(getBestThumbnail(thumbnails)).toBe("maxres.jpg");
  });

  it("should use standard if maxres not available", () => {
    const thumbnails = {
      default: { url: "default.jpg" },
      medium: { url: "medium.jpg" },
      high: { url: "high.jpg" },
      standard: { url: "standard.jpg" },
    };
    expect(getBestThumbnail(thumbnails)).toBe("standard.jpg");
  });

  it("should fall back to high thumbnail", () => {
    const thumbnails = {
      default: { url: "default.jpg" },
      medium: { url: "medium.jpg" },
      high: { url: "high.jpg" },
    };
    expect(getBestThumbnail(thumbnails)).toBe("high.jpg");
  });

  it("should return empty string if no thumbnails available", () => {
    expect(getBestThumbnail(null)).toBe("");
    expect(getBestThumbnail(undefined)).toBe("");
    expect(getBestThumbnail({})).toBe("");
  });
});
