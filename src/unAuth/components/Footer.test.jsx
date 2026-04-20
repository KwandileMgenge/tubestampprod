import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

describe("Footer Component", () => {
  it("should render the footer", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("should have the correct CSS class", () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector("footer.footer");
    expect(footer).toBeInTheDocument();
  });
});
