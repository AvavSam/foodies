'use client'

import { Card, CardContent } from '@/components/ui/card'
import { MapPin, CheckCircle2, Circle, Utensils, Smile, TrendingUp } from 'lucide-react'

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
  const visitedPercentage = stats.total > 0 ? Math.round((stats.visited / stats.total) * 100) : 0

  return (
    <div className="mb-8">
      {/* Main Stats Card */}
      <Card className="border-border/60 rounded-2xl overflow-hidden mb-4 bg-card shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Progress Kunjungan</p>
              <p className="text-3xl font-bold text-foreground">
                {stats.visited} <span className="text-lg font-normal text-muted-foreground">/ {stats.total}</span>
              </p>
            </div>
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${visitedPercentage}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {visitedPercentage}% tempat sudah dikunjungi
          </p>
        </CardContent>
      </Card>

      {/* Category Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-border/60 rounded-xl bg-card shadow-sm card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.visited}</p>
                <p className="text-xs text-muted-foreground">Dikunjungi</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 rounded-xl bg-card shadow-sm card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-sky-500/10 flex items-center justify-center shrink-0">
                <Circle className="h-5 w-5 text-sky-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.unvisited}</p>
                <p className="text-xs text-muted-foreground">Belum</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 rounded-xl bg-card shadow-sm card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                <Utensils className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.byType.kuliner}</p>
                <p className="text-xs text-muted-foreground">Kuliner</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 rounded-xl bg-card shadow-sm card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                <Smile className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.byType.hiburan}</p>
                <p className="text-xs text-muted-foreground">Hiburan</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
