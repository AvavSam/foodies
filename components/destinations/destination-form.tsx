'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2, MapPin } from 'lucide-react'
import { Destination } from "@/generated/prisma/browser";

import { StarRating } from '@/components/ui/star-rating'

interface DestinationFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: Partial<Destination> & { visitDate?: string | Date | null; rating?: number | string | null }) => Promise<void>
  initialData?: Destination | null
  mode: 'create' | 'edit'
}

export function DestinationForm({
  open,
  onClose,
  onSubmit,
  initialData,
  mode,
}: DestinationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'KULINER',
    googleMapUrl: '',
    description: '',
    notes: '',
    priority: 'NORMAL',
    visited: false,
    visitDate: '',
    ratingAvav: '',
    ratingUti: '',
    imageUrl: '',
  })
  const [loading, setLoading] = useState(false)

  // Reset form when dialog opens/closes or initialData changes
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) {
        setFormData({
          name: initialData.name || '',
          type: initialData.type || 'KULINER',
          googleMapUrl: initialData.googleMapUrl || '',
          description: initialData.description || '',
          notes: initialData.notes || '',
          priority: initialData.priority || 'NORMAL',
          visited: initialData.visited || false,
          visitDate: initialData.visitDate
            ? new Date(initialData.visitDate).toISOString().split('T')[0]
            : '',
          ratingAvav: initialData.ratingAvav?.toString() || '',
          ratingUti: initialData.ratingUti?.toString() || '',
          imageUrl: initialData.imageUrl || '',
        })
      } else {
        setFormData({
          name: '',
          type: 'KULINER',
          googleMapUrl: '',
          description: '',
          notes: '',
          priority: 'NORMAL',
          visited: false,
          visitDate: '',
          ratingAvav: '',
          ratingUti: '',
          imageUrl: '',
        })
      }
    }
  }, [open, mode, initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { ratingAvav, ratingUti, visitDate, ...rest } = formData
      const dataToSubmit = {
        ...rest,
        visitDate: visitDate || null,
        ratingAvav: ratingAvav ? parseInt(ratingAvav) : undefined,
        ratingUti: ratingUti ? parseInt(ratingUti) : undefined,
      } as unknown as Partial<Destination> & { visitDate?: string | Date | null; rating?: number | string | null }

      // Calculate average rating if both are present
      if (ratingAvav && ratingUti) {
        const avg = (parseInt(ratingAvav) + parseInt(ratingUti)) / 2
        dataToSubmit.rating = avg
      }

      await onSubmit(dataToSubmit)
      toast.success(
        mode === 'create' ? 'Tempat berhasil ditambahkan' : 'Tempat berhasil diupdate'
      )
      onClose()
    } catch (error) {
      toast.error(
        mode === 'create' ? 'Gagal menambahkan tempat' : 'Gagal mengupdate tempat'
      )
      console.error('Form submit error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto w-full max-w-lg rounded-2xl border-border/60">
        <DialogHeader className="pb-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">
                {mode === 'create' ? 'Tambah Tempat Baru' : 'Edit Tempat'}
              </DialogTitle>
              <DialogDescription className="text-sm">
                {mode === 'create'
                  ? 'Isi informasi tempat yang ingin ditambahkan'
                  : 'Edit informasi tempat'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nama Tempat */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-foreground">
              Nama Tempat <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Contoh: Warung Padang Sederhana"
              className="h-12 rounded-xl border-border/60 focus:border-primary"
              required
            />
          </div>

          {/* Kategori */}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium text-foreground">
              Kategori <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleInputChange('type', value)}
              required
            >
              <SelectTrigger className="h-12 rounded-xl border-border/60 focus:border-primary">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="KULINER" className="rounded-lg">🍜 Kuliner</SelectItem>
                <SelectItem value="HIBURAN" className="rounded-lg">🎉 Hiburan</SelectItem>
                <SelectItem value="LAINNYA" className="rounded-lg">✨ Lainnya</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Link Google Maps */}
          <div className="space-y-2">
            <Label htmlFor="googleMapUrl" className="text-sm font-medium text-foreground">
              Link Google Maps
            </Label>
            <Input
              id="googleMapUrl"
              value={formData.googleMapUrl}
              onChange={(e) => handleInputChange('googleMapUrl', e.target.value)}
              placeholder="https://maps.google.com/..."
              className="h-12 rounded-xl border-border/60 focus:border-primary"
              type="url"
            />
          </div>

          {/* Prioritas */}
          <div className="space-y-2">
            <Label htmlFor="priority" className="text-sm font-medium text-foreground">
              Prioritas
            </Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => handleInputChange('priority', value)}
            >
              <SelectTrigger className="h-12 rounded-xl border-border/60 focus:border-primary">
                <SelectValue placeholder="Pilih prioritas" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="HIGH" className="rounded-lg">🔥 Tinggi</SelectItem>
                <SelectItem value="NORMAL" className="rounded-lg">Normal</SelectItem>
                <SelectItem value="LOW" className="rounded-lg">Rendah</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Deskripsi */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-foreground">
              Deskripsi Singkat
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Deskripsi tempat..."
              rows={3}
              className="resize-none rounded-xl border-border/60 focus:border-primary"
            />
          </div>

          {/* Catatan - hanya muncul di mode edit */}
          {mode === 'edit' && (
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium text-foreground">
                Catatan Tambahan
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Catatan atau reminder..."
                rows={2}
                className="resize-none rounded-xl border-border/60 focus:border-primary"
              />
            </div>
          )}

          {/* Status Kunjungan - hanya muncul di mode edit */}
          {mode === 'edit' && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Status Kunjungan</Label>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant={!formData.visited ? 'default' : 'outline'}
                  className={`flex-1 h-11 rounded-xl ${!formData.visited ? 'bg-primary hover:bg-primary/90' : 'border-border/60'}`}
                  onClick={() => handleInputChange('visited', false)}
                >
                  ⏳ Belum
                </Button>
                <Button
                  type="button"
                  variant={formData.visited ? 'default' : 'outline'}
                  className={`flex-1 h-11 rounded-xl ${formData.visited ? 'bg-emerald-500 hover:bg-emerald-600' : 'border-border/60'}`}
                  onClick={() => handleInputChange('visited', true)}
                >
                  ✅ Sudah
                </Button>
              </div>
            </div>
          )}

          {/* Tanggal Kunjungan - hanya muncul jika sudah dikunjungi dan mode edit */}
          {mode === 'edit' && formData.visited && (
            <div className="space-y-2">
              <Label htmlFor="visitDate" className="text-sm font-medium text-foreground">
                Tanggal Kunjungan
              </Label>
              <Input
                id="visitDate"
                type="date"
                value={formData.visitDate}
                onChange={(e) => handleInputChange('visitDate', e.target.value)}
                className="h-12 rounded-xl border-border/60 focus:border-primary"
              />
            </div>
          )}

          {/* Rating - hanya muncul jika sudah dikunjungi dan mode edit */}
          {mode === 'edit' && formData.visited && (
            <div className="grid grid-cols-2 gap-4">
              <StarRating
                label="Rating Avav"
                value={parseInt(formData.ratingAvav) || 0}
                onChange={(value) => handleInputChange('ratingAvav', value.toString())}
              />
              <StarRating
                label="Rating Uti"
                value={parseInt(formData.ratingUti) || 0}
                onChange={(value) => handleInputChange('ratingUti', value.toString())}
              />
            </div>
          )}

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="text-sm font-medium text-foreground">
              URL Foto (Opsional)
            </Label>
            <Input
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => handleInputChange('imageUrl', e.target.value)}
              placeholder="https://..."
              className="h-12 rounded-xl border-border/60 focus:border-primary"
              type="url"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-12 rounded-xl border-border/60 font-medium"
              onClick={onClose}
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90 font-medium shadow-lg shadow-primary/20"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === 'create' ? 'Menambah...' : 'Mengupdate...'}
                </>
              ) : mode === 'create' ? (
                'Tambah Tempat'
              ) : (
                'Simpan Perubahan'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
