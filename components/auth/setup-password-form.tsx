'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, Lock } from "lucide-react";
import { useAuthStore } from '@/store/auth-store'
import Image from "next/image";

export function SetupPasswordForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { setIsSetup, setIsAuthenticated } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/auth/setup-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, confirmPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Setup failed')
        return
      }

      toast.success('Password setup successful!')
      setIsSetup(true)
      setIsAuthenticated(true)
      router.refresh()
    } catch (error) {
      toast.error('An error occurred. Please try again.')
      console.error('Setup error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md shadow-2xl border-border/60 rounded-3xl relative z-10 bg-card/80 backdrop-blur-sm">
        <CardHeader className="space-y-4 text-center pb-2 pt-8">
          <div className="flex justify-center mb-4">
            <div className="relative w-24 h-24">
              <Image src="/logotrans.webp" alt="Logo" fill className="object-contain drop-shadow-xl" priority />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl md:text-3xl font-bold text-foreground">Setup Password 🔐</CardTitle>
            <p className="text-lg font-medium text-primary mt-1">mAU Jalan-Jalannnnn</p>
          </div>
          <CardDescription className="text-base text-muted-foreground">Buat password untuk mengamankan aplikasi</CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password Baru
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimal 8 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 h-14 text-base rounded-xl border-border/60 focus:border-primary bg-secondary/30"
                  disabled={loading}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                Konfirmasi Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Ulangi password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-12 h-14 text-base rounded-xl border-border/60 focus:border-primary bg-secondary/30"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-14 text-base font-medium bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/25 mt-2" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Memproses...
                </>
              ) : (
                "✨ Setup Password"
              )}
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground mt-8">© 2026 Semalaman. Made with ❤️</p>
        </CardContent>
      </Card>
    </div>
  );
}
