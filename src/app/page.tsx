"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import ProfileCard from "@/components/ProfileCard";
import RepoList from "@/components/RepoList";
import { fetchUser, fetchRepos } from "@/lib/github";
import { GitHubUser, GitHubRepo } from "@/types/github";

export default function Home() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(username: string) {
    setLoading(true);
    setError(null);

    try {
      const [userData, repoData] = await Promise.all([
        fetchUser(username),
        fetchRepos(username),
      ]);
      setUser(userData);
      setRepos(repoData);
    } catch (err) {
      setUser(null);
      setRepos([]);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-8 bg-slate-950 px-4 py-16">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-slate-100">DevPulse</h1>
        <p className="mt-2 text-slate-400">Explore any GitHub profile.</p>
      </header>

      <SearchBar onSearch={handleSearch} />

      {loading && <p className="text-sm text-slate-400">Loading...</p>}

      {error && (
        <p className="rounded-lg border border-red-900 bg-red-950 px-4 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      {!loading && !error && !user && (
        <p className="text-sm text-slate-500">
          Search a username to get started.
        </p>
      )}

      {!loading && user && (
        <>
          <ProfileCard user={user} />
          <RepoList repos={repos} />
        </>
      )}
    </main>
  );
}