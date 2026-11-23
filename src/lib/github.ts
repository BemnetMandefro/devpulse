import { GitHubUser, GitHubRepo } from "@/types/github";

const BASE_URL = "https://api.github.com";

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);

  if (res.status === 404) {
    throw new Error("User not found");
  }

  if (res.status === 403 || res.status === 429) {
    throw new Error("GitHub rate limit reached. Try again in a few minutes.");
  }

  if (!res.ok) {
    throw new Error("Something went wrong. Please try again.");
  }

  return res.json();
}

export function fetchUser(username: string): Promise<GitHubUser> {
  return request<GitHubUser>(`/users/${encodeURIComponent(username)}`);
}

export function fetchRepos(username: string): Promise<GitHubRepo[]> {
  return request<GitHubRepo[]>(
    `/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`
  );
}