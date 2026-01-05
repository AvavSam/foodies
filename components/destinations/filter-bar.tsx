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
    <div className="space-y-4 mb-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Cari nama tempat, deskripsi..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 h-12 rounded-xl bg-card border-border/60 focus:border-primary focus:ring-primary/20 text-base"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Select value={type} onValueChange={onTypeChange}>
          <SelectTrigger className="w-auto min-w-[140px] h-10 rounded-xl bg-card border-border/60 focus:border-primary">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Kategori" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="ALL" className="rounded-lg">Semua Kategori</SelectItem>
            <SelectItem value="KULINER" className="rounded-lg">
              <span className="flex items-center gap-2">
                <Utensils className="h-4 w-4 text-amber-600" />
                Kuliner
              </span>
            </SelectItem>
            <SelectItem value="HIBURAN" className="rounded-lg">
              <span className="flex items-center gap-2">
                <Smile className="h-4 w-4 text-violet-600" />
                Hiburan
              </span>
            </SelectItem>
            <SelectItem value="LAINNYA" className="rounded-lg">
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-slate-600" />
                Lainnya
              </span>
            </SelectItem>
          </SelectContent>
        </Select>

        <Select value={visited} onValueChange={onVisitedChange}>
          <SelectTrigger className="w-auto min-w-[150px] h-10 rounded-xl bg-card border-border/60 focus:border-primary">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="ALL" className="rounded-lg">Semua Status</SelectItem>
            <SelectItem value="true" className="rounded-lg">✅ Sudah Dikunjungi</SelectItem>
            <SelectItem value="false" className="rounded-lg">⏳ Belum Dikunjungi</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priority} onValueChange={onPriorityChange}>
          <SelectTrigger className="w-auto min-w-[140px] h-10 rounded-xl bg-card border-border/60 focus:border-primary">
            <SelectValue placeholder="Prioritas" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="ALL" className="rounded-lg">Semua Prioritas</SelectItem>
            <SelectItem value="HIGH" className="rounded-lg">🔥 Tinggi</SelectItem>
            <SelectItem value="NORMAL" className="rounded-lg">Normal</SelectItem>
            <SelectItem value="LOW" className="rounded-lg">Rendah</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-10 px-4 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary"
            onClick={onReset}
          >
            <X className="h-4 w-4 mr-2" />
            Reset Filter
          </Button>
        )}
      </div>

      {/* Result Count */}
      {totalCount !== undefined && (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center h-6 px-2.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
            {totalCount}
          </span>
          <p className="text-sm text-muted-foreground">
            tempat ditemukan {hasActiveFilters && <span className="text-primary">(dengan filter)</span>}
          </p>
        </div>
      )}
    </div>
  )
}
