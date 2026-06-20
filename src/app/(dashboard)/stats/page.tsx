"use client";

import { useTrackerStore } from "@/store/useTrackerStore";
import { allProblems } from "@/data/problems";

export default function StatsPage() {
  const { problemsData, currentStreak, longestStreak } = useTrackerStore();

  const total = allProblems.length;
  const solved = allProblems.filter((p) => problemsData[p.id]?.status === "Solved").length;
  
  // By Difficulty
  const difficulties = ["Easy", "Medium", "Hard"];
  const diffStats = difficulties.map(diff => {
    const totalDiff = allProblems.filter(p => p.difficulty === diff).length;
    const solvedDiff = allProblems.filter(p => p.difficulty === diff && problemsData[p.id]?.status === "Solved").length;
    return { diff, total: totalDiff, solved: solvedDiff, percentage: totalDiff ? Math.round((solvedDiff / totalDiff) * 100) : 0 };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Statistics</h1>
        <p className="text-muted-foreground">Visualize your progress and consistency.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass-card p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">Consistency</h2>
          <div className="flex gap-8">
            <div>
              <p className="text-sm text-muted-foreground">Current Streak</p>
              <p className="text-4xl font-bold text-indigo-400">{currentStreak} <span className="text-sm text-muted-foreground">days</span></p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Longest Streak</p>
              <p className="text-4xl font-bold">{longestStreak} <span className="text-sm text-muted-foreground">days</span></p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">Completion by Difficulty</h2>
          <div className="space-y-4">
            {diffStats.map(stat => (
              <div key={stat.diff}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{stat.diff}</span>
                  <span className="text-muted-foreground">{stat.solved} / {stat.total}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      stat.diff === 'Easy' ? 'bg-green-500' : 
                      stat.diff === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} 
                    style={{ width: `${stat.percentage}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
