'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
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
  ChevronLeft,
  MapPin,
  Calendar,
  Star,
  Utensils,
  Smile,
  Sparkles,
  Edit,
  Trash2,
  CheckCircle2,
  Circle,
  ExternalLink,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { Destination } from '@/generated/prisma/browser'
import { DestinationForm } from '@/components/destinations/destination-form'
import { MarkVisitedDialog } from '@/components/destinations/mark-visited-dialog'
import { useAuthStore } from '@/store/auth-store'

export default function DestinationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [destination, setDestination] = useState<Destination | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [markVisitedDialogOpen, setMarkVisitedDialogOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const { isAuthenticated } = useAuthStore()

  const fetchDestination = useCallback(async () => {
    try {
      const response = await fetch(`/api/destinations/${id}`)
      if (!response.ok) {
        if (response.status === 404) {
          toast.error("Tempat tidak ditemukan")
          router.push('/')
          return
        }
        throw new Error('Failed to fetch destination')
      }
      const data = await response.json()
      setDestination(data.data)
    } catch (error) {
      console.error(error)
      toast.error("Gagal memuat data tempat")
    } finally {
      setLoading(false)
    }
  }, [id, router])

  useEffect(() => {
    fetchDestination()
  }, [fetchDestination])

  const handleDelete = async () => {
    setActionLoading(true)
    try {
      const response = await fetch(`/api/destinations/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete')
      toast.success('Tempat berhasil dihapus')
      router.push('/')
    } catch (error) {
      toast.error('Gagal menghapus tempat')
      console.error(error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdate = async (data: Partial<Destination> & { visitDate?: string | Date | null, rating?: number | null }) => {
    setActionLoading(true)
    try {
      const response = await fetch(`/api/destinations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to update')
      const result = await response.json()
      setDestination(result.data)
      setEditDialogOpen(false)
      toast.success('Berhasil memperbarui tempat')
    } catch (error) {
      toast.error('Gagal memperbarui tempat')
      console.error(error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleToggleVisited = async () => {
    if (!destination) return

    if (!destination.visited) {
      setMarkVisitedDialogOpen(true)
      return
    }

    // Toggle to unvisited
    if (confirm("Yakin ingin menandai belum dikunjungi? Data rating dan tanggal akan dihapus.")) {
       setActionLoading(true)
       try {
         const response = await fetch(`/api/destinations/${id}`, {
           method: 'PATCH',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
             visited: false,
             visitDate: null,
             rating: null,
             ratingAvav: null,
             ratingUti: null,
             notes: null
           }),
         })
         if (!response.ok) throw new Error('Failed to update')
         const result = await response.json()
         setDestination(result.data)
         toast.success('Status diubah menjadi belum dikunjungi')
       } catch (error) {
         toast.error('Gagal mengubah status')
         console.error(error)
       } finally {
         setActionLoading(false)
       }
    }
  }

  const handleMarkVisitedSubmit = async (data: {
    visitDate: string
    ratingAvav: number
    ratingUti: number
    notes: string
  }) => {
    const averageRating = (data.ratingAvav + data.ratingUti) / 2
    await handleUpdate({
      visited: true,
      visitDate: new Date(data.visitDate),
      ratingAvav: data.ratingAvav,
      ratingUti: data.ratingUti,
      rating: averageRating,
      notes: data.notes,
    })
    setMarkVisitedDialogOpen(false)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'KULINER': return <Utensils className="h-4 w-4" />
      case 'HIBURAN': return <Smile className="h-4 w-4" />
      default: return <Sparkles className="h-4 w-4" />
    }
  }

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'KULINER': return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
      case 'HIBURAN': return 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100'
      default: return 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
    }
  }

  const getMapEmbedUrl = (url: string | null, name: string) => {
     if (url && url.includes('google.com/maps/embed')) {
       return url
     }
     // Fallback to search by name or url
     const query = encodeURIComponent(name)
     return `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <p className="text-muted-foreground font-medium">Memuat data...</p>
        <p className="text-sm text-muted-foreground/70 mt-1">Tunggu sebentar ya</p>
      </div>
    )
  }

  if (!destination) return null

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 pb-24">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Detail Tempat</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

        {/* Left Column: Map & Main Image */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-3xl overflow-hidden border-border/60 shadow-sm">
             <div className="aspect-video w-full bg-muted relative">
               <iframe
                 width="100%"
                 height="100%"
                 frameBorder="0"
                 scrolling="no"
                 marginHeight={0}
                 marginWidth={0}
                 src={getMapEmbedUrl(destination.googleMapUrl, destination.name)}
                 className="w-full h-full"
               ></iframe>
             </div>
          </Card>

          <div className="flex flex-col gap-4">
             {destination.description && (
               <Card className="rounded-3xl border-border/60 shadow-sm p-6 bg-card/50 backdrop-blur-sm">
                 <h3 className="font-semibold mb-2 flex items-center gap-2">
                   <Sparkles className="h-4 w-4 text-primary" />
                   Deskripsi
                 </h3>
                 <p className="text-muted-foreground leading-relaxed">{destination.description}</p>
               </Card>
             )}

             {destination.notes && destination.visited && (
               <Card className="rounded-3xl border-border/60 shadow-sm p-6 bg-card/50 backdrop-blur-sm">
                 <h3 className="font-semibold mb-2 flex items-center gap-2">
                   <Edit className="h-4 w-4 text-primary" />
                   Catatan Kunjungan
                 </h3>
                 <div className="bg-muted/50 p-4 rounded-xl text-muted-foreground italic relative">
                    <span className="text-4xl absolute -top-2 -left-1 opacity-10">&quot;</span>
                    {destination.notes}
                    <span className="text-4xl absolute -bottom-6 -right-1 opacity-10">&quot;</span>
                 </div>
               </Card>
             )}
          </div>
        </div>

        {/* Right Column: Info & Actions */}
        <div className="space-y-6">
           <Card className="rounded-3xl border-border/60 shadow-lg h-fit sticky top-6">
             <CardContent className="p-6 space-y-6">
                <div>
                   <div className="flex items-start justify-between mb-4">
                     <Badge variant="outline" className={`${getTypeBadgeColor(destination.type)} rounded-lg px-2.5 py-1 border text-xs`}>
                        <span className="flex items-center gap-1.5">
                          {getTypeIcon(destination.type)}
                          <span className="uppercase font-bold tracking-wider">{destination.type}</span>
                        </span>
                     </Badge>
                     {destination.priority === "HIGH" && (
                        <Badge variant="secondary" className="bg-rose-50 text-rose-600 border-rose-100 rounded-lg px-2 py-1 text-xs font-bold uppercase tracking-wider animate-pulse">
                           Prioritas
                        </Badge>
                     )}
                   </div>

                   <h2 className={`text-2xl font-bold mb-2 leading-tight`}>
                      {destination.name}
                   </h2>

                   {destination.googleMapUrl && (
                      <a href={destination.googleMapUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1.5 mb-2 w-fit">
                        <MapPin className="h-3.5 w-3.5" />
                        Buka di Google Maps <ExternalLink className="h-3 w-3" />
                      </a>
                   )}
                </div>

                {destination.visited && (
                   <div className="bg-muted/30 p-4 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between text-sm">
                         <span className="text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Tanggal
                         </span>
                         <span className="font-medium">
                            {destination.visitDate ? format(new Date(destination.visitDate), "d MMMM yyyy", { locale: localeId }) : "-"}
                         </span>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-border/40">
                         <div className="flex justify-between items-center text-sm">
                             <span className="text-muted-foreground">Rating Avav</span>
                             <div className="flex items-center text-amber-500 font-bold">
                               <Star className="h-3.5 w-3.5 fill-current mr-1" />
                               {destination.ratingAvav}
                             </div>
                         </div>
                         <div className="flex justify-between items-center text-sm">
                             <span className="text-muted-foreground">Rating Uti</span>
                             <div className="flex items-center text-amber-500 font-bold">
                               <Star className="h-3.5 w-3.5 fill-current mr-1" />
                               {destination.ratingUti}
                             </div>
                         </div>
                         <div className="flex justify-between items-center bg-primary/5 p-2 rounded-lg mt-1">
                             <span className="text-sm font-semibold text-primary">Total Rating</span>
                             <div className="flex items-center text-primary font-bold text-lg">
                               <Star className="h-4 w-4 fill-current mr-1" />
                               {destination.rating?.toFixed(1)}
                             </div>
                         </div>
                      </div>
                   </div>
                )}

                {/* Actions */}
                <div className="space-y-3 pt-2">
                   {!destination.visited ? (
                       <Button className="w-full h-12 rounded-xl text-base font-semibold shadow-primary/25" size="lg" onClick={handleToggleVisited}>
                          <CheckCircle2 className="mr-2 h-5 w-5" />
                          Tandai Sudah Dikunjungi
                       </Button>
                   ) : (
                       <div className="flex gap-2">
                          <div className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 font-medium">
                             <CheckCircle2 className="h-5 w-5" />
                             Sudah Selesai
                          </div>
                          <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-border/60" onClick={handleToggleVisited} title="Tandai belum dikunjungi">
                             <Circle className="h-5 w-5" />
                          </Button>
                       </div>
                   )}

                   {isAuthenticated && (
                     <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="h-11 rounded-xl border-border/60 hover:bg-secondary" onClick={() => setEditDialogOpen(true)}>
                           <Edit className="mr-2 h-4 w-4" />
                           Edit
                        </Button>
                        <Button variant="outline" className="h-11 rounded-xl border-border/60 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30" onClick={() => setDeleteDialogOpen(true)}>
                           <Trash2 className="mr-2 h-4 w-4" />
                           Hapus
                        </Button>
                     </div>
                   )}
                </div>
             </CardContent>
           </Card>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Tempat?</AlertDialogTitle>
            <AlertDialogDescription>Apakah kamu yakin ingin menghapus &quot;{destination.name}&quot;? Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={actionLoading} className="bg-destructive hover:bg-destructive/90 rounded-xl">
              {actionLoading ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <MarkVisitedDialog open={markVisitedDialogOpen} onClose={() => setMarkVisitedDialogOpen(false)} onSubmit={handleMarkVisitedSubmit} destinationName={destination.name} />

      {editDialogOpen && (
        <DestinationForm
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          initialData={destination}
          mode="edit"
          onSubmit={handleUpdate}
        />
      )}
    </div>
  )
}
