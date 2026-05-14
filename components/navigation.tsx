"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Leaf, Menu, X, User } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Beneficios", href: "/#beneficios" },
  { label: "Guía de Plantas", href: "/#guia" },
  { label: "Artículos", href: "/articulos" },
  { label: "Comunidad", href: "/comunidad" },
]

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    let isMounted = true

    const syncSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (isMounted) {
        setIsSignedIn(!!data.session)
        setIsLoaded(true)
      }
    }

    syncSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsSignedIn(!!session)
      setIsLoaded(true)
    })

    return () => {
      isMounted = false
      listener.subscription.unsubscribe()
    }
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setIsSignedIn(false)
    router.push("/")
    router.refresh()
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-foreground hidden sm:block">Huerto en Casa</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.label} 
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            {isLoaded && isSignedIn ? (
              <>
                <Button variant="ghost" className="hidden sm:flex" asChild>
                  <Link href="/dashboard">
                    <User className="mr-2 h-4 w-4" />
                    Mi Huerto
                  </Link>
                </Button>
                <Button className="hidden sm:flex rounded-full" variant="outline" onClick={handleSignOut}>
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="hidden sm:flex" asChild>
                  <Link href="/auth/login">
                    <User className="mr-2 h-4 w-4" />
                    Iniciar sesión
                  </Link>
                </Button>
                <Button className="hidden sm:flex rounded-full" asChild>
                  <Link href="/auth/sign-up">
                    Comenzar
                  </Link>
                </Button>
              </>
            )}
            
            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a 
                  key={link.label} 
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              {isLoaded && isSignedIn ? (
                <>
                  <Button variant="outline" className="rounded-full mt-2" asChild>
                    <Link href="/dashboard">
                      Mi Huerto
                    </Link>
                  </Button>
                  <Button className="rounded-full" variant="outline" onClick={handleSignOut}>
                    Cerrar sesión
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="rounded-full mt-2" asChild>
                    <Link href="/auth/login">
                      Iniciar sesión
                    </Link>
                  </Button>
                  <Button className="rounded-full" asChild>
                    <Link href="/auth/sign-up">
                      Comenzar
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
