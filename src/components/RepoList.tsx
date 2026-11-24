"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { GitHubRepo } from "@/types/github";

type SortOption = "updated" | "stars" | "name";

export default function RepoList({ repos }: { repos: GitHubRepo[] }) {
  const [sortBy, setSortBy] = useState<SortOption>("updated");
  const [language, setLanguage] = useState("all");

  if (repos.length === 0) {
    return <p className="text-sm text-slate-500">No public repositories.</p>;
  }

  const languages = Array.from(
    new Set(repos.map((r) => r.language).filter((l): l is string => !!l))
  ).sort();

  const filtered =
    language === "all" ? repos : repos.filter((r) => r.language === language);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "stars") return b.stargazers_count - a.stargazers_count;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return (
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  });

  const selectClass =
    "rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100 outline-none focus:border-indigo-500";

  return (
    <div className="w-full max-w-md">
      <h3 className="mb-3 text-lg font-semibold text-slate-100">
        Repositories ({sorted.length})
      </h3>

      <div className="mb-3 flex gap-2">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className={selectClass}
        >
          <option value="all">All languages</option>
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className={selectClass}
        >
          <option value="updated">Recently updated</option>
          <option value="stars">Most stars</option>
          <option value="name">Name (A-Z)</option>
        </select>
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-slate-500">No repos match this filter.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {sorted.map((repo) => (
            <li
              key={repo.id}
              className="rounded-xl border border-slate-800 bg-slate-900 p-4"
            >
              <a
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-indigo-400 hover:underline"
              >
                {repo.name}
              </a>

              {repo.description && (
                <p className="mt-1 text-sm text-slate-300">
                  {repo.description}
                </p>
              )}

              <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
                {repo.language && <span>{repo.language}</span>}
                <span className="flex items-center gap-1">
                  <Star className="size-3" />
                  {repo.stargazers_count.toLocaleString()}
                </span>
                <span>
                  Updated {new Date(repo.updated_at).toLocaleDateString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}