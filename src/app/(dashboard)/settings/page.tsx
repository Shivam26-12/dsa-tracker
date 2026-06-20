"use client";

import { useTheme } from "next-themes";
import { useTrackerStore } from "@/store/useTrackerStore";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { resetProgress, importData } = useTrackerStore();

  const handleExport = () => {
    const data = localStorage.getItem('dsa-tracker-storage');
    if (!data) return;
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dsa-tracker-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.state) {
          importData(json.state);
          alert("Import successful!");
        }
      } catch (err) {
        alert("Invalid backup file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your preferences and data.</p>
      </div>

      <div className="space-y-6">
        <div className="glass-card p-6 rounded-xl space-y-4">
          <h2 className="text-xl font-bold border-b border-border/50 pb-2">Appearance</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-muted-foreground">Toggle between dark and light themes.</p>
            </div>
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 transition-colors"
            >
              {theme === 'dark' ? 'Enable Light Mode' : 'Enable Dark Mode'}
            </button>
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl space-y-4">
          <h2 className="text-xl font-bold border-b border-border/50 pb-2">Data Management</h2>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Export Data</p>
                <p className="text-sm text-muted-foreground">Download a JSON backup of your progress and notes.</p>
              </div>
              <button onClick={handleExport} className="px-4 py-2 border border-border rounded-lg font-medium hover:bg-muted transition-colors">
                Export JSON
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Import Data</p>
                <p className="text-sm text-muted-foreground">Restore your progress from a JSON backup.</p>
              </div>
              <label className="px-4 py-2 border border-border rounded-lg font-medium hover:bg-muted transition-colors cursor-pointer">
                Import JSON
                <input type="file" accept=".json" className="hidden" onChange={handleImport} />
              </label>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div>
                <p className="font-medium text-red-500">Danger Zone</p>
                <p className="text-sm text-muted-foreground">Permanently delete all your progress and notes.</p>
              </div>
              <button 
                onClick={() => {
                  if (confirm("Are you SURE you want to reset all your progress? This cannot be undone!")) {
                    resetProgress();
                  }
                }}
                className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg font-medium hover:bg-red-500 hover:text-white transition-colors"
              >
                Reset Progress
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
