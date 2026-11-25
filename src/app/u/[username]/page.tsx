"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ExternalLink, GitFork, MapPin, Star } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import { fetchRepos, fetchUser } from "@/lib/github";
import { GitHubRepo, GitHubUser } from "@/types/github";

function ProfileView({ username }: { username: string }) {
  const router = useRouter();
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([fetchUser(username), fetchRepos(username)])
      .then(([userData, repoData]) => {
        if (cancelled) return;
        setUser(userData);
        setRepos(repoData);
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

  const popular = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 3);

  const stats = user
    ? [
        { label: "Repositories", value: user.public_repos },
        { label: "Followers", value: user.followers },
        { label: "Following", value: user.following },
      ]
    : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <SearchBar onSearch={(name) => router.push(`/u/${encodeURIComponent(name)}`)} />

      {loading && <p className="mt-10 text-sm text-muted">Loading...</p>}

      {error && (
        <p className="mt-10 rounded-lg border border-red-900 bg-red-950 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      {user && (
        <>
          <section className="mt-10 flex flex-col gap-8 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center">
            <Image
              src={user.avatar_url}
              alt={user.login}
              width={160}
              height={160}
              className="rounded-full ring-4 ring-accent/40"
            />

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">
                {user.name ?? user.login}
              </h1>
              <p className="text-muted">@{user.login}</p>

              {user.bio && <p className="mt-3 text-foreground">{user.bio}</p>}

              {user.location && (
                <p className="mt-3 flex items-center gap-2 text-sm text-muted">
                  <MapPin className="size-4" />
                  {user.location}
                </p>
              )}

              <a
                href={user.html_url}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-lg border border-accent px-4 py-2 text-sm font-medium text-accent hover:bg-accent hover:text-background"
              >
                View Profile
                <ExternalLink className="size-4" />
              </a>
            </div>
          </section>

          <section className="mt-6 grid grid-cols-3 gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-border bg-card p-4 text-center"
              >
                <p className="text-2xl font-semibold text-foreground">
                  {s.value.toLocaleString()}
                </p>
                <p className="text-sm text-muted">{s.label}</p>
              </div>
            ))}
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-semibold text-foreground">
              Popular Repositories
            </h2>

            {popular.length === 0 ? (
              <p className="mt-4 text-sm text-muted">No public repositories.</p>
            ) : (
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {popular.map((repo) => (
                  <a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-accent"
                  >
                    <h3 className="font-medium text-foreground">{repo.name}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted">
                      {repo.description ?? "No description"}
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-xs text-muted">
                      {repo.language && <span>{repo.language}</span>}
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
          </section>
        </>
      )}
    </div>
  );
}

export default function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  return <ProfileView key={username} username={username} />;
}