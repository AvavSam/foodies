'use client'

import { useState } from 'react'
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
import { toast } from 'sonner'
import { CheckCircle2, PartyPopper } from 'lucide-react'
import { StarRating } from '@/components/ui/star-rating'

interface MarkVisitedDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: {
    visitDate: string
    ratingAvav: number
    ratingUti: number
    notes: string
  }) => Promise<void>
  destinationName: string
}

export function MarkVisitedDialog({
  open,
  onClose,
  onSubmit,
  destinationName,
}: MarkVisitedDialogProps) {
  const [formData, setFormData] = useState({
    visitDate: new Date().toISOString().split('T')[0],
    ratingAvav: 0,
    ratingUti: 0,
    notes: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.ratingAvav === 0 || formData.ratingUti === 0) {
      toast.error('Mohon isi rating untuk kedua orang')
      return
    }

    setLoading(true)
    try {
      await onSubmit({
        visitDate: formData.visitDate,
        ratingAvav: formData.ratingAvav,
        ratingUti: formData.ratingUti,
        notes: formData.notes,
      })
      // Toast success handled by parent or here?
      // Parent usually handles logic, but here we can show success.
      // The user request says "selesai".
    } catch (error) {
      console.error('Submit error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl border-border/60">
        <DialogHeader className="pb-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <PartyPopper className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">
                Yeay! Sudah Dikunjungi 🎉
              </DialogTitle>
              <DialogDescription className="text-sm">
                Lengkapi detail kunjungan ke <span className="font-medium text-foreground">{destinationName}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="visitDate" className="text-sm font-medium text-foreground">
              Tanggal Kunjungan
            </Label>
            <Input
              id="visitDate"
              type="date"
              value={formData.visitDate}
              onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
              className="h-12 rounded-xl border-border/60 focus:border-primary"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <StarRating
              label="Rating Avav"
              value={formData.ratingAvav}
              onChange={(value) => setFormData({ ...formData, ratingAvav: value })}
            />
            <StarRating
              label="Rating Uti"
              value={formData.ratingUti}
              onChange={(value) => setFormData({ ...formData, ratingUti: value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium text-foreground">
              Catatan (Opsional)
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Ceritakan pengalamanmu..."
              rows={3}
              className="resize-none rounded-xl border-border/60 focus:border-primary"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-11 px-6 rounded-xl border-border/60"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="h-11 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20"
            >
              {loading ? 'Menyimpan...' : '✨ Simpan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
