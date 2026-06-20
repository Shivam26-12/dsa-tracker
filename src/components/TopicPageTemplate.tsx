"use client";

import { useState } from "react";
import { Problem } from "@/data/types";
import { useTrackerStore } from "@/store/useTrackerStore";
import { ProblemDrawer } from "@/components/ProblemDrawer";
import { cn } from "@/lib/utils";
import { Star, CheckCircle2, Circle } from "lucide-react";

interface TopicPageProps {
  title: string;
  description: string;
  topic: string;
  problems: Problem[];
}

export function TopicPageTemplate({ title, description, topic, problems }: TopicPageProps) {
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const { problemsData, toggleFavorite } = useTrackerStore();

  // Group by pattern
  const patterns = Array.from(new Set(problems.map(p => p.pattern)));
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <div className="space-y-12">
        {patterns.map(pattern => {
          const patternProblems = problems.filter(p => p.pattern === pattern);
          const solved = patternProblems.filter(p => problemsData[p.id]?.status === 'Solved').length;
          const percentage = Math.round((solved / patternProblems.length) * 100);

          return (
            <div key={pattern} className="space-y-4">
              <div className="flex items-end justify-between border-b border-border/50 pb-2">
                <div>
                  <h2 className="text-xl font-bold">{pattern}</h2>
                  <p className="text-sm text-muted-foreground">{solved} / {patternProblems.length} Solved</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 rounded-full bg-secondary overflow-hidden hidden sm:block">
                    <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="text-xs font-bold text-indigo-400">{percentage}%</span>
                </div>
              </div>

              <div className="grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {patternProblems.map(problem => {
                  const data = problemsData[problem.id];
                  const status = data?.status || "Unsolved";
                  const isSolved = status === "Solved";
                  const inProgress = status === "In Progress";
                  const isFav = data?.favorite || false;

                  return (
                    <div 
                      key={problem.id}
                      onClick={() => setSelectedProblem(problem)}
                      className={cn(
                        "group glass-card p-4 rounded-xl cursor-pointer hover:-translate-y-1 hover:shadow-2xl transition-all border",
                        isSolved ? "border-success/30 bg-success/5" : 
                        inProgress ? "border-warning/30 bg-warning/5" : "border-border/50 hover:border-indigo-500/30"
                      )}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {isSolved ? (
                            <CheckCircle2 className="w-4 h-4 text-success" />
                          ) : inProgress ? (
                            <Circle className="w-4 h-4 text-warning fill-warning/20" />
                          ) : (
                            <Circle className="w-4 h-4 text-muted-foreground/30" />
                          )}
                          <span className="text-xs font-mono text-muted-foreground">#{problem.id}</span>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleFavorite(problem.id); }}
                          className={cn("transition-colors", isFav ? "text-yellow-500" : "text-muted-foreground/30 hover:text-muted-foreground")}
                        >
                          <Star className="w-4 h-4" fill={isFav ? "currentColor" : "none"} />
                        </button>
                      </div>
                      
                      <h3 className="font-semibold text-sm group-hover:text-indigo-400 transition-colors line-clamp-1 mb-3">
                        {problem.title}
                      </h3>
                      
                      <div className="flex justify-between items-center">
                        <span className={cn(
                          "px-2 py-0.5 text-[10px] font-semibold rounded-full border uppercase",
                          problem.difficulty === "Easy" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                          problem.difficulty === "Medium" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                          "bg-red-500/10 text-red-500 border-red-500/20"
                        )}>
                          {problem.difficulty}
                        </span>
                        <span className="text-xs text-muted-foreground">{problem.estimatedTime}m</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <ProblemDrawer 
        problem={selectedProblem} 
        onClose={() => setSelectedProblem(null)} 
      />
    </div>
  );
}
