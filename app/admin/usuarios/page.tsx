"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Users, Shield, UserCheck, Award, Search, XCircle, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Profile {
  id: string
  display_name: string | null
  role: string
  cedula_profesional: string | null
  especialidad: string | null
  institucion: string | null
  expert_approved: boolean
  created_at: string
}

export default function UsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState<string>("all")
  
  const supabase = createClient()

  const fetchProfiles = async () => {
    setLoading(true)
    const { data } = await supabase
      .from("profiles")
      .select("id, display_name, role, cedula_profesional, especialidad, institucion, expert_approved, created_at")
      .order("created_at", { ascending: false })
    setProfiles(data || [])
    setFilteredProfiles(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchProfiles()
  }, [])

  useEffect(() => {
    let filtered = profiles

    if (searchTerm) {
      filtered = filtered.filter(p => 
        (p.display_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.cedula_profesional?.includes(searchTerm)) ||
        (p.especialidad?.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (filterRole !== "all") {
      if (filterRole === "expert") {
        filtered = filtered.filter(p => p.role === "expert" && p.expert_approved)
      } else if (filterRole === "expert_pending") {
        filtered = filtered.filter(p => p.role === "expert" && !p.expert_approved)
      } else {
        filtered = filtered.filter(p => p.role === filterRole)
      }
    }

    setFilteredProfiles(filtered)
  }, [searchTerm, filterRole, profiles])

  const handleRoleChange = async (userId: string, newRole: string) => {
    const updates: any = { role: newRole }
    
    // Si cambiamos a usuario, quitamos la verificación de experto
    if (newRole === "user") {
      updates.expert_approved = false
    }

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)

    if (!error) {
      setProfiles(prev => 
        prev.map(p => p.id === userId ? { ...p, ...updates } : p)
      )
    }
  }

  const handleToggleExpertVerification = async (userId: string, approve: boolean) => {
    const { error } = await supabase
      .from("profiles")
      .update({ 
        expert_approved: approve,
        role: approve ? "expert" : "user"
      })
      .eq("id", userId)

    if (!error) {
      setProfiles(prev => 
        prev.map(p => p.id === userId ? { ...p, expert_approved: approve, role: approve ? "expert" : "user" } : p)
      )
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin": return "default"
      case "expert": return "secondary"
      default: return "outline"
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin": return "Administrador"
      case "expert": return "Experto"
      default: return "Usuario"
    }
  }

  const stats = {
    total: profiles.length,
    admins: profiles.filter(p => p.role === "admin").length,
    experts: profiles.filter(p => p.role === "expert" && p.expert_approved).length,
    expertsPending: profiles.filter(p => p.role === "expert" && !p.expert_approved).length,
    users: profiles.filter(p => p.role === "user").length,
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Gestión de Usuarios</h1>
        <p className="text-muted-foreground mt-2">
          Administra los roles, permisos y verificación de expertos de los usuarios.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total
            </CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Administradores
            </CardTitle>
            <Shield className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.admins}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Expertos Verificados
            </CardTitle>
            <Award className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.experts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Expertos Pendientes
            </CardTitle>
            <UserCheck className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.expertsPending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Usuarios
            </CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.users}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, cédula o especialidad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los roles</SelectItem>
            <SelectItem value="admin">Administradores</SelectItem>
            <SelectItem value="expert">Expertos Verificados</SelectItem>
            <SelectItem value="expert_pending">Expertos Pendientes</SelectItem>
            <SelectItem value="user">Usuarios</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Cargando usuarios...
        </div>
      ) : filteredProfiles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {searchTerm || filterRole !== "all" 
                ? "No se encontraron usuarios con esos criterios." 
                : "No hay usuarios registrados."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuarios ({filteredProfiles.length})</CardTitle>
            <CardDescription>
              Gestiona roles y verificación de expertos. Los expertos verificados pueden responder preguntas con credenciales visibles.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredProfiles.map((profile) => (
                <div 
                  key={profile.id} 
                  className="flex flex-col lg:flex-row lg:items-center justify-between p-4 rounded-lg border border-border gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-medium text-lg">
                        {(profile.display_name || "U")[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-foreground">
                          {profile.display_name || "Usuario sin nombre"}
                        </p>
                        <Badge variant={getRoleBadgeVariant(profile.role)}>
                          {getRoleLabel(profile.role)}
                        </Badge>
                        {profile.role === "expert" && (
                          <Badge variant={profile.expert_approved ? "default" : "outline"} className={profile.expert_approved ? "bg-green-600" : "text-yellow-600 border-yellow-600"}>
                            {profile.expert_approved ? "Verificado" : "Pendiente"}
                          </Badge>
                        )}
                      </div>
                      {profile.cedula_profesional && (
                        <p className="text-sm text-muted-foreground">
                          Cédula: {profile.cedula_profesional} | {profile.especialidad} | {profile.institucion}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Registrado: {format(new Date(profile.created_at), "d MMM yyyy", { locale: es })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Role selector */}
                    <Select 
                      value={profile.role} 
                      onValueChange={(value) => handleRoleChange(profile.id, value)}
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">Usuario</SelectItem>
                        <SelectItem value="expert">Experto</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Expert verification toggle */}
                    {profile.role === "expert" && (
                      <>
                        {profile.expert_approved ? (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                                <XCircle className="w-4 h-4 mr-1" />
                                Quitar Verificación
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Quitar verificación de experto</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción quitará la verificación de experto a {profile.display_name}. 
                                  Sus respuestas ya no aparecerán como respuestas de experto verificado.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleToggleExpertVerification(profile.id, false)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Quitar Verificación
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => handleToggleExpertVerification(profile.id, true)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Verificar Experto
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
