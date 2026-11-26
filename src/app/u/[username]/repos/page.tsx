"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  GitFork,
  Search,
  Star,
} from "lucide-react";
import { fetchRepos } from "@/lib/github";
import { GitHubRepo } from "@/types/github";

const PAGE_SIZE = 8;

const languageColors: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Python: "#3572a5",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  Go: "#00add8",
  Rust: "#dea584",
  Shell: "#89e051",
  Ruby: "#701516",
  PHP: "#4f5d95",
};

function ReposView({ username }: { username: string }) {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("all");
  const [page, setPage] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetchRepos(username)
      .then((data) => {
        if (!cancelled) setRepos(data);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Something went wrong.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [username]);

  const languages = Array.from(
    new Set(repos.map((r) => r.language).filter((l): l is string => !!l))
  ).sort();

  const q = query.trim().toLowerCase();
  const filtered = repos.filter((r) => {
    const matchesLanguage = language === "all" || r.language === language;
    const matchesQuery =
      !q ||
      r.name.toLowerCase().includes(q) ||
      (r.description ?? "").toLowerCase().includes(q);
    return matchesLanguage && matchesQuery;
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link
        href={`/u/${username}`}
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        Back to profile
      </Link>

      <h1 className="mt-4 text-3xl font-bold text-foreground">Repositories</h1>
      <p className="mt-1 text-muted">
        Explore all repositories from @{username}.
      </p>

      {loading && <p className="mt-10 text-sm text-muted">Loading...</p>}

      {error && (
        <p className="mt-10 rounded-lg border border-red-900 bg-red-950 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(0);
                }}
                placeholder="Search repositories..."
                className="w-full rounded-xl border border-border bg-card py-3 pl-11 pr-3 text-sm text-foreground outline-none placeholder:text-muted focus:border-accent"
              />
            </div>

            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                setPage(0);
              }}
              className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:border-accent"
            >
              <option value="all">All Languages</option>
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <p className="mt-10 text-sm text-muted">
              No repositories match your search.
            </p>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {visible.map((repo) => (
                <a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-accent"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-foreground">{repo.name}</h3>
                    <ExternalLink className="size-4 shrink-0 text-muted" />
                  </div>

                  <p className="mt-1 line-clamp-2 text-sm text-muted">
                    {repo.description ?? "No description"}
                  </p>

                  <div className="mt-4 flex items-center gap-4 text-xs text-muted">
                    {repo.language && (
                      <span className="flex items-center gap-1.5">
                        <span
                          className="size-2.5 rounded-full"
                          style={{
                            backgroundColor:
                              languageColors[repo.language] ?? "#38bdf8",
                          }}
                        />
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star className="size-3" />
                      {repo.stargazers_count.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="size-3" />
                      {repo.forks_count.toLocaleString()}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}

          {pageCount > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="rounded-lg p-2 text-muted hover:text-foreground disabled:opacity-30"
                aria-label="Previous page"
              >
                <ChevronLeft className="size-4" />
              </button>

              {Array.from({ length: pageCount }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`size-8 rounded-lg text-sm ${
                    i === page
                      ? "bg-accent font-semibold text-background"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                disabled={page === pageCount - 1}
                className="rounded-lg p-2 text-muted hover:text-foreground disabled:opacity-30"
                aria-label="Next page"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function ReposPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  return <ReposView key={username} username={username} />;
}