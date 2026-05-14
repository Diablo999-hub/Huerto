import { createClient } from "@/lib/supabase/server"
import { PlantsList } from "@/components/plants-list"
import { AddPlantDialog } from "@/components/add-plant-dialog"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: plants } = await supabase
    .from("plants")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mis Plantas</h1>
          <p className="text-muted-foreground mt-1">
            Administra y sigue el crecimiento de tu huerto
          </p>
        </div>
        <AddPlantDialog />
      </div>

      <PlantsList plants={plants || []} />
    </div>
  )
}
