'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  MapPin,
  Star,
  Utensils,
  Smile,
  MoreHorizontal,
  CheckCircle2,
  Circle,
  ExternalLink,
  Edit,
  Trash2,
  Calendar,
  Sparkles,
} from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { Destination } from "@/generated/prisma/browser";
import { MarkVisitedDialog } from './mark-visited-dialog'

export interface VisitData {
  visitDate: string | Date
  ratingAvav: number
  ratingUti: number
  notes: string
  rating?: number
}

interface DestinationCardProps {
  destination: Destination
  onEdit: (destination: Destination) => void
  onDelete: (id: string) => void
  onToggleVisited: (id: string, visited: boolean, data?: VisitData) => void
}

export function DestinationCard({
  destination,
  onEdit,
  onDelete,
  onToggleVisited,
}: DestinationCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [markVisitedDialogOpen, setMarkVisitedDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await onDelete(destination.id)
      setDeleteDialogOpen(false)
      toast.success('Tempat berhasil dihapus')
    } catch (error) {
      toast.error('Gagal menghapus tempat')
      console.error('Delete error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleVisited = async () => {
    if (!destination.visited) {
      setMarkVisitedDialogOpen(true)
      return
    }

    setLoading(true)
    try {
      await onToggleVisited(destination.id, false)
      toast.success('Status diubah menjadi belum dikunjungi')
    } catch (error) {
      toast.error('Gagal mengubah status')
      console.error('Toggle visited error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkVisitedSubmit = async (data: {
    visitDate: string
    ratingAvav: number
    ratingUti: number
    notes: string
  }) => {
    try {
      const averageRating = (data.ratingAvav + data.ratingUti) / 2
      await onToggleVisited(destination.id, true, {
        visitDate: new Date(data.visitDate),
        ratingAvav: data.ratingAvav,
        ratingUti: data.ratingUti,
        rating: averageRating,
        notes: data.notes,
      })
    } catch (error) {
      throw error
    }
  }

  const getTypeIcon = () => {
    switch (destination.type) {
      case 'KULINER':
        return <Utensils className="h-3.5 w-3.5" />
      case 'HIBURAN':
        return <Smile className="h-3.5 w-3.5" />
      default:
        return <Sparkles className="h-3.5 w-3.5" />
    }
  }

  const getTypeBadgeColor = () => {
    switch (destination.type) {
      case 'KULINER':
        return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
      case 'HIBURAN':
        return 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100'
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
    }
  }

  return (
    <>
      <Card className="group overflow-hidden card-hover border-border/60 bg-card shadow-sm hover:shadow-xl hover:border-primary/20 rounded-2xl">
        <CardContent className="p-5">
          {/* Header with Type Badge */}
          <div className="flex items-center justify-between mb-3">
            <Badge variant="outline" className={`${getTypeBadgeColor()} rounded-lg px-2.5 py-1`}>
              <span className="flex items-center gap-1.5">
                {getTypeIcon()}
                <span className="text-xs font-medium">
                  {destination.type === 'KULINER' && 'Kuliner'}
                  {destination.type === 'HIBURAN' && 'Hiburan'}
                  {destination.type === 'LAINNYA' && 'Lainnya'}
                </span>
              </span>
            </Badge>

            {/* Action Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-lg opacity-60 hover:opacity-100"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                <DropdownMenuItem onClick={() => onEdit(destination)} className="rounded-lg">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                {destination.visited && (
                  <DropdownMenuItem
                    onClick={handleToggleVisited}
                    disabled={loading}
                    className="rounded-lg"
                  >
                    <Circle className="mr-2 h-4 w-4" />
                    Tandai belum dikunjungi
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => setDeleteDialogOpen(true)}
                  className="text-destructive rounded-lg focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Hapus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-base text-foreground leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {destination.name}
          </h3>

          {/* Description */}
          {destination.description ? (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
              {destination.description}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground/50 mb-4 italic">
              Tidak ada deskripsi
            </p>
          )}

          {/* Meta Info Row */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
            {destination.priority === 'HIGH' && (
              <span className="text-rose-600 font-medium">🔥 Prioritas Tinggi</span>
            )}
            {destination.visitDate && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {format(new Date(destination.visitDate), 'dd MMM yyyy', { locale: id })}
              </span>
            )}
          </div>

          {/* Rating - only show if visited and has rating */}
          {destination.visited && destination.rating && (
            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(destination.rating ?? 0)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-muted-foreground/20'
                  }`}
                />
              ))}
              <span className="text-sm font-medium text-muted-foreground ml-1">
                {destination.rating.toFixed(1)}
              </span>
            </div>
          )}
        </CardContent>

        {/* Footer Actions */}
        <CardFooter className="px-5 pb-5 pt-0 flex gap-2">
          {!destination.visited ? (
            <Button
              variant="default"
              size="sm"
              className="flex-1 h-10 rounded-xl font-medium bg-primary hover:bg-primary/90"
              onClick={handleToggleVisited}
              disabled={loading}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Tandai Sudah Dikunjungi
            </Button>
          ) : (
            <div className="flex-1 flex items-center gap-2 h-10 px-3 rounded-xl bg-emerald-500/10 text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm font-medium">Sudah dikunjungi</span>
            </div>
          )}

          {destination.googleMapUrl && (
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-xl shrink-0"
              onClick={() => window.open(destination.googleMapUrl ?? '', '_blank')}
              title="Buka di Google Maps"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Tempat?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah kamu yakin ingin menghapus &quot;{destination.name}&quot;? Tindakan ini tidak
              dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-destructive hover:bg-destructive/90 rounded-xl"
            >
              {loading ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <MarkVisitedDialog
        open={markVisitedDialogOpen}
        onClose={() => setMarkVisitedDialogOpen(false)}
        onSubmit={handleMarkVisitedSubmit}
        destinationName={destination.name}
      />
    </>
  )
}
