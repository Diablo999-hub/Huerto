"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, MapPin, Calendar, Sprout } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

interface Plant {
  id: string
  name: string
  species: string | null
  location: string | null
  image_url: string | null
  acquired_date: string | null
  notes: string | null
  created_at: string
}

interface PlantsListProps {
  plants: Plant[]
}

export function PlantsList({ plants }: PlantsListProps) {
  if (plants.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <Sprout className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Aún no tienes plantas</h3>
          <p className="text-muted-foreground max-w-sm">
            Comienza agregando tu primera planta para llevar un registro de su crecimiento y cuidados.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {plants.map((plant) => (
        <Link key={plant.id} href={`/dashboard/plantas/${plant.id}`}>
          <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer group">
            <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg bg-muted">
              {plant.image_url ? (
                <img
                  src={plant.image_url}
                  alt={plant.name}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Leaf className="h-16 w-16 text-muted-foreground/30" />
                </div>
              )}
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {plant.name}
                </CardTitle>
              </div>
              {plant.species && (
                <CardDescription className="italic">{plant.species}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-2">
              {plant.location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{plant.location}</span>
                </div>
              )}
              {plant.acquired_date && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Agregada{" "}
                    {formatDistanceToNow(new Date(plant.acquired_date), {
                      addSuffix: true,
                      locale: es,
                    })}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
