import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardNav } from "@/components/dashboard-nav"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single()

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav 
        userEmail={user.email || ""} 
        displayName={profile?.display_name || user.email?.split("@")[0] || "Usuario"} 
      />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
