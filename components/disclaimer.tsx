import { AlertTriangle, Shield, Heart } from "lucide-react"

export function Disclaimer() {
  return (
    <section className="py-12 bg-secondary/50 border-y border-border">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col items-center text-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-amber-100">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              Aviso Legal y Ético
            </h3>
          </div>
          
          <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
            <p>
              <strong className="text-foreground">Huerto en Casa</strong> es una plataforma educativa 
              dedicada a la promoción de la agricultura urbana y el cultivo doméstico de plantas. 
              La información proporcionada en este sitio tiene fines exclusivamente informativos y educativos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <div className="flex items-start gap-2 text-left max-w-xs">
                <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p>
                  <strong className="text-foreground">No sustituye consulta médica:</strong> La información 
                  sobre plantas medicinales o beneficios para la salud no reemplaza el diagnóstico, 
                  tratamiento o consejo de un profesional de la salud cualificado.
                </p>
              </div>
              
              <div className="flex items-start gap-2 text-left max-w-xs">
                <Heart className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p>
                  <strong className="text-foreground">Consulte siempre a su médico:</strong> Antes de 
                  consumir cualquier planta con fines terapéuticos o medicinales, consulte con un 
                  profesional de la salud, especialmente si está embarazada, en lactancia o bajo tratamiento.
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground/80 pt-4 border-t border-border/50 mt-4">
              Los artículos científicos mostrados provienen de fuentes públicas como PLOS (Public Library of Science) 
              y se presentan únicamente con fines informativos. Huerto en Casa no se hace responsable del uso 
              indebido de la información ni de las decisiones tomadas basadas en el contenido de esta plataforma.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
