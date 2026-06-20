import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ProblemStatus = 'Unsolved' | 'In Progress' | 'Solved';

export interface ProblemData {
  status: ProblemStatus;
  favorite: boolean;
  notes: string;
  revisionCount: number;
  lastRevised?: string; // ISO date string
  inRevisionQueue: boolean;
}

export interface TrackerState {
  problemsData: Record<number, ProblemData>;
  // Streaks
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  solvedHistory: Record<string, number>; // ISO Date -> count

  // Actions
  updateStatus: (id: number, status: ProblemStatus) => void;
  toggleFavorite: (id: number) => void;
  updateNotes: (id: number, notes: string) => void;
  incrementRevision: (id: number) => void;
  toggleRevisionQueue: (id: number) => void;
  importData: (data: Partial<TrackerState>) => void;
  resetProgress: () => void;
}

const defaultProblemData: ProblemData = {
  status: 'Unsolved',
  favorite: false,
  notes: '',
  revisionCount: 0,
  inRevisionQueue: false,
};

export const useTrackerStore = create<TrackerState>()(
  persist(
    (set, get) => ({
      problemsData: {},
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null,
      solvedHistory: {},

      updateStatus: (id, status) =>
        set((state) => {
          const prevStatus = state.problemsData[id]?.status || 'Unsolved';
          if (prevStatus === status) return state; // no change

          const today = new Date().toISOString().split('T')[0];
          const newProblemsData = {
            ...state.problemsData,
            [id]: {
              ...(state.problemsData[id] || defaultProblemData),
              status,
            },
          };

          let { currentStreak, longestStreak, lastActiveDate, solvedHistory } = state;

          if (status === 'Solved' && prevStatus !== 'Solved') {
            // Check streak logic
            solvedHistory = { ...solvedHistory, [today]: (solvedHistory[today] || 0) + 1 };
            
            if (lastActiveDate !== today) {
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              const yesterdayStr = yesterday.toISOString().split('T')[0];

              if (lastActiveDate === yesterdayStr) {
                currentStreak += 1;
              } else {
                currentStreak = 1;
              }
              lastActiveDate = today;
              longestStreak = Math.max(longestStreak, currentStreak);
            }
          }

          return { problemsData: newProblemsData, currentStreak, longestStreak, lastActiveDate, solvedHistory };
        }),

      toggleFavorite: (id) =>
        set((state) => ({
          problemsData: {
            ...state.problemsData,
            [id]: {
              ...(state.problemsData[id] || defaultProblemData),
              favorite: !(state.problemsData[id]?.favorite || false),
            },
          },
        })),

      updateNotes: (id, notes) =>
        set((state) => ({
          problemsData: {
            ...state.problemsData,
            [id]: {
              ...(state.problemsData[id] || defaultProblemData),
              notes,
            },
          },
        })),

      incrementRevision: (id) =>
        set((state) => {
          const current = state.problemsData[id] || defaultProblemData;
          return {
            problemsData: {
              ...state.problemsData,
              [id]: {
                ...current,
                revisionCount: current.revisionCount + 1,
                lastRevised: new Date().toISOString(),
                inRevisionQueue: false, // Remove from queue when revised
              },
            },
          };
        }),

      toggleRevisionQueue: (id) =>
        set((state) => {
          const current = state.problemsData[id] || defaultProblemData;
          return {
            problemsData: {
              ...state.problemsData,
              [id]: {
                ...current,
                inRevisionQueue: !current.inRevisionQueue,
              },
            },
          };
        }),

      importData: (data) => set((state) => ({ ...state, ...data })),
      resetProgress: () =>
        set({
          problemsData: {},
          currentStreak: 0,
          longestStreak: 0,
          lastActiveDate: null,
          solvedHistory: {},
        }),
    }),
    {
      name: 'dsa-tracker-storage', // name of item in the storage (must be unique)
    }
  )
);
