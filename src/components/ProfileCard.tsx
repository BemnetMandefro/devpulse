import Image from "next/image";
import { GitHubUser } from "@/types/github";

export default function ProfileCard({ user }: { user: GitHubUser }) {
  const stats = [
    { label: "Followers", value: user.followers },
    { label: "Following", value: user.following },
    { label: "Repos", value: user.public_repos },
  ];

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center gap-4">
        <Image
          src={user.avatar_url}
          alt={user.login}
          width={72}
          height={72}
          className="rounded-full"
        />
        <div>
          <h2 className="text-xl font-semibold text-slate-100">
            {user.name ?? user.login}
          </h2>
          <a
            href={user.html_url}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-indigo-400 hover:underline"
          >
            @{user.login}
          </a>
        </div>
      </div>

      {user.bio && <p className="mt-4 text-sm text-slate-300">{user.bio}</p>}

      <div className="mt-6 grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg bg-slate-800 p-3 text-center">
            <p className="text-lg font-semibold text-slate-100">
              {s.value.toLocaleString()}
            </p>
            <p className="text-xs text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}