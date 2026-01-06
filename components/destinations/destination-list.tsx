import { Loader2, MapPin } from "lucide-react";
import { Destination } from "@/generated/prisma/browser";
import { DestinationCard, VisitData } from "./destination-card";
import { EmptyState } from "./empty-state";

interface DestinationListProps {
  destinations: Destination[];
  loading: boolean;
  onEdit: (destination: Destination) => void;
  onDelete: (id: string) => void;
  onToggleVisited: (id: string, visited: boolean, data?: VisitData | Partial<Destination>) => void;
  onCreate: () => void;
}

export function DestinationList({
  destinations,
  loading,
  onCreate,
}: DestinationListProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <p className="text-muted-foreground font-medium">Memuat data...</p>
        <p className="text-sm text-muted-foreground/70 mt-1">Tunggu sebentar ya</p>
      </div>
    );
  }

  if (destinations.length === 0) {
    return <EmptyState onCreate={onCreate} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {destinations.map((destination) => (
        <DestinationCard key={destination.id} destination={destination} />
      ))}
    </div>
  );
}
