"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTrackerStore } from "@/store/useTrackerStore";
import { allProblems } from "@/data/problems";
import { Search } from "lucide-react";

export function Navbar() {
  const problemsData = useTrackerStore((state) => state.problemsData);
  const router = useRouter();
  const [query, setQuery] = useState("");
  
  const total = allProblems.length;
  const solved = allProblems.filter((p) => problemsData[p.id]?.status === "Solved").length;
  const percentage = total === 0 ? 0 : Math.round((solved / total) * 100);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      router.push(`/all?search=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/50 bg-background/50 px-8 backdrop-blur-xl">
      <div className="flex items-center gap-4 w-full max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search problems... (Press Enter)" 
            className="w-full h-9 rounded-full bg-muted/50 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-shadow"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-semibold">{solved} / {total} Solved</div>
            <div className="text-xs text-muted-foreground">Overall Progress</div>
          </div>
          <div className="relative h-10 w-10">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-muted/30"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="text-indigo-500 transition-all duration-1000 ease-out"
                strokeDasharray={`${percentage}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
              {percentage}%
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
