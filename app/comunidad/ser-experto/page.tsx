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
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2, Shield, Award, Clock, ExternalLink } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

type ApplicationStatus = "none" | "pending" | "approved" | "rejected"

export default function SerExpertoPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus>("none")
  const [existingApplication, setExistingApplication] = useState<any>(null)
  const [cedulaVerified, setCedulaVerified] = useState(false)
  const [cedulaData, setCedulaData] = useState<any>(null)

  const [formData, setFormData] = useState({
    cedula_profesional: "",
    especialidad: "",
    institucion: "",
    years_experience: "",
    bio: ""
  })

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login?redirect=/comunidad/ser-experto")
        return
      }
      setUser(user)

      const { data: profile } = await supabase
        .from("profiles")
        .select("role, expert_approved, cedula_profesional, especialidad, institucion, bio, created_at, display_name")
        .eq("id", user.id)
        .single()

      if (profile?.role === "expert" && profile?.expert_approved) {
        setApplicationStatus("approved")
      } else if (profile?.role === "expert") {
        setApplicationStatus("pending")
        setExistingApplication({
          id: user.id,
          user_id: user.id,
          cedula_profesional: profile?.cedula_profesional || "",
          especialidad: profile?.especialidad || "",
          institucion: profile?.institucion || "",
          years_experience: null,
          bio: profile?.bio || "",
          status: "pending",
          rejection_reason: null,
          created_at: profile?.created_at || new Date().toISOString(),
          profiles: { display_name: profile?.display_name || user.user_metadata?.full_name || user.email || "Usuario" },
        })
      }

      setCheckingAuth(false)
    }
    checkAuth()
  }, [router])

  async function verifyCedula() {
    if (!formData.cedula_profesional) {
      setError("Ingresa tu número de cédula profesional")
      return
    }

    setVerifying(true)
    setError("")
    setCedulaVerified(false)
    setCedulaData(null)

    try {
      const response = await fetch(`/api/verify-cedula?cedula=${formData.cedula_profesional}`)
      const data = await response.json()

      if (data.verified) {
        setCedulaVerified(true)
        setCedulaData(data.data)
        setFormData(prev => ({
          ...prev,
          especialidad: data.data.titulo || data.data.especialidad || prev.especialidad,
          institucion: data.data.institucion || prev.institucion
        }))
      } else {
        setError(data.message || "No se pudo verificar la cédula. Verifica el número e intenta de nuevo.")
      }
    } catch {
      setError("Error al verificar la cédula. Intenta de nuevo más tarde.")
    }

    setVerifying(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!cedulaVerified) {
      setError("Debes verificar tu cédula profesional primero")
      setLoading(false)
      return
    }

    if (!formData.especialidad || !formData.institucion || !formData.bio) {
      setError("Por favor completa todos los campos requeridos")
      setLoading(false)
      return
    }

    const { error: insertError } = await supabase
      .from("profiles")
      .update({
        role: "expert",
        cedula_profesional: formData.cedula_profesional,
        especialidad: formData.especialidad,
        institucion: formData.institucion,
        bio: formData.bio,
        expert_approved: false,
        cedula_verified: true,
        expert_approved_at: null,
        expert_approved_by: null,
      })
      .eq("id", user.id)

    if (insertError) {
      if (insertError.code === "23505") {
        setError("Ya tienes una solicitud pendiente")
      } else {
        setError("Error al enviar la solicitud. Intenta de nuevo.")
      }
      setLoading(false)
      return
    }

    setSuccess(true)
    setApplicationStatus("pending")
    setExistingApplication({
      id: user.id,
      user_id: user.id,
      cedula_profesional: formData.cedula_profesional,
      especialidad: formData.especialidad,
      institucion: formData.institucion,
      years_experience: formData.years_experience ? parseInt(formData.years_experience) : null,
      bio: formData.bio,
      status: "pending",
      rejection_reason: null,
      created_at: new Date().toISOString(),
      profiles: { display_name: user?.user_metadata?.full_name || user?.email || "Usuario" },
    })
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

          {/* Status Cards */}
          {applicationStatus === "approved" && (
            <Card className="mb-6 border-green-500 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-800">Ya eres un Experto Verificado</h3>
                    <p className="text-sm text-green-700">
                      Tu cédula profesional ha sido verificada y aprobada
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {applicationStatus === "pending" && (
            <Card className="mb-6 border-yellow-500 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-yellow-800">Solicitud en Revisión</h3>
                    <p className="text-sm text-yellow-700">
                      Tu solicitud está siendo revisada por un administrador. Te notificaremos cuando sea aprobada.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {applicationStatus === "rejected" && (
            <Card className="mb-6 border-red-500 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-100 rounded-full">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-800">Solicitud Rechazada</h3>
                    <p className="text-sm text-red-700">
                      {existingApplication?.rejection_reason || "Tu solicitud no fue aprobada. Contacta al administrador para más información."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {(applicationStatus === "none" || applicationStatus === "rejected") && !success && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-8 h-8 text-primary" />
                  <CardTitle>Solicitud de Experto</CardTitle>
                </div>
                <CardDescription>
                  Verifica tu cédula profesional de la SEP para convertirte en un experto verificado 
                  y ayudar a la comunidad con información confiable.
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

                  {/* Cedula Verification */}
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="cedula">Cédula Profesional *</Label>
                      <a 
                        href="https://cedulaprofesional.sep.gob.mx/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-primary flex items-center gap-1 hover:underline"
                      >
                        Verificar en SEP <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        id="cedula"
                        placeholder="Ej: 12345678"
                        value={formData.cedula_profesional}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, cedula_profesional: e.target.value }))
                          setCedulaVerified(false)
                        }}
                        disabled={cedulaVerified}
                      />
                      <Button 
                        type="button" 
                        variant={cedulaVerified ? "outline" : "secondary"}
                        onClick={verifyCedula}
                        disabled={verifying || cedulaVerified}
                      >
                        {verifying && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {cedulaVerified ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                            Verificada
                          </>
                        ) : (
                          "Verificar"
                        )}
                      </Button>
                    </div>
                    {cedulaVerified && cedulaData && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm">
                        <p className="font-medium text-green-800">Cédula verificada exitosamente</p>
                        <p className="text-green-700">Nombre: {cedulaData.nombre || "Profesional Verificado (simulado)"}</p>
                        <p className="text-green-700">Título: {cedulaData.titulo || cedulaData.especialidad || "Licenciatura en Ciencias de la Salud (simulado)"}</p>
                        <p className="text-green-700">Especialidad: {cedulaData.especialidad || "Nutrición y huertos urbanos (simulado)"}</p>
                        <p className="text-green-700">Institución: {cedulaData.institucion || "Universidad Nacional Simulada"}</p>
                        <p className="text-green-700">Estatus: {cedulaData.estatus || "Vigente"}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="especialidad">Especialidad *</Label>
                    <Input
                      id="especialidad"
                      placeholder="Ej: Médico General, Nutriólogo, Herbolario"
                      value={formData.especialidad}
                      onChange={(e) => setFormData(prev => ({ ...prev, especialidad: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="institucion">Institución donde estudiaste *</Label>
                    <Input
                      id="institucion"
                      placeholder="Ej: Universidad Nacional Autónoma de México"
                      value={formData.institucion}
                      onChange={(e) => setFormData(prev => ({ ...prev, institucion: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="years">Años de experiencia</Label>
                    <Input
                      id="years"
                      type="number"
                      min="0"
                      placeholder="Ej: 5"
                      value={formData.years_experience}
                      onChange={(e) => setFormData(prev => ({ ...prev, years_experience: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Acerca de ti *</Label>
                    <Textarea
                      id="bio"
                      placeholder="Cuéntanos sobre tu experiencia profesional y por qué quieres ayudar a la comunidad..."
                      rows={4}
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    />
                  </div>

                  <div className="p-4 bg-muted rounded-lg text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-2">Proceso de verificación:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Verifica tu cédula profesional con la SEP</li>
                      <li>Completa el formulario de solicitud</li>
                      <li>Un administrador revisará tu solicitud</li>
                      <li>Una vez aprobado, podrás responder como experto verificado</li>
                    </ol>
                  </div>

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={loading || !cedulaVerified}>
                      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Enviar Solicitud
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {success && (
            <Card className="text-center py-12">
              <CardContent>
                <div className="p-4 bg-green-100 rounded-full w-fit mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Solicitud Enviada</h3>
                <p className="text-muted-foreground mb-6">
                  Tu solicitud ha sido enviada exitosamente. Un administrador la revisará pronto.
                </p>
                <Button asChild>
                  <Link href="/comunidad">Volver a la Comunidad</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
