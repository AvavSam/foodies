'use client'

import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, Circle, Utensils, Smile, TrendingUp, Sparkles } from "lucide-react";

interface StatsSummaryProps {
  stats: {
    total: number
    visited: number
    unvisited: number
    byType: {
      kuliner: number
      hiburan: number
      lainnya: number
    }
  }
}

export function StatsSummary({ stats }: StatsSummaryProps) {
  const visitedPercentage = stats.total > 0 ? Math.round((stats.visited / stats.total) * 100) : 0;

  return (
    <div className="mb-8">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Progress Card */}
        <Card className="lg:col-span-2 border-none bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 shadow-none">
          <CardContent className="p-6">
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-primary/80 uppercase tracking-wider">Progress Kunjungan</p>
                  <div className="h-8 w-8 rounded-full bg-background/50 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-bold text-foreground">{visitedPercentage}%</span>
                  <span className="text-sm text-muted-foreground">selesai</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-muted-foreground">
                  <span>{stats.visited} Dikunjungi</span>
                  <span>{stats.total} Total</span>
                </div>
                <div className="h-3 bg-background/50 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" style={{ width: `${visitedPercentage}%` }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Unvisited Card */}
        <Card className="border-border/60 shadow-sm hover:border-primary/20 transition-colors">
          <CardContent className="p-6 flex flex-col justify-center h-full">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center shrink-0">
                <Circle className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Belum Dikunjungi</p>
                <p className="text-3xl font-bold text-foreground">{stats.unvisited}</p>
                <p className="text-xs text-muted-foreground mt-1">Tempat menunggu!</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/60 bg-card/50 shadow-sm hover:bg-card transition-colors">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-500/10 flex items-center justify-center shrink-0">
              <Utensils className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold">{stats.byType.kuliner}</p>
              <p className="text-xs text-muted-foreground">Kuliner</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/50 shadow-sm hover:bg-card transition-colors">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-500/10 flex items-center justify-center shrink-0">
              <Smile className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold">{stats.byType.hiburan}</p>
              <p className="text-xs text-muted-foreground">Hiburan</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/50 shadow-sm hover:bg-card transition-colors">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-500/10 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold">{stats.byType.lainnya}</p>
              <p className="text-xs text-muted-foreground">Lainnya</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
