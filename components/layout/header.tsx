import { Button } from "@/components/ui/button";
import { LogOut, RefreshCw } from "lucide-react";
import Image from "next/image";

interface HeaderProps {
  onRefresh: () => void;
  onLogout: () => void;
}

export function Header({ onRefresh, onLogout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40 supports-backdrop-filter:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 py-3 md:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 md:w-11 md:h-11">
              <Image src="/logotrans.webp" alt="Logo" fill className="object-contain" priority />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight leading-none">mAU Jalan-Jalannnnn</h1>
              <p className="text-[10px] md:text-xs text-muted-foreground font-medium mt-0.5">Track tempat favorit kamu</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={onRefresh} className="h-10 w-10 rounded-xl hover:bg-secondary" title="Refresh">
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onLogout} className="h-10 w-10 rounded-xl hover:bg-destructive/10 text-destructive hover:text-destructive" title="Logout">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
