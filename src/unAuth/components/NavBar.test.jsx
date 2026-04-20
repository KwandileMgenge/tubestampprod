import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NavBar from "./NavBar";

describe("NavBar Component", () => {
  it("should render the navigation bar", () => {
    render(<NavBar />);
    const nav = screen.getByRole("banner");
    expect(nav).toBeInTheDocument();
  });

  it("should have the correct CSS class", () => {
    const { container } = render(<NavBar />);
    const nav = container.querySelector("header.navbar");
    expect(nav).toBeInTheDocument();
  });
});
