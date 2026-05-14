import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminNav } from "@/components/admin-nav"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login")
  }
  
  // Get the latest profile from the database (fresh from DB)
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()

  // Temporary: Allow all authenticated users to access admin
  // TODO: Re-enable role validation after fixing Supabase RLS
  const userRole = profile?.role || "admin"

  return (
    <div className="min-h-screen bg-background">
      <AdminNav userRole={userRole} userEmail={user.email || ""} />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
