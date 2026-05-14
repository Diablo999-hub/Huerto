import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AlertTriangle, Shield, Scale, Heart } from "lucide-react"

export default function AvisoLegalPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
              <Scale className="h-8 w-8 text-amber-600" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Aviso Legal</h1>
            <p className="text-lg text-muted-foreground">
              Términos de uso y responsabilidades de la plataforma Huerto en Casa
            </p>
          </div>

          <div className="space-y-8">
            <section className="bg-card rounded-2xl p-8 border border-border">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-3">
                    Descargo de Responsabilidad Médica
                  </h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      La información proporcionada en Huerto en Casa, incluyendo pero no limitándose a 
                      artículos, guías de cultivo, y contenido sobre plantas medicinales, tiene fines 
                      <strong className="text-foreground"> exclusivamente educativos e informativos</strong>.
                    </p>
                    <p className="bg-amber-50 text-amber-900 p-4 rounded-lg border border-amber-200">
                      <strong>IMPORTANTE:</strong> Esta plataforma NO sustituye, bajo ninguna circunstancia, 
                      la consulta, diagnóstico o tratamiento médico profesional. Siempre consulte a un 
                      profesional de la salud calificado antes de utilizar cualquier planta con fines 
                      medicinales o terapéuticos.
                    </p>
                    <p>
                      Los autores, colaboradores y administradores de Huerto en Casa no son profesionales 
                      médicos certificados y no están autorizados para proporcionar consejos médicos, 
                      diagnósticos o tratamientos.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card rounded-2xl p-8 border border-border">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-3">
                    Verificación de Fuentes Científicas
                  </h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Nos comprometemos a respaldar la información sobre plantas medicinales y sus 
                      propiedades con fuentes científicas verificables. Cada artículo incluye referencias 
                      a estudios, publicaciones académicas y fuentes confiables.
                    </p>
                    <p>
                      Sin embargo, la ciencia evoluciona constantemente y los resultados de estudios 
                      pueden variar. No garantizamos que la información sea completa, actualizada o 
                      aplicable a todas las situaciones individuales.
                    </p>
                    <p>
                      <strong className="text-foreground">Los resultados pueden variar</strong> según 
                      factores individuales como edad, condiciones de salud preexistentes, medicamentos 
                      actuales, y otros factores personales.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card rounded-2xl p-8 border border-border">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Heart className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-3">
                    Uso Responsable
                  </h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Al utilizar esta plataforma, usted acepta:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        Consultar con un profesional de la salud antes de usar plantas con fines medicinales
                      </li>
                      <li>
                        No utilizar la información como sustituto de atención médica profesional
                      </li>
                      <li>
                        Investigar por su cuenta y verificar la información con múltiples fuentes
                      </li>
                      <li>
                        Reportar cualquier información incorrecta o potencialmente dañina
                      </li>
                      <li>
                        Usar el sentido común y la precaución al experimentar con plantas
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section id="datos" className="bg-card rounded-2xl p-8 border border-border">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-3">
                    Tratamiento de Datos Personales
                  </h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      En cumplimiento con la LGDPPP, informamos que los datos que nos proporcionas en formularios como nombre, correo electrónico y contenido de tus preguntas se usan únicamente para crear tu cuenta, gestionar tu acceso, responder consultas y mejorar la experiencia de la plataforma.
                    </p>
                    <p>
                      No vendemos ni compartimos tus datos personales con terceros con fines comerciales. En caso de usar proveedores de autenticación o infraestructura, solo se emplean para operar el servicio.
                    </p>
                    <p>
                      Puedes solicitar acceso, rectificación, cancelación u oposición sobre tus datos escribiendo al área de contacto indicada más abajo.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card rounded-2xl p-8 border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Limitación de Responsabilidad
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Huerto en Casa, sus creadores, colaboradores, y afiliados no serán responsables por:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Daños directos, indirectos, incidentales o consecuentes derivados del uso de la información</li>
                  <li>Reacciones adversas a plantas o tratamientos mencionados en la plataforma</li>
                  <li>Pérdidas económicas relacionadas con el cultivo o uso de plantas</li>
                  <li>Decisiones de salud tomadas basándose en el contenido de esta plataforma</li>
                </ul>
                <p className="mt-4">
                  El usuario asume toda la responsabilidad por el uso que haga de la información 
                  proporcionada en esta plataforma.
                </p>
              </div>
            </section>

            <div className="text-center pt-8 text-sm text-muted-foreground">
              <p>Última actualización: Mayo 2026</p>
              <p id="contacto" className="mt-2">
                Si tiene preguntas sobre este aviso legal, contacte a nuestro equipo.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
