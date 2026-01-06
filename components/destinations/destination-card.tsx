'use client'

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Utensils, Smile, CheckCircle2, MapPin, Calendar, Sparkles } from "lucide-react";
import { format } from 'date-fns'
import { id as localeId } from "date-fns/locale";
import { Destination } from "@/generated/prisma/browser";
import Link from "next/link";

export interface VisitData {
  visitDate: string | Date
  ratingAvav: number
  ratingUti: number
  notes: string
  rating?: number
}

interface DestinationCardProps {
  destination: Destination;
}

export function DestinationCard({ destination }: DestinationCardProps) {
  const getTypeIcon = () => {
    switch (destination.type) {
      case "KULINER":
        return <Utensils className="h-3.5 w-3.5" />;
      case "HIBURAN":
        return <Smile className="h-3.5 w-3.5" />;
      default:
        return <Sparkles className="h-3.5 w-3.5" />;
    }
  };

  const getTypeBadgeColor = () => {
    switch (destination.type) {
      case "KULINER":
        return "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100";
      case "HIBURAN":
        return "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100";
    }
  };

  return (
    <Link href={`/destinations/${destination.id}`} className="block h-full">
      <Card
        className={`group overflow-hidden py-0 border-border/60 transition-all duration-300 rounded-2xl flex flex-col h-full
          ${destination.visited ? "bg-muted/30 hover:bg-muted/50 border-transparent" : "bg-card hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20"}`}
      >
        <CardContent className="p-5 flex-1 relative">
          {/* Priority Ribbon/Indicator */}
          {destination.priority === "HIGH" && !destination.visited && (
            <div className="absolute top-0 right-0 p-2">
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
            </div>
          )}

          {/* Header with Type Badge */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-2">
              <Badge variant="outline" className={`${getTypeBadgeColor()} rounded-lg px-2.5 py-0.5 border`}>
                <span className="flex items-center gap-1.5">
                  {getTypeIcon()}
                  <span className="text-[10px] uppercase font-bold tracking-wider">
                    {destination.type === "KULINER" && "Kuliner"}
                    {destination.type === "HIBURAN" && "Hiburan"}
                    {destination.type === "LAINNYA" && "Lainnya"}
                  </span>
                </span>
              </Badge>
              {destination.priority === "HIGH" && (
                <Badge variant="secondary" className="bg-rose-50 text-rose-600 border-rose-100 rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  Prioritas
                </Badge>
              )}
            </div>
          </div>

          {/* Title */}
          <h3 className={`font-bold text-lg leading-snug mb-2 group-hover:text-primary transition-colors`}>{destination.name}</h3>

          {/* Description */}
          {destination.description && <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{destination.description}</p>}

          {/* Meta Info Row */}
          <div className="flex flex-col gap-2 mt-auto">
            {destination.visitDate && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
                <Calendar className="h-3.5 w-3.5" />
                <span>Dikunjungi pada {format(new Date(destination.visitDate), "d MMMM yyyy", { locale: localeId })}</span>
              </div>
            )}

            {/* Rating - only show if visited and has rating */}
            {destination.visited && destination.rating && (
              <div className="flex items-center gap-1.5 mt-1 bg-amber-50/50 w-fit px-2 py-1 rounded-md -ml-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(destination.rating ?? 0) ? "fill-amber-400 text-amber-400" : "fill-muted/20 text-muted/20"}`} />
                  ))}
                </div>
                <span className="text-xs font-bold text-amber-600">{destination.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </CardContent>

        {/* Footer Actions */}
        <CardFooter className="px-5 pb-5 pt-0 flex gap-2">
          {destination.visited ? (
            <div className="flex-1 flex items-center justify-center gap-2 h-9 px-3 rounded-lg bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span className="text-xs font-semibold">Sudah Selesai</span>
            </div>
          ) : (
            <div className="flex-1"></div>
          )}

          {destination.googleMapUrl && (
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-lg shrink-0 border-border/60 hover:bg-secondary hover:text-foreground z-10"
              onClick={(e) => {
                e.preventDefault();
                window.open(destination.googleMapUrl ?? "", "_blank");
              }}
              title="Buka di Google Maps"
            >
              <MapPin className="h-3.5 w-3.5" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
