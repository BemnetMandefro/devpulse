import { Star } from "lucide-react";
import { GitHubRepo } from "@/types/github";

export default function RepoList({ repos }: { repos: GitHubRepo[] }) {
  if (repos.length === 0) {
    return <p className="text-sm text-slate-500">No public repositories.</p>;
  }

  return (
    <div className="w-full max-w-md">
      <h3 className="mb-3 text-lg font-semibold text-slate-100">
        Repositories ({repos.length})
      </h3>

      <ul className="flex flex-col gap-3">
        {repos.map((repo) => (
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
              <p className="mt-1 text-sm text-slate-300">{repo.description}</p>
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
    </div>
  );
}