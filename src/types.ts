export interface GithubUser {
    id: number;
    login: string;
    html_url: string;
  }
  
  export interface AutocompleteProps {
    placeholder?: string;
    limit: number;
    delay: number;
  }
  