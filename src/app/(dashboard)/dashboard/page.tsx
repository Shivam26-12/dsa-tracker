"use client";

import { motion } from "framer-motion";
import { allProblems } from "@/data/problems";
import { useTrackerStore } from "@/store/useTrackerStore";
import Link from "next/link";
import { ArrowRight, Flame, Target, Trophy } from "lucide-react";

export default function Home() {
  const { problemsData, currentStreak, longestStreak } = useTrackerStore();

  const total = allProblems.length;
  const solved = allProblems.filter((p) => problemsData[p.id]?.status === "Solved").length;
  const inProgress = allProblems.filter((p) => problemsData[p.id]?.status === "In Progress").length;
  const unsolved = total - solved - inProgress;

  const percentage = total === 0 ? 0 : Math.round((solved / total) * 100);

  // Group by topics
  const topics = Array.from(new Set(allProblems.map(p => p.topic)));
  const topicProgress = topics.map(topic => {
    const topicProblems = allProblems.filter(p => p.topic === topic);
    const topicSolved = topicProblems.filter(p => problemsData[p.id]?.status === "Solved").length;
    return {
      topic,
      total: topicProblems.length,
      solved: topicSolved,
      percentage: Math.round((topicSolved / topicProblems.length) * 100)
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back! 👋</h1>
        <p className="text-muted-foreground">Here&apos;s an overview of your DSA journey.</p>
      </div>

      {/* Top Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div whileHover={{ y: -5 }} className="glass-card rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Target className="w-16 h-16" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">Total Solved</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold">{solved}</span>
            <span className="text-sm font-medium text-muted-foreground">/ {total}</span>
          </div>
          <div className="mt-4 h-2 w-full rounded-full bg-secondary overflow-hidden">
            <div className="h-full bg-success transition-all duration-1000" style={{ width: `${percentage}%` }} />
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="glass-card rounded-xl p-6">
          <p className="text-sm font-medium text-muted-foreground">In Progress</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-warning">{inProgress}</span>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="glass-card rounded-xl p-6">
          <p className="text-sm font-medium text-muted-foreground">Unsolved</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-muted-foreground">{unsolved}</span>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="glass-card rounded-xl p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-indigo-400">Current Streak</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-indigo-400">{currentStreak}</span>
                <span className="text-sm font-medium text-muted-foreground">days</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-indigo-500/20 text-indigo-400">
              <Flame className="w-6 h-6" />
            </div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Longest streak: {longestStreak} days</p>
        </motion.div>
      </div>

      {/* Topic Progress */}
      <h2 className="text-2xl font-bold tracking-tight pt-4">Topic Progress</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {topicProgress.map((tp) => (
          <motion.div key={tp.topic} whileHover={{ scale: 1.02 }} className="glass-card rounded-xl p-6 group">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg group-hover:text-indigo-400 transition-colors">{tp.topic}</h3>
              <span className="text-sm text-muted-foreground">{tp.solved}/{tp.total}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary overflow-hidden mb-2">
              <div 
                className="h-full bg-indigo-500 transition-all duration-1000" 
                style={{ width: `${tp.percentage}%` }} 
              />
            </div>
            <div className="text-right text-xs text-muted-foreground">{tp.percentage}%</div>
          </motion.div>
        ))}
      </div>

      {/* Quick Action */}
      <div className="flex justify-end pt-4">
        <Link href="/all" className="inline-flex items-center justify-center rounded-lg bg-indigo-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-600 transition-all hover:-translate-y-1">
          Continue Solving
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
