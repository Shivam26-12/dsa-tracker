"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { 
  LayoutDashboard, 
  List, 
  Network, 
  Trees, 
  SplitSquareHorizontal, 
  Star, 
  History, 
  BarChart2, 
  Settings,
  LogOut,
  LogIn
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "All Problems", href: "/all", icon: List },
  { name: "Graphs", href: "/graphs", icon: Network },
  { name: "Trees", href: "/trees", icon: Trees },
  { name: "Dynamic Programming", href: "/dp", icon: SplitSquareHorizontal },
  { name: "Favorites", href: "/favorites", icon: Star },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border/50 bg-background/50 backdrop-blur-xl">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-white shadow-lg shadow-indigo-500/20">
            <Network className="h-5 w-5" />
          </div>
          DSA<span className="text-muted-foreground font-medium">Tracker</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-indigo-500/10 text-indigo-500 dark:text-indigo-400"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 transition-colors",
                  isActive ? "text-indigo-500 dark:text-indigo-400" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 mt-auto border-t border-border/50">
        {status === "loading" ? (
          <div className="h-12 flex items-center justify-center text-sm text-muted-foreground animate-pulse">
            Loading...
          </div>
        ) : session ? (
          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border">
            <div className="flex items-center gap-3 overflow-hidden">
              {session.user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={session.user.image} alt="Avatar" className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                  {session.user?.name?.charAt(0) || "U"}
                </div>
              )}
              <div className="flex flex-col truncate">
                <span className="text-sm font-medium truncate">{session.user?.name}</span>
                <span className="text-xs text-muted-foreground truncate">{session.user?.email}</span>
              </div>
            </div>
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn()}
            className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white p-2.5 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
          >
            <LogIn className="w-4 h-4" />
            Sign In to Sync
          </button>
        )}
      </div>
    </aside>
  );
}
