import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Droplets, Scissors, FlowerIcon, Package, Eye, Leaf, MoreHorizontal, BookOpen } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const logTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  watering: Droplets,
  fertilizing: FlowerIcon,
  pruning: Scissors,
  repotting: Package,
  observation: Eye,
  harvest: Leaf,
  other: MoreHorizontal,
}

const logTypeLabels: Record<string, string> = {
  watering: "Riego",
  fertilizing: "Fertilización",
  pruning: "Poda",
  repotting: "Trasplante",
  observation: "Observación",
  harvest: "Cosecha",
  other: "Otro",
}

const logTypeColors: Record<string, string> = {
  watering: "bg-blue-100 text-blue-800",
  fertilizing: "bg-amber-100 text-amber-800",
  pruning: "bg-green-100 text-green-800",
  repotting: "bg-orange-100 text-orange-800",
  observation: "bg-purple-100 text-purple-800",
  harvest: "bg-emerald-100 text-emerald-800",
  other: "bg-gray-100 text-gray-800",
}

export default async function BitacoraPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: logs } = await supabase
    .from("plant_logs")
    .select(`
      *,
      plants (
        id,
        name,
        species
      )
    `)
    .eq("user_id", user?.id)
    .order("logged_at", { ascending: false })

  // Group logs by date
  const groupedLogs = logs?.reduce((acc, log) => {
    const date = format(new Date(log.logged_at), "yyyy-MM-dd")
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(log)
    return acc
  }, {} as Record<string, typeof logs>)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Bitácora</h1>
        <p className="text-muted-foreground mt-1">
          Historial completo de cuidados de todas tus plantas
        </p>
      </div>

      {groupedLogs && Object.keys(groupedLogs).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(groupedLogs).map(([date, dayLogs]) => (
            <div key={date}>
              <h2 className="text-lg font-semibold mb-4 text-muted-foreground">
                {format(new Date(date), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
              </h2>
              <div className="space-y-4">
                {dayLogs?.map((log) => {
                  const Icon = logTypeIcons[log.log_type] || MoreHorizontal
                  return (
                    <Card key={log.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${logTypeColors[log.log_type]}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <CardTitle className="text-base">{log.title}</CardTitle>
                              <CardDescription className="flex items-center gap-2">
                                <Link 
                                  href={`/dashboard/plantas/${log.plants?.id}`}
                                  className="hover:text-primary hover:underline"
                                >
                                  {log.plants?.name}
                                </Link>
                                <span>•</span>
                                <span>
                                  {format(new Date(log.logged_at), "HH:mm", { locale: es })}
                                </span>
                              </CardDescription>
                            </div>
                          </div>
                          <Badge variant="secondary" className={logTypeColors[log.log_type]}>
                            {logTypeLabels[log.log_type]}
                          </Badge>
                        </div>
                      </CardHeader>
                      {log.description && (
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{log.description}</p>
                        </CardContent>
                      )}
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Tu bitácora está vacía</h3>
            <p className="text-muted-foreground max-w-sm mb-4">
              Comienza agregando plantas y registrando sus cuidados para ver tu historial aquí.
            </p>
            <Link
              href="/dashboard"
              className="text-primary hover:underline text-sm font-medium"
            >
              Ir a Mis Plantas
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
