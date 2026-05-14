import { notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, MapPin, Leaf, Droplets, Scissors, FlowerIcon, Eye, Package, MoreHorizontal } from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import { es } from "date-fns/locale"
import { AddLogDialog } from "@/components/add-log-dialog"
import { DeletePlantButton } from "@/components/delete-plant-button"

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

export default async function PlantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: plant } = await supabase
    .from("plants")
    .select("*")
    .eq("id", id)
    .single()

  if (!plant) {
    notFound()
  }

  const { data: logs } = await supabase
    .from("plant_logs")
    .select("*")
    .eq("plant_id", id)
    .order("logged_at", { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">{plant.name}</h1>
          {plant.species && (
            <p className="text-muted-foreground italic">{plant.species}</p>
          )}
        </div>
        <DeletePlantButton plantId={plant.id} plantName={plant.name} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <div className="aspect-square relative overflow-hidden rounded-t-lg bg-muted">
              {plant.image_url ? (
                <img
                  src={plant.image_url}
                  alt={plant.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Leaf className="h-24 w-24 text-muted-foreground/30" />
                </div>
              )}
            </div>
            <CardContent className="pt-4 space-y-3">
              {plant.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{plant.location}</span>
                </div>
              )}
              {plant.acquired_date && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Desde {format(new Date(plant.acquired_date), "d 'de' MMMM, yyyy", { locale: es })}
                  </span>
                </div>
              )}
              {plant.notes && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">{plant.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Bitácora de cuidados</h2>
            <AddLogDialog plantId={plant.id} />
          </div>

          {logs && logs.length > 0 ? (
            <div className="space-y-4">
              {logs.map((log) => {
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
                            <CardDescription>
                              {format(new Date(log.logged_at), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
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
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <Droplets className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Sin registros aún</h3>
                <p className="text-muted-foreground max-w-sm mb-4">
                  Comienza a registrar los cuidados de tu planta para llevar un historial completo.
                </p>
                <AddLogDialog plantId={plant.id} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
