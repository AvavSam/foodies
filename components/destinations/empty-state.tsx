import { Button } from "@/components/ui/button";
import { MapPin, Plus, Compass, Sparkles } from "lucide-react";

interface EmptyStateProps {
  onCreate: () => void;
}

export function EmptyState({ onCreate }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Illustration */}
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center">
          <Compass className="w-12 h-12 text-primary" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-xl flex items-center justify-center shadow-lg">
          <Sparkles className="w-4 h-4 text-accent-foreground" />
        </div>
      </div>

      {/* Text Content */}
      <h3 className="text-xl font-semibold text-foreground mb-2 text-center">
        Belum ada tempat tersimpan
      </h3>
      <p className="text-muted-foreground text-center mb-8 max-w-sm leading-relaxed">
        Mulai petualangan dengan menambahkan tempat-tempat menarik yang ingin kamu kunjungi bersama!
      </p>

      {/* CTA Button */}
      <Button
        onClick={onCreate}
        className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 font-medium"
      >
        <Plus className="mr-2 h-5 w-5" />
        Tambah Tempat Pertama
      </Button>

      {/* Decorative elements */}
      <div className="flex items-center gap-2 mt-8 text-muted-foreground/50">
        <MapPin className="w-4 h-4" />
        <span className="text-sm">Kuliner • Hiburan • Lainnya</span>
      </div>
    </div>
  );
}
