import { useEffect, useRef, useState } from "react";
import { API_URL, ERROR_MESSAGE } from "../utils/constants";
import { useDebounce } from "./useDebounce";
import { GithubUser } from "../types";


export default function useAutoCompleteData(query: string, delay: number) {
  const [data, setData] = useState<GithubUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<string | null>(null);
  const cache = useRef(new Map<string, GithubUser[]>());

  const fetchData = useDebounce(async (query: string) => {
    if (!query.trim()) return;
    setIsLoading(true);
    setIsError(null);
    if (cache.current.has(query)) {
      setData(cache.current.get(query)!);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}${query}`);
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }
      const data = await response.json();
      const userList = data.items.map((user: GithubUser) => ({
        id: user.id,
        login: user.login,
        html_url: user.html_url,
      }));
      cache.current.set(query, userList);
      setData(userList);
    } catch (error) {
      setIsError(error instanceof Error ? error.message : ERROR_MESSAGE);
      setData([]); // Clear data on error
    } finally {
      setIsLoading(false);
    }
  }, delay);

  useEffect(() => {
    fetchData(query);
  }, [query]);

  return { data, isLoading, isError };
}
