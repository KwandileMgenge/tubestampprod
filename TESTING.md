# Testing Guide for TubeStamp

This project uses **Vitest** as the testing framework with React Testing Library for component testing.

## Setup & Installation

The testing environment is already configured. Required packages installed:
- **vitest** - Fast unit test framework
- **@testing-library/react** - React component testing utilities
- **@testing-library/jest-dom** - DOM matchers for assertions
- **@testing-library/user-event** - User interaction simulation
- **jsdom** - DOM environment for Node.js

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (re-runs on file changes)
```bash
npm test -- --watch
```

### Run tests with UI dashboard
```bash
npm test:ui
```
Opens an interactive dashboard at http://localhost:51204 to see test results visually.

### Run tests with coverage report
```bash
npm test:coverage
```

## Test Files Structure

Tests are colocated with components:
- `src/utils.test.js` - Utility function tests (120+ assertions)
- `src/App.test.jsx` - App component tests
- `src/unAuth/components/*.test.jsx` - Component-specific tests

## Test Coverage

### Utility Functions (src/utils.test.js)
- **timestampsCopyText()** - 6 tests
  - Handles null/undefined/non-object data
  - Processes timestamps_string and timestamps_list
  - Removes trailing newlines
  - Prefers timestamps_string over timestamps_list

- **isoDurationToMinutes()** - 9 tests
  - Parses ISO 8601 duration format
  - Handles hours, minutes, and seconds
  - Rounds up partial minutes
  - Returns 0 for invalid input

- **YouTube URL Validation** - 8 tests
  - Validates standard youtube.com watch URLs
  - Validates YouTube Shorts and youtu.be URLs
  - Extracts video IDs correctly
  - Handles query parameters

- **getBestThumbnail()** - 4 tests
  - Prefers highest quality thumbnail
  - Falls back to lower quality gracefully
  - Returns empty string for missing data

### Component Tests

#### Timestamp Component (13 tests)
- URL input validation and error messages
- Button state management during loading
- Video fetch and API error handling
- Duration checking (max 30 minutes)
- Error handling for missing videos or API keys
- API response processing

#### LandingPage Component (4 tests)
- Component rendering
- Child component presence (NavBar, Timestamp sections)
- Container structure

#### App Component (2 tests)
- Basic rendering
- Shell structure

#### NavBar Component (2 tests)
- Header element rendering
- CSS class validation

#### Footer Component (2 tests)
- Footer element rendering
- CSS class validation

## Configuration

### vitest.config.js
Main test configuration file that sets up:
- React plugin for JSX support
- jsdom environment for DOM testing
- CSS module support
- Test setup file

### src/vitest.setup.js
Global test setup that mocks:
- `window.matchMedia` for responsive design tests
- `window.scrollTo` for scroll behavior tests
- `navigator.clipboard` for clipboard operations

## Writing Tests

### Basic Test Structure
```javascript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MyComponent from "./MyComponent";

describe("MyComponent", () => {
  it("should render the component", () => {
    render(<MyComponent />);
    expect(screen.getByText("Expected Text")).toBeInTheDocument();
  });
});
```

### Testing User Interactions
```javascript
import userEvent from "@testing-library/user-event";

it("should handle user input", async () => {
  const user = userEvent.setup();
  render(<MyComponent />);
  
  const input = screen.getByRole("textbox");
  await user.type(input, "test value");
  
  expect(input).toHaveValue("test value");
});
```

### Mocking Async Operations
```javascript
import { vi } from "vitest";

beforeEach(() => {
  vi.clearAllMocks();
  fetch.mockClear();
});

it("should handle async operations", async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ data: "test" }),
  });
  
  render(<MyComponent />);
  // Test assertions...
});
```

## Best Practices

1. **Test User Behavior** - Use `@testing-library/user-event` to simulate real user interactions
2. **Avoid Implementation Details** - Query by accessible roles, labels, and text
3. **Mock External Dependencies** - Firebase, API calls, and environment variables
4. **Keep Tests Focused** - One assertion focus per test when possible
5. **Use Descriptive Names** - Test names should describe what they test
6. **Clean Up** - Use `beforeEach` to clear mocks and state between tests

## Common Testing Patterns

### Testing Form Submission
```javascript
const user = userEvent.setup();
const form = screen.getByRole("form");
await user.click(screen.getByRole("button", { name: /submit/i }));
expect(screen.getByText("Success")).toBeInTheDocument();
```

### Testing API Calls
```javascript
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: "test" }),
  })
);
```

### Testing Conditional Rendering
```javascript
const { rerender } = render(<Component isVisible={false} />);
expect(screen.queryByText("Content")).not.toBeInTheDocument();

rerender(<Component isVisible={true} />);
expect(screen.getByText("Content")).toBeInTheDocument();
```

## Debugging Tests

### View DOM Structure
```javascript
const { debug } = render(<MyComponent />);
debug(); // Prints the rendered DOM to console
```

### Check Screen Queries
```javascript
screen.debug(); // Shows all rendered elements
```

### Use `getByRole` for Accessibility
This ensures components are accessible:
```javascript
screen.getByRole("button", { name: /submit/i });
screen.getByRole("textbox", { name: /email/i });
```

## Continuous Integration

To run tests in CI/CD pipelines:
```bash
npm test -- run
```

This runs tests once without watch mode, suitable for automated testing environments.

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
