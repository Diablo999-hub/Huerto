"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Leaf, 
  Upload, 
  FileCheck, 
  LayoutDashboard, 
  LogOut,
  FileText,
  Users,
  Award
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface AdminNavProps {
  userRole: string
  userEmail: string
}

export function AdminNav({ userRole, userEmail }: AdminNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const navItems = [
    { href: "/admin", label: "Panel", icon: LayoutDashboard },
    { href: "/admin/articulos", label: "Artículos", icon: FileText },
    { href: "/admin/carga-masiva", label: "Carga Masiva", icon: Upload },
    { href: "/admin/verificacion", label: "Verificación", icon: FileCheck },
  ]

  // Only show users management and expert approval for admin role
  if (userRole === "admin") {
    navItems.push({ href: "/admin/expertos", label: "Expertos", icon: Award })
    navItems.push({ href: "/admin/usuarios", label: "Usuarios", icon: Users })
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">Huerto en Casa</span>
            </Link>
            
            <Badge variant={userRole === "admin" ? "default" : "secondary"} className="uppercase text-xs">
              {userRole === "admin" ? "Administrador" : "Auditor QA"}
            </Badge>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-sm text-muted-foreground">
              {userEmail}
            </span>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                Mi Huerto
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
