import { Button } from "@/components/ui/button";
import { LogOut, MapPin, RefreshCw } from "lucide-react";

interface HeaderProps {
  onRefresh: () => void;
  onLogout: () => void;
}

export function Header({ onRefresh, onLogout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 py-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-foreground tracking-tight">
                mAU Jalan-Jalannnnn
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Track tempat favorit kamu
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              className="h-10 w-10 rounded-xl hover:bg-secondary"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="h-10 w-10 rounded-xl hover:bg-destructive/10 text-destructive hover:text-destructive"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
