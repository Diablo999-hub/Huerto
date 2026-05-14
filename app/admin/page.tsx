import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Upload, CheckCircle, Users, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboard() {
  const supabase = await createClient()
  
  // Get statistics
  const { count: articlesCount } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true })
  
  const { count: verifiedCount } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true })
    .eq("verified", true)
  
  const { count: pendingCount } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true })
    .eq("verified", false)
  
  const { count: uploadsCount } = await supabase
    .from("bulk_uploads")
    .select("*", { count: "exact", head: true })

  const stats = [
    {
      title: "Artículos Totales",
      value: articlesCount || 0,
      icon: FileText,
      href: "/admin/articulos",
      color: "text-primary"
    },
    {
      title: "Verificados",
      value: verifiedCount || 0,
      icon: CheckCircle,
      href: "/admin/verificacion",
      color: "text-green-600"
    },
    {
      title: "Pendientes",
      value: pendingCount || 0,
      icon: AlertTriangle,
      href: "/admin/verificacion",
      color: "text-amber-600"
    },
    {
      title: "Cargas Realizadas",
      value: uploadsCount || 0,
      icon: Upload,
      href: "/admin/carga-masiva",
      color: "text-blue-600"
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Panel de Administración</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona el contenido científico y verifica las fuentes de información.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Carga Masiva de Datos</CardTitle>
            <CardDescription>
              Importa artículos y contenido científico mediante archivos JSON estructurados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link 
              href="/admin/carga-masiva"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <Upload className="h-4 w-4" />
              Ir a Carga Masiva
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Verificación de Fuentes</CardTitle>
            <CardDescription>
              Revisa y valida las fuentes científicas de los artículos publicados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link 
              href="/admin/verificacion"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <CheckCircle className="h-4 w-4" />
              Ir a Verificación
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
