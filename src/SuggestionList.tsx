import React, { useEffect, useRef, JSX } from "react";
import { GithubUser } from "./types";
import highlightMatch from "./utils/highlightMatch";

interface SuggestionListProps {
  suggestions: GithubUser[];
  highlightIndex: number;
  handleSelect: (value: GithubUser) => void;
  query: string;
  onHover?: (index: number) => void;
  emptyMessage?: string;
  maxVisibleItems?: number;
  customRenderItem?: (user: GithubUser, isHighlighted: boolean) => JSX.Element;
}

const SuggestionList: React.FC<SuggestionListProps> = React.memo(
  ({
    suggestions,
    highlightIndex,
    handleSelect,
    query,
    onHover,
    emptyMessage,
    maxVisibleItems = 5,
    customRenderItem,
  }) => {
    const listRef = useRef<HTMLUListElement>(null);
    const highlightedItemRef = useRef<HTMLLIElement | null>(null);

    // Auto-scroll the highlighted item into view
    useEffect(() => {
      if (highlightedItemRef.current) {
        highlightedItemRef.current.scrollIntoView({
          block: "nearest", // Ensures smooth scrolling inside list
          behavior: "smooth",
        });
      }
    }, [highlightIndex]);

    return (
      <ul className="autocomplete-list" role="listbox" ref={listRef}>
        {suggestions.length === 0 ? (
          <li className="autocomplete-item">{emptyMessage}</li>
        ) : (
          suggestions.slice(0, maxVisibleItems).map((user, index) => (
            <li
              key={user.id}
              onMouseDown={(event) => {
                event.preventDefault(); // Prevents focus loss from input field
                handleSelect(user);
              }}
              ref={index === highlightIndex ? highlightedItemRef : null}
              onMouseEnter={() => onHover && onHover(index)}
              className={`autocomplete-item ${
                index === highlightIndex ? "highlighted" : ""
              }`}
              role="option"
              aria-selected={index === highlightIndex}
            >
              {customRenderItem
                ? customRenderItem(user, index === highlightIndex)
                : highlightMatch(user.login, query)}
            </li>
          ))
        )}
      </ul>
    );
  }
);

export default SuggestionList;
