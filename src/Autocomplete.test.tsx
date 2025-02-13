import { render, fireEvent, waitFor } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import Autocomplete from './Autocomplete';
import userEvent from "@testing-library/user-event";

jest.mock("./hooks/useAutocompleteData", () => ({
  __esModule: true,
  default: (query: string) => ({
    data: query ? [{ id: 1, login: "abhishek", html_url: "https://github.com/abhishek" },
    { id: 2, login: "github-user", html_url: "https://github.com/github-user" },
    { id: 3, login: "john-doe", html_url: "https://github.com/john-doe" }] : [],
    isLoading: false,
    isError: null,
  }),
}));

describe("Autocomplete Component", () => {
  test("renders input field correctly", () => {
    render(
      <Autocomplete
        placeholder="Search GitHub users..."
        limit={5}
        delay={300}
      />
    );

    const input = screen.getByPlaceholderText("Search GitHub users...");
    expect(input).toBeInTheDocument();
  });

  test("displays suggestions when typing", async () => {
    render(
      <Autocomplete
        placeholder="Search GitHub users..."
        limit={5}
        delay={300}
      />
    );

    const input = screen.getByPlaceholderText("Search GitHub users...");
    await userEvent.type(input, "octo");

    const suggestion = await screen.findByText("abhishek");
    expect(suggestion).toBeInTheDocument();
  });

  test("does not show suggestions when input is empty", async () => {
    render(
      <Autocomplete
        placeholder="Search GitHub users..."
        limit={5}
        delay={300}
      />
    );

    const input = screen.getByPlaceholderText("Search GitHub users...");
    await userEvent.clear(input); // Ensures input is empty

    const suggestionList = screen.queryByRole("listbox"); // Check if dropdown is present
    expect(suggestionList).not.toBeInTheDocument(); // Should NOT exist
  });
});