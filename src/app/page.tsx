"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { History, Trash2 } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import { fetchUser } from "@/lib/github";
import {
  clearHistory,
  getHistorySnapshot,
  getServerSnapshot,
  subscribe,
} from "@/lib/history";
import { mockUser } from "@/data/mock";
import { GitHubUser } from "@/types/github";

const compact = new Intl.NumberFormat("en", { notation: "compact" });

export default function Home() {
  const router = useRouter();
  const [featured, setFeatured] = useState<GitHubUser>(mockUser);
  const recent = useSyncExternalStore(
    subscribe,
    getHistorySnapshot,
    getServerSnapshot
  );

  useEffect(() => {
    fetchUser("octocat")
      .then(setFeatured)
      .catch(() => {
        // keep the mock data if the request fails
      });
  }, []);

  function handleSearch(username: string) {
    router.push(`/u/${encodeURIComponent(username)}`);
  }

  const stats = [
    { label: "Repositories", value: featured.public_repos },
    { label: "Followers", value: featured.followers },
    { label: "Following", value: featured.following },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <section className="max-w-2xl">
        <h1 className="text-5xl font-bold leading-tight text-foreground">
          Discover developers on <span className="text-accent">GitHub.</span>
        </h1>
        <p className="mt-4 text-lg text-muted">
          Search any GitHub account and explore their profile, repositories and
          more with DevPulse.
        </p>
        <div className="mt-8">
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      <section className="mt-12 max-w-3xl rounded-2xl border border-border bg-card p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          Featured profile
        </p>

        <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Image
              src={featured.avatar_url}
              alt={featured.login}
              width={56}
              height={56}
              className="rounded-full"
            />
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {featured.name ?? featured.login}
              </h2>
              <p className="text-sm text-muted">@{featured.login}</p>
            </div>
          </div>

          <div className="flex gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-lg font-semibold text-foreground">
                  {compact.format(s.value)}
                </p>
                <p className="text-xs text-muted">{s.label}</p>
              </div>
            ))}
          </div>

          <Link
            href={`/u/${featured.login}`}
            className="rounded-lg border border-accent px-4 py-2 text-center text-sm font-medium text-accent hover:bg-accent hover:text-background"
          >
            Explore Profile →
          </Link>
        </div>
      </section>

      {recent.length > 0 && (
        <section className="mt-10 max-w-3xl">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold text-foreground">
              <History className="size-4 text-muted" />
              Recent Searches
            </h2>
            <button
              onClick={clearHistory}
              className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
            >
              <Trash2 className="size-4" />
              Clear History
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {recent.map((name) => (
              <Link
                key={name}
                href={`/u/${name}`}
                className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-foreground hover:border-accent"
              >
                {name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}