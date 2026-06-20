"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useTrackerStore } from "@/store/useTrackerStore";

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const store = useTrackerStore();
  
  const isInitialSyncDone = useRef(false);

  // Sync Logic
  useEffect(() => {
    if (status !== "authenticated") return;

    const performInitialSync = async () => {
      if (isInitialSyncDone.current) return;
      isInitialSyncDone.current = true;

      try {
        // Fetch cloud data
        const res = await fetch("/api/progress");
        if (!res.ok) throw new Error("Failed to fetch cloud progress");
        const cloudData = await res.json();

        // If local store has data but cloud is empty, sync local -> cloud
        const localData = store.problemsData;
        const hasLocalData = Object.keys(localData).length > 0;
        const hasCloudData = Object.keys(cloudData).length > 0;

        if (hasLocalData && !hasCloudData) {
          await fetch("/api/progress/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ localData }),
          });
        } 
        // If cloud has data, override local
        else if (hasCloudData) {
          store.importData({
            problemsData: cloudData,
            currentStreak: store.currentStreak,
            longestStreak: store.longestStreak,
            lastActivityDate: store.lastActivityDate
          });
        }
      } catch (err) {
        console.error("Sync error:", err);
      }
    };

    performInitialSync();
  }, [status]); // Only depend on status, avoid circular dependency with store

  // Subscription for automatic background sync when data changes
  useEffect(() => {
    if (status !== "authenticated" || !isInitialSyncDone.current) return;

    const unsub = useTrackerStore.subscribe(
      (state, prevState) => {
        const problemsData = state.problemsData;
        const previousProblemsData = prevState.problemsData;

        if (problemsData === previousProblemsData) return;

        // Find which problem changed
        for (const problemId of Object.keys(problemsData)) {
          const current = problemsData[Number(problemId)];
          const prev = previousProblemsData[Number(problemId)];

          if (JSON.stringify(current) !== JSON.stringify(prev)) {
            // Push this specific update to the cloud
            fetch("/api/progress", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                problemId: Number(problemId),
                data: current,
              }),
            }).catch(err => console.error("Auto-sync error:", err));
          }
        }
      }
    );

    return () => unsub();
  }, [status]);

  return <>{children}</>;
}
