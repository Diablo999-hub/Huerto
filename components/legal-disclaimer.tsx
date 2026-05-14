import { AlertTriangle } from "lucide-react"

export function LegalDisclaimer() {
  return (
    <section className="bg-amber-50 border-t border-b border-amber-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-start gap-4 max-w-4xl mx-auto">
          <div className="flex-shrink-0 mt-0.5">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-amber-900">
              Aviso Legal y Ético
            </h3>
            <p className="text-sm text-amber-800 leading-relaxed">
              La información proporcionada en esta plataforma tiene fines exclusivamente educativos e informativos. 
              <strong> Huerto en Casa no sustituye, bajo ninguna circunstancia, la consulta, diagnóstico o tratamiento médico profesional.</strong> 
              {" "}Antes de utilizar cualquier planta con fines medicinales o terapéuticos, consulte siempre a un profesional de la salud calificado.
            </p>
            <p className="text-sm text-amber-800 leading-relaxed">
              Los contenidos sobre plantas medicinales y sus propiedades son respaldados por fuentes científicas verificables; 
              sin embargo, los resultados pueden variar según cada individuo. El proyecto y sus colaboradores no se hacen 
              responsables del uso indebido de la información aquí presentada.
            </p>
            <p className="text-xs text-amber-700 mt-3">
              Al utilizar esta plataforma, usted acepta estos términos y reconoce haber leído este aviso legal.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
