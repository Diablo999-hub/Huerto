"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertTriangle, Leaf, Shield, Stethoscope } from "lucide-react"

const DISCLAIMER_ACCEPTED_KEY = "huerto_disclaimer_accepted"

export function DisclaimerModal() {
  const [open, setOpen] = useState(false)
  const [accepted, setAccepted] = useState(false)

  useEffect(() => {
    // Check if user has already accepted the disclaimer
    const hasAccepted = localStorage.getItem(DISCLAIMER_ACCEPTED_KEY)
    if (!hasAccepted) {
      setOpen(true)
    }
  }, [])

  function handleAccept() {
    if (accepted) {
      localStorage.setItem(DISCLAIMER_ACCEPTED_KEY, "true")
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <DialogTitle className="text-xl">Aviso Legal y Ético</DialogTitle>
              <DialogDescription>
                Por favor lee este aviso importante antes de continuar
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <Stethoscope className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">No sustituye la consulta médica</p>
              <p className="text-sm text-yellow-700 mt-1">
                La información proporcionada en esta plataforma tiene fines educativos e informativos únicamente. 
                No debe ser utilizada como sustituto de una consulta médica profesional, diagnóstico o tratamiento.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <Leaf className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Plataforma educativa</p>
              <p className="text-sm text-muted-foreground mt-1">
                Huerto en Casa es una plataforma educativa sobre jardinería y cultivo urbano. 
                El contenido sobre plantas medicinales y remedios naturales se presenta con fines informativos.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-800">Responsabilidad del usuario</p>
              <p className="text-sm text-blue-700 mt-1">
                Antes de usar cualquier planta con fines medicinales o nutricionales, consulta siempre con un 
                profesional de la salud calificado. El uso de la información de esta plataforma es bajo tu 
                propia responsabilidad.
              </p>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>Nota sobre artículos científicos:</strong> Los artículos mostrados provienen de PLOS (Public Library of Science) 
              y otras fuentes académicas. Estos son estudios de investigación y sus conclusiones no deben interpretarse 
              como recomendaciones médicas.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 py-2">
          <Checkbox 
            id="accept-disclaimer" 
            checked={accepted}
            onCheckedChange={(checked) => setAccepted(checked === true)}
          />
          <label
            htmlFor="accept-disclaimer"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            He leído y comprendo este aviso legal
          </label>
        </div>

        <DialogFooter>
          <Button 
            onClick={handleAccept} 
            disabled={!accepted}
            className="w-full sm:w-auto"
          >
            Aceptar y Continuar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
