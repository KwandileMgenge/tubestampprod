import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Timestamp from "./Timestamp";

// Mock Firebase
vi.mock("../../firebase", () => ({
  functions: {},
}));

// Mock httpsCallable
vi.mock("firebase/functions", () => ({
  httpsCallable: vi.fn(),
}));

// Mock environment variables
vi.stubGlobal("import", {
  meta: {
    env: {
      VITE_YOUTUBE_API_KEY: "test-api-key",
    },
  },
});

// Mock fetch
global.fetch = vi.fn();

describe("Timestamp Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetch.mockClear();
    localStorage.clear();
    window.scrollTo.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render the component", () => {
    render(<Timestamp />);
    expect(screen.getByText("YouTube Video Preview")).toBeInTheDocument();
    expect(screen.getByText("Paste a YouTube URL to load the thumbnail and title.")).toBeInTheDocument();
  });

  it("should render YouTube URL input field", () => {
    render(<Timestamp />);
    const input = screen.getByRole("textbox", { name: /YouTube URL/i });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "url");
  });

  it("should render Get Preview button", () => {
    render(<Timestamp />);
    const button = screen.getByRole("button", { name: /Get Preview/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it("should enable button when valid URL is entered", async () => {
    const user = userEvent.setup();
    render(<Timestamp />);
    const input = screen.getByRole("textbox", { name: /YouTube URL/i });
    const button = screen.getByRole("button", { name: /Get Preview/i });

    await user.type(input, "https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    expect(button).not.toBeDisabled();
  });

  it("should disable button when invalid URL is entered", async () => {
    const user = userEvent.setup();
    render(<Timestamp />);
    const input = screen.getByRole("textbox", { name: /YouTube URL/i });
    const button = screen.getByRole("button", { name: /Get Preview/i });

    await user.type(input, "not-a-valid-url");
    expect(button).toBeDisabled();
  });

  it("should show error message on blur if URL is invalid", async () => {
    const user = userEvent.setup();
    render(<Timestamp />);
    const input = screen.getByRole("textbox", { name: /YouTube URL/i });

    await user.type(input, "invalid-url");
    await user.tab();

    expect(screen.getByText("Please enter a valid YouTube URL.")).toBeInTheDocument();
  });

  it("should clear error message when valid URL is entered", async () => {
    const user = userEvent.setup();
    render(<Timestamp />);
    const input = screen.getByRole("textbox", { name: /YouTube URL/i });

    await user.type(input, "invalid-url");
    await user.tab();
    expect(screen.getByText("Please enter a valid YouTube URL.")).toBeInTheDocument();

    await user.clear(input);
    await user.type(input, "https://www.youtube.com/watch?v=dQw4w9WgXcQ");

    expect(screen.queryByText("Please enter a valid YouTube URL.")).not.toBeInTheDocument();
  });

  it("should handle successful video fetch", async () => {
    const user = userEvent.setup();
    const mockResponse = {
      ok: true,
      json: async () => ({
        items: [
          {
            snippet: {
              title: "Test Video",
              thumbnails: {
                default: { url: "default.jpg" },
                high: { url: "high.jpg" },
              },
            },
            contentDetails: {
              duration: "PT10M",
            },
          },
        ],
      }),
    };

    fetch.mockResolvedValueOnce(mockResponse);

    render(<Timestamp />);
    const input = screen.getByRole("textbox", { name: /YouTube URL/i });
    const button = screen.getByRole("button", { name: /Get Preview/i });

    await user.type(input, "https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("Test Video")).toBeInTheDocument();
    });
  });

  it("should show error for videos longer than 30 minutes", async () => {
    const user = userEvent.setup();
    const mockResponse = {
      ok: true,
      json: async () => ({
        items: [
          {
            snippet: {
              title: "Long Video",
              thumbnails: {
                default: { url: "default.jpg" },
              },
            },
            contentDetails: {
              duration: "PT45M",
            },
          },
        ],
      }),
    };

    fetch.mockResolvedValueOnce(mockResponse);

    render(<Timestamp />);
    const input = screen.getByRole("textbox", { name: /YouTube URL/i });
    const button = screen.getByRole("button", { name: /Get Preview/i });

    await user.type(input, "https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText(/45 minutes long/)).toBeInTheDocument();
    });
  });

  it("should handle fetch error gracefully", async () => {
    const user = userEvent.setup();
    fetch.mockRejectedValueOnce(new Error("Network error"));

    render(<Timestamp />);
    const input = screen.getByRole("textbox", { name: /YouTube URL/i });
    const button = screen.getByRole("button", { name: /Get Preview/i });

    await user.type(input, "https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });
  });

  it("should show error when no video is found", async () => {
    const user = userEvent.setup();
    const mockResponse = {
      ok: true,
      json: async () => ({
        items: [],
      }),
    };

    fetch.mockResolvedValueOnce(mockResponse);

    render(<Timestamp />);
    const input = screen.getByRole("textbox", { name: /YouTube URL/i });
    const button = screen.getByRole("button", { name: /Get Preview/i });

    await user.type(input, "https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("No video found for this URL.")).toBeInTheDocument();
    });
  });

  it("should show API error message on fetch failure", async () => {
    const user = userEvent.setup();
    const mockResponse = {
      ok: false,
      json: async () => ({
        error: { message: "Invalid API Key" },
      }),
    };

    fetch.mockResolvedValueOnce(mockResponse);

    render(<Timestamp />);
    const input = screen.getByRole("textbox", { name: /YouTube URL/i });
    const button = screen.getByRole("button", { name: /Get Preview/i });

    await user.type(input, "https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("Invalid API Key")).toBeInTheDocument();
    });
  });

  it("should disable button while loading", async () => {
    const user = userEvent.setup();
    const mockResponse = {
      ok: true,
      json: async () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                items: [
                  {
                    snippet: {
                      title: "Test Video",
                      thumbnails: {
                        default: { url: "default.jpg" },
                      },
                    },
                    contentDetails: {
                      duration: "PT10M",
                    },
                  },
                ],
              }),
            100
          )
        ),
    };

    fetch.mockResolvedValueOnce(mockResponse);

    render(<Timestamp />);
    const input = screen.getByRole("textbox", { name: /YouTube URL/i });
    const button = screen.getByRole("button", { name: /Get Preview/i });

    await user.type(input, "https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    await user.click(button);

    expect(screen.getByRole("button", { name: /Loading/i })).toBeDisabled();
  });
});
