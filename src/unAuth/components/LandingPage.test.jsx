import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import LandingPage from "./LandingPage";

vi.mock("../../firebase", () => ({
  functions: {},
}));

describe("LandingPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the landing page", () => {
    render(<LandingPage />);
    const landing = screen.getByRole("main");
    expect(landing).toHaveClass("landing");
  });

  it("should contain a navigation bar", () => {
    render(<LandingPage />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("should contain the timestamp section", () => {
    render(<LandingPage />);
    expect(screen.getByText("YouTube Video Preview")).toBeInTheDocument();
  });

  it("should render with proper container class", () => {
    const { container } = render(<LandingPage />);
    const landingContainer = container.querySelector(".landing__container");
    expect(landingContainer).toBeInTheDocument();
  });
});
