import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Info } from "lucide-react";

export function AppShell({ children, title }: { children: ReactNode; title: string }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[image:var(--gradient-subtle)]">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur">
            <SidebarTrigger />
            <h1 className="text-sm font-semibold tracking-tight">{title}</h1>
            <div className="ml-auto hidden items-center gap-2 text-xs text-muted-foreground md:flex">
              <Info className="h-3.5 w-3.5" />
              AI-generated content may require human review
            </div>
          </header>
          <main className="flex-1 p-4 md:p-8">{children}</main>
          <footer className="border-t border-border px-4 py-3 text-center text-xs text-muted-foreground md:hidden">
            AI-generated content may require human review
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}