"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Problem } from "@/data/types";
import { useTrackerStore, ProblemStatus } from "@/store/useTrackerStore";
import { X, ExternalLink, Star, CheckCircle2, Circle, Clock, Tag } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ProblemDrawerProps {
  problem: Problem | null;
  onClose: () => void;
}

export function ProblemDrawer({ problem, onClose }: ProblemDrawerProps) {
  const store = useTrackerStore();
  const data = problem ? store.problemsData[problem.id] : null;
  const status = data?.status || "Unsolved";
  const favorite = data?.favorite || false;
  
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (problem) {
      setNotes(store.problemsData[problem.id]?.notes || "");
    }
  }, [problem, store.problemsData]);

  // Autosave notes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (problem && notes !== store.problemsData[problem.id]?.notes) {
        store.updateNotes(problem.id, notes);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [notes, problem, store]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!problem) return;
      // Don't trigger if typing in textarea
      if (document.activeElement?.tagName === "TEXTAREA" || document.activeElement?.tagName === "INPUT") return;
      
      switch(e.key.toLowerCase()) {
        case 's': store.updateStatus(problem.id, status === 'Solved' ? 'Unsolved' : 'Solved'); break;
        case 'i': store.updateStatus(problem.id, status === 'In Progress' ? 'Unsolved' : 'In Progress'); break;
        case 'f': store.toggleFavorite(problem.id); break;
        case 'Escape': onClose(); break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [problem, store, onClose]);

  return (
    <AnimatePresence>
      {problem && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full md:w-[600px] border-l border-border bg-card shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground font-mono text-sm">#{problem.id}</span>
                <h2 className="text-xl font-bold">{problem.title}</h2>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => store.toggleFavorite(problem.id)}
                  className={cn("p-2 rounded-full hover:bg-muted transition-colors", favorite ? "text-yellow-500" : "text-muted-foreground")}
                >
                  <Star className="w-5 h-5" fill={favorite ? "currentColor" : "none"} />
                </button>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Meta info */}
              <div className="flex flex-wrap gap-2">
                <span className={cn(
                  "px-2.5 py-1 text-xs font-semibold rounded-full border",
                  problem.difficulty === "Easy" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                  problem.difficulty === "Medium" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                  "bg-red-500/10 text-red-500 border-red-500/20"
                )}>
                  {problem.difficulty}
                </span>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full border bg-muted/50 text-muted-foreground">
                  {problem.topic}
                </span>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full border bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                  {problem.pattern}
                </span>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full border bg-muted/50 text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {problem.estimatedTime}m
                </span>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                <p className="text-sm leading-relaxed">{problem.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {problem.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      <Tag className="w-3 h-3" /> {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => store.updateStatus(problem.id, status === 'Solved' ? 'Unsolved' : 'Solved')}
                  className={cn("flex flex-col items-center justify-center p-3 rounded-lg border transition-all", status === 'Solved' ? "bg-success/20 border-success text-success" : "hover:bg-muted")}
                >
                  <CheckCircle2 className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">Solved (S)</span>
                </button>
                <button
                  onClick={() => store.updateStatus(problem.id, status === 'In Progress' ? 'Unsolved' : 'In Progress')}
                  className={cn("flex flex-col items-center justify-center p-3 rounded-lg border transition-all", status === 'In Progress' ? "bg-warning/20 border-warning text-warning" : "hover:bg-muted")}
                >
                  <Circle className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">Progress (I)</span>
                </button>
                <a
                  href={problem.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-lg border bg-indigo-500 text-white hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20"
                >
                  <ExternalLink className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">Open Problem</span>
                </a>
              </div>

              {/* Notes */}
              <div className="flex-1 flex flex-col h-full min-h-[300px]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">My Notes (Markdown)</h3>
                  <span className="text-xs text-muted-foreground italic">Autosaves ✨</span>
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Write your notes, code snippets, or thoughts here..."
                  className="w-full flex-1 min-h-[250px] p-4 rounded-xl bg-background/50 border border-border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none font-mono text-sm"
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
