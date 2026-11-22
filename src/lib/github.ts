import { GitHubUser } from "@/types/github";

const BASE_URL = "https://api.github.com";

export async function fetchUser(username: string): Promise<GitHubUser> {
  const res = await fetch(`${BASE_URL}/users/${encodeURIComponent(username)}`);

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