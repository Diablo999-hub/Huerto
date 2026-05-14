"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navigation } from "@/components/navigation"
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function NuevaPreguntaPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [user, setUser] = useState<any>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: ""
  })

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login?redirect=/comunidad/nueva-pregunta")
        return
      }
      setUser(user)
      setCheckingAuth(false)
    }
    checkAuth()
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!formData.title || !formData.content || !formData.category) {
      setError("Por favor completa todos los campos")
      setLoading(false)
      return
    }

    console.log("[v0] Submitting question with user_id:", user.id)
    
    const { data, error: insertError } = await supabase
      .from("questions")
      .insert({
        user_id: user.id,
        title: formData.title,
        content: formData.content,
        category: formData.category
      })
      .select()
      .single()

    console.log("[v0] Insert result - data:", data, "error:", insertError)

    if (insertError) {
      console.error("[v0] Insert error details:", insertError)
      setError(`Error al publicar la pregunta: ${insertError.message}`)
      setLoading(false)
      return
    }

    if (!data || !data.id) {
      console.error("[v0] No data returned from insert")
      setError("Error: No se recibió respuesta del servidor")
      setLoading(false)
      return
    }

    console.log("[v0] Redirecting to:", `/comunidad/pregunta/${data.id}`)
    router.push(`/comunidad/pregunta/${data.id}`)
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <Link 
            href="/comunidad" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a la comunidad
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>Nueva Pregunta</CardTitle>
              <CardDescription>
                Haz tu pregunta sobre remedios, medicamentos o plantas medicinales. 
                Nuestros expertos verificados te ayudarán.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remedios">Remedios Naturales</SelectItem>
                      <SelectItem value="medicamentos">Medicamentos</SelectItem>
                      <SelectItem value="plantas">Plantas Medicinales</SelectItem>
                      <SelectItem value="nutricion">Nutrición</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Título de tu pregunta</Label>
                  <Input
                    id="title"
                    placeholder="Ej: ¿Cuáles son los beneficios del té de manzanilla?"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Describe tu pregunta</Label>
                  <Textarea
                    id="content"
                    placeholder="Explica con más detalle lo que quieres saber..."
                    rows={6}
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Publicar Pregunta
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
