"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const match = pathname.match(/^\/u\/([^/]+)/);
  const username = match ? match[1] : "octocat";

  const links = [
    { href: "/", label: "Home", active: pathname === "/" },
    {
      href: `/u/${username}/repos`,
      label: "Repositories",
      active: pathname.endsWith("/repos"),
    },
    { href: "/about", label: "About", active: pathname === "/about" },
  ];

  return (
    <nav className="border-b border-border bg-card/60 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Activity className="size-6 text-accent" />
          <span className="text-lg font-semibold text-foreground">
            DevPulse
          </span>
        </Link>

        <ul className="flex items-center gap-6 text-sm">
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className={`pb-1 transition-colors ${
                  link.active
                    ? "border-b-2 border-accent text-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}