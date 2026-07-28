"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, LayoutDashboard, PlusSquare, History, Bookmark, Settings, LifeBuoy, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "New Analysis", icon: PlusSquare, href: "/" },
  { label: "History", icon: History, href: "#" },
  { label: "Saved Reports", icon: Bookmark, href: "#" },
  { label: "Settings", icon: Settings, href: "#" },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-full w-[280px] flex-col bg-surface-container-low border-r border-outline-variant py-md z-40">
      <div className="px-md mb-xl flex items-center gap-sm">
        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-white shadow-lg shadow-secondary/20">
          <Sparkles size={20} />
        </div>
        <div>
          <h2 className="text-headline-sm font-black text-secondary tracking-tight">Intelligence Core</h2>
          <p className="text-label-sm text-on-surface-variant/70">Analytical Engine v2.4</p>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-2">
        {NAV.map(({ label, icon: Icon, href }) => {
          const active = (href === "/" && label === "New Analysis" && pathname === "/") || (href !== "#" && href !== "/" && pathname === href);
          return (
            <Link
              key={label}
              href={href}
              className={cn(
                "flex items-center gap-sm px-md py-2.5 rounded-xl text-label-md transition-all",
                active ? "bg-secondary text-white font-semibold shadow-md shadow-secondary/20" : "text-on-surface-variant hover:bg-surface-container-high",
              )}
            >
              <Icon size={20} /> {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-md space-y-4">
        <div className="p-md bg-primary-container rounded-2xl">
          <p className="text-white text-label-md font-medium mb-sm">Upgrade to Pro</p>
          <p className="text-white/60 text-xs mb-md">Unlimited reports and scheduled competitor monitoring.</p>
          <button className="w-full py-2 bg-secondary text-white rounded-lg text-label-md font-bold hover:opacity-90 transition-opacity">Upgrade</button>
        </div>
        <div className="border-t border-outline-variant pt-md flex flex-col gap-1">
          <a href="#" className="flex items-center gap-sm px-md py-2 text-on-surface-variant hover:bg-surface-container-high rounded-xl text-label-md"><LifeBuoy size={18} /> Support</a>
          <a href="#" className="flex items-center gap-sm px-md py-2 text-on-surface-variant hover:bg-surface-container-high rounded-xl text-label-md"><LogOut size={18} /> Sign Out</a>
        </div>
      </div>
    </aside>
  );
}
