"use client";

import { Search, Bell, HelpCircle } from "lucide-react";

export function Topbar({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-30 flex justify-between items-center w-full h-16 px-margin-desktop bg-surface/80 backdrop-blur-md border-b border-outline-variant">
      <div className="flex items-center gap-xl min-w-0">
        <h1 className="text-headline-md font-bold text-on-surface truncate">{title}</h1>
        <div className="relative hidden lg:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full w-64 text-label-md focus:ring-2 focus:ring-secondary/20 outline-none"
            placeholder="Search reports…"
          />
        </div>
      </div>
      <div className="flex items-center gap-md">
        <button aria-label="Notifications" className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors"><Bell size={20} /></button>
        <button aria-label="Help" className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors"><HelpCircle size={20} /></button>
        <div className="w-px h-6 bg-outline-variant mx-1" />
        <div className="w-9 h-9 rounded-full bg-secondary/15 border border-secondary/20 flex items-center justify-center text-secondary font-bold text-sm">A</div>
      </div>
    </header>
  );
}
