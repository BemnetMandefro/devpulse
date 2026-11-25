import { Activity } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 sm:flex-row">
        <div className="flex items-center gap-2">
          <Activity className="size-5 text-accent" />
          <span className="font-semibold text-foreground">DevPulse</span>
        </div>

        <p className="text-sm text-muted">
          Your window to the GitHub universe
        </p>

        <p className="text-xs text-muted">
          Built with Next.js, TypeScript and Tailwind CSS
        </p>
      </div>
    </footer>
  );
}