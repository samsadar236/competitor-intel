import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:ml-[280px] flex flex-col min-h-screen">
        <Topbar title={title} />
        <main className="flex-1 w-full">{children}</main>
      </div>
    </div>
  );
}
