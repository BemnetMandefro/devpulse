import { Check } from "lucide-react";

const features = [
  "Search any GitHub account",
  "View detailed profiles and stats",
  "Explore and filter repositories",
  "Recent searches saved in your browser",
];

const stack = ["Next.js", "TypeScript", "Tailwind CSS", "GitHub API"];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold text-foreground">About DevPulse</h1>
      <p className="mt-2 text-lg text-accent">
        Your window to the GitHub universe
      </p>

      <p className="mt-6 text-muted">
        DevPulse is a fast, clean way to search and explore GitHub profiles and
        repositories. It was built as a frontend portfolio project with
        Next.js, TypeScript and Tailwind CSS, and it is powered by the public
        GitHub API.
      </p>

      <ul className="mt-8 flex flex-col gap-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-3 text-foreground">
            <span className="flex size-5 items-center justify-center rounded-full bg-accent/20 text-accent">
              <Check className="size-3" />
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-10 rounded-2xl border border-border bg-card p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          Built with
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {stack.map((item) => (
            <span
              key={item}
              className="rounded-full border border-border px-4 py-1.5 text-sm text-foreground"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}