"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import ProfileCard from "@/components/ProfileCard";
import { mockUser } from "@/data/mock";

export default function Home() {
  const [searched, setSearched] = useState<string | null>(null);

  return (
    <main className="flex min-h-screen flex-col items-center gap-8 bg-slate-950 px-4 py-16">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-slate-100">DevPulse</h1>
        <p className="mt-2 text-slate-400">Explore any GitHub profile.</p>
      </header>

      <SearchBar onSearch={setSearched} />

      {searched && (
        <p className="text-xs text-slate-500">
          Showing mock data (searched: {searched})
        </p>
      )}

      <ProfileCard user={mockUser} />
    </main>
  );
}