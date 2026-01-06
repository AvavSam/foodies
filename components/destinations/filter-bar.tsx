'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, SlidersHorizontal, X, Utensils, Smile, Sparkles } from 'lucide-react'

interface FilterBarProps {
  search: string
  onSearchChange: (value: string) => void
  type: string
  onTypeChange: (value: string) => void
  visited: string
  onVisitedChange: (value: string) => void
  priority: string
  onPriorityChange: (value: string) => void
  onReset: () => void
  totalCount?: number
}

export function FilterBar({
  search,
  onSearchChange,
  type,
  onTypeChange,
  visited,
  onVisitedChange,
  priority,
  onPriorityChange,
  onReset,
  totalCount,
}: FilterBarProps) {
  const hasActiveFilters = search || type !== 'ALL' || visited !== 'ALL' || priority !== 'ALL'

  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama tempat, deskripsi..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-11 rounded-xl bg-card border-border/60 focus:border-primary focus:ring-primary/20 text-sm shadow-sm"
          />
          {search && (
            <button onClick={() => onSearchChange("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 hover:bg-muted rounded-full transition-colors">
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
          <Select value={type} onValueChange={onTypeChange}>
            <SelectTrigger className="h-11 rounded-xl bg-card border-border/60 focus:border-primary shadow-sm">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Kategori" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-lg border-border/60">
              <SelectItem value="ALL" className="rounded-lg cursor-pointer">
                Semua Kategori
              </SelectItem>
              <SelectItem value="KULINER" className="rounded-lg cursor-pointer">
                <span className="flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-amber-600" />
                  Kuliner
                </span>
              </SelectItem>
              <SelectItem value="HIBURAN" className="rounded-lg cursor-pointer">
                <span className="flex items-center gap-2">
                  <Smile className="h-4 w-4 text-violet-600" />
                  Hiburan
                </span>
              </SelectItem>
              <SelectItem value="LAINNYA" className="rounded-lg cursor-pointer">
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-slate-600" />
                  Lainnya
                </span>
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={visited} onValueChange={onVisitedChange}>
            <SelectTrigger className="h-11 rounded-xl bg-card border-border/60 focus:border-primary shadow-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-lg border-border/60">
              <SelectItem value="ALL" className="rounded-lg cursor-pointer">
                Semua Status
              </SelectItem>
              <SelectItem value="true" className="rounded-lg cursor-pointer">
                ✅ Sudah Dikunjungi
              </SelectItem>
              <SelectItem value="false" className="rounded-lg cursor-pointer">
                ⭕ Belum Dikunjungi
              </SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="ghost" onClick={onReset} className="h-11 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 px-4">
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between px-1">
        <p className="text-sm text-muted-foreground font-medium">Menampilkan {totalCount} tempat</p>
      </div>
    </div>
  );
}
