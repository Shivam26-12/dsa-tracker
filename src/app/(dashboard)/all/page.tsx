"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { allProblems } from "@/data/problems";
import { Problem } from "@/data/types";
import { useTrackerStore } from "@/store/useTrackerStore";
import { ProblemDrawer } from "@/components/ProblemDrawer";
import { cn } from "@/lib/utils";
import { Search, Filter, Star, CheckCircle2, Circle } from "lucide-react";

function AllQuestionsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  
  const [search, setSearch] = useState(initialSearch);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [sortOrder, setSortOrder] = useState<"none" | "asc" | "desc">("none");
  const [showFilter, setShowFilter] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"All" | "Solved" | "Unsolved" | "In Progress">("All");
  
  useEffect(() => {
    if (searchParams.get("search") !== null) {
      setSearch(searchParams.get("search") || "");
    }
  }, [searchParams]);
  
  const { problemsData, toggleFavorite } = useTrackerStore();

  const normalizedSearch = search.toLowerCase().trim().replace('bsf', 'bfs');

  const filteredProblems = allProblems.filter((p) => {
    const data = problemsData[p.id];
    const status = data?.status || "Unsolved";
    
    if (filterStatus !== "All" && status !== filterStatus) return false;

    return p.title.toLowerCase().includes(normalizedSearch) || 
           p.topic.toLowerCase().includes(normalizedSearch) ||
           p.pattern.toLowerCase().includes(normalizedSearch);
  });

  const sortedProblems = [...filteredProblems].sort((a, b) => {
    if (sortOrder === "none") return 0;
    
    const difficultyWeight = { "Easy": 1, "Medium": 2, "Hard": 3 };
    const weightA = difficultyWeight[a.difficulty as keyof typeof difficultyWeight] || 0;
    const weightB = difficultyWeight[b.difficulty as keyof typeof difficultyWeight] || 0;
    
    if (sortOrder === "asc") return weightA - weightB;
    return weightB - weightA;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Questions</h1>
          <p className="text-muted-foreground">Master the patterns, not just the problems.</p>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, topic..." 
              className="w-full h-10 rounded-lg bg-background border border-border pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowFilter(!showFilter)}
              className={cn("flex items-center justify-center h-10 w-10 rounded-lg border border-border bg-background hover:bg-muted transition-colors", filterStatus !== "All" && "border-indigo-500/50 bg-indigo-500/5 text-indigo-500")}
            >
              <Filter className={cn("w-4 h-4 text-muted-foreground", filterStatus !== "All" && "text-indigo-500")} />
            </button>
            
            {showFilter && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="p-2 space-y-1">
                  <p className="px-2 pt-2 pb-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Filter by Status</p>
                  {["All", "Solved", "Unsolved", "In Progress"].map((status) => (
                    <button
                      key={status}
                      onClick={() => { setFilterStatus(status as any); setShowFilter(false); }}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm rounded-lg transition-colors", 
                        filterStatus === status ? "bg-indigo-500/10 text-indigo-500 font-medium" : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 font-medium w-10">Status</th>
                <th className="px-4 py-3 font-medium w-16">ID</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th 
                  className="px-4 py-3 font-medium w-32 cursor-pointer hover:bg-muted/80 transition-colors group select-none"
                  onClick={() => {
                    if (sortOrder === "none") setSortOrder("asc");
                    else if (sortOrder === "asc") setSortOrder("desc");
                    else setSortOrder("none");
                  }}
                >
                  <div className="flex items-center gap-1">
                    Difficulty
                    <div className="flex flex-col text-[8px] leading-none text-muted-foreground opacity-50 group-hover:opacity-100">
                      <span className={cn(sortOrder === "desc" && "text-indigo-400 font-bold")}>▲</span>
                      <span className={cn(sortOrder === "asc" && "text-indigo-400 font-bold")}>▼</span>
                    </div>
                  </div>
                </th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Pattern</th>
                <th className="px-4 py-3 font-medium hidden lg:table-cell w-32">Time (m)</th>
                <th className="px-4 py-3 font-medium w-16 text-center">Fav</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {sortedProblems.map((problem) => {
                const data = problemsData[problem.id];
                const status = data?.status || "Unsolved";
                const isSolved = status === "Solved";
                const inProgress = status === "In Progress";
                const isFav = data?.favorite || false;

                return (
                  <tr 
                    key={problem.id}
                    onClick={() => setSelectedProblem(problem)}
                    className={cn(
                      "group transition-colors cursor-pointer hover:bg-muted/50",
                      isSolved ? "bg-success/5 hover:bg-success/10" : 
                      inProgress ? "bg-warning/5 hover:bg-warning/10" : ""
                    )}
                  >
                    <td className="px-4 py-3">
                      {isSolved ? (
                        <CheckCircle2 className="w-5 h-5 text-success" />
                      ) : inProgress ? (
                        <Circle className="w-5 h-5 text-warning fill-warning/20" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground/30" />
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">{problem.id}</td>
                    <td className="px-4 py-3 font-medium text-foreground group-hover:text-indigo-400 transition-colors">
                      {problem.title}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "px-2 py-1 text-[10px] font-semibold rounded-full border uppercase tracking-wider",
                        problem.difficulty === "Easy" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                        problem.difficulty === "Medium" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                        "bg-red-500/10 text-red-500 border-red-500/20"
                      )}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                      {problem.pattern}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                      {problem.estimatedTime}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(problem.id);
                        }}
                        className={cn("transition-colors", isFav ? "text-yellow-500" : "text-muted-foreground/30 hover:text-muted-foreground")}
                      >
                        <Star className="w-4 h-4" fill={isFav ? "currentColor" : "none"} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {sortedProblems.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              No problems found matching your search.
            </div>
          )}
        </div>
      </div>

      <ProblemDrawer 
        problem={selectedProblem} 
        onClose={() => setSelectedProblem(null)} 
      />
    </div>
  );
}

export default function AllQuestionsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground animate-pulse">Loading problems...</div>}>
      <AllQuestionsContent />
    </Suspense>
  );
}
