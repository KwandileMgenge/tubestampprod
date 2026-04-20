import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

vi.mock("./firebase", () => ({
  functions: {},
}));

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render without crashing", () => {
    render(<App />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("should render the landing page", () => {
    render(<App />);
    const shell = screen.getByRole("main").parentElement;
    expect(shell).toHaveClass("app__shell");
  });
});
