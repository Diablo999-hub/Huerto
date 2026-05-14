"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Leaf, Shield, ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react"

export default function AdminSetupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSetup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Error al configurar el administrador")
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/admin")
      }, 2000)
    } catch (err) {
      setError("Error de conexión. Por favor intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Convertirse en Administrador
          </h1>
          <p className="text-muted-foreground">
            Acceso rápido al panel de administración
          </p>
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Leaf className="w-5 h-5 text-primary" />
              Huerto en Casa
            </CardTitle>
            <CardDescription>
              Haz clic en el botón a continuación para obtener acceso de administrador
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">
                    ¡Configuración Exitosa!
                  </h3>
                  <p className="text-muted-foreground">
                    Ahora eres administrador. Redirigiendo al panel...
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSetup} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <p className="text-sm text-muted-foreground py-2">
                  Al hacer clic en el botón a continuación, obtendrás acceso de administrador 
                  y podrás acceder al panel de administración.
                </p>

                <Button type="submit" className="w-full" disabled={loading} size="lg">
                  {loading ? "Procesando..." : "Obtener Acceso de Administrador"}
                </Button>

                <div className="pt-2">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      <strong>Nota:</strong> Debes estar autenticado. 
                      Si no has iniciado sesión, <Link href="/auth/login" className="text-primary hover:underline">inicia sesión primero</Link>.
                    </AlertDescription>
                  </Alert>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
