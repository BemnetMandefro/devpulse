"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export default function SearchBar({
  onSearch,
  placeholder = "Search for a GitHub username...",
}: {
  onSearch: (username: string) => void;
  placeholder?: string;
}) {
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const username = value.trim();
    if (username) onSearch(username);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-xl overflow-hidden rounded-xl border border-border bg-card focus-within:border-accent"
    >
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent py-3 pl-11 pr-3 text-sm text-foreground outline-none placeholder:text-muted"
        />
      </div>
      <button
        type="submit"
        className="bg-accent px-6 text-sm font-semibold text-background hover:opacity-90"
      >
        Search
      </button>
    </form>
  );
}