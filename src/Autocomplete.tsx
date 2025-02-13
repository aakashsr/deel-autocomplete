import React, { useState, useRef, useCallback } from "react";
import useAutoCompleteData from "./hooks/useAutocompleteData";
import { AutocompleteProps, GithubUser } from "./types";
import { LOADING_MESSAGE, NO_RESULTS_MESSAGE } from "./utils/constants";
import highlightMatch from "./utils/highlightMatch";
import SuggestionList from "./SuggestionList";

const Autocomplete: React.FC<AutocompleteProps> = ({
  placeholder,
  limit,
  delay,
}) => {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data, isLoading, isError } = useAutoCompleteData(query, delay);

  const handleSelect = useCallback((selectedUser: GithubUser) => {
    setQuery(selectedUser.login);
    // close dropdown after selection
    setShowDropdown(false);
    setHighlightIndex(-1); // reset highlight
    inputRef.current?.blur(); // remove focus
    window.open(selectedUser.html_url, "_blank");
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (data.length === 0) return;

      const visibleSuggestions: GithubUser[] = Array.isArray(data)
        ? data.slice(0, limit)
        : [];

      const maxIndex = visibleSuggestions.length - 1;

      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        setHighlightIndex((prev) =>
          e.key === "ArrowDown"
            ? prev >= maxIndex
              ? 0
              : prev + 1
            : e.key === "ArrowUp"
              ? prev <= 0
                ? maxIndex
                : prev - 1
              : prev
        );
      } else if (e.key === "Enter") {
        if (highlightIndex >= 0) {
          // If a suggestion is highlighted, open its GitHub profile
          handleSelect(data[highlightIndex]);
          setShowDropdown(false); // close dropdown after selecting suggestion using enter
        } else if (query.trim() !== "") {
          // If no suggestion is highlighted, open GitHub for the typed query
          window.open(`https://github.com/${query}`, "_blank");
        }
      } else if (e.key === "Tab") {
        setShowDropdown(false);
        setHighlightIndex(-1);
      }
    },
    [data, highlightIndex]
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let query = e.target.value;
    setQuery(query);
    setShowDropdown(e.target.value.trim() !== "");
  }, []);

  const handleHover = useCallback((index: number) => {
    setHighlightIndex((prev) => (prev !== index ? index : prev));
  }, []);

  const handleClear = () => {
    setQuery("");
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  return (
    <div className="autocomplete-container">
      <div className="autocomplete">
        <span className="search-icon">🔍</span>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder || "Search..."}
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={() => setShowDropdown(false)}
          onFocus={() => setShowDropdown(true)}
          aria-autocomplete="list"
          aria-controls="autocomplete-list"
          className="autocomplete-input"
        />

        {query && (
          <span className="clear-icon" onClick={handleClear}>
            ❌
          </span>
        )}
      </div>

      {isError && <div className="autocomplete-error">{isError}</div>}
      {showDropdown && query.trim() !== "" && !isError && (
        <SuggestionList
          suggestions={
            isLoading
              ? [{ id: 0, login: LOADING_MESSAGE, html_url: "" }]
              : ((Array.isArray(data)
                ? data.slice(0, limit)
                : []) as GithubUser[])
          }
          highlightIndex={isLoading ? -1 : highlightIndex}
          handleSelect={(value) => {
            if (!isLoading) handleSelect(value);
          }}
          query={query}
          onHover={handleHover}
          emptyMessage={
            !isLoading && data.length === 0 && query.trim() !== ""
              ? NO_RESULTS_MESSAGE
              : ""
          }
          maxVisibleItems={limit}
          customRenderItem={(item, isHighlighted) =>
            item.login === LOADING_MESSAGE ? (
              <div style={{ fontStyle: "italic", color: "#777" }}>
                {item.login}
              </div>
            ) : (
              <div style={{ fontWeight: isHighlighted ? "bold" : "normal" }}>
                {highlightMatch(item.login, query)}
              </div>
            )
          }
        />
      )}
    </div>
  );
};

export default Autocomplete;
