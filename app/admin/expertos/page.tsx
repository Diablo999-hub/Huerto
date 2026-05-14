"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Shield, Award, Clock, CheckCircle2, 
  XCircle, ExternalLink, Loader2 
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface ExpertApplication {
  id: string
  user_id: string
  cedula_profesional: string
  especialidad: string
  institucion: string
  years_experience: number | null
  bio: string
  status: "pending" | "approved" | "rejected"
  rejection_reason: string | null
  created_at: string
  profiles: {
    display_name: string
  }
}

interface ProfileRow {
  id: string
  display_name: string | null
  cedula_profesional: string | null
  especialidad: string | null
  institucion: string | null
  bio: string | null
  role: string
  expert_approved: boolean
  expert_approved_at: string | null
  created_at: string
}

export default function ExpertosPage() {
  const supabase = createClient()
  const [applications, setApplications] = useState<ExpertApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [rejectDialog, setRejectDialog] = useState<{ open: boolean; application: ExpertApplication | null }>({
    open: false,
    application: null
  })
  const [rejectionReason, setRejectionReason] = useState("")

  useEffect(() => {
    fetchApplications()
  }, [])

  async function fetchApplications() {
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id, display_name, cedula_profesional, especialidad, institucion, bio, role, expert_approved, expert_approved_at, created_at")
      .order("created_at", { ascending: false })

    if (!error && profiles) {
      const mappedApplications = profiles
        .filter((profile: ProfileRow) => profile.role === "expert")
        .map((profile: ProfileRow) => ({
          id: profile.id,
          user_id: profile.id,
          cedula_profesional: profile.cedula_profesional || "",
          especialidad: profile.especialidad || "",
          institucion: profile.institucion || "",
          years_experience: null,
          bio: profile.bio || "",
          status: profile.expert_approved ? "approved" : "pending",
          rejection_reason: null,
          created_at: profile.expert_approved_at || profile.created_at,
          profiles: {
            display_name: profile.display_name || "Usuario",
          },
        }))

      setApplications(mappedApplications as ExpertApplication[])
    } else {
      setApplications([])
    }
    setLoading(false)
  }

  async function approveApplication(application: ExpertApplication) {
    setProcessing(application.id)

    const { data: { user } } = await supabase.auth.getUser()

    await supabase
      .from("profiles")
      .update({
        role: "expert",
        expert_approved: true,
        cedula_verified: true,
        expert_approved_at: new Date().toISOString(),
        expert_approved_by: user?.id
      })
      .eq("id", application.user_id)

    setApplications(prev => 
      prev.map(a => a.id === application.id ? { ...a, status: "approved" as const } : a)
    )

    setProcessing(null)
  }

  async function rejectApplication() {
    if (!rejectDialog.application) return
    
    setProcessing(rejectDialog.application.id)

    const { data: { user } } = await supabase.auth.getUser()

    await supabase
      .from("profiles")
      .update({
        role: "user",
        expert_approved: false,
        expert_approved_at: null,
        expert_approved_by: null
      })
      .eq("id", rejectDialog.application.user_id)

    setApplications(prev => 
      prev.map(a => a.id === rejectDialog.application?.id ? { ...a, status: "rejected" as const } : a)
    )

    setRejectDialog({ open: false, application: null })
    setRejectionReason("")
    setProcessing(null)
  }

  const pendingApps = applications.filter(a => a.status === "pending")
  const approvedApps = applications.filter(a => a.status === "approved")
  const rejectedApps = applications.filter(a => a.status === "rejected")

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Gestión de Expertos</h1>
          <p className="text-muted-foreground">Aprueba o rechaza solicitudes de profesionales verificados</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className={pendingApps.length > 0 ? "border-yellow-500" : ""}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className={`w-8 h-8 ${pendingApps.length > 0 ? "text-yellow-500" : "text-muted-foreground"}`} />
              <div>
                <p className="text-2xl font-bold">{pendingApps.length}</p>
                <p className="text-sm text-muted-foreground">Pendientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{approvedApps.length}</p>
                <p className="text-sm text-muted-foreground">Aprobados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <XCircle className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{rejectedApps.length}</p>
                <p className="text-sm text-muted-foreground">Rechazados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Solicitudes de Expertos</CardTitle>
          <CardDescription>
            Revisa las cédulas profesionales y aprueba a los profesionales verificados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList className="mb-4">
              <TabsTrigger value="pending" className="relative">
                Pendientes
                {pendingApps.length > 0 && (
                  <Badge className="ml-2 bg-yellow-500">{pendingApps.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="approved">
                Aprobadas ({approvedApps.length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rechazadas ({rejectedApps.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              {pendingApps.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No hay solicitudes pendientes</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingApps.map((app) => (
                    <ApplicationCard 
                      key={app.id} 
                      application={app}
                      processing={processing === app.id}
                      onApprove={() => approveApplication(app)}
                      onReject={() => setRejectDialog({ open: true, application: app })}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="approved">
              {approvedApps.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No hay solicitudes aprobadas</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {approvedApps.map((app) => (
                    <ApplicationCard key={app.id} application={app} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="rejected">
              {rejectedApps.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <XCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No hay solicitudes rechazadas</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rejectedApps.map((app) => (
                    <ApplicationCard key={app.id} application={app} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={rejectDialog.open} onOpenChange={(open) => setRejectDialog({ open, application: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rechazar Solicitud</DialogTitle>
            <DialogDescription>
              Proporciona una razón para el rechazo. Esta información será visible para el solicitante.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Razón del rechazo</Label>
              <Textarea
                id="reason"
                placeholder="Ej: La cédula proporcionada no coincide con los registros de la SEP..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialog({ open: false, application: null })}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={rejectApplication} disabled={!rejectionReason.trim() || !!processing}>
              {processing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Rechazar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ApplicationCard({ 
  application, 
  processing = false,
  onApprove, 
  onReject 
}: { 
  application: ExpertApplication
  processing?: boolean
  onApprove?: () => void
  onReject?: () => void
}) {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800"
  }

  const statusLabels = {
    pending: "Pendiente",
    approved: "Aprobada",
    rejected: "Rechazada"
  }

  return (
    <Card className={application.status === "pending" ? "border-yellow-200" : ""}>
      <CardContent className="pt-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">{application.profiles?.display_name || "Usuario"}</h3>
              <Badge className={statusColors[application.status]}>
                {statusLabels[application.status]}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Cédula Profesional:</span>{" "}
                <a 
                  href={`https://cedulaprofesional.sep.gob.mx/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1 font-medium"
                >
                  {application.cedula_profesional}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div>
                <span className="text-muted-foreground">Especialidad:</span>{" "}
                <span className="font-medium">{application.especialidad}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Institución:</span>{" "}
                <span className="font-medium">{application.institucion}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Experiencia:</span>{" "}
                <span className="font-medium">
                  {application.years_experience ? `${application.years_experience} años` : "No especificado"}
                </span>
              </div>
            </div>

            <div className="text-sm">
              <span className="text-muted-foreground">Biografía:</span>
              <p className="mt-1 text-foreground">{application.bio}</p>
            </div>

            {application.rejection_reason && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm">
                <span className="text-red-700 font-medium">Razón del rechazo:</span>
                <p className="text-red-600 mt-1">{application.rejection_reason}</p>
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              Solicitado {formatDistanceToNow(new Date(application.created_at), { addSuffix: true, locale: es })}
            </p>
          </div>

          {application.status === "pending" && onApprove && onReject && (
            <div className="flex gap-2 lg:flex-col">
              <Button 
                onClick={onApprove} 
                disabled={processing}
                className="flex-1"
              >
                {processing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Aprobar
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={onReject}
                disabled={processing}
                className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Rechazar
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
