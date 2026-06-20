"use client";

import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { ArrowRight, Code2, Flame, GitMerge, LayoutDashboard, Sparkles, Target, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export function LandingContent() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Navbar for Landing */}
      <nav className="w-full border-b border-border/50 bg-background/50 backdrop-blur-xl z-50 fixed top-0 left-0">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-500">
              <Code2 className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              DSA<span className="text-muted-foreground font-medium">Tracker</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
              className="text-sm font-medium bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
            >
              Sign in with GitHub
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto space-y-8 flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium border border-indigo-500/20 mb-4">
            <Sparkles className="w-4 h-4" />
            <span>The ultimate tracker for competitive programming</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            Master Data Structures & <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Algorithms Faster.
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl">
            Track your progress, build your streak, and conquer the most important coding patterns with a curated list of top problems.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <button
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-xl bg-[#24292e] hover:bg-[#2f363d] px-8 py-4 text-base font-semibold text-white shadow-xl transition-all hover:-translate-y-1 group"
            >
              <svg height="24" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="24" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
              </svg>
              Sign in with GitHub
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full mt-24 text-left"
        >
          <div className="glass-card p-8 rounded-2xl border border-border/50 bg-background/50 backdrop-blur-xl relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <LayoutDashboard className="w-24 h-24" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Beautiful Dashboard</h3>
            <p className="text-muted-foreground">
              Visualize your progress across all major topics. See what you've mastered and where you need to focus next.
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl border border-border/50 bg-background/50 backdrop-blur-xl relative overflow-hidden group hover:border-purple-500/50 transition-colors">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <Flame className="w-24 h-24" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-6">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Maintain Streaks</h3>
            <p className="text-muted-foreground">
              Stay consistent by keeping your daily problem-solving streak alive. Gamify your learning journey.
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl border border-border/50 bg-background/50 backdrop-blur-xl relative overflow-hidden group hover:border-blue-500/50 transition-colors">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <GitMerge className="w-24 h-24" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6">
              <GitMerge className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Curated Sheets</h3>
            <p className="text-muted-foreground">
              Includes pre-built problems spanning Dynamic Programming, Graphs, Trees, and essential data structures.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
